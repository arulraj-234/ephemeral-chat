---
description: Repository Information Overview
alwaysApply: true
---

# Ephemeral Chat Information

## Summary
Ephemeral Chat is a privacy-first, real-time chat application built with Spring Boot and WebSockets. It focuses on ephemeral messaging where no data is persisted - once the server shuts down or a room is closed, all messages are permanently deleted. The application allows users to create temporary chat rooms with shareable room IDs and see who's online in real-time.

## Structure
- **src/main/java**: Contains Java source code organized in packages
- **src/main/resources**: Contains application properties, static assets, and templates
- **target**: Contains compiled classes and packaged JAR files
- **.github**: Contains GitHub-related configuration files

## Language & Runtime
**Language**: Java
**Version**: Java 21
**Build System**: Maven
**Package Manager**: Maven

## Dependencies
**Main Dependencies**:
- Spring Boot 3.2.0 (Web, WebSocket, Thymeleaf)
- Jackson Datatype JSR310
- Spring Boot DevTools

**Development Dependencies**:
- Spring Boot Starter Test

## Build & Installation
```bash
# Build the application
mvn clean compile

# Run the application
mvn spring-boot:run

# Package for production
mvn clean package
java -jar target/ephemeral-chat-0.0.1-SNAPSHOT.jar
```

## Docker
**Dockerfile**: Dockerfile (multi-stage build)
**Base Images**: 
- Build: maven:3.9.6-eclipse-temurin-21
- Runtime: eclipse-temurin:21-jdk
**Exposed Port**: 8080
**Run Command**: `java -jar app.jar`

## Application Structure
**Main Class**: `com.ephemeralchat.EphemeralChatApplication`
**Key Components**:
- **config/WebSocketConfig.java**: WebSocket configuration
- **controller/WebController.java**: Web controllers for HTTP endpoints
- **handler/ChatWebSocketHandler.java**: WebSocket message handler
- **model/**: Contains data models (ChatMessage, ChatRoom)
- **service/ChatRoomService.java**: Room management service

## Configuration
**Properties File**: `src/main/resources/application.properties`
**Key Settings**:
- Server port: 8080
- Session timeout: 30 minutes
- Logging level: DEBUG for application components
- Thymeleaf template configuration

## Deployment
**Platform**: Render (configured via render.yaml)
**Service Type**: Web service
**Runtime**: Docker
**Region**: Singapore
**Plan**: Free
**Auto Deploy**: Enabled

## API Endpoints
**Web Endpoints**:
- `GET /`: Home page
- `GET /create-room`: Create room page
- `POST /create-room`: Create a new room
- `GET /join-room`: Join room page
- `POST /check-room`: Check if room exists
- `GET /room/{roomId}`: Chat room page

**WebSocket Endpoint**:
- `WS /chat`: WebSocket connection for real-time messaging