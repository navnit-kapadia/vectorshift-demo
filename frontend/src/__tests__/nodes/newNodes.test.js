import React from 'react';
import { render, screen } from '@testing-library/react';
import { MathNode } from '../../nodes/mathNode';
import { FilterNode } from '../../nodes/filterNode';
import { DelayNode } from '../../nodes/delayNode';
import { CounterNode } from '../../nodes/counterNode';
import { LoggerNode } from '../../nodes/loggerNode';
import { useStore } from '../../store';

jest.mock('../../store');

describe('New Nodes Abstraction', () => {
  beforeEach(() => {
    useStore.mockReturnValue(jest.fn());
  });

  test('MathNode renders with operation dropdown and input handles', () => {
    render(<MathNode id="math-1" data={{}} />);

    expect(screen.getByText('Math')).toBeInTheDocument();
    expect(screen.getByLabelText('Operation:')).toBeInTheDocument();
    expect(screen.getByDisplayValue('add')).toBeInTheDocument();

    const handles = screen.getAllByTestId('handle');
    expect(handles).toHaveLength(3); // 2 inputs + 1 output
  });

  test('FilterNode renders with condition field', () => {
    render(<FilterNode id="filter-1" data={{}} />);

    expect(screen.getByText('Filter')).toBeInTheDocument();
    expect(screen.getByLabelText('Condition:')).toBeInTheDocument();
    expect(screen.getByDisplayValue('value > 0')).toBeInTheDocument();
  });

  test('DelayNode renders with seconds field', () => {
    render(<DelayNode id="delay-1" data={{}} />);

    expect(screen.getByText('Delay')).toBeInTheDocument();
    expect(screen.getByLabelText('Seconds:')).toBeInTheDocument();
    expect(screen.getByDisplayValue('1')).toBeInTheDocument();
  });

  test('CounterNode renders with start field and no input handles', () => {
    render(<CounterNode id="counter-1" data={{}} />);

    expect(screen.getByText('Counter')).toBeInTheDocument();
    expect(screen.getByLabelText('Start:')).toBeInTheDocument();

    const handles = screen.getAllByTestId('handle');
    expect(handles).toHaveLength(1); // Only output handle
  });

  test('LoggerNode renders with content and input/output handles', () => {
    render(<LoggerNode id="logger-1" data={{}} />);

    expect(screen.getByText('Logger')).toBeInTheDocument();
    expect(screen.getByText('Logs input to console')).toBeInTheDocument();

    const handles = screen.getAllByTestId('handle');
    expect(handles).toHaveLength(2); // 1 input + 1 output
  });
});
