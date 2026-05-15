import { createClient } from '@supabase/supabase-js';
import { sampleVolunteers } from './sample-data';
import { Volunteer } from './types';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const hasSupabase = Boolean(url && anonKey);

export const supabase = hasSupabase ? createClient(url!, anonKey!) : null;
export const supabaseAdmin = url && serviceKey ? createClient(url, serviceKey, { auth: { persistSession: false } }) : null;

function normalize(v: any): Volunteer {
  return {
    ...v,
    skills: v.skills ?? [],
    achievements: v.achievements ?? [],
    works: v.works ?? [],
    certificates: v.certificates ?? []
  };
}

export async function getVolunteers(): Promise<Volunteer[]> {
  if (!supabase) return sampleVolunteers;
  const { data, error } = await supabase.from('volunteers').select('*').order('created_at', { ascending: false });
  if (error || !data) return sampleVolunteers;
  return data.map(normalize);
}

export async function getFeaturedVolunteers(): Promise<Volunteer[]> {
  const all = await getVolunteers();
  return all.filter((v) => v.is_featured).slice(0, 6);
}

export async function getVolunteerBySlug(slug: string): Promise<Volunteer | null> {
  if (!supabase) return sampleVolunteers.find((v) => v.slug === slug) ?? null;
  const { data, error } = await supabase.from('volunteers').select('*').eq('slug', slug).single();
  if (error || !data) return sampleVolunteers.find((v) => v.slug === slug) ?? null;
  return normalize(data);
}
