using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace StepUpServer.Users;

public class User
{
    [BsonId]
    [BsonRepresentation(BsonType.String)]
    public required string Id { get; set; }
    public required string Email { get; set; }
    public required string Username { get; set; }
    public required bool IsConfirmed { get; set; }
    public string? AuthToken { get; set; }
    public string? ApiToken { get; set; }
    public required ulong CreatedAt { get; set; }
    public required ulong LastSeenAt { get; set; }
}
