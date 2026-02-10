using StepUpServer.Common;
using StepUpServer.Domains.User;

namespace StepUpServer.Domains.Follower;

public interface IFollowerService
{
    public Task<Follower> Create(string userId, string followingId);
    public Task<List<Follower>> GetFollowers(string userId);
    public Task<List<Follower>> GetFollowing(string userId);
    public Task Delete(string userId, string id);
}

public class FollowerService(IFollowerRepository followerRepository, IUserValidator userValidator) : IFollowerService
{
    private readonly IFollowerRepository _repository = followerRepository;
    private readonly IUserValidator _userValidator = userValidator;

    public async Task<Follower> Create(string userId, string followingId)
    {
        if (userId == followingId)
        {
            throw new ApiException("errors.cannotFollowYourself");
        }

        var user = await _userValidator.EnsureIdExists(userId);
        var following = await _userValidator.EnsureIdExists(followingId);

        var followers = await _repository.GetFollowers(followingId);
        if (followers.Find(f => f.FollowerId == userId) is not null)
        {
            throw new ApiException("errors.alreadyFollowing");
        }

        var follower = new Follower
        {
            Id = Utils.GenerateId(),
            FollowerId = user.Id,
            FollowerUsername = user.Username,
            FollowingId = following.Id,
            FollowingUsername = following.Username,
            FollowedAt = Utils.GetCurrentTimestamp()
        };

        return await _repository.Create(follower);
    }

    public async Task<List<Follower>> GetFollowers(string userId)
    {
        return await _repository.GetFollowers(userId);
    }

    public async Task<List<Follower>> GetFollowing(string userId)
    {
        return await _repository.GetFollowing(userId);
    }

    public async Task Delete(string userId, string id)
    {
        var follower = await _repository.GetById(id);

        if (follower is null || follower.FollowingId != userId)
        {
            throw new ApiException("errors.followerNotFound");
        }

        await _repository.Delete(id);
    }
}
