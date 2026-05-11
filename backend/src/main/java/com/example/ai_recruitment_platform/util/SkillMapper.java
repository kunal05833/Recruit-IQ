package com.example.ai_recruitment_platform.util;

import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class SkillMapper {

    // synonym map: canonical skill -> list of synonyms (all lowercase)
    private static final Map<String, List<String>> SKILL_SYNONYMS = new HashMap<>();

    static {
        SKILL_SYNONYMS.put("java",           List.of("java", "core java", "java se", "java ee"));
        SKILL_SYNONYMS.put("spring",         List.of("spring", "spring boot", "spring framework", "spring mvc"));
        SKILL_SYNONYMS.put("spring security",List.of("spring security"));
        SKILL_SYNONYMS.put("hibernate",      List.of("hibernate", "jpa", "spring data jpa"));
        SKILL_SYNONYMS.put("mysql",          List.of("mysql", "sql", "rdbms"));
        SKILL_SYNONYMS.put("postgresql",     List.of("postgresql", "postgres"));
        SKILL_SYNONYMS.put("mongodb",        List.of("mongodb", "mongo"));
        SKILL_SYNONYMS.put("react",          List.of("react", "reactjs", "react.js"));
        SKILL_SYNONYMS.put("angular",        List.of("angular", "angularjs", "angular.js"));
        SKILL_SYNONYMS.put("vue",            List.of("vue", "vuejs", "vue.js"));
        SKILL_SYNONYMS.put("javascript",     List.of("javascript", "js", "es6", "es2015"));
        SKILL_SYNONYMS.put("typescript",     List.of("typescript", "ts"));
        SKILL_SYNONYMS.put("python",         List.of("python", "python3"));
        SKILL_SYNONYMS.put("django",         List.of("django", "django rest framework", "drf"));
        SKILL_SYNONYMS.put("flask",          List.of("flask"));
        SKILL_SYNONYMS.put("nodejs",         List.of("node", "nodejs", "node.js"));
        SKILL_SYNONYMS.put("express",        List.of("express", "expressjs", "express.js"));
        SKILL_SYNONYMS.put("html",           List.of("html", "html5"));
        SKILL_SYNONYMS.put("css",            List.of("css", "css3", "scss", "sass"));
        SKILL_SYNONYMS.put("git",            List.of("git", "github", "gitlab", "version control"));
        SKILL_SYNONYMS.put("docker",         List.of("docker", "containerization"));
        SKILL_SYNONYMS.put("kubernetes",     List.of("kubernetes", "k8s"));
        SKILL_SYNONYMS.put("aws",            List.of("aws", "amazon web services", "ec2", "s3", "lambda"));
        SKILL_SYNONYMS.put("rest api",       List.of("rest", "restful", "rest api", "restful api"));
        SKILL_SYNONYMS.put("graphql",        List.of("graphql"));
        SKILL_SYNONYMS.put("microservices",  List.of("microservices", "micro services"));
        SKILL_SYNONYMS.put("c++",            List.of("c++", "cpp"));
        SKILL_SYNONYMS.put("c#",             List.of("c#", "csharp", "dotnet", ".net"));
        SKILL_SYNONYMS.put("kotlin",         List.of("kotlin"));
        SKILL_SYNONYMS.put("flutter",        List.of("flutter", "dart"));
        SKILL_SYNONYMS.put("android",        List.of("android", "android development"));
        SKILL_SYNONYMS.put("ios",            List.of("ios", "swift", "objective-c"));
        SKILL_SYNONYMS.put("machine learning", List.of("machine learning", "ml", "deep learning", "dl"));
        SKILL_SYNONYMS.put("data science",   List.of("data science", "data analysis", "data analytics"));
        SKILL_SYNONYMS.put("redis",          List.of("redis", "caching"));
        SKILL_SYNONYMS.put("kafka",          List.of("kafka", "apache kafka", "message queue"));
        SKILL_SYNONYMS.put("maven",          List.of("maven", "gradle"));
        SKILL_SYNONYMS.put("junit",          List.of("junit", "testing", "unit testing", "mockito"));
        SKILL_SYNONYMS.put("linux",          List.of("linux", "unix", "bash", "shell scripting"));
    }

    public Map<String, List<String>> getSkillSynonyms() {
        return Collections.unmodifiableMap(SKILL_SYNONYMS);
    }

    /**
     * Given a synonym word, return the canonical skill name (or null if not found)
     */
    public String getCanonicalSkill(String word) {
        String lower = word.toLowerCase().trim();
        for (Map.Entry<String, List<String>> entry : SKILL_SYNONYMS.entrySet()) {
            if (entry.getValue().contains(lower)) {
                return entry.getKey();
            }
        }
        return null;
    }
}
