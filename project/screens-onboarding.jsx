/* global React, Icons, PageHead, Breadcrumb, Badge, PhaseBadge, EmptyState */
const { useState, useMemo } = React;

// ---------- Screen 1: Medewerker Onboardingen (landing) ----------
function OnboardingLanding({ onNavigate }) {
  const { phaseCount } = window.AppData;
  const pendingId = phaseCount('id');

  const tiles = [
    {
      key: 'totaal', route: 'onboarding-totaal',
      icon: Icons.Users, iconClass: 'alt-blue',
      title: 'Totaal overzicht',
      desc: 'Alle medewerkeronboardingen per fase',
    },
    {
      key: 'id', route: 'onboarding-id',
      icon: Icons.IdCard, iconClass: 'alt-orange',
      title: 'ID-beoordelingen',
      desc: 'Identiteitsbewijzen beoordelen',
      badge: pendingId > 0 ? `${pendingId} wachtend` : null,
    },
    {
      key: 'twv', route: 'onboarding-twv',
      icon: Icons.ShieldCheck, iconClass: 'alt-purple',
      title: 'TWV-statussen',
      desc: 'Tewerkstellingsvergunningen beheren',
    },
  ];

  return (
    <>
      <Breadcrumb items={[{ label: 'Home', route: 'dashboard' }, { label: 'Medewerker Onboardingen' }]} onNavigate={onNavigate} />
      <PageHead title="Medewerker Onboardingen" subtitle="Beheer onboardingen, ID-beoordelingen en TWV-dossiers" />

      <div className="feature-grid">
        {tiles.map(t => (
          <article
            key={t.key}
            className="card card-clickable feature-card"
            onClick={() => onNavigate(t.route)}
            role="button" tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onNavigate(t.route)}
          >
            <div className="feat-top">
              <div className={`feature-icon ${t.iconClass || ''}`}>
                <t.icon size={22} />
              </div>
              {t.badge && <span className="badge badge-count">{t.badge}</span>}
            </div>
            <div>
              <h3>{t.title}</h3>
              <p>{t.desc}</p>
            </div>
            <Icons.ArrowRight className="feat-arrow" size={18} />
          </article>
        ))}
      </div>

      <div style={{ marginTop: 28, display: 'flex', gap: 12, alignItems: 'center', color: 'var(--fg-subtle)', fontSize: 13 }}>
        <span className="live-dot" />
        Aantallen worden live bijgewerkt vanuit het onboarding-systeem.
      </div>
    </>
  );
}

// ---------- Screen 2: Totaal overzicht ----------
function TotaalOverzicht({ onNavigate, onOpenEmployee }) {
  const { EMPLOYEES, PHASES, phaseCount } = window.AppData;
  const [q, setQ] = useState('');
  const [activePhase, setActivePhase] = useState(null);

  const phases = ['invited', 'busy', 'id', 'twv', 'done', 'revoked'];

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return EMPLOYEES.filter(e => {
      if (activePhase && e.phase !== activePhase) return false;
      if (!ql) return true;
      return e.name.toLowerCase().includes(ql)
          || e.employer.toLowerCase().includes(ql)
          || (e.status || '').toLowerCase().includes(ql);
    });
  }, [q, activePhase]);

  return (
    <>
      <Breadcrumb
        items={[
          { label: 'Home', route: 'dashboard' },
          { label: 'Medewerker Onboardingen', route: 'onboarding' },
          { label: 'Totaal overzicht' }
        ]}
        onNavigate={onNavigate}
      />
      <PageHead
        title="Totaal overzicht"
        subtitle="Alle medewerkeronboardingen, gegroepeerd per fase"
      />

      <div className="stat-grid" role="tablist" aria-label="Filter op fase">
        {phases.map(ph => {
          const info = PHASES[ph];
          const count = phaseCount(ph);
          const active = activePhase === ph;
          return (
            <button
              key={ph}
              className={`stat-card ${info.stat} ${active ? 'is-active' : ''}`}
              onClick={() => setActivePhase(active ? null : ph)}
              style={{ cursor: 'pointer', font: 'inherit', textAlign: 'left' }}
              role="tab" aria-selected={active}
            >
              <span className="stat-label">{info.label}</span>
              <span className="stat-value">
                <span className="stat-dot" />
                {count}
              </span>
              <span className="stat-foot">Medewerkers</span>
            </button>
          );
        })}
      </div>

      <div className="tbl-toolbar">
        <div className="tbl-search">
          <Icons.Search />
          <input
            placeholder="Zoek op naam, werkgever of status…"
            value={q}
            onChange={e => setQ(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {activePhase && (
            <button className="btn btn-ghost btn-sm" onClick={() => setActivePhase(null)}>
              <Icons.X size={14} /> Filter wissen
            </button>
          )}
          <button className="btn btn-outline btn-sm"><Icons.Filter size={14} /> Filters</button>
          <button className="btn btn-outline btn-sm"><Icons.Download size={14} /> Export</button>
        </div>
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Naam</th>
              <th>Werkgever</th>
              <th>Fase</th>
              <th>Status</th>
              <th style={{ width: 56 }}></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={5}>
                <EmptyState icon={Icons.Inbox} title="Geen medewerkers gevonden">
                  Pas je zoekopdracht of filter aan.
                </EmptyState>
              </td></tr>
            )}
            {filtered.map(e => (
              <tr key={e.id} className="clickable" onClick={() => onOpenEmployee(e.id)}>
                <td>
                  <div className="cell-name">
                    <div className="avatar">{window.AppData.initialsOf(e.name)}</div>
                    <div>
                      <div>{e.name}</div>
                      <div className="cell-sub">{e.nationality}</div>
                    </div>
                  </div>
                </td>
                <td>{e.employer}</td>
                <td><PhaseBadge phase={e.phase} /></td>
                <td className="cell-sub" style={{ color: 'var(--fg)' }}>{e.status}</td>
                <td><Icons.ChevRight className="feat-arrow" size={16} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, fontSize: 12, color: 'var(--fg-subtle)' }}>
        <div><span className="live-dot" /> {filtered.length} van {EMPLOYEES.length} medewerkers getoond</div>
        <div>Data wordt dynamisch geladen uit de backend</div>
      </div>
    </>
  );
}

