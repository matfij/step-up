using Microsoft.AspNetCore.Mvc;
using StepUpServer.Common;

namespace StepUpServer.Domains.Activity;

public static class ActivityEndpoints
{
    public static void MapActivityEndpoints(this WebApplication app)
    {
        app.MapPost(
                "/activities",
                async (
                    HttpContext context,
                    CreateActivityRequest request,
                    IActivityService activityService
                ) =>
                {
                    var userId = context.GetUserId();
                    var activity = await activityService.Create(userId, request);
                    return Results.Ok(
                        new ActivityResponse
                        {
                            Id = activity.Id,
                            UserId = activity.UserId,
                            Name = activity.Name,
                            Description = activity.Description,
                            Duration = activity.Duration,
                            Distance = activity.Distance,
                            AverageSpeed = activity.AverageSpeed,
                            TopSpeed = activity.TopSpeed,
                            StartTime = activity.StartTime,
                            RouteLatitudes = activity.RouteLatitudes,
                            RouteLongitudes = activity.RouteLongitudes,
                        }
                    );
                }
            )
            .WithMetadata(new RequireAuthAttribute());

        app.MapGet(
                "/activities/{id}",
                async (string id, IActivityService activityService) =>
                {
                    var activity = await activityService.GetById(id);
                    if (activity == null)
                    {
                        return Results.NotFound();
                    }
                    return Results.Ok(
                         new ActivityResponse
                         {
                             Id = activity.Id,
                             UserId = activity.UserId,
                             Name = activity.Name,
                             Description = activity.Description,
                             Duration = activity.Duration,
                             Distance = activity.Distance,
                             AverageSpeed = activity.AverageSpeed,
                             TopSpeed = activity.TopSpeed,
                             StartTime = activity.StartTime,
                             RouteLatitudes = activity.RouteLatitudes,
                             RouteLongitudes = activity.RouteLongitudes,
                         }
                    );
                }
            )
            .WithMetadata(new RequireAuthAttribute());

        app.MapGet(
                "/activities/byUserId/{userId}",
                async (
                    string userId,
                    IActivityService activityService,
                    [FromQuery] int skip = 0,
                    [FromQuery] int take = 10
                ) =>
                {
                    var activities = await activityService.GetByUserId(userId, skip, take);
                    return Results.Ok(
                        activities.Select(
                            activity =>
                                new ActivityResponse
                                {
                                    Id = activity.Id,
                                    UserId = activity.UserId,
                                    Name = activity.Name,
                                    Description = activity.Description,
                                    Duration = activity.Duration,
                                    Distance = activity.Distance,
                                    AverageSpeed = activity.AverageSpeed,
                                    TopSpeed = activity.TopSpeed,
                                    StartTime = activity.StartTime,
                                    RouteLatitudes = activity.RouteLatitudes,
                                    RouteLongitudes = activity.RouteLongitudes,
                                }
                        )
                    );
                }
            )
            .WithMetadata(new RequireAuthAttribute());

        app.MapPut(
                "/activities",
                async (
                    HttpContext context,
                    UpdateActivityRequest request,
                    IActivityService activityService
                ) =>
                {
                    var userId = context.GetUserId();
                    var activity = await activityService.Update(userId, request);
                    return Results.Ok(
                        new ActivityResponse
                        {
                            Id = activity.Id,
                            UserId = activity.UserId,
                            Name = activity.Name,
                            Description = activity.Description,
                            Duration = activity.Duration,
                            Distance = activity.Distance,
                            AverageSpeed = activity.AverageSpeed,
                            TopSpeed = activity.TopSpeed,
                            StartTime = activity.StartTime,
                            RouteLatitudes = activity.RouteLatitudes,
                            RouteLongitudes = activity.RouteLongitudes,
                        }
                    );
                }
            )
            .WithMetadata(new RequireAuthAttribute());
    }
}
