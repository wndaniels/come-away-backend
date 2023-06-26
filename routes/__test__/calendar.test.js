"use strict";

const request = require("supertest");
const app = require("../../app");
const Calendar = require("../../models/calendar");

// Mock the Calendar model methods
jest.mock("../../models/calendar", () => ({
  getAllCal: jest.fn(),
  getCalViewTypes: jest.fn(),
  getBeginHoursData: jest.fn(),
  getEndHoursData: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
}));

describe("Calendar routes", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /calendar", () => {
    it("should return all calendar data", async () => {
      const mockCalData = [
        { id: 1, name: "Calendar 1" },
        { id: 2, name: "Calendar 2" },
      ];
      Calendar.getAllCal.mockResolvedValueOnce(mockCalData);

      const response = await request(app).get("/calendar");

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(mockCalData);
      expect(Calendar.getAllCal).toHaveBeenCalled();
    });

    it("should handle errors when retrieving calendar data", async () => {
      Calendar.getAllCal.mockRejectedValueOnce(
        new Error("Error retrieving calendar data")
      );

      const response = await request(app).get("/calendar");

      expect(response.statusCode).toBe(500);
      expect(response.body).toEqual({
        error: {
          message: "Error retrieving calendar data",
          status: 500,
        },
      });
      expect(Calendar.getAllCal).toHaveBeenCalled();
    });
  });

  describe("GET /calendar/cal-views", () => {
    it("should return calendar view types", async () => {
      const mockCalViewData = [
        { id: 1, name: "Day" },
        { id: 2, name: "Week" },
      ];
      Calendar.getCalViewTypes.mockResolvedValueOnce(mockCalViewData);

      const response = await request(app).get("/calendar/cal-views");

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(mockCalViewData);
      expect(Calendar.getCalViewTypes).toHaveBeenCalled();
    });

    it("should handle errors when retrieving calendar view types", async () => {
      Calendar.getCalViewTypes.mockRejectedValueOnce(
        new Error("Error retrieving calendar view types")
      );

      const response = await request(app).get("/calendar/cal-views");

      expect(response.statusCode).toBe(500);
      expect(response.body).toEqual({
        error: {
          message: "Error retrieving calendar view types",
          status: 500,
        },
      });
      expect(Calendar.getCalViewTypes).toHaveBeenCalled();
    });
  });
});
