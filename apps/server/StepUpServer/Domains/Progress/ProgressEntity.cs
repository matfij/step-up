using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace StepUpServer.Domains.Progress;

public class Progress
{
    [BsonId]
    [BsonRepresentation(BsonType.String)]
    public required string Id { get; set; }
    public required string UserId { get; set; }

    public required uint Level { get; set; } = 1;
    public required ulong Experience { get; set; } = 0;

    public required ulong TotalActivities { get; set; } = 0;
    public required ulong TotalDuration { get; set; } = 0;
    public required ulong TotalDistance { get; set; } = 0;
}
