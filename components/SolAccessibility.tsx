'use client';
import {useState} from 'react';
export default function SolAccessibility(){const [open,setOpen]=useState(false),[large,setLarge]=useState(false),[contrast,setContrast]=useState(false);
 function update(nextLarge:boolean,nextContrast:boolean){setLarge(nextLarge);setContrast(nextContrast);document.documentElement.classList.toggle('sol-v22-large-text',nextLarge);document.documentElement.classList.toggle('sol-v22-contrast',nextContrast)}
 return <div className="sol-v22-access"><button type="button" aria-expanded={open} onClick={()=>setOpen(v=>!v)} aria-label="إعدادات سهولة القراءة">Aa</button>{open&&<div className="sol-v22-access-panel"><strong>سهولة القراءة</strong><button onClick={()=>update(!large,contrast)} aria-pressed={large}>تكبير الخط {large?'✓':''}</button><button onClick={()=>update(large,!contrast)} aria-pressed={contrast}>تباين أعلى {contrast?'✓':''}</button><button onClick={()=>update(false,false)}>إعادة الضبط</button></div>}</div>
}
