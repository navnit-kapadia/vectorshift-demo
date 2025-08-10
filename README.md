# VectorShift Frontend Technical Assessment

A React-based node editor application with Python/FastAPI backend integration, developed as part of the VectorShift technical assessment.

## 🚀 Technologies Used

- **Frontend**: React, JavaScript, React Flow (for node-based UI)
- **Backend**: Python, FastAPI
- **Styling**: CSS/SCSS with modern design principles
- **State Management**: React hooks and context

## 📋 Project Overview

This project implements a visual pipeline editor with the following key features:

### Part 1: Node Abstraction
- **Abstracted Node System**: Created a flexible base node component that eliminates code duplication
- **Dynamic Node Creation**: Streamlined process for creating new node types
- **Five Custom Nodes**: Implemented additional nodes to demonstrate the abstraction's flexibility
- **Location**: `/frontend/src/nodes/` and `/frontend/src/nodeConfigs.js`

### Part 2: Styling
- **Modern UI Design**: Applied cohesive styling across all components
- **Responsive Layout**: Optimized for different screen sizes
- **Visual Consistency**: Unified color scheme and typography
- **Location**: `/frontend/src/styles/` and component-level styling

### Part 3: Text Node Logic
- **Dynamic Resizing**: Text nodes automatically adjust width/height based on content
- **Variable Detection**: Recognizes `{{variable}}` syntax in text input
- **Dynamic Handles**: Automatically creates input handles for detected variables
- **Real-time Updates**: Live preview of variable connections
- **Location**: `/frontend/src/nodes/textNode.js`

### Part 4: Backend Integration
- **Pipeline Submission**: Frontend sends node/edge data to backend
- **DAG Validation**: Backend validates if the pipeline forms a Directed Acyclic Graph
- **Statistics Calculation**: Returns node count, edge count, and DAG status
- **User Feedback**: Alert system displays pipeline analysis results
- **Location**: `/frontend/src/submit.js` and `/backend/main.py`

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- Python (v3.8 or higher)
- npm or yarn package manager

### Frontend Setup
```bash
cd frontend
npm install
npm start
```
The frontend will be available at `http://localhost:3000`

### Backend Setup
```bash
cd backend
pip install fastapi uvicorn
uvicorn main:app --reload
```
The backend API will be available at `http://localhost:8000`

## 🎯 Usage Instructions

1. **Start Both Servers**: Ensure both frontend and backend are running
2. **Create Pipeline**: 
   - Drag nodes from the toolbar onto the canvas
   - Connect nodes using the handles (connection points)
   - Configure node properties as needed
3. **Text Node Variables**:
   - Type `{{variableName}}` in text nodes to create input handles
   - Connect other nodes to these variable handles
4. **Submit Pipeline**: 
   - Click the "Submit" button to analyze your pipeline
   - View the alert showing node count, edge count, and DAG status

## 📁 Project Structure

```
vectorshift/
├── frontend/
│   ├── src/
│   │   ├── nodes/           # Node components and abstractions
│   │   ├── components/      # Reusable UI components
│   │   ├── styles/          # Styling files
│   │   ├── submit.js        # Backend integration logic
│   │   ├── nodeConfigs.js   # Node configuration definitions
│   │   └── ...
│   └── package.json
├── backend/
│   └── main.py             # FastAPI backend with pipeline analysis
└── README.md
```

## 🔧 Key Features Implemented

### Node Abstraction Benefits
- **Reduced Code Duplication**: Base node handles common functionality
- **Easy Extension**: New nodes require minimal code
- **Consistent Behavior**: Unified styling and interaction patterns
- **Maintainable**: Changes to base functionality affect all nodes

### Enhanced Text Node
- **Smart Resizing**: Automatically adjusts to content size
- **Variable Parsing**: Regex-based detection of `{{variable}}` patterns
- **Dynamic Handles**: Creates/removes handles based on variables
- **Live Preview**: Real-time updates as user types

### Backend Integration
- **Pipeline Analysis**: Comprehensive validation and statistics
- **DAG Detection**: Cycle detection algorithm implementation
- **RESTful API**: Clean endpoint design following FastAPI best practices
- **Error Handling**: Robust error responses and validation

## 🎨 Design Decisions

- **Component Architecture**: Modular design for scalability
- **State Management**: Efficient state handling for real-time updates
- **Performance**: Optimized rendering for large pipelines
- **User Experience**: Intuitive drag-and-drop interface with visual feedback

## 🚧 Future Enhancements

- **Node Templates**: Save and reuse common node configurations
- **Pipeline Validation**: Advanced validation rules for different node types
- **Export/Import**: Save pipelines to files
- **Collaborative Editing**: Multi-user pipeline editing
- **Advanced Styling**: Theme system and customizable node appearances

## 📞 Support

For questions about this implementation, please contact the development team or refer to the original assignment instructions.

---

**Note**: This project was developed as part of the VectorShift Frontend Technical Assessment, demonstrating proficiency in React, Python, API integration, and modern web development practices.
