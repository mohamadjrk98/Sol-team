'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Crown, Users, Network, ChevronDown,
  Search, ArrowLeft, ShieldCheck, UserRound
} from 'lucide-react';
import type { Volunteer } from '@/lib/types';

type Props = {
  volunteers: Volunteer[];
};

const rank = (v: Volunteer) =>
  Number.isFinite(Number(v.position_rank))
    ? Number(v.position_rank)
    : 999;

const sortPeople = (people: Volunteer[]) =>
  [...people].sort((a, b) =>
    rank(a) - rank(b) ||
    a.full_name.localeCompare(b.full_name, 'ar')
  );

function teamsOf(v: Volunteer): string[] {
  return Array.from(
    new Set(
      (v.team_names?.length
        ? v.team_names
        : v.team_name
          ? [v.team_name]
          : []
      ).filter(Boolean)
    )
  );
}

function PersonCard({
  person,
  variant = 'normal'
}: {
  person: Volunteer;
  variant?: 'normal' | 'leader';
}) {
  return (
    <Link
      href={`/volunteers/${encodeURIComponent(person.slug)}`}
      className={`sol-org-person ${variant === 'leader' ? 'sol-org-leader' : ''}`}
    >
      <img
        src={person.avatar_url || '/avatar.svg'}
        alt={person.full_name}
        loading="lazy"
      />
      <span className="sol-org-person-info">
        <strong>{person.full_name}</strong>
        <small>{person.role || 'متطوع'}</small>
        {teamsOf(person).length > 0 && (
          <em>{teamsOf(person).join(' • ')}</em>
        )}
      </span>
      <ArrowLeft size={17} className="sol-org-person-arrow" />
    </Link>
  );
}

