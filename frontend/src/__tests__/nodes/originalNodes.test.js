import React from 'react';
import { render, screen } from '@testing-library/react';
import { InputNode } from '../../nodes/inputNode';
import { LLMNode } from '../../nodes/llmNode';
import { OutputNode } from '../../nodes/outputNode';
import { TextNode } from '../../nodes/textNode';
import { useStore } from '../../store';

jest.mock('../../store');

describe('Original Nodes', () => {
  beforeEach(() => {
    useStore.mockReturnValue(jest.fn());
  });

  test('InputNode renders correctly', () => {
    render(<InputNode id="input-1" data={{}} />);
    expect(screen.getByText('Input')).toBeInTheDocument();
  });

  test('LLMNode renders correctly', () => {
    render(<LLMNode id="llm-1" data={{}} />);
    expect(screen.getByText('LLM')).toBeInTheDocument();
  });

  test('OutputNode renders correctly', () => {
    render(<OutputNode id="output-1" data={{}} />);
    expect(screen.getByText('Output')).toBeInTheDocument();
  });

  test('TextNode renders correctly', () => {
    render(<TextNode id="text-1" data={{}} />);
    expect(screen.getByText('Text')).toBeInTheDocument();
  });
});
