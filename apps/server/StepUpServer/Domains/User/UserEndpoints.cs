using Microsoft.AspNetCore.Mvc;
using StepUpServer.Common;

namespace StepUpServer.Domains.User;

public static class UserEndpoints
{
    public static void MapUserEndpoints(this WebApplication app)
    {
        app.MapPost(
            "/users/signup/start",
            async (SignUpStartRequest request, IUserService userService) =>
            {
                await userService.StartSignUp(request.Email, request.Username);
                return Results.Ok();
            }
        );

        app.MapPost(
            "/users/signup/complete",
            async (SignUpCompleteRequest request, IUserService userService) =>
            {
                var user = await userService.CompleteSignUp(request.Email, request.AuthToken);
                return Results.Ok(
                    new UserAuthResponse(
                        user.Id,
                        user.Email,
                        user.Username,
                        user.ApiToken,
                        user.AvatarUri
                    )
                );
            }
        );

        app.MapPost(
            "/users/signin/start",
            async (SignInStartRequest request, IUserService userService) =>
            {
                await userService.StartSignIn(request.Email);
                return Results.Ok();
            }
        );

        app.MapPost(
            "/users/signin/complete",
            async (SignInCompleteRequest request, IUserService userService) =>
            {
                var user = await userService.CompleteSignIn(request.Email, request.AuthToken);
                return Results.Ok(
                    new UserAuthResponse(
                        user.Id,
                        user.Email,
                        user.Username,
                        user.ApiToken,
                        user.AvatarUri
                    )
                );
            }
        );

        app.MapPut(
                "/users/update",
                async (HttpContext context, [FromForm] string? username, IFormFile? avatar, IUserService userService) =>
                {
                    var userId = context.GetUserId();
                    var user = await userService.Update(userId, username, avatar);
                    return Results.Ok(
                        new UserAuthResponse(
                            user.Id,
                            user.Email,
                            user.Username,
                            user.ApiToken,
                            user.AvatarUri
                        )
                    );
                }
            )
            .WithMetadata(new RequireAuthAttribute())
            // 5MB + 1KB for multipart overhead
            .WithMetadata(new RequestSizeLimitAttribute(5 * 1024 * 1024 + 1024))
            .DisableAntiforgery();
    }
}
