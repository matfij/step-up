using System.ComponentModel.DataAnnotations;

namespace StepUpServer.Activity;

public record struct CreateActivityRequest
{
    public required string Name { get; init; }
    public string? Description { get; init; }
    public required ulong StartTime { get; init; }
    public required ulong Duration { get; init; }
    public required ulong Distance { get; init; }
    public required float AverageSpeed { get; init; }
    public required float TopSpeed { get; init; }
    public required Coordinate[] Route { get; init; }
}

public record struct UpdateActivityRequest
{
    public required string Id { get; init; }
    public required string Name { get; init; }
    public string? Description { get; init; }
}
