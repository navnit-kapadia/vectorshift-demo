import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BaseNode } from '../../components/BaseNode';
import { nodeConfigurations } from '../../nodeConfigs';
import { useStore } from '../../store';

jest.mock('../../store');

describe('Text Node Variable Detection', () => {
  const mockUpdateNodeField = jest.fn();

  beforeEach(() => {
    useStore.mockReturnValue(mockUpdateNodeField);
  });

  test('detects single variable and creates dynamic handle', () => {
    render(
      <BaseNode
        id="text-1"
        data={{ text: 'Hello {{name}}!' }}
        nodeConfig={nodeConfigurations.text}
      />
    );

    expect(screen.getByText('Variables: name')).toBeInTheDocument();

    const handles = screen.getAllByTestId('handle');
    // Should have more handles due to dynamic variable
    expect(handles.length).toBeGreaterThan(1);
  });

  test('detects multiple variables', () => {
    render(
      <BaseNode
        id="text-1"
        data={{ text: 'Hello {{firstName}} {{lastName}}!' }}
        nodeConfig={nodeConfigurations.text}
      />
    );

    expect(screen.getByText('Variables: firstName, lastName')).toBeInTheDocument();
  });

  test('ignores invalid variable syntax', () => {
    render(
      <BaseNode
        id="text-1"
        data={{ text: 'Invalid: {{123}} {{spaced name}} {{}}' }}
        nodeConfig={nodeConfigurations.text}
      />
    );

    expect(screen.queryByText(/Variables:/)).not.toBeInTheDocument();
  });

  test('handles duplicate variables correctly', () => {
    render(
      <BaseNode
        id="text-1"
        data={{ text: '{{name}} and {{name}} again' }}
        nodeConfig={nodeConfigurations.text}
      />
    );

    expect(screen.getByText('Variables: name')).toBeInTheDocument();
    // Should not show "name, name"
    expect(screen.queryByText('Variables: name, name')).not.toBeInTheDocument();
  });
});
