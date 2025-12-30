using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace StepUpServer.Domains.Progress;

public class Progress
{
    [BsonId]
    [BsonRepresentation(BsonType.String)]
    public required string Id { get; set; }
    public required string UserId { get; set; }

    public uint Level { get; set; } = 1;
    public ulong Experience { get; set; } = 0;

    public ulong TotalActivities { get; set; } = 0;
    public ulong TotalDuration { get; set; } = 0; // ms
    public ulong TotalDistance { get; set; } = 0; // m
}
