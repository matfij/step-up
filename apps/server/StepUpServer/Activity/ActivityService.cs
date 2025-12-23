using StepUpServer.Common;

namespace StepUpServer.Activity
{
    public interface IActivityService
    {
        Task<Activity> Create(string userId, CreateActivityRequest request);
        Task<Activity?> GetById(string id);
        Task<Activity[]> GetByUserId(string userId, int skip, int take);
        Task<Activity> Update(string userId, UpdateActivityRequest request);
    }

    public class ActivityService(IActivityRepository repository, IActivityValidator validator) : IActivityService
    {
        private readonly IActivityRepository _repository = repository;
        private readonly IActivityValidator _validator = validator;

        public async Task<Activity> Create(string userId, CreateActivityRequest request)
        {
            var activity = new Activity
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
                Route = request.Route,
            };

            _validator.ValidateAll(activity);

            return await _repository.Create(activity);
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
