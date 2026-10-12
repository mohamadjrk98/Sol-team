import { supabase } from '@/lib/supabase';
export type HomeBanner = {id:string;title:string;subtitle:string;image_url:string;button_text:string;button_url:string;sort_order:number;is_active:boolean;image_urls?:string[]};
export async function getHomeBanners():Promise<HomeBanner[]>{
 if(!supabase)return [];
 const {data,error}=await supabase.from('home_banners').select('id,title,subtitle,image_url,image_urls,button_text,button_url,sort_order,is_active').eq('is_active',true).neq('title','__SOL_HOME_HERO_IMAGE__').order('sort_order',{ascending:true}).limit(8);
 if(error)return [];
 return (data||[]) as HomeBanner[];
}

// Dedicated homepage hero image, stored in the existing banner table.
export async function getHomeHeroImage():Promise<string>{
 if(!supabase)return '/team-banner.jpg';
 const {data,error}=await supabase.from('home_banners').select('image_url').eq('title','__SOL_HOME_HERO_IMAGE__').eq('is_active',true).limit(1).maybeSingle();
 if(error||!data?.image_url)return '/team-banner.jpg';
 return data.image_url;
}
