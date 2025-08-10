import '@testing-library/jest-dom';

// Mock ReactFlow
jest.mock('reactflow', () => ({
  Handle: ({ children, ...props }) => (
    <div data-testid="handle" {...props}>
      {children}
    </div>
  ),
  Position: {
    Left: 'left',
    Right: 'right',
    Top: 'top',
    Bottom: 'bottom',
  },
  ReactFlow: ({ children }) => <div data-testid="react-flow">{children}</div>,
  Controls: () => <div data-testid="controls" />,
  Background: () => <div data-testid="background" />,
  MiniMap: () => <div data-testid="minimap" />,
}));

// Mock Zustand store
jest.mock('./store', () => ({
  useStore: jest.fn(),
}));

// Suppress console logs during tests (optional)
if (process.env.NODE_ENV === 'test') {
  const originalConsoleLog = console.log;
  const originalConsoleError = console.error;

  console.log = jest.fn();
  console.error = jest.fn();

  // Keep original for actual test failures
  global.originalConsoleLog = originalConsoleLog;
  global.originalConsoleError = originalConsoleError;
}

// Global test utilities
global.mockStore = {
  nodes: [],
  edges: [],
  updateNodeField: jest.fn(),
  addNode: jest.fn(),
  onNodesChange: jest.fn(),
  onEdgesChange: jest.fn(),
  onConnect: jest.fn(),
  getNodeID: jest.fn(() => 'test-node-id'),
};
