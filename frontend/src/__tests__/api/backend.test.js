import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SubmitButton } from '../../submit';
import { useStore } from '../../store';

jest.mock('../../store');

// Mock fetch
global.fetch = jest.fn();

// Mock console methods to avoid noise in test output
const consoleSpy = {
  log: jest.spyOn(console, 'log').mockImplementation(),
  error: jest.spyOn(console, 'error').mockImplementation(),
};

describe('Backend Integration', () => {
  const mockNodes = [
    {
      id: 'input-1',
      type: 'customInput',
      position: { x: 100, y: 100 },
      data: { inputName: 'test' },
    },
    {
      id: 'math-1',
      type: 'math',
      position: { x: 300, y: 100 },
      data: { operation: 'add' },
    },
  ];

  const mockEdges = [
    {
      id: 'e1',
      source: 'input-1',
      target: 'math-1',
      sourceHandle: 'input-1-value',
      targetHandle: 'math-1-input1',
    },
  ];

  beforeEach(() => {
    // Mock useStore with proper selector pattern
    useStore.mockImplementation((selector) => {
      const state = {
        nodes: mockNodes,
        edges: mockEdges,
      };
      return selector(state);
    });

    // Mock window.alert
    window.alert = jest.fn();

    // Clear all mocks
    fetch.mockClear();
    window.alert.mockClear();
    consoleSpy.log.mockClear();
    consoleSpy.error.mockClear();
  });

  afterAll(() => {
    // Restore console methods
    consoleSpy.log.mockRestore();
    consoleSpy.error.mockRestore();
  });

  test('submits pipeline data to backend correctly', async () => {
    const mockResponse = {
      num_nodes: 2,
      num_edges: 1,
      is_dag: true,
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    render(<SubmitButton />);

    const submitButton = screen.getByText('Analyze Pipeline');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'http://127.0.0.1:8000/pipelines/parse',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: expect.stringContaining('input-1'),
        })
      );
    });
  });

  test('displays success alert with DAG result', async () => {
    const mockResponse = {
      num_nodes: 2,
      num_edges: 1,
      is_dag: true,
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    render(<SubmitButton />);

    const submitButton = screen.getByText('Analyze Pipeline');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('Number of Nodes: 2'));
    });
  });

  test('handles network errors gracefully', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

    render(<SubmitButton />);

    const submitButton = screen.getByText('Analyze Pipeline');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Error analyzing pipeline: Network error');
    });
  });

  test('handles HTTP errors', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    render(<SubmitButton />);

    const submitButton = screen.getByText('Analyze Pipeline');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        'Error analyzing pipeline: HTTP error! status: 500'
      );
    });
  });

  test('handles JSON parsing errors', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.reject(new Error('Invalid JSON')),
    });

    render(<SubmitButton />);

    const submitButton = screen.getByText('Analyze Pipeline');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Error analyzing pipeline: Invalid JSON');
    });
  });
  test('handles mouse hover effects on submit button', () => {
    render(<SubmitButton />);

    const submitButton = screen.getByText('Analyze Pipeline');

    // Test mouse enter event
    fireEvent.mouseEnter(submitButton);

    // Test mouse leave event
    fireEvent.mouseLeave(submitButton);

    // Verify button still works after hover events
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveTextContent('Analyze Pipeline');
  });
});
