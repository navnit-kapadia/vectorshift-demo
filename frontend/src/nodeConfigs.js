export const nodeConfigurations = {
  customInput: {
    title: 'Input',
    type: 'customInput',
    width: 220,
    height: 120,
    fields: [
      { name: 'inputName', label: 'Name', type: 'text', defaultValue: 'input_1' },
      {
        name: 'inputType',
        label: 'Type',
        type: 'select',
        options: ['Text', 'File'],
        defaultValue: 'Text',
      },
    ],
    outputs: [{ id: 'value' }],
  },

  llm: {
    title: 'LLM',
    type: 'llm',
    width: 220,
    height: 120,
    content: 'This is a Large Language Model.',
    inputs: [{ id: 'system' }, { id: 'prompt' }],
    outputs: [{ id: 'response' }],
  },

  customOutput: {
    title: 'Output',
    type: 'customOutput',
    width: 220,
    height: 120,
    fields: [
      { name: 'outputName', label: 'Name', type: 'text', defaultValue: 'output_1' },
      {
        name: 'outputType',
        label: 'Type',
        type: 'select',
        options: ['Text', 'Image'],
        defaultValue: 'Text',
      },
    ],
    inputs: [{ id: 'value' }],
  },

  text: {
    title: 'Text',
    type: 'text',
    width: 250,
    height: 150,
    fields: [{ name: 'text', label: 'Text', type: 'textarea', defaultValue: '' }],
    outputs: [{ id: 'output' }],
    dynamicInputs: true,
  },

  // 5 New nodes for abstraction demo
  math: {
    title: 'Math',
    type: 'math',
    width: 200,
    height: 130,
    fields: [
      {
        name: 'operation',
        label: 'Operation',
        type: 'select',
        options: ['add', 'subtract', 'multiply', 'divide'],
        defaultValue: 'add',
      },
    ],
    inputs: [{ id: 'input1' }, { id: 'input2' }],
    outputs: [{ id: 'result' }],
  },

  filter: {
    title: 'Filter',
    type: 'filter',
    width: 200,
    height: 120,
    fields: [{ name: 'condition', label: 'Condition', type: 'text', defaultValue: 'value > 0' }],
    inputs: [{ id: 'input' }],
    outputs: [{ id: 'filtered' }],
  },

  delay: {
    title: 'Delay',
    type: 'delay',
    width: 180,
    height: 110,
    fields: [{ name: 'seconds', label: 'Seconds', type: 'number', defaultValue: '1' }],
    inputs: [{ id: 'input' }],
    outputs: [{ id: 'output' }],
  },

  counter: {
    title: 'Counter',
    type: 'counter',
    width: 160,
    height: 100,
    fields: [{ name: 'start', label: 'Start', type: 'number', defaultValue: '0' }],
    outputs: [{ id: 'count' }],
  },

  logger: {
    title: 'Logger',
    type: 'logger',
    width: 170,
    height: 90,
    content: 'Logs input to console',
    inputs: [{ id: 'input' }],
    outputs: [{ id: 'output' }],
  },
};
