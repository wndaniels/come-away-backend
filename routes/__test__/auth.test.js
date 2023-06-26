"use strict";

const request = require("supertest");
const app = require("../../app");
const User = require("../../models/user");
const { createToken } = require("../../helpers/tokens");
const db = request("../../db");

// Mock the User.authenticate and User.register functions
jest.mock("../../models/user", () => ({
  authenticate: jest.fn(),
  register: jest.fn(),
}));

// Mock the createToken function
jest.mock("../../helpers/tokens", () => ({
  createToken: jest.fn(() => "mocked-token"),
}));

describe("Authentication routes", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /auth/token", () => {
    it("should return a JWT token if authentication is successful", async () => {
      // Mock the User.authenticate function to resolve with a user
      User.authenticate.mockResolvedValueOnce({ id: 1, username: "testuser" });

      const response = await request(app)
        .post("/auth/token")
        .send({ username: "testuser", password: "testpassword" });

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ token: "mocked-token" });
      expect(User.authenticate).toHaveBeenCalledWith(
        "testuser",
        "testpassword"
      );
      expect(createToken).toHaveBeenCalledWith({ id: 1, username: "testuser" });
    });

    it("should return a 400 error if the request body is invalid", async () => {
      const response = await request(app)
        .post("/auth/token")
        .send({ username: "testuser" }); // missing the password field

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({
        error: {
          message: ['instance requires property "password"'],
          status: 400,
        },
      });
      expect(User.authenticate).not.toHaveBeenCalled();
      expect(createToken).not.toHaveBeenCalled();
    });

    it("should return an error if authentication fails", async () => {
      // Mock the User.authenticate function to throw an error
      User.authenticate.mockRejectedValueOnce(
        new Error("Authentication failed")
      );

      const response = await request(app)
        .post("/auth/token")
        .send({ username: "testuser", password: "testpassword" });

      expect(response.statusCode).toBe(500);
      expect(response.body).toEqual({
        error: {
          message: "Authentication failed",
          status: 500,
        },
      });
      expect(User.authenticate).toHaveBeenCalledWith(
        "testuser",
        "testpassword"
      );
      expect(createToken).not.toHaveBeenCalled();
    });
  });

  describe("POST /auth/register", () => {
    it("should register a new user and return a JWT token", async () => {
      // Mock the User.register function to resolve with a new user
      User.register.mockResolvedValueOnce({ id: 1, username: "testuser" });

      const response = await request(app).post("/auth/register").send({
        username: "testuser",
        password: "testpassword",
        firstName: "John",
        lastName: "Doe",
        email: "test@example.com",
      });

      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual({ token: "mocked-token" });
      expect(User.register).toHaveBeenCalledWith({
        username: "testuser",
        password: "testpassword",
        firstName: "John",
        lastName: "Doe",
        email: "test@example.com",
        isAdmin: false,
      });
      expect(createToken).toHaveBeenCalledWith({ id: 1, username: "testuser" });
    });

    it("should return a 400 error if the request body is invalid", async () => {
      const response = await request(app)
        .post("/auth/register")
        .send({ username: "testuser" }); // missing other required fields

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({
        error: {
          message: [
            'instance requires property "firstName"',
            'instance requires property "lastName"',
            'instance requires property "password"',
            'instance requires property "email"',
          ],
          status: 400,
        },
      });
      expect(User.register).not.toHaveBeenCalled();
      expect(createToken).not.toHaveBeenCalled();
    });

    it("should return an error if user registration fails", async () => {
      // Mock the User.register function to throw an error
      User.register.mockRejectedValueOnce(new Error("Registration failed"));

      const response = await request(app).post("/auth/register").send({
        username: "testuser",
        password: "testpassword",
        firstName: "John",
        lastName: "Doe",
        email: "test@example.com",
      });

      expect(response.statusCode).toBe(500);
      expect(response.body).toEqual({
        error: {
          message: "Registration failed",
          status: 500,
        },
      });
      expect(User.register).toHaveBeenCalledWith({
        username: "testuser",
        password: "testpassword",
        firstName: "John",
        lastName: "Doe",
        email: "test@example.com",
        isAdmin: false,
      });
      expect(createToken).not.toHaveBeenCalled();
    });
  });
});
