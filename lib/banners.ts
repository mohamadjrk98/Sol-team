import { supabase } from '@/lib/supabase';
export type HomeBanner = {id:string;title:string;subtitle:string;image_url:string;button_text:string;button_url:string;sort_order:number;is_active:boolean};
export async function getHomeBanners():Promise<HomeBanner[]>{
 if(!supabase)return [];
 const {data,error}=await supabase.from('home_banners').select('id,title,subtitle,image_url,button_text,button_url,sort_order,is_active').eq('is_active',true).order('sort_order',{ascending:true}).limit(8);
 if(error)return [];
 return (data||[]) as HomeBanner[];
}
