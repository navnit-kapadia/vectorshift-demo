import React, { useState, useEffect, useMemo } from 'react';
import { Handle, Position } from 'reactflow';
import styled from 'styled-components';
import { useStore } from '../store';
import { theme } from '../styles/theme';

// Styled Components
const NodeContainer = styled.div`
  width: ${(props) => props.width}px;
  min-height: ${(props) => props.height}px;
  border: 2px solid ${(props) => props.nodeColor};
  background-color: ${theme.colors.surface};
  border-radius: ${theme.borderRadius};
  padding: ${theme.spacing.md};
  box-shadow: ${theme.boxShadow};
  font-family: ${theme.fonts.primary};
  position: relative;
  transition: all 0.2s ease;
  cursor: default;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 15px -3px rgb(0 0 0 / 0.2);
  }
`;

const NodeTitle = styled.div`
  font-weight: 600;
  margin-bottom: ${theme.spacing.sm};
  color: ${theme.colors.text.primary};
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
`;

const ColorIndicator = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
  box-shadow: 0 0 0 2px ${(props) => props.color}20;
`;

const FieldContainer = styled.div`
  margin-bottom: ${theme.spacing.sm};
`;

const FieldLabel = styled.label`
  font-size: 12px;
  color: ${theme.colors.text.secondary};
  display: block;
  margin-bottom: 2px;
  font-weight: 500;
`;

const BaseInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius};
  font-size: 12px;
  font-family: ${theme.fonts.primary};
  background-color: #ffffff;
  color: ${theme.colors.text.primary};
  outline: none;
  transition: all 0.2s ease;
  box-sizing: border-box;
  -webkit-appearance: none;
  -moz-appearance: textfield;
  appearance: none;
  line-height: 1.4;
  vertical-align: middle;

  &:focus {
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 2px ${theme.colors.primary}20;
    background-color: #ffffff;
  }

  &:placeholder {
    color: ${theme.colors.text.secondary}80;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius};
  font-size: 12px;
  font-family: ${theme.fonts.primary};
  background-color: #ffffff;
  color: ${theme.colors.text.primary};
  outline: none;
  transition: all 0.2s ease;
  box-sizing: border-box;
  min-height: 60px;
  resize: vertical;
  line-height: 1.4;

  &:focus {
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 2px ${theme.colors.primary}20;
    background-color: #ffffff;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius};
  font-size: 12px;
  font-family: ${theme.fonts.primary};
  background-color: #ffffff;
  color: ${theme.colors.text.primary};
  outline: none;
  transition: all 0.2s ease;
  box-sizing: border-box;
  cursor: pointer;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;

  /* Custom dropdown arrow */
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 16px;
  padding-right: 32px;

  &:focus {
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 2px ${theme.colors.primary}20;
  }
`;

const StaticContent = styled.div`
  font-size: 12px;
  color: ${theme.colors.text.secondary};
  margin-top: ${theme.spacing.sm};
  padding: ${theme.spacing.xs};
  background-color: ${(props) => props.nodeColor}08;
  border-radius: 4px;
  border: 1px solid ${(props) => props.nodeColor}20;
`;

const VariableDisplay = styled.div`
  font-size: 10px;
  color: ${theme.colors.text.secondary};
  margin-top: ${theme.spacing.xs};
  font-style: italic;
  padding: ${theme.spacing.xs};
  background-color: ${(props) => props.nodeColor}08;
  border-radius: 4px;
`;

const StyledHandle = styled(Handle)`
  width: 12px !important;
  height: 12px !important;
  border: 2px solid ${(props) => props.nodeColor} !important;
  background-color: ${theme.colors.surface} !important;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 2px 8px ${(props) => props.nodeColor}40;
  }
`;

