/* global React, Icons */
const { useState } = React;

// Real Fooks logo — full wordmark + runner locked together
const FooksMark = () => (
  <img
    src="assets/fooks-logo.png"
    alt="Fooks"
    className="sidebar-logo-img"
    draggable="false"
  />
);

function Sidebar({ route, onNavigate, pendingIdCount }) {
  const [open, setOpen] = useState({
    support: false,
    onboardings: true,
    klanten: false,
    uren: false,
    verloning: false,
    instellingen: false,
  });

  const Item = ({ icon: Ic, label, active, onClick, badge, chev, expanded, subItem, disabled }) => (
    <button
      className={`nav-item ${active ? 'active' : ''} ${disabled ? 'disabled' : ''}`}
      onClick={disabled ? undefined : onClick}
      aria-expanded={chev != null ? !!expanded : undefined}
      disabled={disabled}
    >
      {Ic && <Ic className="nav-icon" size={18} />}
      {!Ic && subItem && <span className="nav-icon" />}
      <span className="nav-label">{label}</span>
      {badge != null && <span className="nav-badge">{badge}</span>}
      {chev && <Icons.ChevDown className="chev" size={14} />}
    </button>
  );

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <FooksMark />
      </div>

      <div className="sidebar-search">
        <div className="sidebar-search-inner">
          <Icons.Search />
          <input placeholder="Zoeken…" />
          <span className="kbd">⌘K</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <Item icon={Icons.Home} label="Dashboard" active={route === 'dashboard'} onClick={() => onNavigate('dashboard')} />

        <Item
          icon={Icons.LifeBuoy} label="Support" chev expanded={open.support}
          onClick={() => setOpen(o => ({ ...o, support: !o.support }))}
        />
        {open.support && (
          <div className="nav-sub">
            <Item subItem label="Openstaande tickets" active={route === 'support-open'} onClick={() => onNavigate('support-open')} />
            <Item subItem label="Kennisbank" active={route === 'support-kb'} onClick={() => onNavigate('support-kb')} />
          </div>
        )}

        <Item
          icon={Icons.UserPlus} label="Medewerker Onboardingen" chev expanded={open.onboardings}
          active={route === 'onboarding'}
          onClick={() => setOpen(o => ({ ...o, onboardings: !o.onboardings }))}
        />
        {open.onboardings && (
          <div className="nav-sub">
            <Item subItem label="Totaal overzicht" active={route === 'onboarding-totaal'} onClick={() => onNavigate('onboarding-totaal')} />
            <Item subItem label="ID-Beoordelingen" active={route === 'onboarding-id' || route === 'onboarding-id-review'} onClick={() => onNavigate('onboarding-id')} badge={pendingIdCount} />
            <Item subItem label="TWV-statussen" active={route === 'onboarding-twv'} onClick={() => onNavigate('onboarding-twv')} />
          </div>
        )}

        <Item icon={Icons.Briefcase} label="Klanten" active={route === 'klanten'} onClick={() => onNavigate('klanten')} />
        <Item icon={Icons.Users}     label="Medewerkers" active={route === 'medewerkers'} onClick={() => onNavigate('medewerkers')} />
        <Item icon={Icons.Clock}     label="Uren" active={route === 'uren'} onClick={() => onNavigate('uren')} />
        <Item icon={Icons.Wallet}    label="Verloningen" active={route === 'verloningen'} onClick={() => onNavigate('verloningen')} />
        <Item icon={Icons.AlertTri}  label="Uitval" active={route === 'uitval'} onClick={() => onNavigate('uitval')} />
        <Item icon={Icons.Settings}  label="Instellingen" active={route === 'instellingen'} onClick={() => onNavigate('instellingen')} />
      </nav>

      <div className="sidebar-support">
        <button className="close-x" aria-label="Sluiten"><Icons.X size={14} /></button>
        <h4>Hulp nodig?</h4>
        <p>Ons team staat voor je klaar.</p>
        <button className="sidebar-support-btn">
          <Icons.LifeBuoy size={14} /> Contact Support
        </button>
      </div>

      <div className="sidebar-user">
        <div className="avatar">MH</div>
        <div className="meta">
          <div className="name">Merel Hoekstra</div>
          <div className="email">merel@fooks.nl</div>
        </div>
        <button className="logout" title="Account"><Icons.ChevDown size={14} /></button>
      </div>
    </aside>
  );
}

function Breadcrumb({ items, onNavigate }) {
  return (
    <nav className="breadcrumb">
      {items.map((it, i) => (
        <React.Fragment key={i}>
          {i > 0 && <Icons.ChevRight className="sep" size={14} />}
          {i === items.length - 1
            ? <span className="current">{it.label}</span>
            : <button onClick={() => it.route && onNavigate(it.route)}>{it.label}</button>
          }
        </React.Fragment>
      ))}
    </nav>
  );
}

function PageHead({ title, subtitle, actions }) {
  return (
    <header className="page-head">
      <div>
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
      {actions && <div style={{ display: 'flex', gap: 10 }}>{actions}</div>}
    </header>
  );
}

function Badge({ kind = 'neutral', children, dot }) {
  return (
    <span className={`badge badge-${kind}`}>
      {dot && <span className="dot" />}
      {children}
    </span>
  );
}

function PhaseBadge({ phase }) {
  const p = window.AppData.PHASES[phase];
  if (!p) return null;
  const kind = p.badge.replace('badge-', '');
  return <Badge kind={kind} dot>{p.label}</Badge>;
}

function EmptyState({ icon: Ic = Icons.Inbox, title, children }) {
  return (
    <div className="empty-state">
      <Ic className="empty-icon" size={48} />
      <h4>{title}</h4>
      {children && <p>{children}</p>}
    </div>
  );
}

Object.assign(window, { Sidebar, Breadcrumb, PageHead, Badge, PhaseBadge, EmptyState });
