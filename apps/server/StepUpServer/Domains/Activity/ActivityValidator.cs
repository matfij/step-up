using StepUpServer.Common;

namespace StepUpServer.Domains.Activity;

public interface IActivityValidator
{
    void ValidateName(string name);
    void ValidateDescription(string? description);
    void ValidateAll(Activity activity);
}

public class ActivityValidator : IActivityValidator
{
    private const int _nameMaxLength = 100;
    private const int _descriptionMaxLength = 800;

    private const ulong _durationMin = 1;
    private const ulong _durationMax = 860_400_000; // 10 days (ms)

    private const ulong _distanceMin = 1;
    private const ulong _distanceMax = 1_000_000; // meters

    private const float _averageSpeedMin = 1;
    private const float _averageSpeedMax = 10_000;

    private const float _topSpeedMin = 1;
    private const float _topSpeedMax = 100_000;

    private const int _routeMinPoints = 2;
    private const int _routeMaxPoints = 1_000;

    private const int _latitudeMin = -90;
    private const int _latitudeMax = 90;
    private const int _longitudeMin = -180;
    private const int _longitudeMax = 180;

    public void ValidateName(string name)
    {
        if (string.IsNullOrWhiteSpace(name) || name.Length > _nameMaxLength)
        {
            throw new ApiException("errors.invalidActivityName", nameof(name));
        }
    }

    public void ValidateDescription(string? description)
    {
        if (description != null && description.Length > _descriptionMaxLength)
        {
            throw new ApiException("errors.invalidActivityDescription", nameof(description));
        }
    }

    public void ValidateAll(Activity activity)
    {
        ValidateName(activity.Name);
        ValidateDescription(activity.Description);

        if (activity.Duration < _durationMin || activity.Duration > _durationMax)
        {
            throw new ApiException("errors.invalidActivityDuration", nameof(activity.Duration));
        }

        if (activity.Distance < _distanceMin || activity.Distance > _distanceMax)
        {
            throw new ApiException("errors.invalidActivityDistance", nameof(activity.Distance));
        }

        if (activity.AverageSpeed < _averageSpeedMin || activity.AverageSpeed > _averageSpeedMax)
        {
            throw new ApiException(
                "errors.invalidActivityAverageSpeed",
                nameof(activity.AverageSpeed)
            );
        }

        if (activity.TopSpeed < _topSpeedMin || activity.TopSpeed > _topSpeedMax)
        {
            throw new ApiException("errors.invalidActivityTopSpeed", nameof(activity.TopSpeed));
        }

        if (activity.TopSpeed < activity.AverageSpeed)
        {
            throw new ApiException(
                "errors.invalidActivitySpeedRelation",
                nameof(activity.AverageSpeed)
            );
        }

        if (
            activity.RouteLatitudes.Length < _routeMinPoints
            || activity.RouteLatitudes.Length > _routeMaxPoints
            || activity.RouteLatitudes.Length != activity.RouteLongitudes.Length
        )
        {
            throw new ApiException("errors.invalidActivityRoute");
        }

        for (int i = 0; i < activity.RouteLatitudes.Length; i++)
        {
            var latitude = activity.RouteLatitudes[i];
            var longitude = activity.RouteLongitudes[i];

            if (
                latitude < _latitudeMin
                || latitude > _latitudeMax
                || longitude < _longitudeMin
                || longitude > _longitudeMax
            )
            {
                throw new ApiException("errors.invalidActivityRoute");
            }
        }
    }
}
