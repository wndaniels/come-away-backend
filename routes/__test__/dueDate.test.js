"use strict";

const request = require("supertest");
const jwt = require("jsonwebtoken");
const { getDatabaseUri, SECRET_KEY } = require("../../config");
const app = require("../../app");
const { ensureCorrectUserOrAdmin } = require("../../middleware/auth");
const Calendar = require("../../models/calendar");
const DueDate = require("../../models/dueDate");
const { BadRequestError } = require("../../expressError");

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
  token = jwt.sign({ username: "testuser", isAdmin: false }, SECRET_KEY);
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
      const mockYearsData = ["2021", "2022", "2023"];
      Calendar.getYearsData.mockResolvedValueOnce(mockYearsData);

      const response = await request(app).get("/due-date/years");

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(mockYearsData);
      expect(Calendar.getYearsData).toHaveBeenCalled();
    });

    it("should handle errors when retrieving years data", async () => {
      Calendar.getYearsData.mockRejectedValueOnce(
        new Error("Error retrieving years data")
      );

      const response = await request(app).get("/due-date/years");

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
      const mockMonthsData = ["January", "February", "March"];
      Calendar.getMonthsData.mockResolvedValueOnce(mockMonthsData);

      const response = await request(app).get("/due-date/months");

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(mockMonthsData);
      expect(Calendar.getMonthsData).toHaveBeenCalled();
    });

    it("should handle errors when retrieving months data", async () => {
      Calendar.getMonthsData.mockRejectedValueOnce(
        new Error("Error retrieving months data")
      );

      const response = await request(app).get("/due-date/months");

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
      const mockDaysData = [1, 2, 3, 4, 5];
      Calendar.getDaysData.mockResolvedValueOnce(mockDaysData);

      const response = await request(app).get("/due-date/days");

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(mockDaysData);
      expect(Calendar.getDaysData).toHaveBeenCalled();
    });

    it("should handle errors when retrieving days data", async () => {
      Calendar.getDaysData.mockRejectedValueOnce(
        new Error("Error retrieving days data")
      );

      const response = await request(app).get("/due-date/days");

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

  describe("GET /", () => {
    it("should return all due dates", async () => {
      DueDate.getAllDueDates.mockResolvedValueOnce(mockDueDate);

      const response = await request(app).get("/due-date");

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(mockDueDate);
      expect(DueDate.getAllDueDates).toHaveBeenCalled();
    });

    it("should handle errors when retrieving due dates", async () => {
      DueDate.getAllDueDates.mockRejectedValueOnce(
        new Error("Error retrieving due dates")
      );

      const response = await request(app).get("/due-date");

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
      const mockNewDueDate = {
        babyName: "Test Baby 2",
        yearId: 1,
        monthId: 12,
        dayId: 6,
        userId: 1,
      };

      DueDate.create.mockResolvedValueOnce(mockNewDueDate);

      const response = await request(app)
        .post("/due-date/testuser/create")
        .set("Authorization", `Bearer ${token}`)
        .send(mockNewDueDate);

      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual({ dueDate: mockNewDueDate });
      expect(DueDate.create).toHaveBeenCalledWith(mockNewDueDate);
    });

    it("should handle errors when creating a due date", async () => {
      DueDate.create.mockRejectedValueOnce(
        new Error("Error creating a due date")
      );

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
    it("should edit due date", async () => ({}));
  });

  describe("PATCH /due-date/:id/:username/edit", () => {
    it("should update a due date", async () => {
      const mockUpdateDueDate = {
        babyName: "Updated Name",
      };

      DueDate.update.mockResolvedValueOnce(mockUpdateDueDate);

      const response = await request(app)
        .patch(`/due-date/${mockDueDate[0].id}/testuser/edit`)
        .set("Authorization", `Bearer ${token}`)
        .send(1, mockUpdateDueDate);

      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual({ updateDueDate: mockUpdateDueDate });
      expect(DueDate.update).toHaveBeenCalledWith(1, mockUpdateDueDate);
    });

    it("should handle errors when updating a due date", async () => {
      const mockUpdateDueDate = {
        babyName: "Updated Name",
      };

      DueDate.update.mockRejectedValueOnce(
        new Error("Error updating a due date")
      );

      const response = await request(app)
        .patch(`/due-date/${mockUpdateDueDate.id}/testuser/edit`)
        .set("Authorization", `Bearer ${token}`)
        .send(mockUpdateDueDate);

      console.log(response.body);

      expect(response.statusCode).toBe(500);
      expect(response.body).toEqual({
        error: {
          message: "Error updating a due date",
          status: 500,
        },
      });
      expect(DueDate.update).toHaveBeenCalledWith(mockDueDate.id, {
        babyName: "UpdatedName",
        yearId: 2,
        monthId: 12,
        dayId: 15,
        userId: 1,
      });
    });
  });

  describe("DELETE /due-date/:id/:username/delete", () => {
    it("should delete created due date", async () => {
      DueDate.delete.mockResolvedValueOnce(mockDueDate);

      const response = await request(app)
        .delete(`/due-date/${mockDueDate[0].id}/testuser/delete`)
        .set("Authorization", `Bearer ${token}`)
        .send(mockDueDate);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ delete: 1 });
    });
  });
});
