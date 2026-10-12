'use client';
import {useEffect,useRef,useState} from 'react';
import {Users,Network,HeartHandshake,CalendarDays} from 'lucide-react';
function Count({value,suffix=''}:{value:number;suffix?:string}){
 const [current,setCurrent]=useState(0);const ref=useRef<HTMLSpanElement>(null);
 useEffect(()=>{const el=ref.current;if(!el)return;
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){setCurrent(value);return;}
  let frame=0,start=0;const observer=new IntersectionObserver(entries=>{if(!entries[0]?.isIntersecting)return;observer.disconnect();const step=(time:number)=>{if(!start)start=time;const t=Math.min((time-start)/1100,1);setCurrent(Math.round(value*(1-Math.pow(1-t,3))));if(t<1)frame=requestAnimationFrame(step)};frame=requestAnimationFrame(step)},{threshold:.2});observer.observe(el);
  return()=>{observer.disconnect();cancelAnimationFrame(frame)};
 },[value]);return <span ref={ref}>{current.toLocaleString('ar')}{suffix}</span>;
}
export default function SolAnimatedStats({active,teams,completed,hours,hoursLabel}:{active:number;teams:number;completed:number;hours:string;hoursLabel:string}){
 return <section className="container stats modern-stats sol-v21-stats" aria-label="إحصائيات الفريق"><div className="stat"><Users/><strong><Count value={active}/></strong><span>متطوع/ة نشطون</span></div><div className="stat"><Network/><strong><Count value={teams}/></strong><span>فرق اختصاصية</span></div><div className="stat"><HeartHandshake/><strong><Count value={completed} suffix="+"/></strong><span>مبادرات منجزة</span></div><div className="stat"><CalendarDays/><strong>{hours}</strong><span>{hoursLabel}</span></div></section>;
}
