export type HierarchyLevel = 'board' | 'coordinator' | 'volunteer';
export type VolunteerStatus = 'active' | 'left' | 'dismissed' | 'vacation' | 'paused';

export type Volunteer = {
  id?: string;
  slug: string;
  full_name: string;
  role: string;
  hierarchy_level: HierarchyLevel;
  department: string | null;
  team_name: string | null;
  position_rank: number;
  specialization: string | null;
  joined_year: number | null;
  joined_date?: string | null;
  location: string | null;
  age: number | null;
  avatar_url: string | null;
  bio: string | null;
  motivation: string | null;
  skills: string[];
  achievements: string[];
  works: string[];
  certificates: string[];
  social_links: Record<string, string>;
  volunteer_status?: VolunteerStatus;
  exit_reason?: string | null;
  is_featured: boolean;
};

export type InitiativeStatus = 'completed' | 'in_progress' | 'planned';

export type Initiative = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  status: InitiativeStatus;
  category: string;
  date: string;
  location: string;
  image_url: string;
  team: string;
};

export type ImpactMetric = {
  label: string;
  value: number;
  suffix?: string;
  description: string;
};
