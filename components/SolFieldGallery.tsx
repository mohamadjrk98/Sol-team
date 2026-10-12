'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {ArrowLeft,ChevronLeft,ChevronRight,X} from 'lucide-react';
type Item={title:string;image:string;href:string};
export default function SolFieldGallery({items}:{items:Item[]}){
 const [selected,setSelected]=useState<number|null>(null);
 useEffect(()=>{if(selected===null)return;const key=(e:KeyboardEvent)=>{if(e.key==='Escape')setSelected(null);if(e.key==='ArrowLeft')setSelected(i=>i===null?null:(i+1)%items.length);if(e.key==='ArrowRight')setSelected(i=>i===null?null:(i-1+items.length)%items.length)};document.addEventListener('keydown',key);return()=>document.removeEventListener('keydown',key)},[selected,items.length]);
 if(!items.length)return null;
 return <section className="section sol-v21-gallery-section" aria-label="معرض أعمال الفريق"><div className="container"><div className="section-head"><div><span className="section-kicker">من قلب الميدان</span><h2>لحظات صنعت فرقاً</h2><p className="muted">صور من المبادرات المنشورة على الموقع.</p></div><Link className="btn secondary" href="/blog">كل الأعمال <ArrowLeft size={17}/></Link></div><div className="sol-v21-gallery-grid">{items.map((item,i)=><button key={item.href} type="button" className="sol-v21-gallery-tile" onClick={()=>setSelected(i)} aria-label={`تكبير صورة ${item.title}`}><img src={item.image} alt={item.title} loading="lazy" decoding="async"/><span>{item.title}</span></button>)}</div></div>
 {selected!==null&&<div className="sol-v21-lightbox" role="dialog" aria-modal="true" aria-label="معرض الصور" onClick={()=>setSelected(null)}><button className="sol-v21-lightbox-close" onClick={()=>setSelected(null)} aria-label="إغلاق"><X/></button><button className="sol-v21-lightbox-prev" onClick={e=>{e.stopPropagation();setSelected((selected-1+items.length)%items.length)}} aria-label="السابق"><ChevronRight/></button><div className="sol-v21-lightbox-body" onClick={e=>e.stopPropagation()}><img src={items[selected].image} alt={items[selected].title}/><Link href={items[selected].href}>{items[selected].title} <ArrowLeft size={16}/></Link></div><button className="sol-v21-lightbox-next" onClick={e=>{e.stopPropagation();setSelected((selected+1)%items.length)}} aria-label="التالي"><ChevronLeft/></button></div>}
 </section>;
}
