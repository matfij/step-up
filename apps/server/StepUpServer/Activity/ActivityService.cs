using StepUpServer.Common;

namespace StepUpServer.Activity
{
    public interface IActivityService
    {
        Task<Activity> Create(CreateActivityRequest request);
        Task<Activity?> GetById(string id);
        Task<Activity[]> GetByUserId(string userId, int? skip = null, int? take = null);
        Task<Activity> Update(string userId, string id, string name, string? description = null);
    }

    public class ActivityService(IActivityRepository repository) : IActivityService
    {
        private readonly IActivityRepository _repository = repository;

        public async Task<Activity> Create(CreateActivityRequest request)
        {
            var activity = new Activity
            {
                Id = Utils.GenerateId(),
                UserId = request.UserId,
                Name = request.Name,
                Description = request.Description,
                StartTime = request.StartTime,
                Duration = request.Duration,
                Distance = request.Distance,
                AverageSpeed = request.AverageSpeed,
                TopSpeed = request.TopSpeed,
                Route = request.Route,
            };
            return await _repository.Create(activity);
        }

        public async Task<Activity[]> GetByUserId(string userId, int? skip = null, int? take = null)
        {
            return await _repository.GetByUserId(userId, skip ?? 0, Math.Min(take ?? 10, 100));
        }

        public async Task<Activity?> GetById(string id)
        {
            return await _repository.GetById(id);
        }

        public async Task<Activity> Update(string userId, string id, string name, string? description = null)
        {
            var activity = await _repository.GetById(id) ?? throw new ApiException("errors.activityNotFound");
            if (activity.UserId != userId)
            {
                throw new ApiException("errors.activityNotFound");
            }
            activity.Name = name;
            activity.Description = description;
            return await _repository.Update(activity);
        }
    }
}
