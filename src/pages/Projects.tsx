import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProjectCard } from "@/components/shared/ProjectCard";
import { supabase } from "@/integrations/supabase/client";

// Mock data
const mockProjects = [
  {
    id: "1",
    name: "E-Commerce Platform Redesign",
    description: "Complete overhaul of the RetailMax e-commerce platform with modern tech stack and improved UX.",
    clientName: "RetailMax Inc.",
    status: "active" as const,
    priority: "high" as const,
    startDate: "2024-01-15",
    endDate: "2024-06-30",
    teamSize: 8,
    requiredSkills: ["React", "Node.js", "PostgreSQL", "AWS"],
    matchedCandidates: 5,
    progress: 45,
  },
  {
    id: "2",
    name: "Mobile Banking App",
    description: "Develop a secure, user-friendly mobile banking application for iOS and Android platforms.",
    clientName: "FinServe Bank",
    status: "active" as const,
    priority: "critical" as const,
    startDate: "2024-02-01",
    endDate: "2024-08-15",
    teamSize: 12,
    requiredSkills: ["React Native", "TypeScript", "Firebase", "Node.js"],
    matchedCandidates: 3,
    progress: 28,
  },
  {
    id: "3",
    name: "AI Customer Service Bot",
    description: "Implement an AI-powered customer service chatbot for enterprise clients.",
    clientName: "TechCorp Solutions",
    status: "draft" as const,
    priority: "medium" as const,
    startDate: "2024-04-01",
    endDate: "2024-09-30",
    teamSize: 5,
    requiredSkills: ["Python", "TensorFlow", "NLP", "FastAPI"],
    matchedCandidates: 8,
    progress: 0,
  },
  {
    id: "4",
    name: "Cloud Migration Project",
    description: "Migrate legacy on-premise infrastructure to AWS cloud with zero downtime.",
    clientName: "Global Logistics Co.",
    status: "active" as const,
    priority: "high" as const,
    startDate: "2024-01-01",
    endDate: "2024-05-15",
    teamSize: 6,
    requiredSkills: ["AWS", "Terraform", "Kubernetes", "Docker"],
    matchedCandidates: 4,
    progress: 72,
  },
  {
    id: "5",
    name: "Data Analytics Platform",
    description: "Build a comprehensive data analytics and reporting platform for business intelligence.",
    clientName: "DataDriven Inc.",
    status: "on_hold" as const,
    priority: "low" as const,
    startDate: "2024-03-01",
    endDate: "2024-10-31",
    teamSize: 7,
    requiredSkills: ["Python", "Spark", "Tableau", "PostgreSQL"],
    matchedCandidates: 6,
    progress: 15,
  },
  {
    id: "6",
    name: "Healthcare Portal",
    description: "Patient management and telehealth portal for healthcare providers.",
    clientName: "MediCare Health",
    status: "completed" as const,
    priority: "medium" as const,
    startDate: "2023-08-01",
    endDate: "2024-01-31",
    teamSize: 10,
    requiredSkills: ["React", "Node.js", "MongoDB", "WebRTC"],
    matchedCandidates: 0,
    progress: 100,
  },
];

export default function Projects() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setLoading(false);
    };
    checkAuth();
  }, [navigate]);

  const getFilteredProjects = () => {
    return mockProjects.filter((project) => {
      const matchesSearch =
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.clientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.requiredSkills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesPriority =
        priorityFilter === "all" || project.priority === priorityFilter;

      const matchesTab =
        activeTab === "all" || project.status === activeTab;

      return matchesSearch && matchesPriority && matchesTab;
    });
  };

  const filteredProjects = getFilteredProjects();

  const getTabCount = (status: string) => {
    if (status === "all") return mockProjects.length;
    return mockProjects.filter((p) => p.status === status).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1">Projects</h1>
            <p className="text-muted-foreground">
              Manage project requirements and team allocations
            </p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Project
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">
              All ({getTabCount("all")})
            </TabsTrigger>
            <TabsTrigger value="active">
              Active ({getTabCount("active")})
            </TabsTrigger>
            <TabsTrigger value="draft">
              Draft ({getTabCount("draft")})
            </TabsTrigger>
            <TabsTrigger value="on_hold">
              On Hold ({getTabCount("on_hold")})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({getTabCount("completed")})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, client, or skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results */}
        <p className="text-sm text-muted-foreground">
          Showing {filteredProjects.length} projects
        </p>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} {...project} />
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No projects found matching your criteria.</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}