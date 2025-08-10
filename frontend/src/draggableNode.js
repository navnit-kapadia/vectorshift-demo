import React from 'react';
import styled from 'styled-components';
import { theme } from './styles/theme';

const NodeContainer = styled.div`
  cursor: grab;
  min-width: 100px;
  height: 70px;
  display: flex;
  align-items: center;
  border-radius: ${theme.borderRadius};
  background-color: ${(props) => props.nodeColor};
  justify-content: center;
  flex-direction: column;
  box-shadow: ${theme.boxShadow};
  transition: all 0.2s ease;
  border: 2px solid ${(props) => props.nodeColor};
  font-family: ${theme.fonts.primary};
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.25);
  }

  &:active {
    cursor: grabbing;
  }
`;

const BackgroundGradient = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  background: linear-gradient(
    135deg,
    ${(props) => props.nodeColor}00 0%,
    ${(props) => props.nodeColor}20 100%
  );
`;

const Label = styled.span`
  color: ${theme.colors.text.white};
  font-size: 14px;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
`;

export const DraggableNode = ({ type, label }) => {
  const nodeColor = theme.colors.node[type] || theme.colors.primary;

  const onDragStart = (event) => {
    const appData = { nodeType: type };
    event.target.style.cursor = 'grabbing';
    event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDragEnd = (event) => {
    event.target.style.cursor = 'grab';
  };

  return (
    <NodeContainer
      className={type}
      nodeColor={nodeColor}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <BackgroundGradient nodeColor={nodeColor} />
      <Label>{label}</Label>
    </NodeContainer>
  );
};
