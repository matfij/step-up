# Step Up - Repository Root

## Project Overview

Step Up is a fitness tracking mobile application with a backend API. The repository is a monorepo containing:

- **Mobile App** (`apps/mobile`): React Native/Expo application
- **Server** (`apps/server`): .NET 10.0 Web API with MongoDB

## Architecture

- **Monorepo structure**: Apps organized in `apps/` directory
- **Mobile**: React Native (Expo), TypeScript, file-based routing (Expo Router)
- **Server**: .NET 10.0, MongoDB, Domain-Driven Design pattern

## Key Technologies

- **Mobile**: Expo SDK 54, React 19, TypeScript 5.9, Zustand, i18next
- **Server**: .NET 10.0, MongoDB Driver 3.5.2, ASP.NET Core Minimal APIs

## Code Organization

- Mobile app follows feature-based architecture with shared common code
- Server uses Domain-Driven Design with Entities, Repositories, Services, Validators, and Endpoints
- Server implements event-driven architecture with domain events

## Development Guidelines

- Maintain separation between mobile and server codebases
- Follow TypeScript strict mode conventions for mobile
- Follow C# nullable reference types conventions for server
- Use consistent naming: kebab-case for files, PascalCase for C# classes, camelCase for TypeScript
- Always check app-specific `AGENTS.MD` files for detailed conventions
