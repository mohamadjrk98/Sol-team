import { createClient } from '@supabase/supabase-js';
import { impactMetrics, initiatives, sampleVolunteers } from './sample-data';
import { ImpactMetric, Initiative, Volunteer } from './types';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const hasSupabase = Boolean(url && anonKey);

export const supabase = hasSupabase ? createClient(url!, anonKey!) : null;
export const supabaseAdmin = url && serviceKey ? createClient(url, serviceKey, { auth: { persistSession: false } }) : null;

function normalizeVolunteer(v: any): Volunteer {
  return {
    ...v,
    skills: v.skills ?? [],
    achievements: v.achievements ?? [],
    works: v.works ?? [],
    certificates: v.certificates ?? [],
    social_links: v.social_links ?? {},
    volunteer_status: v.volunteer_status ?? 'active',
    exit_reason: v.exit_reason ?? null
  };
}

export async function getVolunteers(): Promise<Volunteer[]> {
  if (!supabase) return sampleVolunteers;
  const { data, error } = await supabase.from('volunteers').select('*').order('position_rank', { ascending: true });
  if (error || !data) return sampleVolunteers;
  return data.map(normalizeVolunteer);
}

export async function getFeaturedVolunteers(): Promise<Volunteer[]> {
  const all = await getVolunteers();
  return all.filter((v) => v.is_featured).slice(0, 6);
}

export async function getVolunteerBySlug(slug: string): Promise<Volunteer | null> {
  if (!supabase) return sampleVolunteers.find((v) => v.slug === slug) ?? null;
  const { data, error } = await supabase.from('volunteers').select('*').eq('slug', slug).single();
  if (error || !data) return sampleVolunteers.find((v) => v.slug === slug) ?? null;
  return normalizeVolunteer(data);
}

function normalizeInitiative(i: any): Initiative {
  return {
    slug: i.slug,
    title: i.title,
    excerpt: i.excerpt,
    content: i.content,
    status: i.status,
    category: i.category,
    date: i.date,
    location: i.location,
    image_url: i.image_url ?? '/team-banner.jpg',
    team: i.team
  };
}

export async function getInitiatives(): Promise<Initiative[]> {
  if (!supabase) return initiatives;
  const { data, error } = await supabase.from('initiatives').select('*').order('date', { ascending: false });
  if (error || !data) return initiatives;
  return data.map(normalizeInitiative);
}

export async function getInitiativeBySlug(slug: string): Promise<Initiative | null> {
  if (!supabase) return initiatives.find((i) => i.slug === slug) ?? null;
  const { data, error } = await supabase.from('initiatives').select('*').eq('slug', slug).single();
  if (error || !data) return initiatives.find((i) => i.slug === slug) ?? null;
  return normalizeInitiative(data);
}

export async function getImpactMetrics(): Promise<ImpactMetric[]> {
  if (!supabase) return impactMetrics;
  const { data, error } = await supabase.from('impact_metrics').select('*').order('value', { ascending: false });
  if (error || !data) return impactMetrics;
  return data.map((m) => ({
    label: m.label,
    value: Number(m.value ?? 0),
    suffix: m.suffix ?? '',
    description: m.description ?? ''
  }));
}
