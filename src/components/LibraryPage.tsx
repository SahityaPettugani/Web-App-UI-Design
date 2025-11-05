import { useState } from "react";
import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Card } from "./ui/card";
import { Eye, Trash2, Edit2, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";

interface Project {
  id: string;
  name: string;
  date: string;
  thumbnail: string;
}

interface LibraryPageProps {
  onNavigate: (page: string) => void;
}

export function LibraryPage({ onNavigate }: LibraryPageProps) {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'Downtown Office Building',
      date: 'Oct 5, 2025',
      thumbnail: 'https://images.unsplash.com/photo-1703014172880-a9ad043097c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBidWlsZGluZyUyMGFyY2hpdGVjdHVyZXxlbnwxfHx8fDE3NTk5ODg1ODZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: '2',
      name: 'Residential Complex A',
      date: 'Oct 3, 2025',
      thumbnail: 'https://images.unsplash.com/photo-1601648933230-1fcd7e547bc3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb2ludCUyMGNsb3VkJTIwc2Nhbm5pbmd8ZW58MXx8fHwxNzYwMDIyODIwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: '3',
      name: 'Warehouse Facility',
      date: 'Sep 28, 2025',
      thumbnail: 'https://images.unsplash.com/photo-1684450471771-b70596cf13dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHwzRCUyMGFyY2hpdGVjdHVyYWwlMjBibHVlcHJpbnR8ZW58MXx8fHwxNzYwMDIyODIwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: '4',
      name: 'Shopping Mall West Wing',
      date: 'Sep 25, 2025',
      thumbnail: 'https://images.unsplash.com/photo-1703014172880-a9ad043097c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBidWlsZGluZyUyMGFyY2hpdGVjdHVyZXxlbnwxfHx8fDE3NTk5ODg1ODZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: '5',
      name: 'Historic Building Restoration',
      date: 'Sep 20, 2025',
      thumbnail: 'https://images.unsplash.com/photo-1601648933230-1fcd7e547bc3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb2ludCUyMGNsb3VkJTIwc2Nhbm5pbmd8ZW58MXx8fHwxNzYwMDIyODIwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: '6',
      name: 'Corporate Headquarters',
      date: 'Sep 15, 2025',
      thumbnail: 'https://images.unsplash.com/photo-1684450471771-b70596cf13dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHwzRCUyMGFyY2hpdGVjdHVyYWwlMjBibHVlcHJpbnR8ZW58MXx8fHwxNzYwMDIyODIwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    }
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleDelete = (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
  };

  const handleRename = (id: string) => {
    const project = projects.find(p => p.id === id);
    if (project) {
      setEditingId(id);
      setEditName(project.name);
    }
  };

  const saveRename = (id: string) => {
    setProjects(projects.map(p => 
      p.id === id ? { ...p, name: editName } : p
    ));
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F3EEE8] to-[#e5ddd3] pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-[#3C73AD] mb-2">Project Library</h1>
              <p className="text-[#3C73AD]/70">
                {projects.length} projects in your library
              </p>
            </div>
            <Button 
              onClick={() => onNavigate('dashboard')}
              className="bg-[#FFE2EE] hover:bg-[#FFE2EE]/90 text-[#79274B]"
            >
              New Project
            </Button>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden bg-white shadow-lg hover:shadow-xl transition-all">
                  {/* Thumbnail */}
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[#3C73AD] to-[#5085B8]">
                    <ImageWithFallback
                      src={project.thumbnail}
                      alt={project.name}
                      className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      {/* 3D Cube Icon */}
                      <div className="relative">
                        <div className="w-20 h-20 border-4 border-[#AEE1FE] bg-[#3C73AD]/50 backdrop-blur-sm transform rotate-45"></div>
                        <div className="absolute top-2 left-2 w-16 h-16 border-4 border-[#FFE2EE] bg-[#AEE1FE]/30 transform rotate-45"></div>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    {editingId === project.id ? (
                      <div className="flex gap-2 mb-3">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="flex-1 px-2 py-1 border border-[#AEE1FE] rounded text-[#3C73AD]"
                          autoFocus
                        />
                        <Button
                          size="sm"
                          onClick={() => saveRename(project.id)}
                          className="bg-[#FFE2EE] hover:bg-[#FFE2EE]/90 text-[#79274B]"
                        >
                          Save
                        </Button>
                      </div>
                    ) : (
                      <h3 className="text-[#3C73AD] mb-2">{project.name}</h3>
                    )}
                    <p className="text-[#3C73AD]/60 text-sm mb-4">{project.date}</p>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => onNavigate('dashboard')}
                        className="flex-1 bg-[#AEE1FE] hover:bg-[#AEE1FE]/80 text-[#3C73AD]"
                        size="sm"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-[#AEE1FE] text-[#3C73AD] hover:bg-[#AEE1FE]/20"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleRename(project.id)}>
                            <Edit2 className="w-4 h-4 mr-2" />
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(project.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Empty State */}
          {projects.length === 0 && (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[#AEE1FE]/30 flex items-center justify-center">
                <Eye className="w-12 h-12 text-[#3C73AD]/50" />
              </div>
              <h3 className="text-[#3C73AD] mb-2">No projects yet</h3>
              <p className="text-[#3C73AD]/60 mb-6">
                Start by uploading your first 3D scan
              </p>
              <Button 
                onClick={() => onNavigate('dashboard')}
                className="bg-[#FFE2EE] hover:bg-[#FFE2EE]/90 text-[#79274B]"
              >
                Create First Project
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
