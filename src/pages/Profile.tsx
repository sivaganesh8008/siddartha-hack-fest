import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  Award,
  BookOpen,
  Edit,
  Upload,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AppLayout } from "@/components/layout/AppLayout";
import { SkillBadge } from "@/components/shared/SkillBadge";
import { MatchScoreRing } from "@/components/dashboard/MatchScoreRing";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    fullName: "John Doe",
    email: "john.doe@company.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    department: "Engineering",
    designation: "Senior Software Engineer",
    yearsExperience: 5,
    bio: "Passionate full-stack developer with expertise in React, Node.js, and cloud technologies. Love building scalable applications and mentoring junior developers.",
    availability: "available",
    readinessScore: 88,
  });

  const mockSkills = [
    { name: "React", level: "expert" as const },
    { name: "TypeScript", level: "expert" as const },
    { name: "Node.js", level: "intermediate" as const },
    { name: "Python", level: "intermediate" as const },
    { name: "AWS", level: "intermediate" as const },
    { name: "PostgreSQL", level: "beginner" as const },
  ];

  const mockCertifications = [
    { name: "AWS Solutions Architect", issuer: "Amazon Web Services", date: "2023" },
    { name: "React Developer Certification", issuer: "Meta", date: "2022" },
  ];

  const mockProjects = [
    { name: "E-Commerce Platform", role: "Tech Lead", duration: "6 months" },
    { name: "CRM System", role: "Senior Developer", duration: "4 months" },
  ];

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      // In a real app, fetch profile from database here
      setLoading(false);
    };
    checkAuth();
  }, [navigate]);

  const handleSave = () => {
    toast.success("Profile updated successfully!");
    setIsEditing(false);
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
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        {/* Header Card */}
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-3">
              <Avatar className="w-24 h-24 ring-4 ring-border">
                <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground text-2xl font-bold">
                  {profile.fullName.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Change Photo
              </Button>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold">{profile.fullName}</h1>
                  <p className="text-muted-foreground">{profile.designation}</p>
                </div>
                <div className="flex items-center gap-4">
                  <MatchScoreRing score={profile.readinessScore} size="sm" />
                  <Button
                    variant={isEditing ? "default" : "outline"}
                    onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                  >
                    {isEditing ? "Save Changes" : <><Edit className="w-4 h-4 mr-2" /> Edit</>}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span>{profile.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  <span>{profile.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{profile.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Briefcase className="w-4 h-4" />
                  <span>{profile.department}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>{profile.yearsExperience} years experience</span>
                </div>
              </div>

              <Badge className="mt-4 availability-available">Available</Badge>
            </div>
          </div>

          {isEditing && (
            <div className="mt-6 pt-6 border-t border-border space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={profile.fullName}
                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="designation">Designation</Label>
                  <Input
                    id="designation"
                    value={profile.designation}
                    onChange={(e) => setProfile({ ...profile, designation: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={profile.location}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
          )}

          {!isEditing && profile.bio && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">{profile.bio}</p>
            </div>
          )}
        </Card>

        {/* Skills */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Skills
            </h2>
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Skill
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {mockSkills.map((skill) => (
              <SkillBadge key={skill.name} {...skill} />
            ))}
          </div>
        </Card>

        {/* Certifications */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Award className="w-5 h-5" />
              Certifications
            </h2>
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Certification
            </Button>
          </div>
          <div className="space-y-3">
            {mockCertifications.map((cert, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                <div>
                  <p className="font-medium">{cert.name}</p>
                  <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                </div>
                <Badge variant="outline">{cert.date}</Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Project History */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Project History
            </h2>
          </div>
          <div className="space-y-3">
            {mockProjects.map((project, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                <div>
                  <p className="font-medium">{project.name}</p>
                  <p className="text-sm text-muted-foreground">{project.role}</p>
                </div>
                <Badge variant="outline">{project.duration}</Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Resume Upload */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Resume</h2>
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
            <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
            <p className="font-medium mb-1">Upload your resume</p>
            <p className="text-sm text-muted-foreground mb-4">
              PDF or DOC format, max 5MB
            </p>
            <Button variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Choose File
            </Button>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}