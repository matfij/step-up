using MongoDB.Bson.Serialization.Attributes;

namespace StepUpServer.Domains.Log;

public class Log
{
    [BsonId]
    [BsonRepresentation(MongoDB.Bson.BsonType.String)]
    public required string Id { get; set; }
    public required ulong Timestamp { get; set; }
    public required LogType Type { get; set; }
    public string UserId { get; set; } = String.Empty;
    public string Details { get; set; } = String.Empty;
}

public enum LogType
{
    Info = 0,
    Error = 1,
}
