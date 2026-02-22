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
                        user.ApiToken
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
                        user.ApiToken
                    )
                );
            }
        );

        app.MapPut(
            "/users/avatar",
            async (HttpContext context, IUserService userService) =>
            {
                var userId = context.GetUserId();
                var file = context.Request.Form.Files.First();
                var avatarUri = await userService.UpladteAvatar(userId, file);
                return Results.Ok(new UserAvatarResponse(avatarUri));
            }
        ).WithMetadata(new RequireAuthAttribute());
    }
}
