namespace StepUpServer.Domains.User;

public readonly record struct SignUpStartRequest(string Email, string Username);

public readonly record struct SignUpCompleteRequest(string Email, string AuthToken);

public readonly record struct SignInStartRequest(string Email);

public readonly record struct SignInCompleteRequest(string Email, string AuthToken);

public readonly record struct UserAuthResponse(
    string Id,
    string Email,
    string Username,
    string? ApiToken,
    string AvatarUri
);

public readonly record struct UserAvatarResponse(string AvatarUri);
