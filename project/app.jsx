/* global React, ReactDOM, Icons, Sidebar, Breadcrumb, PageHead, EmptyState,
          OnboardingLanding, TotaalOverzicht, EmployeeDetail,
          IdReviewList, IdReviewDetail, TwvDossierDetail, TwvStatussen, Stub */
const { useState: useStateApp, useEffect: useEffectApp } = React;

const TWEAKS_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "orange",
  "density": "comfortable"
}/*EDITMODE-END*/;

const ACCENTS = {
  orange: { '--cta-override': '#ff8100', '--cta-900-override': '#ff9a33' },
  teal:   { '--cta-override': '#0f9d8a', '--cta-900-override': '#17b9a2' },
  purple: { '--cta-override': '#615dff', '--cta-900-override': '#7773ff' },
};

function applyTweaks(t) {
  const root = document.documentElement;
  const ac = ACCENTS[t.accent] || ACCENTS.orange;
  root.style.setProperty('--cta', ac['--cta-override']);
  root.style.setProperty('--cta-900', ac['--cta-900-override']);
  document.body.dataset.density = t.density || 'comfortable';
}

function App() {
  const [route, setRoute] = useStateApp(() => {
    try { return localStorage.getItem('ff_route') || 'onboarding'; }
    catch { return 'onboarding'; }
  });
  const [employeeId, setEmployeeId] = useStateApp(null);
  const [twvDossierId, setTwvDossierId] = useStateApp(null);
  const [toasts, setToasts] = useStateApp([]);
  const [tweakMode, setTweakMode] = useStateApp(false);
  const [tweaks, setTweaks] = useStateApp(TWEAKS_DEFAULTS);

  useEffectApp(() => { applyTweaks(tweaks); }, [tweaks]);

  useEffectApp(() => { localStorage.setItem('ff_route', route); }, [route]);

  // --- Tweaks host protocol ---
  useEffectApp(() => {
    const onMsg = (ev) => {
      const d = ev.data || {};
      if (d.type === '__activate_edit_mode') setTweakMode(true);
      else if (d.type === '__deactivate_edit_mode') setTweakMode(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);

  const pushTweak = (patch) => {
    setTweaks(t => {
      const nxt = { ...t, ...patch };
      window.parent.postMessage({ type: '__edit_mode_set_keys', edits: patch }, '*');
      return nxt;
    });
  };

  // --- Toasts ---
  const toast = (msg, kind = 'ok') => {
    const id = Math.random().toString(36).slice(2);
    setToasts(list => [...list, { id, msg, kind }]);
    setTimeout(() => setToasts(list => list.filter(t => t.id !== id)), 2800);
  };

  const navigate = (r) => { setRoute(r); };
  const openEmployee = (id) => { setEmployeeId(id); setRoute('employee'); };
  const startReview  = (id) => { setEmployeeId(id); setRoute('onboarding-id-review'); };
  const openTwvDossier = (id) => { setTwvDossierId(id); setRoute('onboarding-twv-detail'); };
  const completeReview = (nextId) => {
    if (nextId) { setEmployeeId(nextId); setRoute('onboarding-id-review'); }
    else { setRoute('onboarding-id'); toast('Alle beoordelingen afgerond', 'ok'); }
  };

  let page;
  switch (route) {
    case 'onboarding':
    case 'onboarding-landing':
      page = <OnboardingLanding onNavigate={navigate} />; break;
    case 'onboarding-totaal':
      page = <TotaalOverzicht onNavigate={navigate} onOpenEmployee={openEmployee} />; break;
    case 'employee':
      page = <EmployeeDetail employeeId={employeeId} onNavigate={navigate} />; break;
    case 'onboarding-id':
      page = <IdReviewList onNavigate={navigate} onStartReview={startReview} />; break;
    case 'onboarding-id-review':
      page = <IdReviewDetail employeeId={employeeId} onNavigate={navigate} onCompleteReview={completeReview} toast={toast} />; break;
    case 'onboarding-twv':
      page = <TwvStatussen onNavigate={navigate} onOpenDossier={openTwvDossier} />; break;
    case 'onboarding-twv-detail':
      page = <TwvDossierDetail dossierId={twvDossierId} onNavigate={navigate} toast={toast} />; break;
    case 'dashboard':        page = <Stub title="Dashboard" onNavigate={navigate} />; break;
    case 'support-open':     page = <Stub title="Support — openstaande tickets" onNavigate={navigate} />; break;
    case 'support-kb':       page = <Stub title="Support — kennisbank" onNavigate={navigate} />; break;
    case 'klanten':          page = <Stub title="Klanten" onNavigate={navigate} />; break;
    case 'medewerkers':      page = <Stub title="Medewerkers" onNavigate={navigate} />; break;
    case 'uren':             page = <Stub title="Uren" onNavigate={navigate} />; break;
    case 'verloningen':      page = <Stub title="Verloningen" onNavigate={navigate} />; break;
    case 'uitval':           page = <Stub title="Uitval" onNavigate={navigate} />; break;
    case 'instellingen':     page = <Stub title="Instellingen" onNavigate={navigate} />; break;
    default:                 page = <OnboardingLanding onNavigate={navigate} />;
  }

  const pendingIdCount = window.AppData.phaseCount('id');

  return (
    <div className="app-root" data-screen-label="Fooks Forward Portal">
      <Sidebar route={route} onNavigate={navigate} pendingIdCount={pendingIdCount} />
      <main className="main">
        <div className="main-inner">
          {page}
        </div>
      </main>

      <div className="toast-wrap">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.kind}`}>
            {t.kind === 'ok' ? <Icons.Check size={14} /> : <Icons.AlertTri size={14} />}
            {t.msg}
          </div>
        ))}
      </div>

      {tweakMode && (
        <div className="tweaks-panel">
          <div className="tweaks-head">
            <span>Tweaks</span>
            <button
              className="logout"
              style={{ color: 'white', opacity: 0.8 }}
              onClick={() => setTweakMode(false)}
            ><Icons.X size={14} /></button>
          </div>
          <div className="tweaks-body">
            <div className="tweak-row">
              <label>Accent kleur</label>
              <div className="swatch-row">
                {Object.entries(ACCENTS).map(([k, v]) => (
                  <button
                    key={k}
                    className={`swatch ${tweaks.accent === k ? 'selected' : ''}`}
                    style={{ background: v['--cta-override'] }}
                    onClick={() => pushTweak({ accent: k })}
                    title={k}
                  />
                ))}
              </div>
            </div>
            <div className="tweak-row">
              <label>Dichtheid</label>
              <select className="select" value={tweaks.density} onChange={e => pushTweak({ density: e.target.value })}>
                <option value="comfortable">Comfortable</option>
                <option value="compact">Compact</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