export const BaseNode = ({ id, data, nodeConfig }) => {
  const [formData, setFormData] = useState(data || {});
  const [dynamicInputs, setDynamicInputs] = useState([]);
  const updateNodeField = useStore((state) => state.updateNodeField);

  // Extract variables from text for dynamic inputs (Part 3)
  const extractVariables = (text) => {
    if (!text) return [];
    const regex = /\{\{([a-zA-Z_$][a-zA-Z0-9_$]*)\}\}/g;
    const variables = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
      if (!variables.includes(match[1])) {
        variables.push(match[1]);
      }
    }
    return variables;
  };

  // Handle dynamic inputs for text nodes
  useEffect(() => {
    if (nodeConfig.dynamicInputs && formData.text) {
      const variables = extractVariables(formData.text);
      setDynamicInputs(variables);
    }
  }, [formData.text, nodeConfig.dynamicInputs]);

  // Dynamic sizing for text nodes (Part 3)
  const dynamicDimensions = useMemo(() => {
    if (nodeConfig.type !== 'text') {
      return { width: nodeConfig.width, height: nodeConfig.height };
    }

    const textLength = formData.text?.length || 0;
    const lines = formData.text ? formData.text.split('\n').length : 1;

    const baseWidth = 250;
    const baseHeight = 150;
    const extraWidth = Math.min(Math.floor(textLength / 20) * 20, 200);
    const extraHeight = Math.max(lines - 2, 0) * 20;

    return {
      width: baseWidth + extraWidth,
      height: baseHeight + extraHeight,
    };
  }, [formData.text, nodeConfig.type, nodeConfig.width, nodeConfig.height]);

  const handleFieldChange = (fieldName, value) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
    updateNodeField(id, fieldName, value);
  };

  // Combine static inputs with dynamic inputs
  const allInputs = [
    ...(nodeConfig.inputs || []),
    ...dynamicInputs.map((variable) => ({ id: variable, isDynamic: true })),
  ];

  // Enhanced styling with theme
  const nodeColor = theme.colors.node[nodeConfig.type] || theme.colors.primary;

  return (
    <NodeContainer
      width={dynamicDimensions.width}
      height={dynamicDimensions.height}
      nodeColor={nodeColor}
    >
      {/* Input handles */}
      {allInputs.map((input, index) => (
        <StyledHandle
          key={input.id}
          type="target"
          position={Position.Left}
          id={`${id}-${input.id}`}
          nodeColor={nodeColor}
          style={{
            top: `${(index + 1) * (100 / (allInputs.length + 1))}%`,
          }}
          title={input.isDynamic ? `Variable: ${input.id}` : input.id}
        />
      ))}

      {/* Node title with color indicator */}
      <NodeTitle>
        <ColorIndicator color={nodeColor} />
        {nodeConfig.title}
      </NodeTitle>

      {/* Form fields */}
      {nodeConfig.fields?.map((field) => {
        const fieldId = `${id}-${field.name}`;

        return (
          <FieldContainer key={field.name}>
            <FieldLabel htmlFor={fieldId}>{field.label}:</FieldLabel>
            {field.type === 'select' ? (
              <Select
                id={fieldId}
                value={formData[field.name] || field.defaultValue || ''}
                onChange={(e) => handleFieldChange(field.name, e.target.value)}
              >
                {field.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
            ) : field.type === 'textarea' ? (
              <TextArea
                id={fieldId}
                value={formData[field.name] || field.defaultValue || ''}
                onChange={(e) => handleFieldChange(field.name, e.target.value)}
                placeholder={field.placeholder || ''}
                rows={3}
              />
            ) : (
              <BaseInput
                id={fieldId}
                type={field.type || 'text'}
                value={formData[field.name] || field.defaultValue || ''}
                onChange={(e) => handleFieldChange(field.name, e.target.value)}
                placeholder={field.placeholder || ''}
              />
            )}
          </FieldContainer>
        );
      })}

      {/* Static content */}
      {nodeConfig.content && (
        <StaticContent nodeColor={nodeColor}>{nodeConfig.content}</StaticContent>
      )}

      {/* Show detected variables for text nodes */}
      {nodeConfig.dynamicInputs && dynamicInputs.length > 0 && (
        <VariableDisplay nodeColor={nodeColor}>
          Variables: {dynamicInputs.join(', ')}
        </VariableDisplay>
      )}

      {/* Output handles */}
      {nodeConfig.outputs?.map((output, index) => (
        <StyledHandle
          key={output.id}
          type="source"
          position={Position.Right}
          id={`${id}-${output.id}`}
          nodeColor={nodeColor}
          style={{
            top: `${(index + 1) * (100 / (nodeConfig.outputs.length + 1))}%`,
          }}
        />
      ))}
    </NodeContainer>
  );
};
