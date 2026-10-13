'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { BookOpen, Headphones, Pause, Play, Search, SkipBack, SkipForward, RotateCcw } from 'lucide-react';

type Surah = { id: number; name: string };
type Moshaf = { id: number; name: string; server: string; surahs: number[] };
type Reciter = { id: number; name: string; moshaf: Moshaf[] };
type Catalog = { surahs: Surah[]; reciters: Reciter[] };

export default function QuranLibrary() {
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [reciterId, setReciterId] = useState<number | null>(null);
  const [moshafId, setMoshafId] = useState<number | null>(null);
  const [surahId, setSurahId] = useState(1);
  const [query, setQuery] = useState('');
  const [playing, setPlaying] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [audioError, setAudioError] = useState('');
  const audio = useRef<HTMLAudioElement>(null);
  const requestCatalog = () => {
    setLoading(true); setError('');
    fetch('/api/quran/library').then(async r => { const j = await r.json(); if (!r.ok) throw new Error(j.error || 'تعذر التحميل'); return j as Catalog; })
      .then(j => { setCatalog(j); setReciterId(j.reciters[0]?.id ?? null); setMoshafId(j.reciters[0]?.moshaf[0]?.id ?? null); })
      .catch(e => setError(e instanceof Error ? e.message : 'تعذر تحميل التلاوات'))
      .finally(() => setLoading(false));
  };
  useEffect(() => { requestCatalog(); }, []);
  const reciter = useMemo(() => catalog?.reciters.find(r => r.id === reciterId), [catalog, reciterId]);
  const moshaf = useMemo(() => reciter?.moshaf.find(m => m.id === moshafId) || reciter?.moshaf[0], [reciter, moshafId]);
  const available = useMemo(() => new Set(moshaf?.surahs || []), [moshaf]);
  const listed = useMemo(() => catalog?.surahs.filter(s => available.has(s.id) && (`${s.id} ${s.name}`).includes(query.trim())) || [], [catalog, available, query]);
  const current = catalog?.surahs.find(s => s.id === surahId);
  const ids = catalog?.surahs.filter(s => available.has(s.id)).map(s => s.id) || [];
  const url = moshaf && available.has(surahId) ? `${moshaf.server.replace(/\/+$/, '')}/${String(surahId).padStart(3, '0')}.mp3` : '';
  const selectSurah = (id: number) => { setSurahId(id); setAudioError(''); setPlaying(false); audio.current?.pause(); };
  const changeReciter = (id: number) => {
    const r = catalog?.reciters.find(x => x.id === id);
    const m = r?.moshaf[0];
    if (!m) return;
    setReciterId(id); setMoshafId(m.id); setSurahId(m.surahs[0] || 1); setAudioError(''); setPlaying(false);
  };
  const changeMoshaf = (id: number) => {
    const m = reciter?.moshaf.find(x => x.id === id);
    if (!m) return;
    setMoshafId(id); setSurahId(m.surahs[0] || 1); setAudioError(''); setPlaying(false);
  };
  const move = (delta: number) => { const i = ids.indexOf(surahId); if (i < 0) return; selectSurah(ids[(i + delta + ids.length) % ids.length]); };
  async function toggle() {
    const el = audio.current; if (!el || !url) return;
    setAudioError('');
    if (!el.paused) { el.pause(); return; }
    try { await el.play(); } catch { setAudioError('تعذر تشغيل التلاوة. جرّب سورة أو قارئاً آخر أو تحقق من الاتصال.'); }
  }
  return <main className="sol-quran-page"><div className="container">
    <section className="sol-quran-hero"><span className="section-kicker"><BookOpen size={18}/> مكتبة القرآن الكريم</span><h1>نورٌ يُتلى، وأجرٌ يُرجى</h1><p>استمع إلى تلاوات القرآن الكريم، واختر القارئ والسورة التي تحبها.</p><small>التلاوات مقدمة عبر MP3Quran.net، ويتطلب الاستماع اتصالاً بالإنترنت.</small></section>
    {loading && <div className="card sol-quran-notice" role="status">جارٍ تحميل قائمة القراء والسور…</div>}
    {error && <div className="card sol-quran-notice" role="alert"><p>{error}</p><button className="btn" onClick={requestCatalog}>إعادة المحاولة</button></div>}
    {catalog && <div className="sol-quran-grid"><section className="card sol-quran-player" aria-label="مشغل التلاوة">
      <span className="sol-quran-symbol">۞</span><Headphones size={25}/><h2>{current ? `سورة ${current.name}` : 'اختر سورة'}</h2><p>{reciter?.name}</p><small>{moshaf?.name}</small>
      <div className="sol-quran-buttons"><button type="button" onClick={() => move(-1)} aria-label="السورة السابقة" disabled={ids.length < 2}><SkipForward size={23}/></button><button type="button" className="sol-quran-mainplay" onClick={toggle} aria-label={playing ? 'إيقاف مؤقت' : 'تشغيل'} disabled={!url}>{playing ? <Pause size={27}/> : <Play size={27}/>}</button><button type="button" onClick={() => move(1)} aria-label="السورة التالية" disabled={ids.length < 2}><SkipBack size={23}/></button></div>
      <audio ref={audio} src={url || undefined} controls preload="none" loop={repeat} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)} onError={() => { setPlaying(false); if (url) setAudioError('ملف التلاوة غير متاح حالياً لهذا القارئ. جرّب قارئاً آخر.'); }} aria-label="مشغل صوت القرآن" />
      <button className="sol-quran-repeat" type="button" aria-pressed={repeat} onClick={() => setRepeat(v => !v)}><RotateCcw size={16}/> {repeat ? 'إيقاف التكرار' : 'تكرار السورة'}</button>
      {audioError && <p className="sol-quran-error" role="alert">{audioError}</p>}
      <p className="sol-quran-credit">المصدر: <a href="https://www.mp3quran.net/ar" target="_blank" rel="noopener noreferrer">المكتبة الصوتية للقرآن الكريم</a></p>
    </section><section className="card sol-quran-library" aria-label="اختيار السورة والقارئ">
      <h2>اختر التلاوة</h2><div className="sol-quran-filters"><label>القارئ<select value={reciterId ?? ''} onChange={e => changeReciter(Number(e.target.value))}>{catalog.reciters.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}</select></label><label>الرواية / المصحف<select value={moshaf?.id ?? ''} onChange={e => changeMoshaf(Number(e.target.value))}>{reciter?.moshaf.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}</select></label></div>
      <label className="sol-quran-search"><Search size={18}/><input type="search" placeholder="ابحث عن سورة أو رقمها" value={query} onChange={e => setQuery(e.target.value)}/></label>
      <p className="sol-quran-count">{listed.length} سورة متاحة لهذا القارئ {query ? 'وفق البحث' : ''}</p>
      <div className="sol-quran-surahs">{listed.map(s => <button key={s.id} type="button" className={s.id === surahId ? 'selected' : ''} aria-pressed={s.id === surahId} onClick={() => selectSurah(s.id)}><span>{String(s.id).padStart(3, '0')}</span><strong>{s.name}</strong>{s.id === surahId && <Headphones size={17}/>}</button>)}{!listed.length && <p>لا توجد سور مطابقة أو متاحة لهذا المصحف.</p>}</div>
    </section></div>}
  </div></main>;
}
