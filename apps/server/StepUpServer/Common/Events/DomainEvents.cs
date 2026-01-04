namespace StepUpServer.Common.Events;

public interface IDomainEvent
{
    DateTime OccurredAt { get; }
}

public record UserCreatedEvent : IDomainEvent
{
    public required string UserId { get; init; }
    public DateTime OccurredAt { get; init; } = DateTime.UtcNow;
}

public record ActivityCreatedEvent : IDomainEvent
{
    public required string ActivityId { get; init; }
    public required string UserId { get; init; }
    public required ulong Duration { get; init; }
    public required ulong Distance { get; init; }
    public required float AverageSpeed { get; init; }
    public required ulong StartTime { get; init; }
    public required ulong LastActivityStartTime { get; init; }
    public DateTime OccurredAt { get; init; } = DateTime.UtcNow;
}
