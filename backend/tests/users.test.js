const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { app, server } = require("../server.js");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("User API", () => {
  let token;
  let userId;

  it("should register a new user", async () => {
    const res = await request(app).post("/api/user/register").send({
      username: "testuser",
      email: "test@example.com",
      password: "testpassword",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("user");
    expect(res.body.user).toHaveProperty("_id");
    userId = res.body.user._id;
  });

  it("should login the user", async () => {
    const res = await request(app).post("/api/user/login").send({
      username: "testuser",
      password: "testpassword",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    token = res.body.token;
  });

  it("should get authenticated user info", async () => {
    const res = await request(app)
      .get("/api/user/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("username", "testuser");
  });

  it("should get all users", async () => {
    const res = await request(app)
      .get("/api/user")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("should get user by ID", async () => {
    const res = await request(app)
      .get(`/api/user/${userId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("user");
    expect(res.body.user).toHaveProperty("_id", userId);
  });

  it("should search user by username", async () => {
    const res = await request(app).get("/api/user/search?username=testuser");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty("username", "testuser");
  });

  it("should update user", async () => {
    const res = await request(app)
      .put(`/api/user/${userId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ email: "newtest@example.com" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("email", "newtest@example.com");
  });

  it("should delete user", async () => {
    const res = await request(app)
      .delete(`/api/user/${userId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "User deleted successfully");
  });
});
