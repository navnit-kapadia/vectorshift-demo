import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BaseNode } from '../../components/BaseNode';
import { useStore } from '../../store';

// Mock the store
jest.mock('../../store');

describe('BaseNode Component', () => {
  const mockUpdateNodeField = jest.fn();

  beforeEach(() => {
    useStore.mockReturnValue(mockUpdateNodeField);
    mockUpdateNodeField.mockClear();
  });

  const mockNodeConfig = {
    title: 'Test Node',
    type: 'test',
    width: 200,
    height: 120,
    fields: [
      {
        name: 'testField',
        label: 'Test Field',
        type: 'text',
        defaultValue: 'test value',
      },
      {
        name: 'selectField',
        label: 'Select Field',
        type: 'select',
        options: ['option1', 'option2'],
        defaultValue: 'option1',
      },
    ],
    inputs: [{ id: 'input1' }],
    outputs: [{ id: 'output1' }],
    content: 'Test content',
  };

  test('renders node with title and content', () => {
    render(<BaseNode id="test-1" data={{}} nodeConfig={mockNodeConfig} />);

    expect(screen.getByText('Test Node')).toBeInTheDocument();
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  test('renders form fields correctly', () => {
    render(<BaseNode id="test-1" data={{}} nodeConfig={mockNodeConfig} />);

    expect(screen.getByLabelText('Test Field:')).toBeInTheDocument();
    expect(screen.getByLabelText('Select Field:')).toBeInTheDocument();
    expect(screen.getByDisplayValue('test value')).toBeInTheDocument();
  });

  test('renders input and output handles', () => {
    render(<BaseNode id="test-1" data={{}} nodeConfig={mockNodeConfig} />);

    const handles = screen.getAllByTestId('handle');
    expect(handles).toHaveLength(2); // 1 input + 1 output
  });

  test('calls updateNodeField when field changes', () => {
    render(<BaseNode id="test-1" data={{}} nodeConfig={mockNodeConfig} />);

    const textInput = screen.getByLabelText('Test Field:');
    fireEvent.change(textInput, { target: { value: 'new value' } });

    expect(mockUpdateNodeField).toHaveBeenCalledWith('test-1', 'testField', 'new value');
  });
});