// ---------- Screen 2b: Employee detail ----------
function EmployeeDetail({ employeeId, onNavigate }) {
  const { EMPLOYEES } = window.AppData;
  const emp = EMPLOYEES.find(e => e.id === employeeId);
  if (!emp) return <div>Medewerker niet gevonden.</div>;

  const steps = [
    { key: 'registratie',   label: 'Registratie',    done: true },
    { key: 'id',            label: 'ID-verificatie', done: emp.phase === 'done' || emp.phase === 'twv', active: emp.phase === 'id' },
    { key: 'contract',      label: 'Contract',        done: emp.phase === 'done', active: emp.phase === 'busy' || emp.phase === 'twv' },
    { key: 'afronding',     label: 'Afronding',       done: emp.phase === 'done', active: false },
  ];

  return (
    <>
      <Breadcrumb
        items={[
          { label: 'Home', route: 'dashboard' },
          { label: 'Medewerker Onboardingen', route: 'onboarding' },
          { label: 'Totaal overzicht', route: 'onboarding-totaal' },
          { label: emp.name },
        ]}
        onNavigate={onNavigate}
      />
      <PageHead title={emp.name} subtitle={emp.employer}
        actions={<>
          <button className="btn btn-outline"><Icons.MoreHoriz size={16} /></button>
          <button className="btn btn-primary"><Icons.Send size={16} /> Contact</button>
        </>}
      />

      <div className="detail-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <section className="card card-pad sub-card">
            <h3>Voortgang</h3>
            <div className="steps">
              {steps.map((s, i) => (
                <div key={s.key} className={`step ${s.done ? 'done' : s.active ? 'active' : 'pending'}`}>
                  <div className="step-indicator">{s.done ? <Icons.Check size={14} /> : i + 1}</div>
                  <div className="step-label">{s.label}</div>
                  <div className="step-meta">
                    {s.done ? 'Voltooid' : s.active ? 'Actief' : 'Open'}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="card card-pad sub-card">
            <h3>Acties</h3>
            <div className="action-list">
              <button className="action-btn"><Icons.ShieldCheck /> TWV beheren</button>
              <button className="action-btn"><Icons.FileCheck /> Co-signing</button>
              <button className="action-btn"><Icons.Bell /> Herinnering sturen</button>
              <button className="action-btn danger"><Icons.X /> Intrekken</button>
            </div>
          </section>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <section className="card card-pad sub-card">
            <h3>Persoonsgegevens</h3>
            {emp.dob || emp.docNumber ? (
              <div className="kv-list">
                <div className="kv"><span className="k">Geboortedatum</span><span className="v">{emp.dob || '—'}</span></div>
                <div className="kv"><span className="k">Nationaliteit</span><span className="v">{emp.nationality || '—'}</span></div>
                <div className="kv"><span className="k">Documenttype</span><span className="v">{emp.docType || '—'}</span></div>
                <div className="kv"><span className="k">Documentnummer</span><span className="v">{emp.docNumber || '—'}</span></div>
              </div>
            ) : (
              <div className="empty">Nog geen persoonsgegevens — deze worden aangevuld zodra de medewerker zijn dossier voltooit.</div>
            )}
          </section>

          <section className="card card-pad sub-card">
            <h3>Plaatsingen</h3>
            {emp.role ? (
              <div className="kv-list">
                <div className="kv"><span className="k">Functie</span><span className="v">{emp.role}</span></div>
                <div className="kv"><span className="k">Startdatum</span><span className="v">{window.AppData.fmtDate(emp.startDate)}</span></div>
                <div className="kv"><span className="k">Uren per week</span><span className="v">{emp.hoursPerWeek} uur</span></div>
                <div className="kv"><span className="k">Bruto uurloon</span><span className="v">€ {emp.salary.toFixed(2).replace('.', ',')}</span></div>
              </div>
            ) : (
              <div className="empty">Nog geen plaatsing geregistreerd.</div>
            )}
          </section>
        </div>
      </div>
    </>
  );
}

Object.assign(window, { OnboardingLanding, TotaalOverzicht, EmployeeDetail });
