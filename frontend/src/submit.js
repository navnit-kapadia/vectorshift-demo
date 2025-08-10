import React from 'react';
import styled from 'styled-components';
import { useStore } from './store';
import { theme } from './styles/theme';

const SubmitContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.lg};
  background-color: ${theme.colors.surface};
  border-top: 1px solid ${theme.colors.border};
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.05);
`;

const SubmitButtonStyled = styled.button`
  background-color: ${theme.colors.primary};
  color: ${theme.colors.text.white};
  border: none;
  border-radius: ${theme.borderRadius};
  padding: ${theme.spacing.md} ${theme.spacing.xl};
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: ${theme.boxShadow};
  transition: all 0.2s ease;
  min-width: 200px;
  font-family: ${theme.fonts.primary};

  &:hover {
    background-color: ${theme.colors.accent};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
    box-shadow: ${theme.boxShadow};
  }

  &:disabled {
    background-color: ${theme.colors.border};
    cursor: not-allowed;
    transform: none;

    &:hover {
      background-color: ${theme.colors.border};
      transform: none;
    }
  }
`;

export const SubmitButton = () => {
  const nodes = useStore((state) => state.nodes);
  const edges = useStore((state) => state.edges);

  const handleSubmit = async () => {
    try {
      // Prepare pipeline data for backend
      const pipelineData = {
        nodes: nodes.map((node) => ({
          id: node.id,
          type: node.type,
          position: node.position,
          data: node.data || {},
        })),
        edges: edges.map((edge) => ({
          id: edge.id,
          source: edge.source,
          target: edge.target,
          sourceHandle: edge.sourceHandle,
          targetHandle: edge.targetHandle,
        })),
      };

      console.log('Sending pipeline data:', pipelineData);

      // Send to your FastAPI backend
      const response = await fetch('http://127.0.0.1:8000/pipelines/parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pipelineData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Backend response:', result);

      // Display user-friendly alert (as required by assessment)
      const message = `Pipeline Analysis Results:

📊 Number of Nodes: ${result.num_nodes}
🔗 Number of Edges: ${result.num_edges}
${result.is_dag ? '✅ Valid DAG (No Cycles)' : '❌ Contains Cycles (Not a DAG)'}

${
  result.is_dag
    ? 'Your pipeline structure is valid and can be executed!'
    : 'Warning: Your pipeline contains cycles and may cause infinite loops.'
}`;

      alert(message);
    } catch (error) {
      console.error('Error submitting pipeline:', error);
      alert(`Error analyzing pipeline: ${error.message}`);
    }
  };

  // Disable button if no nodes exist
  const isDisabled = nodes.length === 0;

  return (
    <SubmitContainer>
      <SubmitButtonStyled
        onClick={handleSubmit}
        disabled={isDisabled}
        title={isDisabled ? 'Add nodes to analyze pipeline' : 'Analyze Pipeline Structure'}
      >
        {isDisabled ? 'No Pipeline to Analyze' : 'Analyze Pipeline'}
      </SubmitButtonStyled>
    </SubmitContainer>
  );
};
