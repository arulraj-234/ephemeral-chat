
# ===== Frontend Build Stage =====
FROM node:20 AS frontend
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install
COPY frontend/ ./
RUN npx vite build

# ===== Backend Build Stage =====
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
COPY --from=frontend /app/frontend/dist ./src/main/resources/static
RUN mvn clean package -DskipTests

# ===== Run Stage =====
FROM eclipse-temurin:21-jdk
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
