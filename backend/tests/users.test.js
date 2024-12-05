const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { app, server } = require("../server");
const User = require("../models/User");

let mongoServer;

const testUser = {
  username: "testuser",
  email: "testuser@example.com",
  password: "Test1234!",
};

describe("User Routes", () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();

    // Close the server if it exists
    if (server) {
      server.close();
    }
  });

  beforeEach(async () => {
    // Clear the database before each test
    await User.deleteMany();
  });

  describe("POST /api/user/register", () => {
    it("should register a new user", async () => {
      const response = await request(app)
        .post("/api/user/register")
        .send(testUser);
      expect(response.status).toBe(201);
      expect(response.body.user).toHaveProperty("_id");
      expect(response.body.user.username).toBe(testUser.username);
    });

    it("should not register a user with an existing username", async () => {
      await User.create(testUser);
      const response = await request(app)
        .post("/api/user/register")
        .send(testUser);
      expect(response.status).toBe(400);
      expect(response.body.msg).toBe("Username or email already exists");
    });
  });

  describe("POST /api/user/login", () => {
    it("should log in an existing user", async () => {
      const newUser = new User(testUser);
      await newUser.save();

      const response = await request(app)
        .post("/api/user/login")
        .send({ username: testUser.username, password: testUser.password });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("token");
      expect(response.body.user.username).toBe(testUser.username);
    });

    it("should not log in with incorrect password", async () => {
      const newUser = new User(testUser);
      await newUser.save();

      const response = await request(app)
        .post("/api/user/login")
        .send({ username: testUser.username, password: "WrongPassword123" });

      expect(response.status).toBe(400);
      expect(response.body.msg).toBe("Invalid username or password");
    });
  });

  describe("GET /api/user/me", () => {
    let token;

    beforeEach(async () => {
      const newUser = new User(testUser);
      await newUser.save();

      const loginResponse = await request(app)
        .post("/api/user/login")
        .send({ username: testUser.username, password: testUser.password });

      token = loginResponse.body.token;
    });

    it("should get authenticated user info", async () => {
      const response = await request(app)
        .get("/api/user/me")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.username).toBe(testUser.username);
      expect(response.body.email).toBe(testUser.email);
    });

    it("should return 401 for unauthenticated request", async () => {
      const response = await request(app).get("/api/user/me");
      expect(response.status).toBe(401);
      expect(response.body.msg).toBe("Unauthorized");
    });
  });
});
