package com.example.ai_recruitment_platform.ai.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
public class SkillNormalizationService {

    // Skill synonym map — key is standardized name, value is all aliases
    private static final Map<String, List<String>> SKILL_MAP = new HashMap<>();

    static {
        SKILL_MAP.put("java",             List.of("java", "core java", "advanced java", "java8", "java 8", "java11", "java 11"));
        SKILL_MAP.put("javascript",       List.of("javascript", "js", "ecmascript", "es6", "es2015"));
        SKILL_MAP.put("python",           List.of("python", "python3", "python 3", "py"));
        SKILL_MAP.put("spring boot",      List.of("spring boot", "springboot", "spring framework", "spring mvc", "spring"));
        SKILL_MAP.put("react",            List.of("react", "reactjs", "react.js", "react js"));
        SKILL_MAP.put("angular",          List.of("angular", "angularjs", "angular.js", "angular2", "angular 2"));
        SKILL_MAP.put("vue",              List.of("vue", "vuejs", "vue.js", "vue js"));
        SKILL_MAP.put("node.js",          List.of("node.js", "nodejs", "node js", "node"));
        SKILL_MAP.put("mysql",            List.of("mysql", "my sql", "mysql db"));
        SKILL_MAP.put("postgresql",       List.of("postgresql", "postgres", "pg", "postgre sql"));
        SKILL_MAP.put("mongodb",          List.of("mongodb", "mongo", "mongo db"));
        SKILL_MAP.put("docker",           List.of("docker", "docker container", "containerization"));
        SKILL_MAP.put("kubernetes",       List.of("kubernetes", "k8s", "kube"));
        SKILL_MAP.put("aws",              List.of("aws", "amazon web services", "amazon aws"));
        SKILL_MAP.put("azure",            List.of("azure", "microsoft azure", "ms azure"));
        SKILL_MAP.put("git",              List.of("git", "github", "gitlab", "bitbucket", "version control"));
        SKILL_MAP.put("rest api",         List.of("rest api", "restful", "rest", "restful api", "rest web service"));
        SKILL_MAP.put("microservices",    List.of("microservices", "micro services", "microservice architecture"));
        SKILL_MAP.put("hibernate",        List.of("hibernate", "jpa", "hibernate jpa", "spring jpa", "spring data jpa"));
        SKILL_MAP.put("c++",              List.of("c++", "cpp", "c plus plus"));
        SKILL_MAP.put("c#",               List.of("c#", "csharp", "c sharp", "dotnet c#"));
        SKILL_MAP.put(".net",             List.of(".net", "dotnet", "dot net", ".net core", "asp.net"));
        SKILL_MAP.put("machine learning", List.of("machine learning", "ml", "deep learning", "dl", "ai", "artificial intelligence"));
        SKILL_MAP.put("sql",              List.of("sql", "structured query language", "pl/sql", "t-sql"));
        SKILL_MAP.put("html",             List.of("html", "html5", "html 5"));
        SKILL_MAP.put("css",              List.of("css", "css3", "css 3", "sass", "scss", "less"));
        SKILL_MAP.put("linux",            List.of("linux", "unix", "ubuntu", "centos", "redhat"));
        SKILL_MAP.put("kafka",            List.of("kafka", "apache kafka", "message queue", "mq"));
        SKILL_MAP.put("redis",            List.of("redis", "redis cache", "cache"));
        SKILL_MAP.put("typescript",       List.of("typescript", "ts", "type script"));
    }

    /**
     * Normalize a raw skill name to its standardized form.
     * Returns null if no match found.
     */
    public String normalize(String rawSkill) {
        if (rawSkill == null || rawSkill.isBlank()) return null;

        String cleaned = rawSkill.toLowerCase().trim().replaceAll("[^a-z0-9+#. ]", "");

        for (Map.Entry<String, List<String>> entry : SKILL_MAP.entrySet()) {
            if (entry.getValue().contains(cleaned)) {
                log.debug("Normalized skill '{}' -> '{}'", rawSkill, entry.getKey());
                return entry.getKey();
            }
        }

        // If no synonym match, return cleaned version (still useful)
        return cleaned;
    }

    /**
     * Normalize a list of raw skills, removing duplicates.
     */
    public List<String> normalizeAll(List<String> rawSkills) {
        if (rawSkills == null || rawSkills.isEmpty()) return new ArrayList<>();

        return rawSkills.stream()
                .map(this::normalize)
                .filter(Objects::nonNull)
                .filter(s -> !s.isBlank())
                .distinct()
                .collect(Collectors.toList());
    }

    /**
     * Extract and normalize skills from raw resume text.
     */
    public List<String> extractAndNormalizeFromText(String rawText) {
        if (rawText == null || rawText.isBlank()) return new ArrayList<>();

        String text = rawText.toLowerCase().replaceAll("[^a-z0-9+#. \n]", " ");
        Set<String> found = new LinkedHashSet<>();

        for (Map.Entry<String, List<String>> entry : SKILL_MAP.entrySet()) {
            for (String alias : entry.getValue()) {
                if (text.contains(alias)) {
                    found.add(entry.getKey());
                    break;
                }
            }
        }

        return new ArrayList<>(found);
    }
}
