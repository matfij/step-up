using System;
using Microsoft.AspNetCore.Mvc;
using StepUpServer.Common;

namespace StepUpServer.Activity;

public static class ActivityEndpoints
{
    public static void MapActivityEndpoints(this WebApplication app)
    {
        app.MapPost(
                "/activities",
                async (
                    HttpContext context,
                    CreateActivityRequest request,
                    IActivityService activityService) =>
                {
                    var userId = context.GetUserId();
                    var activity = await activityService.Create(userId, request);
                    return Results.Ok(activity);
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
                    return Results.Ok(activity);
                }
            )
            .WithMetadata(new RequireAuthAttribute());

        app.MapGet(
                "/activitiesByUserId/{userId}",
                async (
                    string userId,
                    IActivityService activityService,
                    [FromQuery] int skip = 0,
                    [FromQuery] int take = 10) =>
                {
                    var activities = await activityService.GetByUserId(userId, skip, take);
                    return Results.Ok(activities);
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
                return Results.Ok(activity);
            }
        )
             .WithMetadata(new RequireAuthAttribute());
    }
}
