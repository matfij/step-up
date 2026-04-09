namespace StepUpServer.Domains.Log;

public readonly record struct CreateLogRequest(
    LogType Type,
    string? UserId,
    string? Details
);

public readonly record struct LogResponse(
    string Id,
    LogType Type,
    string UserId,
    string Details,
    ulong Timestamp
);
