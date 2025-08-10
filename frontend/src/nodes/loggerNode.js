import { BaseNode } from '../components/BaseNode';
import { nodeConfigurations } from '../nodeConfigs';

export const LoggerNode = ({ id, data }) => {
  return <BaseNode id={id} data={data} nodeConfig={nodeConfigurations.logger} />;
};
