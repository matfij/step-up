using MongoDB.Bson.Serialization.Attributes;

namespace StepUpServer.Domains.Follower;

public class Follower
{
    [BsonId]
    [BsonRepresentation(MongoDB.Bson.BsonType.String)]
    public required string Id { get; set; }

    public required string FollowerId { get; set; }
    public required string FollowerUsername { get; set; }

    public required string FollowingId { get; set; }
    public required string FollowingUsername { get; set; }

    public required ulong FollowedAt { get; set; }
}
