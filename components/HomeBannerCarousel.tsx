'use client';
import { useEffect,useState } from 'react';
import Link from 'next/link';
import { ChevronLeft,ChevronRight } from 'lucide-react';
import type { HomeBanner } from '@/lib/banners';
export default function HomeBannerCarousel({items}:{items:HomeBanner[]}){
 const [index,setIndex]=useState(0);
 useEffect(()=>{if(items.length<2)return;const timer=setInterval(()=>setIndex(v=>(v+1)%items.length),6500);return()=>clearInterval(timer)},[items.length]);
 if(!items.length)return null;
 const current=items[index%items.length];
 return <section className="sol-banner-section" aria-label="أبرز أخبار وإعلانات الفريق"><div className="container"><div className="sol-banner-frame" aria-roledescription="عرض شرائح">
 <img className="sol-banner-image" src={current.image_url} alt={current.title}/><div className="sol-banner-overlay"/>
 <div className="sol-banner-content" key={current.id}><span className="sol-banner-eyebrow">من SOL TEAM</span><h2>{current.title}</h2><p>{current.subtitle}</p>{current.button_url&&current.button_text&&<Link className="btn yellow" href={current.button_url}>{current.button_text}</Link>}</div>
 {items.length>1&&<><div className="sol-banner-controls"><button type="button" aria-label="السابق" onClick={()=>setIndex(v=>(v-1+items.length)%items.length)}><ChevronRight/></button><button type="button" aria-label="التالي" onClick={()=>setIndex(v=>(v+1)%items.length)}><ChevronLeft/></button></div><div className="sol-banner-dots">{items.map((item,i)=><button key={item.id} type="button" aria-label={`عرض الشريحة ${i+1}`} aria-current={i===index?'true':undefined} className={i===index?'active':''} onClick={()=>setIndex(i)}/>)}</div></>}
 </div></div></section>;
}
