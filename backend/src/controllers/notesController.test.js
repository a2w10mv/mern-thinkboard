import { jest } from '@jest/globals';

const mockFindById = jest.fn();

// Mock Note model BEFORE importing the controller
jest.unstable_mockModule('../models/Note.js', () => {
  return {
    default: {
      findById: mockFindById
    }
  };
});

// Import after mocking
const { getNoteById } = await import('./notesController.js');
const Note = (await import('../models/Note.js')).default;

describe('getNoteById', () => {
  let req;
  let res;

  beforeEach(() => {
    req = { params: { id: 'test-id' } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  it('should return 404 if note is not found', async () => {
    Note.findById.mockResolvedValueOnce(null);

    await getNoteById(req, res);

    expect(Note.findById).toHaveBeenCalledWith('test-id');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Note not found" });
  });

  it('should return 500 if an error occurs', async () => {
    const error = new Error('Database error');
    Note.findById.mockRejectedValueOnce(error);

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await getNoteById(req, res);

    expect(Note.findById).toHaveBeenCalledWith('test-id');
    expect(consoleSpy).toHaveBeenCalledWith("Error in getNoteById controller", error);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });

    consoleSpy.mockRestore();
  });

  it('should return 200 with note if found', async () => {
    const mockNoteData = { _id: 'test-id', title: 'Test Note' };
    Note.findById.mockResolvedValueOnce(mockNoteData);

    await getNoteById(req, res);

    expect(Note.findById).toHaveBeenCalledWith('test-id');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "You just fetched the note", note: mockNoteData });
  });
});
