from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
import json

app = FastAPI(title="VectorShift Backend", description="Pipeline validation and DAG analysis")

# Add CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for request/response validation
class NodeData(BaseModel):
    id: str
    type: str
    position: Dict[str, float]
    data: Dict[str, Any] = {}

class EdgeData(BaseModel):
    id: str
    source: str
    target: str
    sourceHandle: str = None
    targetHandle: str = None

class PipelineData(BaseModel):
    nodes: List[NodeData]
    edges: List[EdgeData]

class PipelineResponse(BaseModel):
    num_nodes: int
    num_edges: int
    is_dag: bool

@app.get('/')
def read_root():
    return {'Ping': 'Pong'}

@app.post('/pipelines/parse', response_model=PipelineResponse)
def parse_pipeline(pipeline: PipelineData):
    """
    Analyze pipeline structure and validate if it forms a DAG (Directed Acyclic Graph)
    """
    try:
        # Count nodes and edges
        num_nodes = len(pipeline.nodes)
        num_edges = len(pipeline.edges)
        
        # Check if pipeline forms a DAG (no cycles)
        is_dag = check_dag(pipeline.nodes, pipeline.edges)
        
        return PipelineResponse(
            num_nodes=num_nodes,
            num_edges=num_edges,
            is_dag=is_dag
        )
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing pipeline: {str(e)}")

def check_dag(nodes: List[NodeData], edges: List[EdgeData]) -> bool:
    """
    Check if the graph formed by nodes and edges is a DAG (Directed Acyclic Graph)
    Uses DFS-based cycle detection algorithm
    """
    if not edges:
        return True  # No edges means no cycles
    
    # Build adjacency list
    graph = {}
    node_ids = {node.id for node in nodes}
    
    # Initialize graph with all nodes
    for node in nodes:
        graph[node.id] = []
    
    # Add edges to graph
    for edge in edges:
        source = edge.source
        target = edge.target
        
        # Skip edges that reference non-existent nodes
        if source not in node_ids or target not in node_ids:
            continue
            
        graph[source].append(target)
    
    # DFS cycle detection using colors:
    # WHITE = 0 (unvisited)
    # GRAY = 1 (currently being processed)
    # BLACK = 2 (completely processed)
    colors = {node_id: 0 for node_id in node_ids}
    
    def has_cycle_dfs(node_id: str) -> bool:
        if colors[node_id] == 1:  # Gray - back edge found (cycle)
            return True
        if colors[node_id] == 2:  # Black - already processed
            return False
        
        # Mark as gray (being processed)
        colors[node_id] = 1
        
        # Visit all neighbors
        for neighbor in graph.get(node_id, []):
            if has_cycle_dfs(neighbor):
                return True
        
        # Mark as black (completely processed)
        colors[node_id] = 2
        return False
    
    # Check for cycles starting from each unvisited node
    for node_id in node_ids:
        if colors[node_id] == 0:
            if has_cycle_dfs(node_id):
                return False  # Cycle found - not a DAG
    
    return True  # No cycles found - is a DAG

# Additional endpoints for debugging/development
@app.get('/pipelines/validate/{node_count}')
def validate_pipeline_size(node_count: int):
    """Development endpoint to test pipeline validation"""
    return {
        'message': f'Pipeline validation requested for {node_count} nodes',
        'status': 'ready'
    }


@app.get('/health')
def health_check():
    """Health check endpoint"""
    return {
        'status': 'healthy',
        'service': 'VectorShift Backend',
        'version': '1.0.0'
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=True)
