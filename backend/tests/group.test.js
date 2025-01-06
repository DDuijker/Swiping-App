const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { app, server } = require("../server.js");
const Group = require("../models/Group");

// Test gemaakt door Djoeke

describe("Group API Endpoints", () => {
  let mongoServer;
  let groupId;

  beforeAll(async () => {
    // Start MongoDB Memory Server
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    // Connect to in-memory MongoDB
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    // Disconnect MongoDB and stop the memory server
    await mongoose.disconnect();
    await mongoServer.stop();

    // Close the server if it exists
    if (server) {
      server.close();
    }
  });

  beforeEach(async () => {
    // Clear all collections before each test
    for (const collection in mongoose.connection.collections) {
      await mongoose.connection.collections[collection].deleteMany();
    }
  });

  it("should create a new group", async () => {
    const response = await request(app)
      .post("/api/groups")
      .send({
        name: "Movie Night Group",
        description: "A group for movie enthusiasts",
        members: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()], // Use 'new'
        creator: new mongoose.Types.ObjectId(), // Use 'new'
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.name).toBe("Movie Night Group");
    groupId = response.body._id; // Save group ID for future tests
  });

  it("should fetch all groups", async () => {
    await Group.create({
      name: "Sample Group",
      description: "Sample Description",
      members: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()],
      creator: new mongoose.Types.ObjectId(),
    });

    const response = await request(app).get("/api/groups");
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(1); // Ensure there's one group
  });

  it("should fetch groups by user ID", async () => {
    const userId = new mongoose.Types.ObjectId(); // Create a test user ID

    // Create groups where the user is either a member or the creator
    await Group.create({
      name: "Group 1",
      description: "User as Creator",
      members: [new mongoose.Types.ObjectId()],
      creator: userId, // Set user as creator
    });

    await Group.create({
      name: "Group 2",
      description: "User as Member",
      members: [userId, new mongoose.Types.ObjectId()], // Set user as a member
      creator: new mongoose.Types.ObjectId(),
    });

    await Group.create({
      name: "Group 3",
      description: "No Relation",
      members: [new mongoose.Types.ObjectId()],
      creator: new mongoose.Types.ObjectId(),
    });

    // Make request to fetch groups by user ID
    const response = await request(app).get(`/api/groups/user/${userId}`);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(2); // Only 2 groups should be related to the user

    // Validate that the correct groups are returned
    const groupNames = response.body.map((group) => group.name);
    expect(groupNames).toContain("Group 1");
    expect(groupNames).toContain("Group 2");
    expect(groupNames).not.toContain("Group 3");
  });

  it("should fetch a group by ID", async () => {
    const group = await Group.create({
      name: "Unique Group",
      description: "Unique Description",
      members: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()],
      creator: new mongoose.Types.ObjectId(),
    });

    const response = await request(app).get(`/api/groups/${group._id}`);
    expect(response.statusCode).toBe(200);
    expect(response.body._id).toBe(group._id.toString());
    expect(response.body.name).toBe("Unique Group");
  });

  it("should update a group", async () => {
    const group = await Group.create({
      name: "Update Group",
      description: "Update Description",
      members: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()],
      creator: new mongoose.Types.ObjectId(),
    });

    const response = await request(app).put(`/api/groups/${group._id}`).send({
      name: "Updated Group Name",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe("Updated Group Name");
  });

  it("should delete a group", async () => {
    const group = await Group.create({
      name: "Delete Group",
      description: "Delete Description",
      members: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()],
      creator: new mongoose.Types.ObjectId(),
    });

    const response = await request(app).delete(`/api/groups/${group._id}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Group deleted");
  });
});
