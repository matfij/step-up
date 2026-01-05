# Step Up - Server

## Tech Stack

-   **Framework**: .NET 10.0 (ASP.NET Core Minimal APIs)
-   **Database**: MongoDB with MongoDB.Driver 3.5.2
-   **Language**: C# with nullable reference types enabled
-   **Architecture**: Domain-Driven Design with event-driven components

## Project Structure

```
StepUpServer/
  Common/             # Shared middleware, utilities, events
    Events/           # Domain events and event publisher
  Domains/            # Domain-specific code (DDD)
    {Domain}/         # User, Activity, Progress, Achievements
      {Domain}Entity.cs      # Domain entity (MongoDB document)
      {Domain}Repository.cs  # Data access interface and implementation
      {Domain}Service.cs     # Business logic
      {Domain}Validator.cs   # Validation logic
      {Domain}DTOs.cs        # Data Transfer Objects
      {Domain}Endpoints.cs   # HTTP endpoint mappings
  Program.cs          # Application entry point and DI configuration
```

## Key Patterns & Conventions

### Domain-Driven Design

Each domain follows consistent structure:

-   **Entity**: MongoDB document model with `Id` property (string)
-   **Repository**: Interface + implementation for data access (MongoDB collections)
-   **Service**: Business logic interface + implementation
-   **Validator**: Validation logic (async for DB checks, sync for business rules)
-   **DTOs**: Request/Response models
-   **Endpoints**: Static extension methods mapping HTTP routes

### Naming Conventions

-   Classes: PascalCase (e.g., `UserService`, `ActivityRepository`)
-   Interfaces: Prefix with `I` (e.g., `IUserService`, `IActivityRepository`)
-   Methods: PascalCase async methods return `Task` or `Task<T>`
-   Files: One class per file, filename matches class name
-   Collections: Plural collection names (e.g., "Users", "Activities")

### Dependency Injection

-   Configured in `Program.cs`
-   MongoDB Client: Singleton
-   MongoDB Database: Singleton
-   Repositories: Scoped
-   Services: Scoped
-   Event Handlers: Scoped (registered as `IEventHandler<TEvent>`)

### Authentication

-   API token-based authentication via `Authorization` header
-   `AuthMiddleware` checks `RequireAuthAttribute` metadata
-   User stored in `HttpContext.Items["User"]` after authentication
-   Use `context.GetUserId()` extension method to retrieve authenticated user ID

### Error Handling

-   `ApiException` thrown with error key (e.g., `"errors.userNotFound"`)
-   `ExceptionMiddleware` catches exceptions and returns JSON error response
-   Error format: `{ error: { key: "errors.xxx", message: "..." } }`

### Domain Events

-   Events implement `IDomainEvent` interface
-   Published via `IEventPublisher.PublishAsync<TEvent>()`
-   Handlers implement `IEventHandler<TEvent>`
-   Events: `UserCreatedEvent`, `ActivityCreatedEvent`, `ProgressUpdatedEvent`
-   Registered in `Program.cs` as event handlers

### MongoDB Patterns

-   Repository constructor receives `IMongoDatabase`
-   Collections retrieved via `database.GetCollection<T>("CollectionName")`
-   Indexes created in repository constructor (unique indexes for emails, usernames)
-   Use `Builders<T>.Filter` for queries
-   Timestamps: `ulong` (Unix timestamp milliseconds)

### Validation Pattern

-   Validators separate async DB checks from sync business rules
-   Async methods: `Validate*`, `Ensure*` (throws `ApiException` if invalid)
-   Sync methods: `Ensure*` (throws `ApiException` if invalid)
-   Use `ApiException` with translation keys for errors

### Endpoint Pattern

-   Static extension methods on `WebApplication` (e.g., `MapUserEndpoints()`)
-   Use Minimal API syntax with `app.MapGet/Post/Put/Delete()`
-   Protected endpoints: `.WithMetadata(new RequireAuthAttribute())`
-   Get user ID: `context.GetUserId()` extension method
-   Return: `Results.Ok(object)`, `Results.NotFound()`, etc.

### Service Pattern

-   Services depend on Repository, Validator, and IEventPublisher
-   Business logic in service methods
-   Entities returned from services (not DTOs)
-   Events published after state changes
-   Use `Utils.GenerateId()` for ID generation
-   Use `Utils.GetCurrentTimestamp()` for timestamps

### Code Style

-   Use primary constructors (C# 12) for dependency injection
-   Use `required` keyword for required properties in records
-   Use `init` for immutable properties
-   Prefer `record` for DTOs and events
-   Use `partial class` for service files if needed
-   Configure JSON serialization in `Program.cs` with `DefaultJsonTypeInfoResolver`

## Development Guidelines

-   Always use nullable reference types
-   Follow DDD domain structure strictly
-   Register all services in `Program.cs`
-   Use dependency injection, avoid static dependencies
-   MongoDB indexes should be created in repository constructors
-   Use domain events for cross-domain communication
-   Return entities from services, map to DTOs in endpoints if needed
-   Use translation keys for error messages (errors.\*)
-   API tokens: Base64 encoded GUIDs
-   Auth tokens: 6-digit numeric codes (100000-999999)

## Configuration

-   Connection string: `appsettings.json` → `ConnectionStrings:DefaultConnection`
-   Database name: `appsettings.json` → `DatabaseName`
-   Default port: 8080 (configured in Dockerfile)
-   Development settings: `appsettings.Development.json`
