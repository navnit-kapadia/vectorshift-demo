import { BaseNode } from '../components/BaseNode';
import { nodeConfigurations } from '../nodeConfigs';

export const MathNode = ({ id, data }) => {
  return <BaseNode id={id} data={data} nodeConfig={nodeConfigurations.math} />;
};
