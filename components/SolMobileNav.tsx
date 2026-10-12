'use client';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {Home,Users,Newspaper,UserPlus} from 'lucide-react';
export default function SolMobileNav(){
 const pathname=usePathname();if(pathname.startsWith('/admin'))return null;
 const links=[{href:'/',label:'الرئيسية',Icon:Home},{href:'/volunteers',label:'المتطوعون',Icon:Users},{href:'/blog',label:'الأعمال',Icon:Newspaper},{href:'/join',label:'انضم',Icon:UserPlus}];
 return <nav className="sol-v21-mobile-nav" aria-label="التنقل السريع">{links.map(({href,label,Icon})=><Link key={href} href={href} className={pathname===href?'active':''} aria-current={pathname===href?'page':undefined}><Icon size={19}/><span>{label}</span></Link>)}</nav>;
}
