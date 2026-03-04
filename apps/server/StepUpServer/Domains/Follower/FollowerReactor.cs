using StepUpServer.Common.Events;

namespace StepUpServer.Domains.Follower;

public class FollowerReactor(IFollowerRepository repository) : IEventHandler<UserUpdatedEvent>
{
    private readonly IFollowerRepository _repository = repository;

    public async Task HandleAsync(UserUpdatedEvent userUpdatedEveny)
    {
        var followers = await _repository.GetFollowers(userUpdatedEveny.UserId);
        foreach (var follower in followers)
        {
            follower.FollowingUsername = userUpdatedEveny.Username;
            follower.FollowingAvatarUri = userUpdatedEveny.AvatarUri;
            
            await _repository.Update(follower);
        }

        var followings = await _repository.GetFollowing(userUpdatedEveny.UserId);
        foreach (var following in followings)
        {
            following.FollowerUsername = userUpdatedEveny.Username;
            following.FollowerAvatarUri = userUpdatedEveny.AvatarUri;
            await _repository.Update(following);
        }
    }
}
