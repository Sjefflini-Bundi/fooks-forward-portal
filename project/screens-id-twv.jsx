/* global React, Icons, PageHead, Breadcrumb, Badge, PhaseBadge, EmptyState */
const { useState: useStateId, useMemo: useMemoId } = React;

// ---------- Screen 3: ID-beoordelingen (list) ----------
function IdReviewList({ onNavigate, onStartReview }) {
  const { ID_QUEUE, waitBadgeClass, fmtDate, initialsOf } = window.AppData;
  const [q, setQ] = useStateId('');

  const rows = useMemoId(() => {
    const ql = q.trim().toLowerCase();
    return ID_QUEUE.filter(e =>
      !ql || e.name.toLowerCase().includes(ql) || e.nationality.toLowerCase().includes(ql)
    );
  }, [q]);

  return (
    <>
      <Breadcrumb
        items={[
          { label: 'Home', route: 'dashboard' },
          { label: 'Medewerker Onboardingen', route: 'onboarding' },
          { label: 'ID-beoordelingen' },
        ]}
        onNavigate={onNavigate}
      />
      <PageHead
        title="ID-beoordelingen"
        subtitle={
          <>
            <span className="live-dot" />
            <span><b>{ID_QUEUE.length}</b> medewerkers wachtend op beoordeling</span>
          </>
        }
        actions={
          <button className="btn btn-success btn-lg" onClick={() => onStartReview(ID_QUEUE[0].id)}>
            <Icons.Play size={16} /> Start beoordeling ({ID_QUEUE.length} wachtend)
          </button>
        }
      />

      <div className="tbl-toolbar">
        <div className="tbl-search">
          <Icons.Search />
          <input placeholder="Zoek op naam of nationaliteit…" value={q} onChange={e => setQ(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-outline btn-sm"><Icons.Filter size={14} /> Filters</button>
        </div>
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Naam</th>
              <th>Nationaliteit</th>
              <th>Documenttype</th>
              <th>Geüpload</th>
              <th>Wachttijd</th>
              <th style={{ width: 160 }}></th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td colSpan={6}>
                <EmptyState icon={Icons.BadgeCheck} title="Alles beoordeeld">
                  Er wachten op dit moment geen documenten op beoordeling.
                </EmptyState>
              </td></tr>
            )}
            {rows.map(e => (
              <tr key={e.id} className="clickable" onClick={() => onStartReview(e.id)}>
                <td>
                  <div className="cell-name">
                    <div className="avatar">{initialsOf(e.name)}</div>
                    <span>{e.name}</span>
                  </div>
                </td>
                <td>{e.nationality}</td>
                <td>{e.docType}</td>
                <td className="cell-sub" style={{ color: 'var(--fg)' }}>{e.uploaded ? fmtDate(e.uploaded) : '—'}</td>
                <td><span className={`badge ${waitBadgeClass(e.waitDays)}`}>{e.waitDays} {e.waitDays === 1 ? 'dag' : 'dagen'}</span></td>
                <td>
                  <button className="row-action" onClick={(ev) => { ev.stopPropagation(); onStartReview(e.id); }}>
                    Beoordelen <Icons.ArrowRight size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

// ---------- Screen 3b: ID review detail ----------
function IdReviewDetail({ employeeId, onNavigate, onCompleteReview, toast }) {
  const { ID_QUEUE, REJECT_REASONS, COLLEAGUES, fmtDateTime } = window.AppData;
  const idx = ID_QUEUE.findIndex(e => e.id === employeeId);
  const emp = ID_QUEUE[idx];
  if (!emp) return null;

  const [panel, setPanel] = useStateId(null); // 'reject' | 'forward' | null
  const [reason, setReason] = useStateId('');
  const [colleague, setColleague] = useStateId('');
  const [note, setNote] = useStateId('');

  const prev = idx > 0 ? ID_QUEUE[idx - 1].id : null;
  const next = idx < ID_QUEUE.length - 1 ? ID_QUEUE[idx + 1].id : null;

  const handleApprove = () => { toast(`✓ ${emp.name} — goedgekeurd`, 'ok'); onCompleteReview(next); };
  const handleReject  = () => {
    if (!reason) return;
    toast(`✕ ${emp.name} — afgewezen & e-mail verzonden`, 'err');
    setPanel(null); setReason('');
    onCompleteReview(next);
  };
  const handleForward = () => {
    if (!colleague) return;
    const c = COLLEAGUES.find(c => c.id === colleague);
    toast(`→ Doorverwezen naar ${c?.name || ''}`, 'ok');
    setPanel(null); setColleague(''); setNote('');
    onCompleteReview(next);
  };

  return (
    <>
      <Breadcrumb
        items={[
          { label: 'Home', route: 'dashboard' },
          { label: 'Medewerker Onboardingen', route: 'onboarding' },
          { label: 'ID-beoordelingen', route: 'onboarding-id' },
          { label: emp.name },
        ]}
        onNavigate={onNavigate}
      />

      <div className="review-head">
        <div>
          <h1 className="page-title" style={{ fontSize: 28, marginBottom: 2 }}>{emp.name}</h1>
          <p className="page-subtitle">{emp.employer} · {emp.docType}</p>
        </div>
        <div className="review-progress">
          <button className="iconbtn" disabled={!prev} onClick={() => prev && onCompleteReview(prev)} title="Vorige"><Icons.ChevLeft size={16} /></button>
          <span><b>{idx + 1}</b> van <b>{ID_QUEUE.length}</b> beoordeeld</span>
          <button className="iconbtn" disabled={!next} onClick={() => next && onCompleteReview(next)} title="Volgende"><Icons.ChevRight size={16} /></button>
        </div>
      </div>

      <div className="review-grid">
        <section>
          <div className="card card-pad">
            <h3 className="card-title" style={{ marginBottom: 12 }}>Document — {emp.docType}</h3>
            <div className="id-docs">
              <div className="id-doc">
                <div className="id-doc-label">
                  <span>Voorzijde</span>
                  <button className="zoom"><Icons.ZoomIn size={14} /></button>
                </div>
                <div className="id-surface">
                  <div className="id-portrait" />
                  <div style={{ maxWidth: '55%' }}>
                    <div className="id-line w-75" />
                    <div className="id-line w-60" />
                    <div className="id-line w-40" />
                    <div className="id-line w-60" />
                  </div>
                  <div className="id-chip" />
                  <div className="id-mrz">P&lt;NLD&lt;&lt;{emp.name.toUpperCase().replace(/\s+/g, '&lt;')}&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;{emp.docNumber || '000000000'}NLD{(emp.dob || '').replace(/-/g,'')}</div>
                </div>
              </div>
              <div className="id-doc back">
                <div className="id-doc-label">
                  <span>Achterzijde</span>
                  <button className="zoom"><Icons.ZoomIn size={14} /></button>
                </div>
                <div className="id-surface">
                  <div className="id-line w-75" />
                  <div className="id-line w-60" />
                  <div className="id-line w-75" />
                  <div className="id-line w-40" />
                  <div className="id-mrz">IDNLD&lt;&lt;{emp.docNumber || '000000000'}&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;{(emp.dob || '').replace(/-/g,'')}</div>
                </div>
              </div>
            </div>
            <p className="card-desc" style={{ marginTop: 10, fontSize: 12 }}>
              Klik op het vergrootglas voor volledige weergave. De selfie wordt in de sidebar rechts weergegeven.
            </p>
          </div>

          <div className="review-actions">
            <button className="btn btn-outline" onClick={() => setPanel('forward')}>
              <Icons.Forward size={16} /> Doorverwijzen
            </button>
            <button className="btn btn-danger" onClick={() => setPanel('reject')}>
              <Icons.X size={16} /> Afwijzen
            </button>
            <button className="btn btn-success btn-lg" onClick={handleApprove}>
              <Icons.Check size={16} /> Goedkeuren
            </button>
          </div>
        </section>

        <aside style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card card-pad">
            <h3 className="card-title">Gegevensvergelijking</h3>
            <div className="kv-list" style={{ marginTop: 8 }}>
              <div className="kv"><span className="k">Naam</span><span className="v">{emp.name} <Icons.Check size={12} style={{ color: 'var(--success-500)' }} /></span></div>
              <div className="kv"><span className="k">Geboortedatum</span><span className="v">{emp.dob || '—'}</span></div>
              <div className="kv"><span className="k">Nationaliteit</span><span className="v">{emp.nationality}</span></div>
              <div className="kv"><span className="k">Documentnummer</span><span className="v" style={{ fontFamily: 'monospace', fontSize: 12 }}>{emp.docNumber || '—'}</span></div>
              <div className="kv"><span className="k">Geldig tot</span><span className="v">{emp.validUntil || '—'}</span></div>
            </div>
          </div>

          <div className="card card-pad">
            <h3 className="card-title">Documentinfo</h3>
            <div className="kv-list" style={{ marginTop: 8 }}>
              <div className="kv"><span className="k">Type</span><span className="v">{emp.docType}</span></div>
              <div className="kv"><span className="k">Aantal uploads</span><span className="v">1</span></div>
              <div className="kv"><span className="k">Selfie</span><span className="v">{emp.hasSelfie ? 'Ja' : 'Nee'}</span></div>
              <div className="kv"><span className="k">Status</span><span className="v"><Badge kind="id" dot>In beoordeling</Badge></span></div>
              <div className="kv"><span className="k">Geüpload</span><span className="v" style={{ fontSize: 12 }}>{emp.uploaded ? fmtDateTime(emp.uploaded) : '—'}</span></div>
            </div>
          </div>
        </aside>
      </div>

      {/* Afwijzen panel */}
      {panel === 'reject' && (
        <div className="modal-backdrop" onClick={() => setPanel(null)}>
          <div className="modal" style={{ width: 'min(640px, 100%)' }} onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <div>
                <h3>Document afwijzen</h3>
                <p>{emp.name} krijgt automatisch een e-mail om opnieuw te uploaden.</p>
              </div>
              <button className="modal-close" onClick={() => setPanel(null)}><Icons.X size={16} /></button>
            </div>
            <div className="modal-body">
              <div className="field">
                <label>Reden van afwijzing</label>
                <select className="select" value={reason} onChange={e => setReason(e.target.value)}>
                  <option value="">Selecteer een reden…</option>
                  {REJECT_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              {reason && (
                <div className="field">
                  <label>Voorbeeld e-mail aan medewerker</label>
                  <div className="email-preview">
                    <div className="email-head">Aan · {emp.name.toLowerCase().replace(/\s+/g,'.')}@fooks.nl</div>
                    <div className="email-subject">Je identiteitsbewijs moet opnieuw worden geüpload</div>
                    <div className="email-body">{`Beste ${emp.name.split(' ')[0]},

We hebben je ID-document bekeken en kunnen het helaas niet goedkeuren.

Reden: ${reason}.

Upload een nieuwe versie via de onderstaande link. Lukt het niet, neem dan contact op met je contactpersoon bij Fooks Forward.

`}<a href="#">Opnieuw uploaden →</a>{`

Met vriendelijke groet,
Team Fooks Forward`}</div>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-foot">
              <button className="btn btn-ghost" onClick={() => setPanel(null)}>Terug</button>
              <button className="btn btn-danger" disabled={!reason} onClick={handleReject}>
                <Icons.Send size={14} /> Afwijzen & verzenden
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Doorverwijzen panel */}
      {panel === 'forward' && (
        <div className="modal-backdrop" onClick={() => setPanel(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <div>
                <h3>Doorverwijzen naar collega</h3>
                <p>De collega ontvangt deze beoordeling in hun wachtrij.</p>
              </div>
              <button className="modal-close" onClick={() => setPanel(null)}><Icons.X size={16} /></button>
            </div>
            <div className="modal-body">
              <div className="field">
                <label>Doorverwijzen naar</label>
                <select className="select" value={colleague} onChange={e => setColleague(e.target.value)}>
                  <option value="">Kies een collega…</option>
                  {COLLEAGUES.map(c => <option key={c.id} value={c.id}>{c.name} — {c.role}</option>)}
                </select>
              </div>
              <div className="field">
                <label>Reden van doorverwijzing</label>
                <textarea className="textarea" rows={3} value={note} onChange={e => setNote(e.target.value)} placeholder="Bijv. specialistische controle nodig…" />
              </div>
            </div>
            <div className="modal-foot">
              <button className="btn btn-ghost" onClick={() => setPanel(null)}>Annuleren</button>
              <button className="btn btn-primary" disabled={!colleague} onClick={handleForward}>
                <Icons.Forward size={14} /> Doorverwijzen
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ---------- Screen 4: TWV-statussen ----------
function TwvStatussen({ onNavigate }) {
  const { TWV_DOSSIERS, fmtDate } = window.AppData;
  const tabs = ['Actie Fooks', 'Actie UWV', 'Actie Medewerker', 'Afgerond', 'Afgekeurd'];
  const [active, setActive] = useStateId('Actie Fooks');

  const rows = TWV_DOSSIERS[active] || [];

  return (
    <>
      <Breadcrumb
        items={[
          { label: 'Home', route: 'dashboard' },
          { label: 'Medewerker Onboardingen', route: 'onboarding' },
          { label: 'TWV-statussen' },
        ]}
        onNavigate={onNavigate}
      />
      <PageHead title="TWV-statussen" subtitle="Tewerkstellingsvergunningen beheren"
        actions={<button className="btn btn-primary"><Icons.Plus size={16} /> Nieuw dossier</button>}
      />

      <div className="tabs">
        {tabs.map(t => (
          <button key={t} className={`tab ${active === t ? 'active' : ''}`} onClick={() => setActive(t)}>
            {t}
            <span className="tab-count">{TWV_DOSSIERS[t]?.length ?? 0}</span>
          </button>
        ))}
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Medewerker</th>
              <th>Type</th>
              <th>Status</th>
              <th>Geldig tot</th>
              <th>Aangemaakt</th>
              <th style={{ width: 56 }}></th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={6}>
                <EmptyState icon={Icons.FileText} title="Geen dossiers in deze categorie">
                  Dossiers verschijnen hier zodra er actie ondernomen moet worden.
                </EmptyState>
              </td></tr>
            ) : rows.map(d => (
              <tr key={d.id} className="clickable">
                <td><div className="cell-name"><div className="avatar">{window.AppData.initialsOf(d.medewerker)}</div><span>{d.medewerker}</span></div></td>
                <td>{d.type}</td>
                <td>
                  {d.status === 'Goedgekeurd' ? <Badge kind="done" dot>{d.status}</Badge>
                   : d.status === 'Afgekeurd' ? <Badge kind="revoked" dot>{d.status}</Badge>
                   : <Badge kind="twv" dot>{d.status}</Badge>}
                </td>
                <td>{d.geldigTot ? fmtDate(d.geldigTot) : '—'}</td>
                <td className="cell-sub" style={{ color: 'var(--fg)' }}>{fmtDate(d.aangemaakt)}</td>
                <td><Icons.ChevRight size={16} style={{ color: 'var(--gray-400)' }} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

// ---------- Fallback stub for sidebar destinations ----------
function Stub({ title, onNavigate }) {
  return (
    <>
      <Breadcrumb items={[{ label: 'Home', route: 'dashboard' }, { label: title }]} onNavigate={onNavigate} />
      <PageHead title={title} subtitle="Deze sectie valt buiten de scope van deze prototype." />
      <div className="card card-pad-lg">
        <EmptyState icon={Icons.Sparkles} title={`${title} — placeholder`}>
          Een productieversie van deze pagina is beschikbaar in het volledige portaal.
        </EmptyState>
      </div>
    </>
  );
}

Object.assign(window, { IdReviewList, IdReviewDetail, TwvStatussen, Stub });
