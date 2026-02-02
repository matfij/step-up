import { MongoClient } from "mongodb";
import { faker } from "@faker-js/faker";

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME;

if (!MONGO_URI || !DB_NAME) {
  throw new Error("MONGO_URI and DB_NAME must be set");
}

const CLEAN_DATA = false;
const USER_COUNT = 10;
const MIN_ACTIVITIES_PER_USER = 3;
const MAX_ACTIVITIES_PER_USER = 15;

const client = new MongoClient(MONGO_URI);
await client.connect();
const db = client.db(DB_NAME);

const usersCollection = db.collection("Users");
const progressCollection = db.collection("Progress");
const achievementsCollection = db.collection("Achievements");
const activitiesCollection = db.collection("Activities");

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const now = () => Date.now();

const generateRoute = () => {
  const points = rand(5, 10);

  let lat = rand(-800000, 800000) / 10000;
  let lon = rand(-1800000, 1800000) / 10000;

  const route = [];

  for (let i = 0; i < points; i++) {
    lat += rand(-5, 5) / 10000;
    lon += rand(-5, 5) / 10000;

    route.push({
      Latitude: Number(lat.toFixed(6)),
      Longitude: Number(lon.toFixed(6)),
    });
  }

  return route;
};

const clean = async () => {
  try {
    console.log("🧹 Cleaning existing data...");
    await usersCollection.deleteMany({});
    await progressCollection.deleteMany({});
    await achievementsCollection.deleteMany({});
    await activitiesCollection.deleteMany({});
    console.log("✅ Cleaning completed successfully");
  } catch (err) {
    console.error("❌ Cleaning failed:", err);
  }
};

const seed = async () => {
  try {
    console.log("🌱 Seeding data...");
    for (let userIndex = 1; userIndex <= USER_COUNT; userIndex++) {
      console.log(`\t⏳ Seeding user ${userIndex} of ${USER_COUNT}...`);

      const userId = faker.string.uuid();
      const username = faker.internet.username();
      const email = faker.internet.email();

      let totalDistance = 0;
      let totalDuration = 0;
      let maxDistance = 0;
      let maxDuration = 0;

      const activities = [];
      const maxActivities = rand(
        MIN_ACTIVITIES_PER_USER,
        MAX_ACTIVITIES_PER_USER,
      );

      for (
        let activityIndex = 0;
        activityIndex < maxActivities;
        activityIndex++
      ) {
        const distance = rand(100, 50_000);
        const duration = rand(600_000, 15_600_000);
        const avgSpeed = Math.floor(distance / (duration / 1000));
        const topSpeed = avgSpeed + rand(50, 300);

        totalDistance += distance;
        totalDuration += duration;
        maxDistance = Math.max(maxDistance, distance);
        maxDuration = Math.max(maxDuration, duration);

        const route = generateRoute();

        activities.push({
          _id: faker.string.uuid(),
          UserId: userId,
          Name: faker.location.city(),
          Description: faker.lorem.sentence(),
          StartTime: now() - rand(0, 200_000_000),
          Duration: duration,
          Distance: distance,
          AverageSpeed: avgSpeed,
          TopSpeed: topSpeed,
          RouteLatitudes: route.map((p) => p.Latitude),
          RouteLongitudes: route.map((p) => p.Longitude),
        });
      }

      await usersCollection.insertOne({
        _id: userId,
        Email: email,
        Username: username,
        IsConfirmed: true,
        AuthToken: null,
        ApiToken: faker.string.uuid(),
        CreatedAt: now() - rand(300_000_000, 900_000_000),
        LastSeenAt: now() - rand(0, 100_000_000),
      });

      const level = Math.floor(totalDistance / 10_000) + 1;
      const experience = totalDistance + Math.floor(totalDuration / 1000);

      const currentStreak = rand(1, 7);
      const bestStreak = currentStreak + rand(0, 7);

      await progressCollection.insertOne({
        _id: faker.string.uuid(),
        UserId: userId,
        Username: username,
        Level: level,
        Experience: experience,
        TotalActivities: maxActivities,
        TotalDuration: totalDuration,
        TotalDistance: totalDistance,
        CurrentStreak: currentStreak,
        BestStreak: bestStreak,
        MonthlyDuration: Math.floor(totalDuration / rand(2, 5)),
        MonthlyDistance: Math.floor(totalDistance / rand(2, 5)),
      });

      await achievementsCollection.insertOne({
        _id: faker.string.uuid(),
        UserId: userId,
        TotalDistance: {
          Tier: Math.floor(totalDistance / 50_000),
          Progress: totalDistance,
          AchievedAt: 0,
        },
        TotalDuration: {
          Tier: Math.floor(totalDuration / 3_600_000),
          Progress: totalDuration,
          AchievedAt: 0,
        },
        TotalActivities: {
          Tier: Math.floor(maxActivities / 10),
          Progress: maxActivities,
          AchievedAt: 0,
        },
        MaxCurrentStreak: {
          Tier: Math.floor(bestStreak / 7),
          Progress: bestStreak,
          AchievedAt: 0,
        },
        MaxActivitySpeed: {
          Tier: 0,
          Progress: 0,
          AchievedAt: 0,
        },
        MaxActivityDistance: {
          Tier: 0,
          Progress: maxDistance,
          AchievedAt: 0,
        },
        MaxActivityDuration: {
          Tier: 0,
          Progress: maxDuration,
          AchievedAt: 0,
        },
        Greenhorn: {
          Tier: 1,
          Progress: 0,
          AchievedAt: now() - rand(0, 50_000_000),
        },
        Marathoner: {
          Tier: 0,
          Progress: 0,
          AchievedAt: 0,
        },
      });

      await activitiesCollection.insertMany(activities);

      console.log(`\t✅ User ${userIndex} seeded successfully`);
    }
    console.log("✅ Seeding completed successfully");
  } catch (err) {
    console.error("❌ Seeding failed:", err);
  } finally {
    await client.close();
  }
};

if (CLEAN_DATA) {
  await clean();
}
await seed();
