namespace StepUpServer.Users;

record StartRegisterStartRequest(string Email, string Username);

record CompleteRegisterRequest(string Email, string AuthCode);

public static class UserEndpints
{
    public static void MapUserEndpoints(this WebApplication app)
    {
        app.MapPost(
            "/users/register/start",
            async (StartRegisterStartRequest request, IUserService userService) =>
            {
                var user = await userService.StartRegister(request.Email, request.Username);
                return Results.Ok(
                    new
                    {
                        user.Id,
                        user.Email,
                        user.Username,
                    }
                );
            }
        );

        app.MapPost(
            "/users/register/complete",
            async (CompleteRegisterRequest request, IUserService userService) =>
            {
                var user = await userService.CompleteRegister(request.Email, request.AuthCode);
                return Results.Ok(
                    new
                    {
                        user.Id,
                        user.Email,
                        user.Username,
                        user.ApiToken,
                    }
                );
            }
        );
    }
}
