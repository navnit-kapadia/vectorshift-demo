import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DraggableNode } from '../../draggableNode';

// Mock DragEvent for jsdom environment
class MockDragEvent extends Event {
  constructor(eventType, params = {}) {
    super(eventType, params);
    this.dataTransfer = params.dataTransfer || {
      setData: jest.fn(),
      effectAllowed: '',
      getData: jest.fn(),
    };
  }
}

// Add DragEvent to global for tests
global.DragEvent = MockDragEvent;

// Mock theme
jest.mock('../../styles/theme', () => ({
  theme: {
    colors: {
      primary: '#2563eb', // Add primary color for fallback
      node: {
        customInput: '#10b981',
        llm: '#8b5cf6',
        text: '#06b6d4',
        math: '#ef4444',
        // Note: unknownType is not defined here, should fallback to primary
      },
      text: {
        white: '#ffffff',
      },
    },
    borderRadius: '8px',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    fonts: {
      primary: 'Inter, system-ui, sans-serif',
    },
  },
}));

describe('DraggableNode Component', () => {
  test('renders with correct label and styling', () => {
    render(<DraggableNode type="customInput" label="Input" />);

    expect(screen.getByText('Input')).toBeInTheDocument();

    const nodeElement = screen.getByText('Input').closest('div');
    expect(nodeElement).toHaveAttribute('draggable', 'true');
    expect(nodeElement).toHaveClass('customInput');
  });

  test('applies correct color for known node types', () => {
    const { container } = render(<DraggableNode type="customInput" label="Input" />);

    const nodeElement = container.querySelector('.customInput');
    expect(nodeElement).toHaveStyle({
      backgroundColor: '#10b981',
    });
  });

  test('applies fallback color for unknown node types', () => {
    const { container } = render(<DraggableNode type="unknownType" label="Unknown" />);

    const nodeElement = container.querySelector('.unknownType');

    // Check if it uses theme.colors.primary as fallback
    expect(nodeElement).toHaveStyle({
      backgroundColor: 'rgb(37, 99, 235)', // This is #2563eb in RGB
    });
  });

  test('has correct draggable attributes', () => {
    render(<DraggableNode type="math" label="Math" />);

    const draggableElement = screen.getByText('Math').closest('div');
    expect(draggableElement).toHaveAttribute('draggable', 'true');
    expect(draggableElement).toHaveStyle({
      cursor: 'grab',
      minWidth: '100px',
      height: '70px',
    });
  });

  test('handles drag start event correctly', () => {
    render(<DraggableNode type="llm" label="LLM" />);

    const draggableElement = screen.getByText('LLM').closest('div');

    // Create mock dataTransfer
    const mockDataTransfer = {
      setData: jest.fn(),
      effectAllowed: '',
    };

    // Simulate dragstart event
    fireEvent.dragStart(draggableElement, {
      dataTransfer: mockDataTransfer,
    });

    expect(mockDataTransfer.setData).toHaveBeenCalledWith(
      'application/reactflow',
      JSON.stringify({ nodeType: 'llm' })
    );
    expect(mockDataTransfer.effectAllowed).toBe('move');
  });

  test('handles drag end event correctly', () => {
    render(<DraggableNode type="text" label="Text" />);

    const draggableElement = screen.getByText('Text').closest('div');

    // Drag end event should reset cursor
    fireEvent.dragEnd(draggableElement);

    // The component should handle the drag end
    expect(draggableElement).toBeInTheDocument();
  });

  test('renders with correct CSS class', () => {
    const { container } = render(<DraggableNode type="filter" label="Filter" />);

    const nodeElement = container.querySelector('.filter');
    expect(nodeElement).toBeInTheDocument();
  });

  test('text content is styled correctly', () => {
    render(<DraggableNode type="counter" label="Counter" />);

    const textElement = screen.getByText('Counter');
    expect(textElement).toHaveStyle({
      color: '#ffffff',
      fontSize: '14px',
      fontWeight: '600',
    });
  });

  test('renders gradient background element', () => {
    const { container } = render(<DraggableNode type="delay" label="Delay" />);
    const backgroundElements = container.querySelectorAll('div');
    const hasGradientBackground = Array.from(backgroundElements).some((el) => {
      const style = window.getComputedStyle(el);
      return (
        style.position === 'absolute' &&
        style.top === '0px' &&
        style.left === '0px' &&
        style.right === '0px' &&
        style.bottom === '0px'
      );
    });

    expect(hasGradientBackground).toBe(true);
  });

  test('applies correct styling for multiple node types', () => {
    const nodeTypes = [
      { type: 'customInput', label: 'Input', expectedColor: '#10b981' },
      { type: 'llm', label: 'LLM', expectedColor: '#8b5cf6' },
      { type: 'text', label: 'Text', expectedColor: '#06b6d4' },
      { type: 'math', label: 'Math', expectedColor: '#ef4444' },
    ];

    nodeTypes.forEach(({ type, label, expectedColor }) => {
      const { container, unmount } = render(<DraggableNode type={type} label={label} />);

      expect(screen.getByText(label)).toBeInTheDocument();

      const nodeElement = container.querySelector(`.${type}`);
      expect(nodeElement).toHaveStyle({
        backgroundColor: expectedColor,
      });

      unmount(); // Clean up for next iteration
    });
  });

  test('component structure includes required elements', () => {
    const { container } = render(<DraggableNode type="logger" label="Logger" />);

    // Check main container
    const mainDiv = container.firstChild;
    expect(mainDiv).toHaveAttribute('draggable', 'true');
    expect(mainDiv).toHaveClass('logger');

    // Check text element
    expect(screen.getByText('Logger')).toBeInTheDocument();

    // Check for multiple divs (main + gradient background)
    const divElements = container.querySelectorAll('div');
    expect(divElements.length).toBeGreaterThanOrEqual(2);
  });

  test('drag event sets correct data format for ReactFlow', () => {
    render(<DraggableNode type="customOutput" label="Output" />);

    const draggableElement = screen.getByText('Output').closest('div');
    const mockDataTransfer = {
      setData: jest.fn(),
      effectAllowed: '',
    };

    fireEvent.dragStart(draggableElement, {
      dataTransfer: mockDataTransfer,
    });

    const expectedData = JSON.stringify({ nodeType: 'customOutput' });
    expect(mockDataTransfer.setData).toHaveBeenCalledWith('application/reactflow', expectedData);
  });

  test('renders flexbox layout correctly', () => {
    const { container } = render(<DraggableNode type="math" label="Math" />);

    const nodeElement = container.querySelector('.math');
    expect(nodeElement).toHaveStyle({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
    });
  });
  test('handles mouse hover effects correctly', () => {
    const { container } = render(<DraggableNode type="math" label="Math" />);

    const draggableElement = container.querySelector('.math');

    // Test mouse enter (hover effect)
    fireEvent.mouseEnter(draggableElement);

    // Test mouse leave (removes hover effect)
    fireEvent.mouseLeave(draggableElement);

    // Verify element is still functional after hover events
    expect(draggableElement).toBeInTheDocument();
    expect(draggableElement).toHaveAttribute('draggable', 'true');
  });
});
