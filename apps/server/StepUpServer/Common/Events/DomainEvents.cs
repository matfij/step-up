namespace StepUpServer.Common.Events;

public interface IDomainEvent
{
    DateTime OccurredAt { get; }
}

public record UserCreatedEvent : IDomainEvent
{
    public required string UserId { get; init; }
    public required string Username { get; init; }
    public DateTime OccurredAt { get; init; } = DateTime.UtcNow;
}

public record ActivityCreatedEvent : IDomainEvent
{
    public required string ActivityId { get; init; }
    public required string UserId { get; init; }
    public required ulong Duration { get; init; }
    public required ulong Distance { get; init; }
    public required ulong AverageSpeed { get; init; }
    public required ulong StartTime { get; init; }
    public required ulong LastActivityStartTime { get; init; }
    public DateTime OccurredAt { get; init; } = DateTime.UtcNow;
}

public record ProgressUpdatedEvent : IDomainEvent
{
    public required string UserId { get; init; }
    public required ulong ActivityDuration { get; init; }
    public required ulong ActivityDistance { get; init; }
    public required ulong ActivityAverageSpeed { get; init; }
    public required ulong TotalDistance { get; init; }
    public required ulong TotalDuration { get; init; }
    public required ulong TotalActivities { get; init; }
    public required ulong CurrentStreak { get; init; }
    public DateTime OccurredAt { get; init; } = DateTime.UtcNow;
}
