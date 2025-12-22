using System.ComponentModel.DataAnnotations;

namespace StepUpServer.Activity;

public readonly record struct CreateActivityRequest
{
    public required string UserId { get; init; }
    public required string Name { get; init; }
    public required ulong StartTime { get; init; }
    public required ulong Duration { get; init; }
    public required ulong Distance { get; init; }
    public required float AverageSpeed { get; init; }
    public required float TopSpeed { get; init; }
    public required Coordinate[] Route { get; init; }
    public string? Description { get; init; }
}
