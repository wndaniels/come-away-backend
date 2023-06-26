"use strict";

const request = require("supertest");
const jwt = require("jsonwebtoken");
const { getDatabaseUri, SECRET_KEY } = require("../../config");
const app = require("../../app");
const { ensureCorrectUserOrAdmin } = require("../../middleware/auth");
const Calendar = require("../../models/calendar");
const DueDate = require("../../models/dueDate");
const { BadRequestError } = require("../../expressError");
const db = require("../../db");

// Mock the Calendar model methods
jest.mock("../../models/calendar", () => ({
  getYearsData: jest.fn(),
  getMonthsData: jest.fn(),
  getDaysData: jest.fn(),
}));

// Mock the DueDate model methods
jest.mock("../../models/dueDate", () => ({
  getAllDueDates: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
}));

let token;
let mockDueDate;

beforeEach(() => {
  // Generate a JWT token for authentication
  token = jwt.sign({ username: "testuser", isAdmin: false }, SECRET_KEY);

  // Prepare mock data for due date
  mockDueDate = [
    {
      id: 1,
      babyName: "Test Baby",
      yearId: 1,
      monthId: 2,
      dayId: 3,
      userId: 1,
    },
  ];
});

describe("DueDate routes", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /due-date/years", () => {
    it("should return years data", async () => {
      // Mock the Calendar.getYearsData method to resolve with mock data
      const mockYearsData = ["2021", "2022", "2023"];
      Calendar.getYearsData.mockResolvedValueOnce(mockYearsData);

      // Send a GET request to the specified route
      const response = await request(app).get("/due-date/years");

      // Verify the response
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(mockYearsData);
      expect(Calendar.getYearsData).toHaveBeenCalled();
    });

    it("should handle errors when retrieving years data", async () => {
      // Mock the Calendar.getYearsData method to reject with an error
      Calendar.getYearsData.mockRejectedValueOnce(
        new Error("Error retrieving years data")
      );

      // Send a GET request to the specified route
      const response = await request(app).get("/due-date/years");

      // Verify the response
      expect(response.statusCode).toBe(500);
      expect(response.body).toEqual({
        error: {
          message: "Error retrieving years data",
          status: 500,
        },
      });
      expect(Calendar.getYearsData).toHaveBeenCalled();
    });
  });

  describe("GET /due-date/months", () => {
    it("should return months data", async () => {
      // Mock the Calendar.getMonthsData method to resolve with mock data
      const mockMonthsData = ["January", "February", "March"];
      Calendar.getMonthsData.mockResolvedValueOnce(mockMonthsData);

      // Send a GET request to the specified route
      const response = await request(app).get("/due-date/months");

      // Verify the response
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(mockMonthsData);
      expect(Calendar.getMonthsData).toHaveBeenCalled();
    });

    it("should handle errors when retrieving months data", async () => {
      // Mock the Calendar.getMonthsData method to reject with an error
      Calendar.getMonthsData.mockRejectedValueOnce(
        new Error("Error retrieving months data")
      );

      // Send a GET request to the specified route
      const response = await request(app).get("/due-date/months");

      // Verify the response
      expect(response.statusCode).toBe(500);
      expect(response.body).toEqual({
        error: {
          message: "Error retrieving months data",
          status: 500,
        },
      });
      expect(Calendar.getMonthsData).toHaveBeenCalled();
    });
  });

  describe("GET /due-date/days", () => {
    it("should return days data", async () => {
      // Mock the Calendar.getDaysData method to resolve with mock data
      const mockDaysData = [1, 2, 3, 4, 5];
      Calendar.getDaysData.mockResolvedValueOnce(mockDaysData);

      // Send a GET request to the specified route
      const response = await request(app).get("/due-date/days");

      // Verify the response
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(mockDaysData);
      expect(Calendar.getDaysData).toHaveBeenCalled();
    });

    it("should handle errors when retrieving days data", async () => {
      // Mock the Calendar.getDaysData method to reject with an error
      Calendar.getDaysData.mockRejectedValueOnce(
        new Error("Error retrieving days data")
      );

      // Send a GET request to the specified route
      const response = await request(app).get("/due-date/days");

      // Verify the response
      expect(response.statusCode).toBe(500);
      expect(response.body).toEqual({
        error: {
          message: "Error retrieving days data",
          status: 500,
        },
      });
      expect(Calendar.getDaysData).toHaveBeenCalled();
    });
  });

  describe("GET /due-date", () => {
    it("should return all due dates", async () => {
      // Mock the DueDate.getAllDueDates method to resolve with mock data
      DueDate.getAllDueDates.mockResolvedValueOnce(mockDueDate);

      // Send a GET request to the specified route
      const response = await request(app).get("/due-date");

      // Verify the response
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(mockDueDate);
      expect(DueDate.getAllDueDates).toHaveBeenCalled();
    });

    it("should handle errors when retrieving due dates", async () => {
      // Mock the DueDate.getAllDueDates method to reject with an error
      DueDate.getAllDueDates.mockRejectedValueOnce(
        new Error("Error retrieving due dates")
      );

      // Send a GET request to the specified route
      const response = await request(app).get("/due-date");

      // Verify the response
      expect(response.statusCode).toBe(500);
      expect(response.body).toEqual({
        error: {
          message: "Error retrieving due dates",
          status: 500,
        },
      });
      expect(DueDate.getAllDueDates).toHaveBeenCalled();
    });
  });

  describe("POST /due-date/:username/create", () => {
    it("should create a new due date", async () => {
      // Prepare mock data for a new due date
      const mockNewDueDate = {
        babyName: "Test Baby 2",
        yearId: 1,
        monthId: 12,
        dayId: 6,
        userId: 1,
      };

      // Mock the DueDate.create method to resolve with the mock new due date
      DueDate.create.mockResolvedValueOnce(mockNewDueDate);

      // Send a POST request to the specified route with the necessary parameters and authentication token
      const response = await request(app)
        .post("/due-date/testuser/create")
        .set("Authorization", `Bearer ${token}`)
        .send(mockNewDueDate);

      // Verify the response
      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual({ dueDate: mockNewDueDate });
      expect(DueDate.create).toHaveBeenCalledWith(mockNewDueDate);
    });

    it("should handle errors when creating a due date", async () => {
      // Mock the DueDate.create method to reject with an error
      DueDate.create.mockRejectedValueOnce(
        new Error("Error creating a due date")
      );

      // Send a POST request to the specified route with the necessary parameters and authentication token
      const response = await request(app)
        .post("/due-date/testuser/create")
        .set("Authorization", `Bearer ${token}`)
        .send({
          babyName: "Test Baby 3",
          yearId: 1,
          monthId: 3,
          dayId: 8,
          userId: 1,
        });

      // Verify the response
      expect(response.statusCode).toBe(500);
      expect(response.body).toEqual({
        error: {
          message: "Error creating a due date",
          status: 500,
        },
      });
      expect(DueDate.create).toHaveBeenCalledWith({
        babyName: "Test Baby 3",
        yearId: 1,
        monthId: 3,
        dayId: 8,
        userId: 1,
      });
    });
  });

  describe("PATCH /due-date/:id/:username/edit", () => {
    it("should update a due date", async () => {
      // Prepare mock data for an updated due date
      const mockUpdateDueDate = {
        babyName: "New Name",
        yearId: 1,
        monthId: 2,
        dayId: 3,
      };

      // Mock the DueDate.update method to resolve with the mock updated due date
      DueDate.update.mockResolvedValueOnce(mockUpdateDueDate);

      // Send a PATCH request to the specified route with the necessary parameters and authentication token
      const response = await request(app)
        .patch(`/due-date/${mockDueDate[0].id}/testuser/edit`)
        .set("Authorization", `Bearer ${token}`)
        .send(mockUpdateDueDate);

      // Verify the response
      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual({ updateDueDate: mockUpdateDueDate });
      expect(DueDate.update).toHaveBeenCalledWith(
        `${mockDueDate[0].id}`,
        mockUpdateDueDate
      );
    });

    it("should handle errors when updating a due date", async () => {
      // Prepare mock data for an updated due date
      const mockUpdateDueDate = {
        babyName: "New Name",
        yearId: 1,
        monthId: 2,
        dayId: 3,
      };

      // Mock the DueDate.update method to reject with an error
      DueDate.update.mockRejectedValueOnce(
        new Error("Error updating a due date")
      );

      // Send a PATCH request to the specified route with the necessary parameters and authentication token
      const response = await request(app)
        .patch(`/due-date/${mockDueDate[0].id}/testuser/edit`)
        .set("Authorization", `Bearer ${token}`)
        .send(mockUpdateDueDate);

      // Verify the response
      expect(response.statusCode).toBe(500);
      expect(response.body).toEqual({
        error: {
          message: "Error updating a due date",
          status: 500,
        },
      });
      expect(DueDate.update).toHaveBeenCalledWith(
        `${mockDueDate[0].id}`,
        mockUpdateDueDate
      );
    });
  });

  describe("DELETE /due-date/:id/:username/delete", () => {
    it("should delete a due date", async () => {
      // Mock the DueDate.delete method to resolve with the mock due date
      DueDate.delete.mockResolvedValueOnce(mockDueDate);

      // Send a DELETE request to the specified route with the necessary parameters and authentication token
      const response = await request(app)
        .delete(`/due-date/${mockDueDate[0].id}/testuser/delete`)
        .set("Authorization", `Bearer ${token}`)
        .send(mockDueDate);

      // Verify the response
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ delete: 1 });
    });
  });
});
