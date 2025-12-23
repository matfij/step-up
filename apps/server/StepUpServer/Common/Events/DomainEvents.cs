namespace StepUpServer.Common.Events;

public interface IDomainEvent
{
    DateTime OccurredAt { get; }
}

public record ActivityCreatedEvent : IDomainEvent
{
    public required string ActivityId { get; init; }
    public required string UserId { get; init; }
    public required ulong Duration { get; init; }
    public required ulong Distance { get; init; }
    public required float AverageSpeed { get; init; }
    public DateTime OccurredAt { get; init; } = DateTime.UtcNow;
}
