import React from 'react';
import styled from 'styled-components';
import { DraggableNode } from './draggableNode';
import { theme } from './styles/theme';

const ToolbarContainer = styled.div`
  padding: ${theme.spacing.lg};
  background-color: ${theme.colors.surface};
  border-bottom: 2px solid ${theme.colors.border};
  box-shadow: ${theme.boxShadow};
  font-family: ${theme.fonts.primary};
`;

const ToolbarTitle = styled.h2`
  margin: 0 0 ${theme.spacing.md} 0;
  color: ${theme.colors.text.primary};
  font-size: 20px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const TitleAccent = styled.div`
  width: 6px;
  height: 24px;
  background-color: ${theme.colors.primary};
  border-radius: 3px;
`;

const NodesGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing.md};

  @media (max-width: 768px) {
    gap: ${theme.spacing.sm};
    justify-content: center;
  }
`;

const NodeSection = styled.div`
  display: contents;

  &:not(:first-child)::before {
    content: '';
    width: 100%;
    height: 1px;
    background: linear-gradient(to right, transparent, ${theme.colors.border}, transparent);
    margin: ${theme.spacing.sm} 0;
    grid-column: 1 / -1;
  }
`;

export const PipelineToolbar = () => {
  return (
    <ToolbarContainer>
      <ToolbarTitle>
        <TitleAccent />
        Pipeline Components
      </ToolbarTitle>
      <NodesGrid>
        {/* Original 4 nodes */}
        <NodeSection>
          <DraggableNode type="customInput" label="Input" />
          <DraggableNode type="llm" label="LLM" />
          <DraggableNode type="customOutput" label="Output" />
          <DraggableNode type="text" label="Text" />
          {/* 5 New nodes for demonstration */}
          <DraggableNode type="math" label="Math" />
          <DraggableNode type="filter" label="Filter" />
          <DraggableNode type="delay" label="Delay" />
          <DraggableNode type="counter" label="Counter" />
          <DraggableNode type="logger" label="Logger" />
        </NodeSection>
      </NodesGrid>
    </ToolbarContainer>
  );
};
