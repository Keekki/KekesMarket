const request = require("supertest");
const app = require("../app");
const db = require("../db/database");

// Setup and teardown for the database
beforeAll(async () => {
  try {
    db.run(`CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(50) NOT NULL,
    password_hash VARCHAR(60),
    phoneNumber VARCHAR(15),
    postalCode VARCHAR(10),
    city VARCHAR(30),
    googleId VARCHAR(255),
    admin BOOLEAN NOT NULL DEFAULT 0,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id)
  )`);

    db.run(`CREATE TABLE IF NOT EXISTS Listings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price REAL NOT NULL,
    ownerId VARCHAR(36) NOT NULL,
    additionalInfo TEXT,
    category TEXT
  )`);
  } catch (err) {
    console.error("Failed to create table", err);
  }
});

afterAll(async () => {
  db.run("DROP TABLE IF EXISTS Listings");
  db.run("DROP TABLE IF EXISTS users");
  db.close();
});

describe("User Authentication", () => {
  beforeEach(async () => {
    db.run("DELETE FROM users");
  });

  test("Sign Up - should create a new user", async () => {
    const response = await request(app).post("/users/signup").send({
      name: "Timo Silakka",
      email: "timo@gmail.com",
      password: "password123",
      phoneNumber: "050 123 4567",
      postalCode: "33520",
      city: "Tampere",
    });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("email", "timo@gmail.com");
    expect(response.body).toHaveProperty("token");
  });

  test("Login - should authenticate an existing user", async () => {
    await request(app).post("/users/signup").send({
      name: "Timo Silakka",
      email: "timo@gmail.com",
      password: "password123",
      postalCode: "33520",
      city: "Tampere",
    });

    const response = await request(app).post("/users/login").send({
      email: "timo@gmail.com",
      password: "password123",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("email", "timo@gmail.com");
    expect(response.body).toHaveProperty("token");
  });
});

describe("Listing Operations", () => {
  let token;
  let userId;

  beforeAll(async () => {
    db.run("DELETE FROM users");
    db.run("DELETE FROM Listings");

    const signupResponse = await request(app).post("/users/signup").send({
      name: "Timo Silakka",
      email: "timo@gmail.com",
      password: "password123",
      postalCode: "33520",
      city: "Tampere",
    });

    userId = signupResponse.body.id;
    token = signupResponse.body.token;
  });

  describe("Create Listing Tests", () => {
    test("Create Listing without additionalInfo", async () => {
      const response = await request(app)
        .post("/api/listings")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "PC",
          description: "Gaming PC",
          price: 550,
          category: "IT",
        });

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty("id");
    });

    test("Create Listing with additionalInfo", async () => {
      const response = await request(app)
        .post("/api/listings")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "PC",
          description: "Gaming PC",
          price: 550,
          additionalInfo: "only pickup",
          category: "IT",
        });

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty("id");
    });
  });

  test("Get Listing by ID - should return the specified listing", async () => {
    const createResponse = await request(app)
      .post("/api/listings")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Laptop",
        description: "Powerful laptop",
        price: 800,
        ownerId: userId,
        category: "IT",
      });

    const listingId = createResponse.body.id;

    const response = await request(app)
      .get(`/api/listings/${listingId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("id", listingId);
  });

  test("Update Listing - should update the specified listing", async () => {
    const createResponse = await request(app)
      .post("/api/listings")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Smartphone",
        description: "Latest smartphone",
        price: 1000,
        ownerId: userId,
        category: "IT",
      });

    const listingId = createResponse.body.id;

    const response = await request(app)
      .put(`/api/listings/${listingId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Updated Smartphone",
        description: "Updated description",
        price: 1100,
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("message", "Listing Updated");
  });

  test("Delete Listing - should delete the specified listing", async () => {
    const createResponse = await request(app)
      .post("/api/listings")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Tablet",
        description: "Powerful tablet",
        price: 600,
        ownerId: userId,
        category: "IT",
      });

    const listingId = createResponse.body.id;

    const response = await request(app)
      .delete(`/api/listings/${listingId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("message", "Listing Deleted");
  });
});