export default function OrganizationChart({ volunteers }: Props) {
  const [query, setQuery] = useState('');
  const [openTeams, setOpenTeams] = useState<string[]>([]);
  const [boardOpen, setBoardOpen] = useState(true);
  const [coordinatorsOpen, setCoordinatorsOpen] = useState(true);

  const people = useMemo(
    () => sortPeople(volunteers),
    [volunteers]
  );

  const board = useMemo(
    () => people.filter(v => v.hierarchy_level === 'board'),
    [people]
  );

  const coordinators = useMemo(
    () => people.filter(v => v.hierarchy_level === 'coordinator'),
    [people]
  );

  const teams = useMemo(() => {
    const map = new Map<string, Volunteer[]>();

    for (const person of people) {
      if (person.hierarchy_level !== 'volunteer') continue;

      const names = teamsOf(person);
      const assigned = names.length ? names : ['غير محدد الفريق'];

      for (const name of assigned) {
        if (!map.has(name)) map.set(name, []);
        map.get(name)!.push(person);
      }
    }

    return Array.from(map.entries()).sort((a, b) =>
      a[0].localeCompare(b[0], 'ar')
    );
  }, [people]);

  const search = query.trim().toLocaleLowerCase();

  const matches = (v: Volunteer) =>
    !search ||
    [
      v.full_name,
      v.role,
      v.department || '',
      ...teamsOf(v)
    ].join(' ').toLocaleLowerCase().includes(search);

  const visibleBoard = board.filter(matches);
  const visibleCoordinators = coordinators.filter(matches);

  const visibleTeams = teams
    .map(([name, members]) => [
      name,
      search && name.toLocaleLowerCase().includes(search)
        ? members
        : members.filter(matches)
    ] as [string, Volunteer[]])
    .filter(([, members]) => members.length > 0);

  const toggleTeam = (name: string) => {
    setOpenTeams(current =>
      current.includes(name)
        ? current.filter(item => item !== name)
        : [...current, name]
    );
  };

  const allOpen = teams.length > 0 &&
    teams.every(([name]) => openTeams.includes(name));

  return (
    <div className="sol-org" dir="rtl">
      <div className="sol-org-stats">
        <div><Crown size={21}/><strong>{board.length}</strong><span>الإدارة</span></div>
        <div><ShieldCheck size={21}/><strong>{coordinators.length}</strong><span>المنسقون</span></div>
        <div><Network size={21}/><strong>{teams.length}</strong><span>الفرق</span></div>
        <div><Users size={21}/><strong>{people.length}</strong><span>إجمالي الأعضاء</span></div>
      </div>

      <div className="sol-org-toolbar">
        <div className="sol-org-search">
          <Search size={19}/>
          <input
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="ابحث عن عضو، منصب أو فريق..."
            aria-label="البحث في الهيكل التنظيمي"
          />
        </div>
        <button
          type="button"
          className="sol-org-expand"
          onClick={() => setOpenTeams(
            allOpen ? [] : teams.map(([name]) => name)
          )}
        >
          {allOpen ? 'طي جميع الفرق' : 'عرض جميع الفرق'}
        </button>
      </div>

      <div className="sol-org-tree">
        <section className="sol-org-tier">
          <button
            type="button"
            className="sol-org-node sol-org-board-node"
            onClick={() => setBoardOpen(v => !v)}
            aria-expanded={boardOpen}
          >
            <Crown size={27}/>
            <span><strong>مجلس الإدارة</strong><small>{board.length} عضو</small></span>
            <ChevronDown className={boardOpen ? 'sol-org-rotated' : ''} size={20}/>
          </button>
          {(boardOpen || search) && (
            <div className="sol-org-people sol-org-board-people">
              {visibleBoard.map(person => (
                <PersonCard key={person.id || person.slug} person={person} variant="leader"/>
              ))}
              {visibleBoard.length === 0 && <p className="sol-org-empty">لا يوجد أعضاء مطابقون.</p>}
            </div>
          )}
        </section>

        <div className="sol-org-connector" aria-hidden="true"/>

        <section className="sol-org-tier">
          <button
            type="button"
            className="sol-org-node sol-org-coordinator-node"
            onClick={() => setCoordinatorsOpen(v => !v)}
            aria-expanded={coordinatorsOpen}
          >
            <ShieldCheck size={26}/>
            <span><strong>المنسقون</strong><small>{coordinators.length} عضو</small></span>
            <ChevronDown className={coordinatorsOpen ? 'sol-org-rotated' : ''} size={20}/>
          </button>
          {(coordinatorsOpen || search) && (
            <div className="sol-org-people">
              {visibleCoordinators.map(person => (
                <PersonCard key={person.id || person.slug} person={person}/>
              ))}
              {visibleCoordinators.length === 0 && <p className="sol-org-empty">لا يوجد منسقون مطابقون.</p>}
            </div>
          )}
        </section>

        <div className="sol-org-connector" aria-hidden="true"/>

        <section className="sol-org-tier">
          <div className="sol-org-node sol-org-team-node">
            <Network size={26}/>
            <span><strong>الفرق التطوعية</strong><small>{teams.length} فريق</small></span>
          </div>

          <div className="sol-org-teams">
            {visibleTeams.map(([name, members]) => {
              const open = search.length > 0 || openTeams.includes(name);
              return (
                <article className="sol-org-team" key={name}>
                  <button
                    type="button"
                    className="sol-org-team-toggle"
                    onClick={() => toggleTeam(name)}
                    aria-expanded={open}
                  >
                    <span className="sol-org-team-icon"><Users size={21}/></span>
                    <span className="sol-org-team-title">
                      <strong>{name}</strong>
                      <small>{members.length} متطوع</small>
                    </span>
                    <ChevronDown className={open ? 'sol-org-rotated' : ''} size={20}/>
                  </button>
                  {open && (
                    <div className="sol-org-team-members">
                      {members.map(person => (
                        <PersonCard
                          key={`${name}-${person.id || person.slug}`}
                          person={person}
                        />
                      ))}
                    </div>
                  )}
                </article>
              );
            })}
            {visibleTeams.length === 0 && (
              <p className="sol-org-empty">لا توجد فرق أو أعضاء مطابقون للبحث.</p>
            )}
          </div>
        </section>
      </div>

      <p className="sol-org-footnote">
        <UserRound size={16}/>
        يُحتسب كل عضو مرة واحدة في إجمالي الأعضاء، حتى لو كان منتسباً لأكثر من فريق.
      </p>
    </div>
  );
}
