using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace StepUpServer.Activity;

public class Activity
{
    [BsonId]
    [BsonRepresentation(BsonType.String)]
    public required string Id { get; set; }
    public required string UserId { get; set; }

    public required string Name { get; set; }
    public string? Description { get; set; }

    public required ulong StartTime { get; set; } // Unix timestamp ms
    public required ulong Duration { get; set; } // ms

    public required ulong Distance { get; set; } // meters
    public required float AverageSpeed { get; set; } // meters per minute
    public required float TopSpeed { get; set; } // meters per minute

    public required Coordinate[] Route { get; set; }
}

public record struct Coordinate(double Latitude, double Longitude);
