import { BaseNode } from '../components/BaseNode';
import { nodeConfigurations } from '../nodeConfigs';

export const LLMNode = ({ id, data }) => {
  return <BaseNode id={id} data={data} nodeConfig={nodeConfigurations.llm} />;
};
