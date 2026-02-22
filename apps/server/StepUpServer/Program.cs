using System.Text.Json.Serialization.Metadata;
using MongoDB.Driver;
using StepUpServer.Common;
using StepUpServer.Common.Events;
using StepUpServer.Domains.Achievements;
using StepUpServer.Domains.Activity;
using StepUpServer.Domains.Follower;
using StepUpServer.Domains.Progress;
using StepUpServer.Domains.User;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<Microsoft.AspNetCore.Http.Json.JsonOptions>(options =>
{
    options.SerializerOptions.TypeInfoResolver = new DefaultJsonTypeInfoResolver();
});

builder.Services.AddSingleton(provider =>
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    return new MongoClient(connectionString);
});

builder.Services.AddSingleton(provider =>
{
    var client = provider.GetRequiredService<MongoClient>();
    var databaseName = builder.Configuration.GetValue<string>("DatabaseName");
    return client.GetDatabase(databaseName);
});

builder.Services.AddScoped<IEventPublisher, EventPublisher>();
builder.Services.AddSingleton<IFileService, FileService>(); 

builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IUserValidator, UserValidator>();
builder.Services.AddScoped<IUserService, UserService>();

builder.Services.AddScoped<IActivityRepository, ActivityRepository>();
builder.Services.AddScoped<IActivityValidator, ActivityValidator>();
builder.Services.AddScoped<IActivityService, ActivityService>();

builder.Services.AddScoped<IProgressRepository, ProgressRepository>();
builder.Services.AddScoped<IProgressService, ProgressService>();
builder.Services.AddScoped<IEventHandler<UserCreatedEvent>, ProgressService>();
builder.Services.AddScoped<IEventHandler<ActivityCreatedEvent>, ProgressService>();

builder.Services.AddScoped<IAchievementsRepository, AchievementsRepository>();
builder.Services.AddScoped<IAchievementsService, AchievementsService>();
builder.Services.AddScoped<IEventHandler<UserCreatedEvent>, AchievementsService>();
builder.Services.AddScoped<IEventHandler<ProgressUpdatedEvent>, AchievementsService>();

builder.Services.AddScoped<IFollowerRepository, FollowerRepository>();
builder.Services.AddScoped<IFollowerService, FollowerService>();

var app = builder.Build();

app.UseMiddleware<ExceptionMiddleware>();
app.UseMiddleware<AuthMiddleware>();

app.MapUserEndpoints();
app.MapActivityEndpoints();
app.MapProgressEndpoints();
app.MapAchievementsEndpoints();
app.MapFollowerEndpoints();

app.UseStaticFiles();

app.Run();
