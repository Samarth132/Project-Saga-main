import { useEffect, useState, useCallback, useMemo } from 'react';
import ReactFlow, { Controls, Background, MiniMap, type NodeMouseHandler } from 'reactflow';
import useGraphStore from '../store/graphStore';
import { Box, CircularProgress, Alert, Typography, Container } from '@mui/material';
import 'reactflow/dist/style.css';
import useProjectStore from '../store/projectStore';

const GraphViewPage = () => {
  const { selectedProject } = useProjectStore();
  const { nodes, edges, loading, error, fetchGraphData, onNodesChange, onEdgesChange } = useGraphStore();
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const onNodeClick: NodeMouseHandler = useCallback((_, node) => {
    setSelectedNodeId(prevId => (prevId === node.id ? null : node.id));
  }, []);

  useEffect(() => {
    if (selectedProject) {
      fetchGraphData(selectedProject._id);
    }
  }, [selectedProject, fetchGraphData]);

  const { nodes: processedNodes, edges: processedEdges } = useMemo(() => {
    if (!selectedNodeId) {
      return {
        nodes: nodes.map(node => ({ ...node, style: { ...node.style, opacity: 1 }})),
        edges: edges.map(edge => ({ ...edge, style: { ...edge.style, opacity: 1 }}))
      };
    }

    const neighborNodeIds = new Set<string>();
    const connectingEdges = new Set<string>();

    edges.forEach(edge => {
      if (edge.source === selectedNodeId) {
        neighborNodeIds.add(edge.target);
        connectingEdges.add(edge.id);
      }
      if (edge.target === selectedNodeId) {
        neighborNodeIds.add(edge.source);
        connectingEdges.add(edge.id);
      }
    });

    const highlightedNodes = nodes.map(node => {
      const isSelected = node.id === selectedNodeId;
      const isNeighbor = neighborNodeIds.has(node.id);
      const isHighlighted = isSelected || isNeighbor;

      return {
        ...node,
        style: {
          ...node.style,
          opacity: isHighlighted ? 1 : 0.2,
        },
      };
    });

    const highlightedEdges = edges.map(edge => ({
        ...edge,
        animated: connectingEdges.has(edge.id),
        style: {
            ...edge.style,
            opacity: connectingEdges.has(edge.id) ? 1 : 0.2,
        }
    }));

    return { nodes: highlightedNodes, edges: highlightedEdges };
  }, [nodes, edges, selectedNodeId]);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Container maxWidth="xl" sx={{ height: '85vh' }}>
       <Typography variant="h4" component="h1" gutterBottom sx={{ my: 4 }}>
          The Web of Knowledge
        </Typography>
      <Box sx={{ height: '100%', width: '100%' }}>
        <ReactFlow
          nodes={processedNodes}
          edges={processedEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          fitView
        >
          <Controls />
          <MiniMap />
          <Background gap={12} size={1} />
        </ReactFlow>
      </Box>
    </Container>
  );
};

export default GraphViewPage;
