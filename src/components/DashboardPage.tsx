import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { Upload, Download, Layers, Eye, EyeOff, RotateCw, ChevronDown, ChevronRight, Sparkles, Info, Ruler, Box, Pipette } from "lucide-react";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Card } from "./ui/card";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";

interface LayerNode {
  id: string;
  name: string;
  type: string;
  visible: boolean;
  expanded?: boolean;
  children?: LayerNode[];
}

interface ElementProperties {
  name: string;
  type: string;
  material: string;
  dimensions: {
    width: string;
    height: string;
    depth: string;
  };
  area: string;
  volume: string;
  notes: string;
}

export function DashboardPage() {
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedElement, setSelectedElement] = useState<ElementProperties | null>(null);
  
  const [layers, setLayers] = useState<LayerNode[]>([
    {
      id: 'structure',
      name: 'Structure',
      type: 'group',
      visible: true,
      expanded: true,
      children: [
        { id: 'walls', name: 'Walls', type: 'element', visible: true },
        { id: 'floors', name: 'Floors', type: 'element', visible: true },
        { id: 'ceilings', name: 'Ceilings', type: 'element', visible: true },
        { id: 'columns', name: 'Columns', type: 'element', visible: true },
        { id: 'beams', name: 'Beams', type: 'element', visible: true },
      ]
    },
    {
      id: 'architecture',
      name: 'Architecture',
      type: 'group',
      visible: true,
      expanded: true,
      children: [
        { id: 'doors', name: 'Doors', type: 'element', visible: true },
        { id: 'windows', name: 'Windows', type: 'element', visible: true },
        { id: 'stairs', name: 'Stairs', type: 'element', visible: true },
      ]
    },
    {
      id: 'mep',
      name: 'MEP Systems',
      type: 'group',
      visible: true,
      expanded: false,
      children: [
        { id: 'hvac', name: 'HVAC', type: 'element', visible: true },
        { id: 'plumbing', name: 'Plumbing', type: 'element', visible: true },
        { id: 'electrical', name: 'Electrical', type: 'element', visible: true },
      ]
    }
  ]);

  const [highlights, setHighlights] = useState({
    walls: false,
    floors: false,
    ceilings: false,
    doors: false,
    windows: false,
    columns: false,
    beams: false,
    hvac: false,
    plumbing: false,
    electrical: false,
    stairs: false
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });

  // Get layer visibility helper
  const getLayerVisibility = (layerId: string): boolean => {
    for (const group of layers) {
      if (!group.visible) continue;
      if (group.children) {
        const child = group.children.find(c => c.id === layerId);
        if (child) return child.visible;
      }
    }
    return false;
  };

  // Simple 3D cube visualization with clickable elements
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    const draw = () => {
      // Clear canvas with gradient background
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#2a5a8a');
      gradient.addColorStop(1, '#3C73AD');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Draw grid
      ctx.strokeStyle = '#AEE1FE';
      ctx.lineWidth = 0.5;
      ctx.globalAlpha = 0.3;
      
      for (let i = 0; i < width; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
      }
      for (let i = 0; i < height; i += 40) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // Draw 3D building representation
      const centerX = width / 2;
      const centerY = height / 2;
      const size = 100;

      const rotX = rotation.x * Math.PI / 180;
      const rotY = rotation.y * Math.PI / 180;

      // Define 3D cube vertices
      const vertices = [
        [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
        [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]
      ];

      // Project vertices
      const projected = vertices.map(([x, y, z]) => {
        // Rotate around Y axis
        let newX = x * Math.cos(rotY) - z * Math.sin(rotY);
        let newZ = x * Math.sin(rotY) + z * Math.cos(rotY);
        
        // Rotate around X axis
        let newY = y * Math.cos(rotX) - newZ * Math.sin(rotX);
        newZ = y * Math.sin(rotX) + newZ * Math.cos(rotX);

        // Simple perspective projection
        const scale = 200 / (200 + newZ * 50);
        return {
          x: centerX + newX * size * scale,
          y: centerY + newY * size * scale,
          z: newZ
        };
      });

      // Draw faces with transparency
      const faces = [
        { indices: [0, 1, 2, 3], color: '#AEE1FE', layer: 'floors', highlightColor: '#0088FF' },
        { indices: [4, 5, 6, 7], color: '#FFE2EE', layer: 'ceilings', highlightColor: '#FFB8D0' },
        { indices: [0, 1, 5, 4], color: '#F3EEE8', layer: 'walls', highlightColor: '#FFFFFF' },
        { indices: [2, 3, 7, 6], color: '#F3EEE8', layer: 'walls', highlightColor: '#FFFFFF' },
        { indices: [1, 2, 6, 5], color: '#F3EEE8', layer: 'walls', highlightColor: '#FFFFFF' },
        { indices: [3, 0, 4, 7], color: '#F3EEE8', layer: 'walls', highlightColor: '#FFFFFF' },
      ];

      // Sort faces by average Z (painter's algorithm)
      const sortedFaces = faces
        .filter(face => getLayerVisibility(face.layer))
        .map(face => ({
          ...face,
          avgZ: face.indices.reduce((sum, i) => sum + projected[i].z, 0) / face.indices.length
        }))
        .sort((a, b) => a.avgZ - b.avgZ);

      // Draw sorted faces
      sortedFaces.forEach(face => {
        const isHighlighted = highlights[face.layer as keyof typeof highlights];
        ctx.fillStyle = isHighlighted ? face.highlightColor : face.color;
        ctx.globalAlpha = isHighlighted ? 0.6 : 0.3;
        ctx.beginPath();
        ctx.moveTo(projected[face.indices[0]].x, projected[face.indices[0]].y);
        face.indices.forEach(i => {
          ctx.lineTo(projected[i].x, projected[i].y);
        });
        ctx.closePath();
        ctx.fill();
        ctx.globalAlpha = 1;

        // Draw edges
        ctx.strokeStyle = isHighlighted ? face.highlightColor : '#F3EEE8';
        ctx.lineWidth = isHighlighted ? 3 : 2;
        ctx.beginPath();
        ctx.moveTo(projected[face.indices[0]].x, projected[face.indices[0]].y);
        face.indices.forEach(i => {
          ctx.lineTo(projected[i].x, projected[i].y);
        });
        ctx.closePath();
        ctx.stroke();
      });

      // Draw door (if visible)
      if (getLayerVisibility('doors')) {
        const doorStart = {
          x: centerX - size * 0.3,
          y: centerY + size * 0.5
        };
        const isDoorHighlighted = highlights.doors;
        ctx.fillStyle = isDoorHighlighted ? '#FFB8D0' : '#FFE2EE';
        ctx.globalAlpha = isDoorHighlighted ? 0.8 : 1;
        ctx.fillRect(doorStart.x, doorStart.y, size * 0.6, size * 0.8);
        ctx.globalAlpha = 1;
        ctx.strokeStyle = isDoorHighlighted ? '#FFB800' : '#3C73AD';
        ctx.lineWidth = isDoorHighlighted ? 3 : 2;
        ctx.strokeRect(doorStart.x, doorStart.y, size * 0.6, size * 0.8);
      }

      // Draw columns (if visible)
      if (getLayerVisibility('columns')) {
        const isColumnsHighlighted = highlights.columns;
        ctx.fillStyle = isColumnsHighlighted ? '#00D9FF' : '#AEE1FE';
        ctx.globalAlpha = isColumnsHighlighted ? 0.8 : 0.6;
        
        // Draw 4 columns at corners
        const columnPositions = [
          { x: centerX - size * 0.8, y: centerY + size * 0.5 },
          { x: centerX + size * 0.5, y: centerY + size * 0.5 },
          { x: centerX - size * 0.8, y: centerY - size * 0.3 },
          { x: centerX + size * 0.5, y: centerY - size * 0.3 },
        ];
        
        columnPositions.forEach(pos => {
          ctx.fillRect(pos.x, pos.y, 15, size * 1.2);
        });
        ctx.globalAlpha = 1;
      }
    };

    draw();
  }, [rotation, layers, highlights]);

  // Mouse handlers for rotation
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDragging.current = true;
    lastMouse.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging.current) return;
    
    const deltaX = e.clientX - lastMouse.current.x;
    const deltaY = e.clientY - lastMouse.current.y;
    
    setRotation(prev => ({
      x: prev.x + deltaY * 0.5,
      y: prev.y + deltaX * 0.5
    }));
    
    lastMouse.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  // Handle canvas click to select elements
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Simple click detection for demo - in real app would use raycasting
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Example: Click on door area
    if (x > centerX - 50 && x < centerX + 50 && y > centerY + 50 && y < centerY + 150) {
      setSelectedElement({
        name: 'Main Entrance Door',
        type: 'Single Door',
        material: 'Solid Wood',
        dimensions: {
          width: '900 mm',
          height: '2100 mm',
          depth: '45 mm'
        },
        area: '1.89 m²',
        volume: '0.085 m³',
        notes: 'Fire-rated, includes hardware'
      });
    }
    // Click on wall
    else if (y > centerY - 100 && y < centerY + 100) {
      setSelectedElement({
        name: 'Exterior Wall - South',
        type: 'Curtain Wall',
        material: 'Concrete with Steel Frame',
        dimensions: {
          width: '12000 mm',
          height: '3000 mm',
          depth: '300 mm'
        },
        area: '36.0 m²',
        volume: '10.8 m³',
        notes: 'Insulated, weatherproofed'
      });
    }
    // Click on floor
    else if (y > centerY + 100) {
      setSelectedElement({
        name: 'Ground Floor Slab',
        type: 'Concrete Slab',
        material: 'Reinforced Concrete',
        dimensions: {
          width: '12000 mm',
          height: '150 mm',
          depth: '8000 mm'
        },
        area: '96.0 m²',
        volume: '14.4 m³',
        notes: 'Grade C30/37, reinforced with steel mesh'
      });
    }
  };

  const handleUpload = () => {
    setProcessing(true);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setProcessing(false);
          return 100;
        }
        return prev + 10;
      });
    }, 400);
  };

  const toggleLayerVisibility = (layerId: string) => {
    setLayers(prevLayers => {
      return prevLayers.map(group => {
        if (group.id === layerId) {
          return { ...group, visible: !group.visible };
        }
        if (group.children) {
          const updatedChildren = group.children.map(child => {
            if (child.id === layerId) {
              return { ...child, visible: !child.visible };
            }
            return child;
          });
          return { ...group, children: updatedChildren };
        }
        return group;
      });
    });
  };

  const toggleLayerExpanded = (layerId: string) => {
    setLayers(prevLayers => {
      return prevLayers.map(group => {
        if (group.id === layerId) {
          return { ...group, expanded: !group.expanded };
        }
        return group;
      });
    });
  };

  const toggleHighlight = (elementType: keyof typeof highlights) => {
    setHighlights(prev => ({
      ...prev,
      [elementType]: !prev[elementType]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F3EEE8] to-[#e5ddd3] pt-24 pb-12 px-6">
      <div className="max-w-[1800px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-[#3C73AD] mb-8">Dashboard</h1>

          <div className="grid lg:grid-cols-[280px_1fr_380px] gap-6">
            {/* Left Sidebar - Layers Panel */}
            <div className="space-y-6">
              <Card className="p-6 bg-white shadow-xl">
                <h3 className="text-[#3C73AD] mb-4 flex items-center gap-2">
                  <Layers className="w-5 h-5" />
                  Layers
                </h3>
                <ScrollArea className="h-[700px] pr-4">
                  <div className="space-y-1">
                    {layers.map(group => (
                      <div key={group.id}>
                        <div className="flex items-center gap-1 py-2 hover:bg-[#AEE1FE]/20 rounded px-2 cursor-pointer">
                          <button
                            onClick={() => toggleLayerExpanded(group.id)}
                            className="text-[#3C73AD]"
                          >
                            {group.expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => toggleLayerVisibility(group.id)}
                            className="text-[#3C73AD]"
                          >
                            {group.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </button>
                          <Layers className="w-4 h-4 text-[#3C73AD]" />
                          <span className="text-[#3C73AD] flex-1">{group.name}</span>
                        </div>
                        
                        {group.expanded && group.children && (
                          <div className="ml-6 space-y-1">
                            {group.children.map(child => (
                              <div
                                key={child.id}
                                className="flex items-center gap-2 py-1.5 hover:bg-[#AEE1FE]/20 rounded px-2 cursor-pointer"
                                onClick={() => toggleLayerVisibility(child.id)}
                              >
                                {child.visible ? <Eye className="w-3.5 h-3.5 text-[#3C73AD]" /> : <EyeOff className="w-3.5 h-3.5 text-[#3C73AD]/40" />}
                                <Box className="w-3.5 h-3.5 text-[#3C73AD]" />
                                <span className="text-sm text-[#3C73AD]">{child.name}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </Card>
            </div>

            {/* Center - Main Viewer */}
            <Card className="p-6 bg-white shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-[#3C73AD]">3D Model Viewer</h3>
                <div className="flex items-center gap-2">
                  <Button 
                    onClick={handleUpload}
                    size="sm"
                    className="bg-[#FFE2EE] hover:bg-[#FFE2EE]/90 text-[#79274B]"
                    disabled={processing}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Scan
                  </Button>
                  <button
                    onClick={() => setRotation({ x: 0, y: 0 })}
                    className="text-[#3C73AD] hover:text-[#2a5a8a] transition-colors p-2"
                  >
                    <RotateCw className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="relative bg-gradient-to-br from-[#2a5a8a] to-[#3C73AD] rounded-xl overflow-hidden">
                <canvas
                  ref={canvasRef}
                  width={1000}
                  height={700}
                  className="w-full h-[700px] cursor-pointer"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onClick={handleCanvasClick}
                />
                <div className="absolute bottom-4 left-4 bg-[#3C73AD]/80 text-[#F3EEE8] px-4 py-2 rounded-lg backdrop-blur-sm">
                  <p className="text-sm">Click and drag to rotate • Click elements to view properties</p>
                </div>
              </div>

              {processing && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[#3C73AD]">AI is processing your scan...</p>
                    <span className="text-[#3C73AD]">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}
            </Card>

            {/* Right Sidebar - Properties & Controls */}
            <div className="space-y-6">
              <Card className="bg-white shadow-xl">
                <Tabs defaultValue="properties" className="w-full">
                  <TabsList className="w-full grid grid-cols-2 bg-[#AEE1FE]/20">
                    <TabsTrigger value="properties" className="data-[state=active]:bg-[#3C73AD] data-[state=active]:text-white">
                      <Info className="w-4 h-4 mr-2" />
                      Properties
                    </TabsTrigger>
                    <TabsTrigger value="filters" className="data-[state=active]:bg-[#3C73AD] data-[state=active]:text-white">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Highlights
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="properties" className="p-6">
                    <ScrollArea className="h-[600px] pr-4">
                      {selectedElement ? (
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-[#3C73AD] mb-2">{selectedElement.name}</h3>
                            <Badge className="bg-[#AEE1FE] text-[#3C73AD]">{selectedElement.type}</Badge>
                          </div>

                          <div className="space-y-3 pt-4 border-t border-[#AEE1FE]/30">
                            <div>
                              <label className="text-sm text-[#3C73AD]/60">Material</label>
                              <p className="text-[#3C73AD]">{selectedElement.material}</p>
                            </div>

                            <div>
                              <label className="text-sm text-[#3C73AD]/60 flex items-center gap-1">
                                <Ruler className="w-3 h-3" />
                                Dimensions
                              </label>
                              <div className="grid grid-cols-3 gap-2 mt-1">
                                <div>
                                  <p className="text-xs text-[#3C73AD]/60">Width</p>
                                  <p className="text-[#3C73AD]">{selectedElement.dimensions.width}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-[#3C73AD]/60">Height</p>
                                  <p className="text-[#3C73AD]">{selectedElement.dimensions.height}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-[#3C73AD]/60">Depth</p>
                                  <p className="text-[#3C73AD]">{selectedElement.dimensions.depth}</p>
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="text-sm text-[#3C73AD]/60">Area</label>
                                <p className="text-[#3C73AD]">{selectedElement.area}</p>
                              </div>
                              <div>
                                <label className="text-sm text-[#3C73AD]/60">Volume</label>
                                <p className="text-[#3C73AD]">{selectedElement.volume}</p>
                              </div>
                            </div>

                            <div>
                              <label className="text-sm text-[#3C73AD]/60">Notes</label>
                              <p className="text-sm text-[#3C73AD]">{selectedElement.notes}</p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-12 text-[#3C73AD]/60">
                          <Box className="w-12 h-12 mx-auto mb-3 opacity-40" />
                          <p>Click on an element in the 3D viewer to view its properties</p>
                        </div>
                      )}
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="filters" className="p-6">
                    <ScrollArea className="h-[600px] pr-4">
                      <div className="space-y-4">
                        <p className="text-sm text-[#3C73AD]/60 mb-4">Highlight specific element types in the 3D model</p>
                        
                        <div>
                          <h4 className="text-[#3C73AD] mb-3">Structure</h4>
                          <div className="space-y-2">
                            {['walls', 'floors', 'ceilings', 'columns', 'beams'].map(type => (
                              <div key={type} className="flex items-center justify-between p-2 hover:bg-[#AEE1FE]/10 rounded">
                                <Label htmlFor={`highlight-${type}`} className="text-[#3C73AD] capitalize cursor-pointer flex items-center gap-2">
                                  <Pipette className="w-4 h-4" />
                                  {type}
                                </Label>
                                <Switch
                                  id={`highlight-${type}`}
                                  checked={highlights[type as keyof typeof highlights]}
                                  onCheckedChange={() => toggleHighlight(type as keyof typeof highlights)}
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="pt-4 border-t border-[#AEE1FE]/30">
                          <h4 className="text-[#3C73AD] mb-3">Architecture</h4>
                          <div className="space-y-2">
                            {['doors', 'windows', 'stairs'].map(type => (
                              <div key={type} className="flex items-center justify-between p-2 hover:bg-[#AEE1FE]/10 rounded">
                                <Label htmlFor={`highlight-${type}`} className="text-[#3C73AD] capitalize cursor-pointer flex items-center gap-2">
                                  <Pipette className="w-4 h-4" />
                                  {type}
                                </Label>
                                <Switch
                                  id={`highlight-${type}`}
                                  checked={highlights[type as keyof typeof highlights]}
                                  onCheckedChange={() => toggleHighlight(type as keyof typeof highlights)}
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="pt-4 border-t border-[#AEE1FE]/30">
                          <h4 className="text-[#3C73AD] mb-3">MEP Systems</h4>
                          <div className="space-y-2">
                            {['hvac', 'plumbing', 'electrical'].map(type => (
                              <div key={type} className="flex items-center justify-between p-2 hover:bg-[#AEE1FE]/10 rounded">
                                <Label htmlFor={`highlight-${type}`} className="text-[#3C73AD] capitalize cursor-pointer flex items-center gap-2">
                                  <Pipette className="w-4 h-4" />
                                  {type === 'hvac' ? 'HVAC' : type}
                                </Label>
                                <Switch
                                  id={`highlight-${type}`}
                                  checked={highlights[type as keyof typeof highlights]}
                                  onCheckedChange={() => toggleHighlight(type as keyof typeof highlights)}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </Card>

              {/* Export Options */}
              <Card className="p-6 bg-white shadow-xl">
                <h3 className="text-[#3C73AD] mb-4">Export Model</h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start text-[#3C73AD] border-[#AEE1FE]">
                    <Download className="w-4 h-4 mr-2" />
                    Export as .obj
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-[#3C73AD] border-[#AEE1FE]">
                    <Download className="w-4 h-4 mr-2" />
                    Export as .fbx
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-[#3C73AD] border-[#AEE1FE]">
                    <Download className="w-4 h-4 mr-2" />
                    Export as .ifc
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
