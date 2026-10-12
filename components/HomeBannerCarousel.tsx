'use client';
import {useEffect,useRef,useState} from 'react';
import Link from 'next/link';
import {ChevronLeft,ChevronRight} from 'lucide-react';
import type {HomeBanner} from '@/lib/banners';
export default function HomeBannerCarousel({items}:{items:HomeBanner[]}){
 const [bannerIndex,setBannerIndex]=useState(0),[photoIndex,setPhotoIndex]=useState(0),[paused,setPaused]=useState(false);
 const touch=useRef<{x:number;y:number}|null>(null);
 const banner=items[bannerIndex%Math.max(items.length,1)];
 const photos=banner?(banner.image_urls?.length?banner.image_urls:[banner.image_url]):[];
 function next(){if(photoIndex+1<photos.length)setPhotoIndex(photoIndex+1);else {setBannerIndex(v=>(v+1)%items.length);setPhotoIndex(0)}}
 function previous(){if(photoIndex>0)setPhotoIndex(photoIndex-1);else{const idx=(bannerIndex-1+items.length)%items.length;setBannerIndex(idx);const prev=items[idx];setPhotoIndex(Math.max(0,(prev.image_urls?.length?prev.image_urls.length:1)-1))}}
 useEffect(()=>{if(items.length===0||paused||items.reduce((n,b)=>n+(b.image_urls?.length||1),0)<2)return;const timer=setInterval(()=>{setPhotoIndex(p=>{const b=items[bannerIndex%items.length];const count=b.image_urls?.length||1;if(p+1<count)return p+1;setBannerIndex(v=>(v+1)%items.length);return 0})},6500);return()=>clearInterval(timer)},[items,bannerIndex,paused]);
 if(!banner)return null;
 const multi=photos.length>1||items.length>1;
 return <section className="sol-banner-section" aria-label="أبرز أخبار وإعلانات الفريق"><div className="container"><div className="sol-banner-frame sol-v15-banner-frame" aria-roledescription="عرض شرائح" onMouseEnter={()=>setPaused(true)} onMouseLeave={()=>setPaused(false)} onFocusCapture={()=>setPaused(true)} onBlurCapture={e=>{if(!e.currentTarget.contains(e.relatedTarget as Node))setPaused(false)}} onTouchStart={e=>{const t=e.touches[0];touch.current={x:t.clientX,y:t.clientY}}} onTouchEnd={e=>{if(!touch.current)return;const t=e.changedTouches[0],dx=t.clientX-touch.current.x,dy=t.clientY-touch.current.y;touch.current=null;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.25){if(dx<0)next();else previous()}}}>
 <div className="sol-v15-banner-images">{photos.map((url,i)=><img key={url+i} className={`sol-banner-image sol-v15-banner-image ${i===photoIndex?'is-active':''}`} src={url} alt={`${banner.title} - ${i+1}`} loading={i===0?'eager':'lazy'}/>)}</div><div className="sol-banner-overlay"/>
 <div className="sol-banner-content" key={banner.id}><span className="sol-banner-eyebrow">من SOL TEAM</span><h2>{banner.title}</h2><p>{banner.subtitle}</p>{banner.button_url&&banner.button_text&&<Link className="btn yellow" href={banner.button_url}>{banner.button_text}</Link>}</div>
 {multi&&<><div className="sol-banner-controls"><button type="button" aria-label="السابق" onClick={previous}><ChevronRight/></button><button type="button" aria-label="التالي" onClick={next}><ChevronLeft/></button></div><div className="sol-banner-dots">{photos.map((_,i)=><button key={i} type="button" aria-label={`عرض الصورة ${i+1}`} aria-current={i===photoIndex?'true':undefined} className={i===photoIndex?'active':''} onClick={()=>setPhotoIndex(i)}/>)}</div></>}
 </div></div></section>
}
