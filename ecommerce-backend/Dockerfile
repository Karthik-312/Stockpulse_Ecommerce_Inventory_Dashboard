# Build stage
FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app

COPY gradlew gradlew.bat ./
COPY gradle gradle/
COPY build.gradle settings.gradle ./
COPY src src/

RUN chmod +x gradlew && ./gradlew bootJar -x test

# Run stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

COPY --from=build /app/build/libs/ecommerce-backend-1.0.0.jar app.jar

EXPOSE 9090
ENTRYPOINT ["java", "-jar", "app.jar"]
