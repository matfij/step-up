using StepUpServer.Users;

namespace StepUpServer.Common;

public static class HttpContextExtensions
{
    public static T GetItem<T>(this HttpContext context, string key)
    {
        if (context.Items.TryGetValue(key, out var value) && value is T typedValue)
        {
            return typedValue;
        }
        throw new InvalidOperationException($"Item with key '{key}' not found or of incorrect type.");
    }

    public static string GetUserId(this HttpContext context)
    {
        return context.GetItem<User>("User").Id;
    }
}
