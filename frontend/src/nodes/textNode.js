import { BaseNode } from '../components/BaseNode';
import { nodeConfigurations } from '../nodeConfigs';

export const TextNode = ({ id, data }) => {
  return <BaseNode id={id} data={data} nodeConfig={nodeConfigurations.text} />;
};
