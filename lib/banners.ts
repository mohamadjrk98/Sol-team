import { supabase, supabaseAdmin } from '@/lib/supabase';
import { unstable_noStore as noStore } from 'next/cache';
export type HomeBanner = {id:string;title:string;subtitle:string;image_url:string;button_text:string;button_url:string;sort_order:number;is_active:boolean;image_urls?:string[]};
export async function getHomeBanners():Promise<HomeBanner[]>{
 // Read published banner galleries on the server without stale cached results.
 noStore();
 const client=supabaseAdmin ?? supabase;
 if(!client)return [];
 const {data,error}=await client.from('home_banners')
  .select('id,title,subtitle,image_url,image_urls,button_text,button_url,sort_order,is_active')
  .eq('is_active',true)
  .neq('title','__SOL_HOME_HERO_IMAGE__')
  .order('sort_order',{ascending:true}).limit(8);
 if(error){console.error('SOL banner gallery read error:',error.message);return []}
 return (data||[]).map(b=>({
  ...b,
  image_urls:Array.isArray(b.image_urls)&&b.image_urls.length
   ?b.image_urls.filter((u:unknown):u is string=>typeof u==='string'&&u.length>0)
   :(b.image_url?[b.image_url]:[])
 })) as HomeBanner[];
}

// Dedicated homepage hero image, stored in the existing banner table.
export async function getHomeHeroImage():Promise<string>{
 if(!supabase)return '/team-banner.jpg';
 const {data,error}=await supabase.from('home_banners').select('image_url').eq('title','__SOL_HOME_HERO_IMAGE__').eq('is_active',true).limit(1).maybeSingle();
 if(error||!data?.image_url)return '/team-banner.jpg';
 return data.image_url;
}
