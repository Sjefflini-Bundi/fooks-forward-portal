/* global React, Icons, PageHead, Breadcrumb, Badge, PhaseBadge, EmptyState */
const { useState: useStateId, useMemo: useMemoId } = React;

// ---------- Screen 3: ID-beoordelingen (list) ----------
function IdReviewList({ onNavigate, onStartReview }) {
  const { ID_QUEUE, waitBadgeClass, waitLabel, fmtDate, initialsOf } = window.AppData;
  const [q, setQ] = useStateId('');
  const [showFilter, setShowFilter] = useStateId(false);
  const [filterDocType, setFilterDocType] = useStateId('');
  const [filterVierOgen, setFilterVierOgen] = useStateId(false);
  const [filterDoorverwezen, setFilterDoorverwezen] = useStateId(false);

  const docTypes = [...new Set(ID_QUEUE.map(e => e.docType))].filter(Boolean);

  const filtered = useMemoId(() => {
    const ql = q.trim().toLowerCase();
    return ID_QUEUE.filter(e => {
      if (filterDocType && e.docType !== filterDocType) return false;
      if (filterVierOgen && !e.fourEyesRequired) return false;
      if (filterDoorverwezen && e.referredTo !== 'me') return false;
      if (!ql) return true;
      return e.name.toLowerCase().includes(ql) || e.nationality.toLowerCase().includes(ql);
    });
  }, [q, filterDocType, filterVierOgen, filterDoorverwezen]);

  const referred  = filtered.filter(e => e.referredTo === 'me');
  const vierOgen  = filtered.filter(e => e.referredTo !== 'me' && e.fourEyesRequired);
  const standard  = filtered.filter(e => e.referredTo !== 'me' && !e.fourEyesRequired);
  const activeFilters = [filterDocType, filterVierOgen, filterDoorverwezen].filter(Boolean).length;
  const clearFilters = () => { setFilterDocType(''); setFilterVierOgen(false); setFilterDoorverwezen(false); };

  const GroupHd = ({ label, count, color, icon: Ic }) => (
    <tr className="tbl-group-hd">
      <td colSpan={7}>
        <div className="group-hd-inner" style={{ color: color || 'var(--fg-muted)' }}>
          {Ic && <Ic size={13} />}
          {label}
          <span className="group-count" style={{
            background: color ? color.replace(')', ', 0.12)').replace('var(', 'color-mix(in srgb, ').replace(')', ' 12%, transparent)') : 'var(--gray-200)',
            color: color || 'var(--fg-muted)',
          }}>{count}</span>
        </div>
      </td>
    </tr>
  );

  const Row = ({ e }) => (
    <tr className="clickable" onClick={() => onStartReview(e.id)}>
      <td>
        <div className="cell-name">
          <div className="avatar">{initialsOf(e.name)}</div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {e.name}
              {e.fourEyesRequired && (
                <Icons.Eye size={13} style={{ color: 'var(--warn-600)', flexShrink: 0 }} title="Vier-ogen vereist" />
              )}
            </div>
            {e.referredTo === 'me' && (
              <div style={{ fontSize: 11, color: 'var(--brand-500)', fontWeight: 600 }}>
                Doorverwezen door {e.referredBy}
              </div>
            )}
          </div>
        </div>
      </td>
      <td>{e.nationality}</td>
      <td>{e.docType}</td>
      <td style={{ fontSize: 13, color: 'var(--fg)' }}>{e.uploaded ? fmtDate(e.uploaded) : '—'}</td>
      <td>
        <span className={`badge ${waitBadgeClass(e)}`}>{waitLabel(e)}</span>
      </td>
      <td>
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {e.fourEyesRequired && (
            <span className="badge badge-busy" style={{ gap: 4 }}>
              <Icons.Eye size={10} />Vier-ogen
            </span>
          )}
          {e.referredTo === 'me' && (
            <span className="badge badge-invited" style={{ gap: 4 }}>
              <Icons.Forward size={10} />Verwezen
            </span>
          )}
          {e.firstApprovedBy && (
            <span className="badge badge-done" title={`Eerste beoordeling: ${e.firstApprovedBy}`} style={{ gap: 4 }}>
              <Icons.Check size={10} />1e oog
            </span>
          )}
        </div>
      </td>
      <td>
        <button className="row-action" onClick={ev => { ev.stopPropagation(); onStartReview(e.id); }}>
          Beoordelen <Icons.ArrowRight size={14} />
        </button>
      </td>
    </tr>
  );

  return (
    <>
      <Breadcrumb items={[
        { label: 'Home', route: 'dashboard' },
        { label: 'Medewerker Onboardingen', route: 'onboarding' },
        { label: 'ID-beoordelingen' },
      ]} onNavigate={onNavigate} />

      <PageHead
        title="ID-beoordelingen"
        subtitle={<><span className="live-dot" /><span><b>{ID_QUEUE.length}</b> medewerkers wachtend op beoordeling</span></>}
        actions={
          ID_QUEUE.length > 0 && (
            <button className="btn btn-success btn-lg" onClick={() => onStartReview(ID_QUEUE[0].id)}>
              <Icons.Play size={16} /> Start beoordeling ({ID_QUEUE.length} wachtend)
            </button>
          )
        }
      />

      <div className="tbl-toolbar">
        <div className="tbl-search">
          <Icons.Search />
          <input
            placeholder="Zoek op naam of nationaliteit…"
            value={q}
            onChange={e => setQ(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {activeFilters > 0 && (
            <button className="btn btn-ghost btn-sm" onClick={clearFilters}>
              <Icons.X size={14} /> Wis filters
            </button>
          )}
          <div style={{ position: 'relative' }}>
            <button
              className={`btn btn-sm ${activeFilters > 0 ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setShowFilter(f => !f)}
            >
              <Icons.Filter size={14} /> Filters
              {activeFilters > 0 && (
                <span style={{ background: 'rgba(255,255,255,0.28)', borderRadius: 999, padding: '0 6px', fontSize: 11, marginLeft: 2 }}>
                  {activeFilters}
                </span>
              )}
            </button>

            {showFilter && (
              <div className="filter-popover" onClick={e => e.stopPropagation()}>
                <div className="filter-popover-title">Filters</div>

                <div className="filter-popover-section">
                  <label>Documenttype</label>
                  <select
                    className="select"
                    style={{ fontSize: 13 }}
                    value={filterDocType}
                    onChange={e => setFilterDocType(e.target.value)}
                  >
                    <option value="">Alle typen</option>
                    {docTypes.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                <div className="filter-popover-section">
                  <label className="filter-check">
                    <input
                      type="checkbox"
                      checked={filterVierOgen}
                      onChange={e => setFilterVierOgen(e.target.checked)}
                    />
                    Alleen vier-ogen casussen
                  </label>
                </div>

                <div className="filter-popover-section">
                  <label className="filter-check">
                    <input
                      type="checkbox"
                      checked={filterDoorverwezen}
                      onChange={e => setFilterDoorverwezen(e.target.checked)}
                    />
                    Doorverwezen naar mij
                  </label>
                </div>

                <button
                  className="btn btn-primary btn-sm"
                  style={{ width: '100%' }}
                  onClick={() => setShowFilter(false)}
                >
                  Toepassen
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="table-wrap" onClick={() => showFilter && setShowFilter(false)}>
        <table className="table">
          <thead>
            <tr>
              <th>Naam</th>
              <th>Nationaliteit</th>
              <th>Documenttype</th>
              <th>Geüpload</th>
              <th>Wachttijd</th>
              <th>Flags</th>
              <th style={{ width: 130 }}></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={7}>
                <EmptyState icon={Icons.BadgeCheck} title="Alles beoordeeld">
                  Er wachten op dit moment geen documenten op beoordeling.
                </EmptyState>
              </td></tr>
            )}

            {referred.length > 0 && (
              <>
                <GroupHd label="Doorverwezen naar mij" count={referred.length} icon={Icons.Forward} color="var(--brand-500)" />
                {referred.map(e => <Row key={e.id} e={e} />)}
              </>
            )}

            {vierOgen.length > 0 && (
              <>
                <GroupHd label="Vier-ogen vereist" count={vierOgen.length} icon={Icons.Eye} color="var(--warn-600)" />
                {vierOgen.map(e => <Row key={e.id} e={e} />)}
              </>
            )}

            {standard.length > 0 && (
              <>
                {(referred.length > 0 || vierOgen.length > 0) && (
                  <GroupHd label="Standaard beoordeling" count={standard.length} icon={Icons.IdCard} />
                )}
                {standard.map(e => <Row key={e.id} e={e} />)}
              </>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

// ---------- Screen 3b: ID review detail ----------
function IdReviewDetail({ employeeId, onNavigate, onCompleteReview, toast }) {
  const { ID_QUEUE, REJECT_CATEGORIES, COLLEAGUES, CURRENT_USER, fmtDateTime, fmtDate } = window.AppData;
  const idx = ID_QUEUE.findIndex(e => e.id === employeeId);
  const emp = ID_QUEUE[idx];
  if (!emp) return null;

  const [panel, setPanel] = useStateId(null); // 'reject' | 'forward' | null
  const [rejectCat, setRejectCat] = useStateId('');
  const [rejectReason, setRejectReason] = useStateId('');
  const [rejectNote, setRejectNote] = useStateId('');
  const [colleague, setColleague] = useStateId('');
  const [forwardNote, setForwardNote] = useStateId('');

  const prev = idx > 0 ? ID_QUEUE[idx - 1].id : null;
  const next = idx < ID_QUEUE.length - 1 ? ID_QUEUE[idx + 1].id : null;

  const isVierOgen = emp.fourEyesRequired;
  const hasFirstApproval = !!emp.firstApprovedBy;
  const isSamePerson = hasFirstApproval && emp.firstApprovedById === CURRENT_USER.id;
  const canApprove = !isSamePerson;
  const hasOcrMismatch = emp.ocrName && emp.ocrName !== emp.name;

  const selectedCategory = REJECT_CATEGORIES.find(c => c.key === rejectCat);

  const handleApprove = () => {
    if (isVierOgen && !hasFirstApproval) {
      toast(`✓ ${emp.name} — eerste beoordeling goedgekeurd (wacht op tweede review)`, 'ok');
    } else {
      toast(`✓ ${emp.name} — definitief goedgekeurd`, 'ok');
    }
    onCompleteReview(next);
  };

  const handleReject = () => {
    if (!rejectReason) return;
    toast(`✕ ${emp.name} — afgewezen & e-mail verzonden`, 'err');
    setPanel(null); setRejectCat(''); setRejectReason(''); setRejectNote('');
    onCompleteReview(next);
  };

  const handleForward = () => {
    if (!colleague) return;
    const c = COLLEAGUES.find(c => c.id === colleague);
    toast(`→ Doorverwezen naar ${c?.name || ''}`, 'ok');
    setPanel(null); setColleague(''); setForwardNote('');
    onCompleteReview(next);
  };

  const catIcon = (key) => {
    if (key === 'onleesbaar') return <Icons.Eye size={14} />;
    if (key === 'verlopen')   return <Icons.Calendar size={14} />;
    if (key === 'verkeerd')   return <Icons.FileText size={14} />;
    if (key === 'mismatch')   return <Icons.AlertCircle size={14} />;
    if (key === 'fraude')     return <Icons.AlertTri size={14} />;
    return <Icons.MoreHoriz size={14} />;
  };

  return (
    <>
      <Breadcrumb items={[
        { label: 'Home', route: 'dashboard' },
        { label: 'Medewerker Onboardingen', route: 'onboarding' },
        { label: 'ID-beoordelingen', route: 'onboarding-id' },
        { label: emp.name },
      ]} onNavigate={onNavigate} />

      {/* Vier-ogen banner */}
      {isVierOgen && (
        <div className="vier-ogen-banner">
          <Icons.Eye size={16} />
          <div>
            <strong>Vier-ogen beoordeling vereist</strong>
            {hasFirstApproval ? (
              <>
                {' '}— Eerste beoordeling goedgekeurd door <strong>{emp.firstApprovedBy}</strong> op {fmtDateTime(emp.firstApprovedAt)}.
                {isSamePerson && (
                  <span style={{ color: 'var(--error-600)', fontWeight: 600 }}>
                    {' '}Je hebt de eerste beoordeling al gedaan — je kunt niet ook de tweede beoordelen.
                  </span>
                )}
              </>
            ) : (
              <> — Dit is de eerste beoordeling. Na goedkeuring is een tweede reviewer nodig om de zaak definitief goed te keuren.</>
            )}
          </div>
        </div>
      )}

      {/* Referred banner */}
      {emp.referredTo === 'me' && (
        <div className="referred-banner">
          <Icons.Forward size={15} />
          <span>
            Doorverwezen door <strong>{emp.referredBy}</strong>
            {emp.referredAt && <span style={{ color: 'var(--fg-muted)', marginLeft: 6 }}>· {fmtDate(emp.referredAt)}</span>}
          </span>
        </div>
      )}

      <div className="review-head">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <h1 className="page-title" style={{ fontSize: 28, margin: 0 }}>{emp.name}</h1>
            {isVierOgen && <span className="badge badge-busy" style={{ gap: 4 }}><Icons.Eye size={11} /> Vier-ogen</span>}
            {emp.referredTo === 'me' && <span className="badge badge-invited" style={{ gap: 4 }}><Icons.Forward size={11} /> Doorverwezen</span>}
          </div>
          <p className="page-subtitle">{emp.employer} · {emp.docType}</p>
        </div>
        <div className="review-progress">
          <button className="iconbtn" disabled={!prev} onClick={() => prev && onCompleteReview(prev)} title="Vorige">
            <Icons.ChevLeft size={16} />
          </button>
          <span><b>{idx + 1}</b> / <b>{ID_QUEUE.length}</b></span>
          <button className="iconbtn" disabled={!next} onClick={() => next && onCompleteReview(next)} title="Volgende">
            <Icons.ChevRight size={16} />
          </button>
        </div>
      </div>

      <div className="review-grid">
        {/* Left column */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* ID document cards */}
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
                  <div className="id-mrz">P&lt;NLD&lt;&lt;{emp.name.toUpperCase().replace(/\s+/g, '&lt;')}&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;{emp.docNumber || '000000000'}NLD{(emp.dob || '').replace(/-/g, '')}</div>
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
                  <div className="id-mrz">IDNLD&lt;&lt;{emp.docNumber || '000000000'}&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;{(emp.dob || '').replace(/-/g, '')}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Selfie */}
          <div className="card card-pad">
            <h3 className="card-title" style={{ marginBottom: 10 }}>Selfie</h3>
            {emp.hasSelfie ? (
              <div className="selfie-wrap">
                <div className="selfie-placeholder" title="Selfie — live via backend" />
                <div className="selfie-meta">
                  <div className="selfie-match"><Icons.Check size={13} /> Selfie aanwezig</div>
                  <div className="selfie-hint">
                    Vergelijk het gezicht op de selfie met de pasfoto op het ID-document.
                    De afbeelding wordt live geladen vanuit het onboarding-systeem.
                  </div>
                </div>
              </div>
            ) : (
              <div className="empty">
                Geen selfie geüpload. De medewerker kan opnieuw uitgenodigd worden om een selfie toe te voegen.
              </div>
            )}
          </div>

          {/* Extra documents */}
          {emp.extraDocs && emp.extraDocs.length > 0 && (
            <div className="card card-pad">
              <h3 className="card-title" style={{ marginBottom: 10 }}>Extra documenten</h3>
              <div>
                {emp.extraDocs.map(doc => (
                  <div key={doc} className="extra-doc-item">
                    <Icons.FileText size={15} />
                    <span className="extra-doc-label">{doc}</span>
                    <span className="badge badge-neutral">Wacht op beoordeling</span>
                    <button className="zoom" title="Bekijken"><Icons.Eye size={14} /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Review actions */}
          <div className="review-actions">
            <button className="btn btn-outline" onClick={() => setPanel('forward')}>
              <Icons.Forward size={16} /> Doorverwijzen
            </button>
            <button className="btn btn-danger" onClick={() => setPanel('reject')}>
              <Icons.X size={16} /> Afwijzen
            </button>
            <button
              className="btn btn-success btn-lg"
              onClick={handleApprove}
              disabled={!canApprove}
              title={!canApprove ? 'Je hebt de eerste beoordeling al gedaan' : undefined}
            >
              <Icons.Check size={16} />
              {isVierOgen && !hasFirstApproval ? 'Eerste beoordeling — Goedkeuren' : 'Goedkeuren'}
            </button>
          </div>
        </section>

        {/* Right sidebar */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Gegevensvergelijking */}
          <div className="card card-pad">
            <h3 className="card-title" style={{ marginBottom: 8 }}>Gegevensvergelijking</h3>
            {hasOcrMismatch && (
              <div className="mismatch-alert">
                <Icons.AlertCircle size={13} /> OCR-naam wijkt af van profielnaam — controleer zorgvuldig.
              </div>
            )}
            <div className="kv-list" style={{ marginTop: 8 }}>
              <div className={`kv ${hasOcrMismatch ? 'kv-mismatch' : ''}`}>
                <span className="k">Naam (profiel)</span>
                <span className="v">{emp.name}</span>
              </div>
              {hasOcrMismatch && (
                <div className="kv kv-mismatch">
                  <span className="k">Naam (OCR)</span>
                  <span className="v">
                    {emp.ocrName}
                    <Icons.AlertCircle size={12} style={{ color: 'var(--error-500)', marginLeft: 5 }} />
                  </span>
                </div>
              )}
              <div className="kv">
                <span className="k">Geboortedatum</span>
                <span className="v">{emp.dob || '—'}</span>
              </div>
              <div className="kv">
                <span className="k">Nationaliteit</span>
                <span className="v">{emp.nationality}</span>
              </div>
              <div className="kv">
                <span className="k">Documentnummer</span>
                <span className="v" style={{ fontFamily: 'monospace', fontSize: 12 }}>{emp.docNumber || '—'}</span>
              </div>
              <div className="kv">
                <span className="k">Geldig tot</span>
                <span className="v">{emp.validUntil || '—'}</span>
              </div>
              {emp.bsn && (
                <div className="kv">
                  <span className="k">BSN</span>
                  <span className="v" style={{ fontFamily: 'monospace', fontSize: 12 }}>{emp.bsn}</span>
                </div>
              )}
            </div>
          </div>

          {/* Documentinfo */}
          <div className="card card-pad">
            <h3 className="card-title" style={{ marginBottom: 8 }}>Documentinfo</h3>
            <div className="kv-list">
              <div className="kv"><span className="k">Type</span><span className="v">{emp.docType}</span></div>
              <div className="kv">
                <span className="k">Selfie</span>
                <span className="v">{emp.hasSelfie
                  ? <span style={{ color: 'var(--success-600)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}><Icons.Check size={12} /> Aanwezig</span>
                  : <span style={{ color: 'var(--error-600)' }}>Ontbreekt</span>
                }</span>
              </div>
              <div className="kv">
                <span className="k">Extra docs</span>
                <span className="v">{emp.extraDocs?.length ? emp.extraDocs.length + ' bijlage(n)' : 'Geen'}</span>
              </div>
              <div className="kv">
                <span className="k">Vier-ogen</span>
                <span className="v">{isVierOgen
                  ? <Badge kind="busy">Vereist</Badge>
                  : <Badge kind="done">Niet vereist</Badge>
                }</span>
              </div>
              <div className="kv">
                <span className="k">Status</span>
                <span className="v"><Badge kind="id" dot>In beoordeling</Badge></span>
              </div>
              <div className="kv">
                <span className="k">Geüpload</span>
                <span className="v" style={{ fontSize: 12 }}>{emp.uploaded ? fmtDateTime(emp.uploaded) : '—'}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* ====== Afwijzen modal ====== */}
      {panel === 'reject' && (
        <div className="modal-backdrop" onClick={() => setPanel(null)}>
          <div className="modal" style={{ width: 'min(660px, 100%)' }} onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <div>
                <h3>Document afwijzen</h3>
                <p>{emp.name} ontvangt automatisch een e-mail om opnieuw te uploaden.</p>
              </div>
              <button className="modal-close" onClick={() => setPanel(null)}><Icons.X size={16} /></button>
            </div>
            <div className="modal-body">
              <div className="field">
                <label>Categorie</label>
                <div style={{ display: 'grid', gap: 6 }}>
                  {REJECT_CATEGORIES.map(cat => (
                    <button
                      key={cat.key}
                      className={`reject-cat-btn ${rejectCat === cat.key ? 'selected' : ''}`}
                      onClick={() => { setRejectCat(cat.key); setRejectReason(''); }}
                    >
                      <div className="cat-icon">{catIcon(cat.key)}</div>
                      {cat.label}
                      {rejectCat === cat.key && (
                        <Icons.ChevRight size={14} style={{ marginLeft: 'auto', flexShrink: 0 }} />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {selectedCategory && (
                <div className="field">
                  <label>Reden</label>
                  <div className="reject-sub-list">
                    {selectedCategory.reasons.map(r => (
                      <label key={r} className={`reject-sub-item ${rejectReason === r ? 'selected' : ''}`}>
                        <input
                          type="radio"
                          name="reject_reason"
                          value={r}
                          checked={rejectReason === r}
                          onChange={() => setRejectReason(r)}
                        />
                        {r}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {rejectReason && (
                <div className="field">
                  <label>Toelichting <span style={{ fontWeight: 400, color: 'var(--fg-subtle)' }}>(optioneel)</span></label>
                  <textarea
                    className="textarea"
                    rows={2}
                    value={rejectNote}
                    onChange={e => setRejectNote(e.target.value)}
                    placeholder="Extra context voor de medewerker…"
                  />
                </div>
              )}

              {rejectReason && (
                <div className="field">
                  <label>Voorbeeld e-mail</label>
                  <div className="email-preview">
                    <div className="email-head">Aan · {emp.email || emp.name.toLowerCase().replace(/\s+/g, '.') + '@fooks.nl'}</div>
                    <div className="email-subject">Je identiteitsbewijs moet opnieuw worden geüpload</div>
                    <div className="email-body">{`Beste ${emp.name.split(' ')[0]},

We hebben je ID-document bekeken en kunnen het helaas niet goedkeuren.

Reden: ${rejectReason}.${rejectNote ? '\n\nToelichting: ' + rejectNote : ''}

Upload een nieuwe versie via de onderstaande link.

`}<a href="#">Opnieuw uploaden →</a>{`

Met vriendelijke groet,
Team Fooks Forward`}</div>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-foot">
              <button className="btn btn-ghost" onClick={() => setPanel(null)}>Terug</button>
              <button className="btn btn-danger" disabled={!rejectReason} onClick={handleReject}>
                <Icons.Send size={14} /> Afwijzen & verzenden
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====== Doorverwijzen modal ====== */}
      {panel === 'forward' && (
        <div className="modal-backdrop" onClick={() => setPanel(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <div>
                <h3>Doorverwijzen naar collega</h3>
                <p>De collega ontvangt {isVierOgen ? 'deze vier-ogen beoordeling' : 'deze beoordeling'} in hun wachtrij.</p>
              </div>
              <button className="modal-close" onClick={() => setPanel(null)}><Icons.X size={16} /></button>
            </div>
            <div className="modal-body">
              {isVierOgen && (
                <div className="vier-ogen-banner" style={{ marginBottom: 0 }}>
                  <Icons.Eye size={15} />
                  <span>
                    <strong>Vier-ogen casus</strong> — Doorverwijzen wordt geregistreerd als overdracht voor de {hasFirstApproval ? 'tweede' : 'eerste'} beoordeling.
                  </span>
                </div>
              )}
              <div className="field">
                <label>Doorverwijzen naar</label>
                <select className="select" value={colleague} onChange={e => setColleague(e.target.value)}>
                  <option value="">Kies een collega…</option>
                  {COLLEAGUES.map(c => (
                    <option key={c.id} value={c.id}>{c.name} — {c.role}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>Reden van doorverwijzing <span style={{ fontWeight: 400, color: 'var(--fg-subtle)' }}>(optioneel)</span></label>
                <textarea
                  className="textarea"
                  rows={3}
                  value={forwardNote}
                  onChange={e => setForwardNote(e.target.value)}
                  placeholder="Bijv. specialistische controle nodig, medewerker kent de taal…"
                />
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

// ---------- Screen 4: TWV dossier detail ----------
function TwvDossierDetail({ dossierId, onNavigate, toast }) {
  const { TWV_DOSSIERS, TWV_HISTORY, fmtDate, fmtDateTime } = window.AppData;

  const allDossiers = Object.values(TWV_DOSSIERS).flat();
  const dossier = allDossiers.find(d => d.id === dossierId);
  const history = TWV_HISTORY[dossierId] || [];

  if (!dossier) return (
    <>
      <Breadcrumb items={[
        { label: 'Home', route: 'dashboard' },
        { label: 'Medewerker Onboardingen', route: 'onboarding' },
        { label: 'TWV-statussen', route: 'onboarding-twv' },
      ]} onNavigate={onNavigate} />
      <div className="empty">Dossier niet gevonden.</div>
    </>
  );

  const statusBadge = (status) => {
    if (status === 'Goedgekeurd') return <Badge kind="done" dot>{status}</Badge>;
    if (status === 'Afgekeurd')   return <Badge kind="revoked" dot>{status}</Badge>;
    return <Badge kind="twv" dot>{status}</Badge>;
  };

  return (
    <>
      <Breadcrumb items={[
        { label: 'Home', route: 'dashboard' },
        { label: 'Medewerker Onboardingen', route: 'onboarding' },
        { label: 'TWV-statussen', route: 'onboarding-twv' },
        { label: dossier.medewerker },
      ]} onNavigate={onNavigate} />

      <PageHead
        title={dossier.medewerker}
        subtitle={`${dossier.werkgever} · ${dossier.type}`}
        actions={<>
          <button className="btn btn-outline"><Icons.MoreHoriz size={16} /></button>
          <button className="btn btn-primary" onClick={() => toast && toast('Actie geregistreerd', 'ok')}>
            <Icons.Check size={16} /> Actie voltooien
          </button>
        </>}
      />

      <div className="detail-grid">
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <section className="card card-pad sub-card">
            <h3>Statusgeschiedenis</h3>
            {history.length === 0 ? (
              <div className="empty">Geen historiegegevens beschikbaar voor dit dossier.</div>
            ) : (
              <div className="audit-trail">
                {history.map((h, i) => (
                  <div key={i} className="audit-item">
                    <div className="audit-dot" />
                    <div className="audit-content">
                      <div className="audit-status">{h.status}</div>
                      <div className="audit-meta">{fmtDate(h.datum)} · {h.door}</div>
                      {h.note && <div className="audit-note">{h.note}</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="card card-pad sub-card">
            <h3>Acties</h3>
            <div className="action-list">
              <button className="action-btn"><Icons.Upload size={18} /> Document uploaden</button>
              <button className="action-btn"><Icons.Bell size={18} /> Herinnering sturen</button>
              <button className="action-btn"><Icons.Mail size={18} /> E-mail versturen</button>
              <button className="action-btn danger"><Icons.X size={18} /> Dossier intrekken</button>
            </div>
          </section>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <section className="card card-pad sub-card">
            <h3>Dossiergegevens</h3>
            <div className="kv-list">
              <div className="kv"><span className="k">Medewerker</span><span className="v">{dossier.medewerker}</span></div>
              <div className="kv"><span className="k">Werkgever</span><span className="v">{dossier.werkgever}</span></div>
              <div className="kv"><span className="k">Type</span><span className="v">{dossier.type}</span></div>
              <div className="kv"><span className="k">Status</span><span className="v">{statusBadge(dossier.status)}</span></div>
              <div className="kv"><span className="k">Aangemaakt</span><span className="v">{fmtDate(dossier.aangemaakt)}</span></div>
              <div className="kv"><span className="k">Ingediend door</span><span className="v">{dossier.ingedienddoor}</span></div>
              {dossier.geldigTot && (
                <div className="kv"><span className="k">Geldig tot</span><span className="v">{fmtDate(dossier.geldigTot)}</span></div>
              )}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

// ---------- Screen 4: TWV-statussen (list) ----------
function TwvStatussen({ onNavigate, onOpenDossier }) {
  const { TWV_DOSSIERS, fmtDate } = window.AppData;
  const tabs = ['Actie Fooks', 'Actie UWV', 'Actie Medewerker', 'Afgerond', 'Afgekeurd'];
  const [active, setActive] = useStateId('Actie Fooks');

  const rows = TWV_DOSSIERS[active] || [];

  return (
    <>
      <Breadcrumb items={[
        { label: 'Home', route: 'dashboard' },
        { label: 'Medewerker Onboardingen', route: 'onboarding' },
        { label: 'TWV-statussen' },
      ]} onNavigate={onNavigate} />

      <PageHead
        title="TWV-statussen"
        subtitle="Tewerkstellingsvergunningen beheren"
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
              <tr
                key={d.id}
                className="clickable"
                onClick={() => onOpenDossier && onOpenDossier(d.id)}
              >
                <td>
                  <div className="cell-name">
                    <div className="avatar">{window.AppData.initialsOf(d.medewerker)}</div>
                    <span>{d.medewerker}</span>
                  </div>
                </td>
                <td>{d.type}</td>
                <td>
                  {d.status === 'Goedgekeurd' ? <Badge kind="done" dot>{d.status}</Badge>
                   : d.status === 'Afgekeurd'  ? <Badge kind="revoked" dot>{d.status}</Badge>
                   : <Badge kind="twv" dot>{d.status}</Badge>}
                </td>
                <td>{d.geldigTot ? fmtDate(d.geldigTot) : '—'}</td>
                <td style={{ color: 'var(--fg)', fontSize: 13 }}>{fmtDate(d.aangemaakt)}</td>
                <td><Icons.ChevRight size={16} style={{ color: 'var(--gray-400)' }} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

// ---------- Fallback stub ----------
function Stub({ title, onNavigate }) {
  return (
    <>
      <Breadcrumb items={[{ label: 'Home', route: 'dashboard' }, { label: title }]} onNavigate={onNavigate} />
      <PageHead title={title} subtitle="Deze sectie valt buiten de scope van dit prototype." />
      <div className="card card-pad-lg">
        <EmptyState icon={Icons.Sparkles} title={`${title} — placeholder`}>
          Een productieversie van deze pagina is beschikbaar in het volledige portaal.
        </EmptyState>
      </div>
    </>
  );
}

Object.assign(window, { IdReviewList, IdReviewDetail, TwvDossierDetail, TwvStatussen, Stub });
