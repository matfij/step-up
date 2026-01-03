using StepUpServer.Common;
using StepUpServer.Common.Events;

namespace StepUpServer.Domains.Activity
{
    public interface IActivityService
    {
        Task<Activity> Create(string userId, CreateActivityRequest request);
        Task<Activity?> GetById(string id);
        Task<Activity[]> GetByUserId(string userId, int skip, int take);
        Task<Activity> Update(string userId, UpdateActivityRequest request);
    }

    public class ActivityService(
        IActivityRepository repository,
        IActivityValidator validator,
        IEventPublisher publisher
    ) : IActivityService
    {
        private readonly IActivityRepository _repository = repository;
        private readonly IActivityValidator _validator = validator;
        private readonly IEventPublisher _publisher = publisher;

        public async Task<Activity> Create(string userId, CreateActivityRequest request)
        {
            var newActivity = new Activity
            {
                Id = Utils.GenerateId(),
                UserId = userId,
                Name = request.Name,
                Description = request.Description,
                StartTime = request.StartTime,
                Duration = request.Duration,
                Distance = request.Distance,
                AverageSpeed = request.AverageSpeed,
                TopSpeed = request.TopSpeed,
                RouteLatitudes = request.RouteLatitudes,
                RouteLongitudes = request.RouteLongitudes,
            };

            _validator.ValidateAll(newActivity);

            var activity = await _repository.Create(newActivity);

            await _publisher.PublishAsync(
                new ActivityCreatedEvent
                {
                    ActivityId = activity.Id,
                    UserId = activity.UserId,
                    Distance = activity.Distance,
                    Duration = activity.Duration,
                    AverageSpeed = activity.AverageSpeed,
                }
            );

            return activity;
        }

        public async Task<Activity[]> GetByUserId(string userId, int skip, int take)
        {
            return await _repository.GetByUserId(userId, skip, Math.Min(take, 100));
        }

        public async Task<Activity?> GetById(string id)
        {
            return await _repository.GetById(id);
        }

        public async Task<Activity> Update(string userId, UpdateActivityRequest request)
        {
            var activity = await _repository.GetById(request.Id);
            if (activity is null || activity.UserId != userId)
            {
                throw new ApiException("errors.activityNotFound");
            }

            _validator.ValidateName(request.Name);
            _validator.ValidateDescription(request.Description);

            activity.Name = request.Name;
            activity.Description = request.Description;

            return await _repository.Update(activity);
        }
    }
}
