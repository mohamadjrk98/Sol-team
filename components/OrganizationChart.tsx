'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Plus, Pencil, UserPlus } from 'lucide-react';
import {
  Crown, Users, Network, ChevronDown,
  Search, ArrowLeft, ShieldCheck, UserRound
} from 'lucide-react';
import type { Volunteer } from '@/lib/types';

type Props = {
  volunteers: Volunteer[];
  adminMode?: boolean;
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
  variant = 'normal',
  adminMode = false
}: {
  person: Volunteer;
  variant?: 'normal' | 'leader';
  adminMode?: boolean;
}) {
  return (
    <div className="sol-org-person-wrap">
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
        </span>
        <ArrowLeft size={17} className="sol-org-person-arrow" />
      </Link>
      {adminMode && (
        <Link
          className="sol-org-edit"
          href={`/admin?orgAction=edit&slug=${encodeURIComponent(person.slug)}#admin-volunteer-form`}
        >
          <Pencil size={15}/> تعديل
        </Link>
      )}
    </div>
  );
}

export default function OrganizationChart({ volunteers, adminMode = false }: Props) {
  const [query, setQuery] = useState('');
  // sol-v4-stage5-org: mobile-friendly tree navigation and search feedback
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
    const configuredTeams = [
      'مكتب المؤثرات الإعلامية والتمكين البشري',
      'فريق الدراسات العامة',
      'فريق الخدمات الميدانية',
      'فريق التبرعات'
    ];
    configuredTeams.forEach(name => map.set(name, []));

    for (const person of people) {
      if (person.hierarchy_level === 'board') continue;

      const names = teamsOf(person);
      const assigned = names.length ? names : ['غير محدد الفريق'];

      for (const name of assigned) {
        if (!map.has(name)) map.set(name, []);
        map.get(name)!.push(person);
      }
    }

    return Array.from(map.entries())
      .map(([name, members]) => [
        name,
        [...members].sort((a, b) =>
          (a.hierarchy_level === 'coordinator' ? 0 : 1) -
          (b.hierarchy_level === 'coordinator' ? 0 : 1) ||
          rank(a) - rank(b)
        )
      ] as [string, Volunteer[]])
      .sort((a, b) => a[0].localeCompare(b[0], 'ar'));
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
    .filter(([, members]) => adminMode || !search || members.length > 0);

  const toggleTeam = (name: string) => {
    setOpenTeams(current =>
      current.includes(name)
        ? current.filter(item => item !== name)
        : [...current, name]
    );
  };

  const allOpen = teams.length > 0 &&
    teams.every(([name]) => openTeams.includes(name));

  const visiblePeopleCount = new Set([
    ...visibleBoard,
    ...visibleCoordinators,
    ...visibleTeams.flatMap(([, members]) => members)
  ].map(person => person.id || person.slug)).size;

  return (
    <div className="sol-org" dir="rtl">
      {adminMode && (
        <div className="sol-org-admin-bar">
          <div>
            <strong>إدارة الشجرة التنظيمية</strong>
            <p>أضف الأعضاء وعدّل مواقعهم مباشرة من الهيكل.</p>
          </div>
          <div className="sol-org-admin-actions">
            <Link href="/admin?orgAction=add&level=board#admin-volunteer-form">
              <Plus size={16}/> إضافة عضو إدارة
            </Link>
            <Link href="/organization" target="_blank">
              معاينة الشجرة العامة
            </Link>
          </div>
        </div>
      )}
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

      <div className="sol-v4-org-summary" role="status" aria-live="polite">
        <span>{search ? `نتائج البحث: ${visiblePeopleCount} عضو` : `إجمالي الأعضاء: ${people.length}`}</span>
        {search && <button type="button" onClick={() => setQuery('')}>مسح البحث</button>}
      </div>
      <nav className="sol-v4-org-jumps" aria-label="التنقل بين أقسام الهيكل التنظيمي">
        <a href="#sol-v4-org-board">مجلس الإدارة</a>
        <a href="#sol-v4-org-coordinators">المنسقون</a>
        <a href="#sol-v4-org-teams">الفرق التطوعية</a>
      </nav>
      <div className="sol-org-tree">
        <section id="sol-v4-org-board" className="sol-org-tier">
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
                <PersonCard key={person.id || person.slug} person={person} variant="leader" adminMode={adminMode}/>
              ))}
              {visibleBoard.length === 0 && <p className="sol-org-empty">لا يوجد أعضاء مطابقون.</p>}
            </div>
          )}
        </section>

        <div className="sol-org-connector" aria-hidden="true"/>

        <section id="sol-v4-org-coordinators" className="sol-org-tier">
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
                <PersonCard key={person.id || person.slug} person={person} adminMode={adminMode}/>
              ))}
              {visibleCoordinators.length === 0 && <p className="sol-org-empty">لا يوجد منسقون مطابقون.</p>}
            </div>
          )}
        </section>

        <div className="sol-org-connector" aria-hidden="true"/>

        <section id="sol-v4-org-teams" className="sol-org-tier">
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
                      <small>
                        {members.filter(v => v.hierarchy_level === 'coordinator').length} منسق
                        {' • '}
                        {members.filter(v => v.hierarchy_level !== 'coordinator').length} متطوع
                      </small>
                    </span>
                    <ChevronDown className={open ? 'sol-org-rotated' : ''} size={20}/>
                  </button>
                  {adminMode && (
                    <div className="sol-org-team-actions">
                      <Link href={`/admin?orgAction=add&level=volunteer&team=${encodeURIComponent(name)}#admin-volunteer-form`}>
                        <UserPlus size={15}/> إضافة متطوع
                      </Link>
                      <Link href={`/admin?orgAction=add&level=coordinator&team=${encodeURIComponent(name)}#admin-volunteer-form`}>
                        <Plus size={15}/> إضافة منسق
                      </Link>
                    </div>
                  )}
                  {open && (
                    <div className="sol-org-team-members">
                      {members.filter(v => v.hierarchy_level === 'coordinator').length > 0 && (
                        <div className="sol-org-branch-heading">منسقو الفريق</div>
                      )}
                      {members.filter(v => v.hierarchy_level === 'coordinator').map(person => (
                        <PersonCard
                          key={`${name}-${person.id || person.slug}`}
                          person={person}
                          variant="leader"
                          adminMode={adminMode}
                        />
                      ))}
                      {members.filter(v => v.hierarchy_level !== 'coordinator').length > 0 && (
                        <div className="sol-org-branch-heading">المتطوعون</div>
                      )}
                      {members.filter(v => v.hierarchy_level !== 'coordinator').map(person => (
                        <PersonCard
                          key={`${name}-${person.id || person.slug}`}
                          person={person}
                          adminMode={adminMode}
                        />
                      ))}
                      {members.length === 0 && (
                        <p className="sol-org-empty">لا يوجد أعضاء ضمن هذا الفريق حالياً.</p>
                      )}
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
