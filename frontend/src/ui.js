import React, { useState, useRef, useCallback } from 'react';
import ReactFlow, { Controls, Background, MiniMap } from 'reactflow';
import styled from 'styled-components';
import { useStore } from './store';
import { InputNode } from './nodes/inputNode';
import { LLMNode } from './nodes/llmNode';
import { OutputNode } from './nodes/outputNode';
import { TextNode } from './nodes/textNode';
import { MathNode } from './nodes/mathNode';
import { FilterNode } from './nodes/filterNode';
import { DelayNode } from './nodes/delayNode';
import { CounterNode } from './nodes/counterNode';
import { LoggerNode } from './nodes/loggerNode';
import { theme } from './styles/theme';

import 'reactflow/dist/style.css';

const FlowContainer = styled.div`
  width: 100vw;
  height: 70vh;
  position: relative;
  background-color: ${theme.colors.background};
  border-radius: ${theme.borderRadius};
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.06);

  /* Custom ReactFlow styling */
  .react-flow__background {
    background-color: ${theme.colors.background};
  }

  .react-flow__controls {
    background-color: ${theme.colors.surface};
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.borderRadius};
    box-shadow: ${theme.boxShadow};
  }

  .react-flow__controls-button {
    background-color: ${theme.colors.surface};
    border-bottom: 1px solid ${theme.colors.border};
    color: ${theme.colors.text.primary};
    transition: all 0.2s ease;

    &:hover {
      background-color: ${theme.colors.primary}10;
      color: ${theme.colors.primary};
    }

    &:last-child {
      border-bottom: none;
    }
  }

  .react-flow__minimap {
    background-color: ${theme.colors.surface};
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.borderRadius};
    box-shadow: ${theme.boxShadow};
  }

  .react-flow__edge-path {
    stroke: ${theme.colors.primary};
    stroke-width: 2;
  }

  .react-flow__edge.selected .react-flow__edge-path {
    stroke: ${theme.colors.accent};
    stroke-width: 3;
  }

  .react-flow__connection-line {
    stroke: ${theme.colors.primary};
    stroke-width: 2;
    stroke-dasharray: 5;
  }

  .react-flow__handle {
    border: 2px solid ${theme.colors.primary};
    background-color: ${theme.colors.surface};
    width: 12px;
    height: 12px;

    &:hover {
      background-color: ${theme.colors.primary};
      transform: scale(1.1);
    }
  }
`;

const gridSize = 20;
const proOptions = { hideAttribution: true };

const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
  math: MathNode,
  filter: FilterNode,
  delay: DelayNode,
  counter: CounterNode,
  logger: LoggerNode,
};

const defaultViewport = { x: 0, y: 0, zoom: 1 };

export const PipelineUI = () => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  // Zustand store selectors
  const nodes = useStore((state) => state.nodes);
  const edges = useStore((state) => state.edges);
  const getNodeID = useStore((state) => state.getNodeID);
  const addNode = useStore((state) => state.addNode);
  const onNodesChange = useStore((state) => state.onNodesChange);
  const onEdgesChange = useStore((state) => state.onEdgesChange);
  const onConnect = useStore((state) => state.onConnect);

  const getInitNodeData = (nodeID, type) => {
    return {
      id: nodeID,
      nodeType: type,
    };
  };

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      if (event?.dataTransfer?.getData('application/reactflow')) {
        const appData = JSON.parse(event.dataTransfer.getData('application/reactflow'));
        const type = appData?.nodeType;

        if (typeof type === 'undefined' || !type) {
          return;
        }

        const position = reactFlowInstance.screenToFlowPosition({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });

        const nodeID = getNodeID(type);
        const newNode = {
          id: nodeID,
          type,
          position,
          data: getInitNodeData(nodeID, type),
        };

        addNode(newNode);
      }
    },
    [reactFlowInstance, getNodeID, addNode]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onInit = useCallback((instance) => {
    setReactFlowInstance(instance);
  }, []);

  return (
    <FlowContainer ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onInit={onInit}
        nodeTypes={nodeTypes}
        proOptions={proOptions}
        snapGrid={[gridSize, gridSize]}
        connectionLineType="smoothstep"
        defaultViewport={defaultViewport}
        fitView
        attributionPosition="bottom-left"
      >
        <Background color={theme.colors.border} gap={gridSize} size={1} variant="dots" />
        <Controls position="top-left" showZoom={true} showFitView={true} showInteractive={true} />
        <MiniMap
          position="bottom-right"
          zoomable
          pannable
          nodeColor={(node) => {
            const nodeColor = theme.colors.node[node.type] || theme.colors.primary;
            return nodeColor;
          }}
        />
      </ReactFlow>
    </FlowContainer>
  );
};
