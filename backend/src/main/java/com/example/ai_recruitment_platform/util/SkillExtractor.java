package com.example.ai_recruitment_platform.util;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import java.util.*;
import java.util.regex.*;

@Component
@RequiredArgsConstructor
public class SkillExtractor {

    private final SkillMapper skillMapper;

    public List<String> extractSkills(String resumeText) {
        String lower = resumeText.toLowerCase();
        Set<String> foundSkills = new LinkedHashSet<>();

        Map<String, List<String>> synonymMap = skillMapper.getSkillSynonyms();

        List<String> allSynonyms = new ArrayList<>();
        for (List<String> synonyms : synonymMap.values()) {
            allSynonyms.addAll(synonyms);
        }
        allSynonyms.sort((a, b) -> b.length() - a.length());

        for (String synonym : allSynonyms) {
            String pattern = "\\b" + Pattern.quote(synonym) + "\\b";
            if (Pattern.compile(pattern).matcher(lower).find()) {
                String canonical = skillMapper.getCanonicalSkill(synonym);
                if (canonical != null) {
                    foundSkills.add(canonical);
                }
            }
        }

        return new ArrayList<>(foundSkills);
    }

    public String extractName(String resumeText) {
        String[] lines = resumeText.split("\n");
        for (String line : lines) {
            String trimmed = line.trim();
            if (!trimmed.isEmpty()
                    && trimmed.matches("[A-Za-z]+(\\s[A-Za-z]+){1,3}")
                    && trimmed.length() < 50) {
                return trimmed;
            }
        }
        return "";
    }

    public String extractEmail(String resumeText) {
        Pattern emailPattern = Pattern.compile(
                "[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}");
        Matcher matcher = emailPattern.matcher(resumeText);
        return matcher.find() ? matcher.group() : "";
    }

    public String extractExperience(String resumeText) {
        return extractSection(resumeText, "experience",
                List.of("education", "skills", "projects", "certifications", "awards", "references"));
    }

    public String extractEducation(String resumeText) {
        return extractSection(resumeText, "education",
                List.of("experience", "skills", "projects", "certifications", "work", "awards", "references"));
    }

    // ── Core fix ──────────────────────────────────────────────────────
    private String extractSection(String text, String sectionName, List<String> stopSections) {

        // FIX 1: PDF se aaya spaced text normalize karo — "E X P E R I E N C E" → "EXPERIENCE"
        String normalized = normalizeSpacedText(text);
        String lower = normalized.toLowerCase();

        // FIX 2: Section header dhundo — word boundary ke saath
        Pattern sectionPattern = Pattern.compile(
                "(?im)^[\\s]*" + Pattern.quote(sectionName) + "[\\s:]*$");
        Matcher m = sectionPattern.matcher(lower);

        int start = -1;
        if (m.find()) {
            // FIX 3: Header ke BAAD se shuru karo — header khud include mat karo
            start = m.end();
        } else {
            // Fallback: simple indexOf
            int idx = lower.indexOf(sectionName);
            if (idx == -1) return "";
            start = idx + sectionName.length();
        }

        // FIX 4: Next section ka start dhundo
        int end = normalized.length();
        for (String stop : stopSections) {
            Pattern stopPattern = Pattern.compile(
                    "(?im)^[\\s]*" + Pattern.quote(stop) + "[\\s:]*$");
            Matcher sm = stopPattern.matcher(lower);
            // start ke baad dhundo
            sm.region(start, lower.length());
            if (sm.find() && sm.start() < end) {
                end = sm.start();
            } else {
                // Fallback indexOf
                int stopIdx = lower.indexOf(stop, start);
                if (stopIdx != -1 && stopIdx < end) {
                    end = stopIdx;
                }
            }
        }

        // FIX 5: Extract karo aur clean karo
        String section = normalized.substring(start, Math.min(end, normalized.length())).trim();
        section = cleanSectionText(section);

        if (section.isEmpty()) return "";

        // FIX 6: Reasonable limit — 800 chars
        return section.length() > 800 ? section.substring(0, 800) + "..." : section;
    }

    // ── Helper: "E X P E R I E N C E" → "EXPERIENCE" ────────────────
    // FIX: Lambda replaceAll is not supported in String.replaceAll()
    // Using Matcher with StringBuffer for proper regex replace with logic
    private String normalizeSpacedText(String text) {
        if (text == null) return "";

        // Pattern: single capital letter followed by (space + single capital letter), 2+ times
        // e.g. "E D U C A T I O N" → "EDUCATION"
        Pattern spacedCaps = Pattern.compile("\\b([A-Z])( [A-Z]){2,}\\b");
        Matcher matcher = spacedCaps.matcher(text);
        StringBuffer sb = new StringBuffer();

        while (matcher.find()) {
            // Remove all spaces from the matched spaced-capitals word
            String replacement = matcher.group().replace(" ", "");
            matcher.appendReplacement(sb, Matcher.quoteReplacement(replacement));
        }
        matcher.appendTail(sb);

        return sb.toString();
    }

    // ── Helper: Clean extracted section text ──────────────────────────
    private String cleanSectionText(String text) {
        if (text == null || text.isBlank()) return "";

        return text
                // Multiple spaces → single space (per line)
                .replaceAll("[ \\t]+", " ")
                // 3+ newlines → 2 newlines
                .replaceAll("\\n{3,}", "\n\n")
                // Remove lines that are just dashes/underscores (PDF separators)
                .replaceAll("(?m)^[-_=]{3,}\\s*$", "")
                // Remove trailing spaces per line
                .replaceAll("(?m) +$", "")
                .trim();
    }
}