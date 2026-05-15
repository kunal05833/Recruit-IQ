FROM maven:3.9.6-eclipse-temurin-17 AS build

WORKDIR /app

COPY pom.xml .

RUN mvn dependency:go-offline

COPY . .

RUN mvn clean package -DskipTests

FROM eclipse-temurin:17

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE ${PORT:-8080}

CMD ["sh", "-c", "java -jar -Dserver.port=${PORT:-8080} app.jar"]