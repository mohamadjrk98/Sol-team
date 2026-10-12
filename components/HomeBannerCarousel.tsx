'use client';
import {useEffect,useRef,useState} from 'react';
import Link from 'next/link';
import {ChevronLeft,ChevronRight} from 'lucide-react';
import type {HomeBanner} from '@/lib/banners';

type Slide={banner:HomeBanner;url:string;photoNumber:number;photoCount:number};
export default function HomeBannerCarousel({items}:{items:HomeBanner[]}){
 const slides:Slide[]=items.flatMap(b=>{
  const urls=(Array.isArray(b.image_urls)&&b.image_urls.length?b.image_urls:[b.image_url]).filter(Boolean);
  return urls.map((url,i)=>({banner:b,url,photoNumber:i+1,photoCount:urls.length}));
 });
 const [index,setIndex]=useState(0);
 const [paused,setPaused]=useState(false);
 const touch=useRef<{x:number;y:number}|null>(null);
 const total=slides.length;
 const active=slides[((index%Math.max(total,1))+Math.max(total,1))%Math.max(total,1)];
 const next=()=>setIndex(i=>(i+1)%total);
 const previous=()=>setIndex(i=>(i-1+total)%total);
 useEffect(()=>{if(total<2||paused)return;const t=setInterval(()=>setIndex(i=>(i+1)%total),6500);return()=>clearInterval(t)},[total,paused]);
 if(!active)return null;
 const {banner,url,photoNumber,photoCount}=active;
 return <section className="sol-banner-section" aria-label="أبرز أخبار وإعلانات الفريق"><div className="container"><div className="sol-banner-frame sol-v17-banner-frame" aria-roledescription="عرض شرائح" onMouseEnter={()=>setPaused(true)} onMouseLeave={()=>setPaused(false)} onFocusCapture={()=>setPaused(true)} onBlurCapture={e=>{if(!e.currentTarget.contains(e.relatedTarget as Node))setPaused(false)}} onTouchStart={e=>{const t=e.touches[0];touch.current={x:t.clientX,y:t.clientY}}} onTouchEnd={e=>{if(!touch.current)return;const t=e.changedTouches[0],dx=t.clientX-touch.current.x,dy=t.clientY-touch.current.y;touch.current=null;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.25){if(dx<0)next();else previous()}}}>
 <img key={url} className="sol-v17-banner-photo" src={url} alt={`${banner.title} - صورة ${photoNumber} من ${photoCount}`} loading="eager" />
 <div className="sol-banner-overlay"/>
 <div className="sol-banner-content sol-v19-banner-content" key={`${banner.id}-${url}`}><span className="sol-banner-eyebrow">من SOL TEAM</span><h2>{banner.title}</h2><p>{banner.subtitle}</p>{banner.button_url&&banner.button_text&&<Link className="btn yellow" href={banner.button_url}>{banner.button_text}</Link>}</div>
 {total>1&&<><div className="sol-banner-controls"><button type="button" aria-label="السابق" onClick={previous}><ChevronRight/></button><button type="button" aria-label="التالي" onClick={next}><ChevronLeft/></button></div><div className="sol-banner-dots">{Array.from({length:photoCount},(_,i)=><button key={i} type="button" aria-label={`عرض الصورة ${i+1} من ${photoCount}`} aria-current={i+1===photoNumber?'true':undefined} className={i+1===photoNumber?'active':''} onClick={()=>{const start=slides.findIndex(s=>s.banner.id===banner.id);setIndex(start+i)}}/>)}</div></>}
 </div></div></section>
}
