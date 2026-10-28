import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';

// Mock the Note model
jest.unstable_mockModule("../../models/Note.js", () => {
  return {
    default: jest.fn()
  };
});

const Note = (await import("../../models/Note.js")).default;
const { createNote } = await import("../notesController.js");

describe("createNote controller", () => {
  let req;
  let res;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Setup mock request and response objects
    req = {
      body: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Mock console.error to avoid noise in test output
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  it("should create a new note and return 201 status", async () => {
    // Arrange
    const mockNoteData = {
      title: "Test Note",
      content: "Test Content",
      type: "note",
    };
    req.body = mockNoteData;

    const mockSavedNote = {
      _id: "mockId123",
      ...mockNoteData,
      order: -1234567890,
      layout: { x: 0, y: Infinity, w: 2, h: 2 }
    };

    // Note is a constructor function in the implementation
    // We need to mock the constructor to return an object with a save method
    Note.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue(mockSavedNote)
    }));

    // Override Date.now for predictable 'order' field testing
    const originalDateNow = Date.now;
    Date.now = jest.fn(() => 1234567890);

    // Act
    await createNote(req, res);

    // Assert
    expect(Note).toHaveBeenCalledWith({
      title: "Test Note",
      content: "Test Content",
      type: "note",
      tasks: undefined,
      order: -1234567890,
      layout: { x: 0, y: Infinity, w: 2, h: 2 }
    });

    // Check that we called json with the saved note
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ note: mockSavedNote });

    // Restore Date.now
    Date.now = originalDateNow;
  });

  it("should return 500 when saving note fails", async () => {
    // Arrange
    req.body = {
      title: "Test Note",
      content: "Test Content"
    };

    const mockError = new Error("Database error");
    Note.mockImplementation(() => ({
      save: jest.fn().mockRejectedValue(mockError)
    }));

    // Act
    await createNote(req, res);

    // Assert
    expect(console.error).toHaveBeenCalledWith("Error in createNote controller", mockError);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
  });
});
