namespace StepUpServer.Domains.User;

public interface IUserEmailService
{
    string GetSignUpEmailContent(string username, string authCode);
    string GetSignInEmailContent(string username, string authCode);
}
public class UserEmailService : IUserEmailService
{
    public string GetSignUpEmailContent(string username, string authCode) =>
$"""
<div
    style="
    background-color: #000;
    letter-spacing: 1px;
    text-align: center;
    padding: 10px;
    font-size: 20px;
    "
>
    <h2 class="title" style="color: #00ff41; padding-top: 24px; padding-bottom: 12px">
        Welcome to Step Up
    </h2>

    <div style="color: #fff3e6">
        <div>
            Hey there <b>{username}</b>! Thank you for joining, in order to activate your account use following code:
        </div>

        <div
            style="
            width: auto;
            margin-top: 12px;
            padding: 12px;
            color: #ffbf80;
            font-size: 44px;
            letter-spacing: 8px;
            background-color: #171e25;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
            "
        >
            {authCode}
        </div>

        <div style="margin-top: 16px; padding-bottom: 16px; font-style: italic">
            Regards,
            <div>Mat</div>
        </div>
    </div>
</div> 
""";
    
    public string GetSignInEmailContent(string username, string authCode) =>
$"""
<div
    style="
    background-color: #000;
    letter-spacing: 1px;
    text-align: center;
    padding: 10px;
    font-size: 20px;
    "
>
    <h2 class="title" style="color: #00ff41; padding-top: 24px; padding-bottom: 12px">
        Welcome back, {username}
    </h2>

    <div style="color: #fff3e6">
        <div>
            In order to sign in use following code:
        </div>

        <div
            style="
            width: auto;
            margin-top: 12px;
            padding: 12px;
            color: #ffbf80;
            font-size: 44px;
            letter-spacing: 8px;
            background-color: #171e25;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
            "
        >
            {authCode}
        </div>
    </div>
</div> 
""";

}
