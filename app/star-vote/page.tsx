import { getVolunteers } from '@/lib/supabase';
import StarVoteClient from '@/components/StarVoteClient';

export default async function StarVotePage() {
  const volunteers = await getVolunteers();
  return (
    <main>
      <section className="hero" style={{padding:'72px 0'}}><div className="container"><span className="eyebrow">نجم الأسبوع</span><h1>صوّت لنجم الأسبوع</h1><p className="lead">صوت بسيط يقدّر جهود المتطوعين ويعزز روح الفريق.</p></div></section>
      <section className="section"><div className="container"><StarVoteClient volunteers={volunteers}/></div></section>
    </main>
  );
}
