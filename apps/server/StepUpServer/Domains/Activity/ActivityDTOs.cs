namespace StepUpServer.Domains.Activity;

public readonly record struct CreateActivityRequest(
    string Name,
    string? Description,
    ulong StartTime,
    ulong Duration,
    ulong Distance,
    float AverageSpeed,
    float TopSpeed,
    double[] RouteLatitudes,
    double[] RouteLongitudes
);

public readonly record struct UpdateActivityRequest(
    string Id,
    string Name,
    string? Description
);
