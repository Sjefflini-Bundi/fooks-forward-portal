/* Dynamic sample data — all numbers are placeholders; live data replaces these */
/* global React */

// Generate timestamps relative to "now" so ages feel real
const daysAgo = (d) => {
  const t = new Date();
  t.setDate(t.getDate() - d);
  return t;
};
const hoursAgo = (h) => {
  const t = new Date();
  t.setHours(t.getHours() - h);
  return t;
};
const fmtDate = (d) => d.toLocaleDateString('nl-NL', { day: '2-digit', month: 'short', year: 'numeric' });
const fmtDateTime = (d) => d.toLocaleDateString('nl-NL', { day: '2-digit', month: '2-digit', year: 'numeric' }) + ' ' + d.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });

// --- Four-eyes rule (mirrors determineFourEyesRequired in src/lib/fourEyes.ts) ---
const CARIBBEAN_BIRTH_PLACES = [
  'bonaire', 'sint eustatius', 'saba',
  'aruba', 'curacao', 'curaçao',
  'sint maarten', 'st maarten', 'st. maarten',
];
function determineFourEyesRequired(nationality, birthPlace) {
  const nat = (nationality || '').trim().toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
  const bp  = (birthPlace  || '').trim().toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
  const isDutch = nat === 'nederlands' || nat === 'nl' || nat === 'dutch';
  if (!isDutch) return true;
  if (CARIBBEAN_BIRTH_PLACES.some(c => bp.includes(c))) return true;
  return false;
}

const PHASES = {
  invited:  { label: 'Uitgenodigd',   badge: 'badge-invited', stat: 'stat--invited' },
  busy:     { label: 'Bezig',         badge: 'badge-busy',    stat: 'stat--busy' },
  id:       { label: 'ID beoordelen', badge: 'badge-id',      stat: 'stat--id' },
  twv:      { label: 'TWV',           badge: 'badge-twv',     stat: 'stat--twv' },
  done:     { label: 'Voltooid',      badge: 'badge-done',    stat: 'stat--done' },
  revoked:  { label: 'Ingetrokken',   badge: 'badge-revoked', stat: 'stat--revoked' },
};

// Current user (operator) — used by four-eyes anti-collusion check
const CURRENT_USER = { id: 'me', name: 'Jij (Merel Groen)' };

// Employees (realistic names spanning phases)
const EMPLOYEES = [
  {
    id: 'e1', name: 'Aylin Yıldız', employer: 'Brasserie De Waag', phase: 'id',
    status: 'Wachtend op tweede beoordeling', nationality: 'Turks', birthPlace: 'Istanbul',
    docType: 'Paspoort', uploaded: daysAgo(20), hasSelfie: true,
    dob: '14-03-1998', docNumber: 'NX1782354', validUntil: '22-08-2029',
    bsn: '123 45 6789', ocrName: 'Aylin Yıldız',
    firstApprovedBy: 'Thijs Hoekstra', firstApprovedById: 'c2', firstApprovedAt: daysAgo(2),
    extraDocs: ['Verblijfsvergunning'],
    role: 'Bediening', startDate: daysAgo(-7), hoursPerWeek: 24, salary: 14.75,
    email: 'aylin.yildiz@fooks.nl', phone: '06 12 34 56 78',
    idReviewedCount: 1, idReviewedTotal: 2,
  },
  {
    id: 'e2', name: 'Kwame Mensah', employer: 'Hotel Nieuwpoort', phase: 'id',
    status: 'Doorverwezen — vier-ogen casus', nationality: 'Ghanees', birthPlace: 'Accra',
    docType: 'Verblijfsdocument', uploaded: daysAgo(12), hasSelfie: true,
    dob: '02-11-1995', docNumber: 'V827165', validUntil: '15-02-2027',
    bsn: '234 56 7890', ocrName: 'Kwame Mensah',
    referredTo: 'me', referredBy: 'Saskia de Wit', referredAt: daysAgo(1),
    extraDocs: ['BSN-bewijs', 'Werkvergunning'],
    role: 'Afwas', startDate: daysAgo(-14), hoursPerWeek: 32, salary: 13.27,
    email: 'kwame.mensah@fooks.nl', phone: '06 98 76 54 32',
  },
  {
    id: 'e3', name: 'Sanne de Vries', employer: 'Grand Café Central', phase: 'id',
    status: 'Wachtend op beoordeling', nationality: 'Nederlands', birthPlace: 'Utrecht',
    docType: 'ID-kaart', uploaded: daysAgo(5), hasSelfie: true,
    dob: '30-07-2001', docNumber: 'IK82716A', validUntil: '11-06-2031',
    bsn: '345 67 8901', ocrName: 'Sanne de Vries',
    role: 'Bediening', startDate: daysAgo(-21), hoursPerWeek: 16, salary: 13.27,
    email: 'sanne.de.vries@fooks.nl', phone: '06 11 22 33 44',
  },
  {
    id: 'e4', name: 'Mateusz Kowalski', employer: 'Restaurant De Molen', phase: 'id',
    status: 'Wachtend op beoordeling', nationality: 'Pools', birthPlace: 'Kraków',
    docType: 'Paspoort', uploaded: daysAgo(3), hasSelfie: false,
    dob: '19-05-1990', docNumber: 'EA9128374', validUntil: '03-03-2030',
    bsn: '456 78 9012', ocrName: 'Matheusz Kowalski', // OCR typo triggers mismatch
    role: 'Kok', startDate: daysAgo(-3), hoursPerWeek: 38, salary: 17.50,
    email: 'mateusz.kowalski@fooks.nl', phone: '06 55 44 33 22',
  },
  {
    id: 'e5', name: 'Fatima El Amrani', employer: 'Lunchroom Koffietijd', phase: 'id',
    status: 'Wachtend op beoordeling', nationality: 'Marokkaans', birthPlace: 'Rabat',
    docType: 'Verblijfsdocument', uploaded: hoursAgo(6), hasSelfie: true,
    dob: '08-09-1996', docNumber: 'V991827', validUntil: '28-12-2026',
    bsn: '567 89 0123', ocrName: 'Fatima El Amrani',
    extraDocs: ['BSN-bewijs'],
    role: 'Bediening', startDate: daysAgo(-30), hoursPerWeek: 20, salary: 13.27,
    email: 'fatima.elamrani@fooks.nl', phone: '06 77 88 99 00',
  },
  {
    id: 'e5b', name: 'Oleksandr Tkachenko', employer: 'Grand Café Central', phase: 'id',
    status: 'Wachtend op beoordeling', nationality: 'Oekraïens', birthPlace: 'Lviv',
    docType: 'Paspoort', uploaded: hoursAgo(18), hasSelfie: true,
    dob: '27-02-1992', docNumber: 'FA7821994', validUntil: '09-11-2028',
    bsn: '678 90 1234', ocrName: 'Oleksandr Tkachenko',
    extraDocs: ['Oekraïne-stempel'],
    role: 'Afwas', startDate: daysAgo(-10), hoursPerWeek: 30, salary: 13.50,
    email: 'oleksandr.tkachenko@fooks.nl', phone: '06 21 43 65 87',
  },
  {
    id: 'e5c', name: 'Miguel Santos', employer: 'Hotel Nieuwpoort', phase: 'id',
    status: 'Wachtend op beoordeling', nationality: 'Nederlands', birthPlace: 'Willemstad, Curaçao',
    docType: 'Paspoort', uploaded: daysAgo(2), hasSelfie: true,
    dob: '15-08-1989', docNumber: 'NF9182736', validUntil: '04-05-2030',
    bsn: '789 01 2345', ocrName: 'Miguel Santos',
    role: 'Receptie', startDate: daysAgo(-5), hoursPerWeek: 36, salary: 16.25,
    email: 'miguel.santos@fooks.nl', phone: '06 31 42 53 64',
  },

  // Uitgenodigd
  ...['Jasper Bakker','Lisa Jansen','Ricardo Silva','Emma Visser','Daan Mulder','Noa van Dijk','Oluwaseun Adeyemi','Pieter Smit','Anouk de Groot','Jeroen Peters','Youssef Haddad','Sofía Ramírez']
    .map((name, i) => ({
      id: `e-inv-${i}`, name,
      employer: ['Brasserie De Waag','Hotel Nieuwpoort','Grand Café Central','Restaurant De Molen','Lunchroom Koffietijd'][i % 5],
      phase: 'invited', status: 'Uitnodiging verzonden',
      nationality: ['Nederlands','Nederlands','Portugees','Nederlands','Nederlands','Nederlands','Nigeriaans','Nederlands','Nederlands','Nederlands','Syrisch','Spaans'][i],
      birthPlace: '-', docType: '-', uploaded: null, hasSelfie: false,
      invitedAt: daysAgo(i + 1),
      email: name.toLowerCase().replace(/\s+/g,'.').replace(/[áéíóú]/g,m=>({á:'a',é:'e',í:'i',ó:'o',ú:'u'}[m])) + '@fooks.nl',
    })),

  // Bezig
  { id: 'e18', name: 'Timo van den Berg', employer: 'Grand Café Central', phase: 'busy', status: 'Gegevens invullen (stap 3)', nationality: 'Nederlands', birthPlace: 'Amsterdam', docType: '-', uploaded: null, hasSelfie: false, email: 'timo.van.den.berg@fooks.nl' },
  { id: 'e19', name: 'Dewi Hartono', employer: 'Restaurant De Molen', phase: 'busy', status: 'Contract ondertekenen (stap 7)', nationality: 'Indonesisch', birthPlace: 'Jakarta', docType: '-', uploaded: null, hasSelfie: false, role: 'Bediening', startDate: daysAgo(-5), hoursPerWeek: 28, salary: 14.00, email: 'dewi.hartono@fooks.nl' },

  // TWV-fase (contract ondertekend, wachten op TWV)
  { id: 'e-twv-1', name: 'Oluwaseun Adeyemi', employer: 'Hotel Nieuwpoort', phase: 'twv', status: 'TWV in behandeling bij UWV', nationality: 'Nigeriaans', birthPlace: 'Lagos', docType: 'Paspoort', uploaded: daysAgo(33), hasSelfie: true, dob: '12-06-1993', docNumber: 'A04827165', validUntil: '03-09-2029', bsn: '890 12 3456', role: 'Keuken', startDate: daysAgo(-45), hoursPerWeek: 40, salary: 15.50, email: 'oluwaseun.adeyemi@fooks.nl' },
  { id: 'e-twv-2', name: 'Youssef Haddad', employer: 'Brasserie De Waag', phase: 'twv', status: 'Documenten van medewerker vereist', nationality: 'Syrisch', birthPlace: 'Aleppo', docType: 'Paspoort', uploaded: daysAgo(18), hasSelfie: true, dob: '22-03-1988', docNumber: 'N7281938', validUntil: '01-12-2028', bsn: '901 23 4567', role: 'Afwas', startDate: daysAgo(-20), hoursPerWeek: 32, salary: 13.50, email: 'youssef.haddad@fooks.nl' },

  // Afgerond
  { id: 'e20', name: 'Bram Schouten', employer: 'Brasserie De Waag', phase: 'done', status: 'Onboarding afgerond', nationality: 'Nederlands', birthPlace: 'Rotterdam', docType: 'ID-kaart', uploaded: daysAgo(45), hasSelfie: true, email: 'bram.schouten@fooks.nl' },
  { id: 'e21', name: 'Iris van Leeuwen', employer: 'Hotel Nieuwpoort', phase: 'done', status: 'Onboarding afgerond', nationality: 'Nederlands', birthPlace: 'Den Haag', docType: 'ID-kaart', uploaded: daysAgo(38), hasSelfie: true, email: 'iris.vanleeuwen@fooks.nl' },
  { id: 'e22', name: 'Martijn de Bruin', employer: 'Grand Café Central', phase: 'done', status: 'Onboarding afgerond', nationality: 'Nederlands', birthPlace: 'Eindhoven', docType: 'Paspoort', uploaded: daysAgo(52), hasSelfie: true, email: 'martijn.debruin@fooks.nl' },
  { id: 'e23', name: 'Zara Khan', employer: 'Restaurant De Molen', phase: 'done', status: 'Onboarding afgerond', nationality: 'Brits', birthPlace: 'London', docType: 'Paspoort', uploaded: daysAgo(60), hasSelfie: true, email: 'zara.khan@fooks.nl' },
  { id: 'e24', name: 'Lucas Vermeer', employer: 'Lunchroom Koffietijd', phase: 'done', status: 'Onboarding afgerond', nationality: 'Nederlands', birthPlace: 'Groningen', docType: 'ID-kaart', uploaded: daysAgo(29), hasSelfie: true, email: 'lucas.vermeer@fooks.nl' },
];

// Fill 'done' bucket to a realistic count
while (EMPLOYEES.filter(e => e.phase === 'done').length < 14) {
  const n = EMPLOYEES.filter(e => e.phase === 'done').length + 1;
  EMPLOYEES.push({
    id: `e-done-${n}`, name: `Medewerker ${n}`, employer: 'Diverse werkgevers',
    phase: 'done', status: 'Onboarding afgerond', nationality: 'Nederlands', birthPlace: 'Nederland',
    docType: 'ID-kaart', uploaded: daysAgo(30 + n), hasSelfie: true,
  });
}

// Compute four-eyes flag + wait time for every employee
EMPLOYEES.forEach(e => {
  e.fourEyesRequired = determineFourEyesRequired(e.nationality, e.birthPlace);
  if (e.uploaded) {
    const diffMs = Date.now() - e.uploaded.getTime();
    e.waitHours = Math.round(diffMs / 36e5);
    e.waitDays  = Math.floor(diffMs / 864e5);
  } else {
    e.waitHours = 0;
    e.waitDays = 0;
  }
});

const phaseCount = (phase) => EMPLOYEES.filter(e => e.phase === phase).length;

// Pending ID review = all in 'id' phase; referred-to-me + vier-ogen first, then by wait
const ID_QUEUE = EMPLOYEES
  .filter(e => e.phase === 'id')
  .sort((a, b) => {
    const aRef = a.referredTo === 'me' ? 1 : 0;
    const bRef = b.referredTo === 'me' ? 1 : 0;
    if (aRef !== bRef) return bRef - aRef;
    const aFe = a.fourEyesRequired ? 1 : 0;
    const bFe = b.fourEyesRequired ? 1 : 0;
    if (aFe !== bFe) return bFe - aFe;
    return b.waitDays - a.waitDays;
  });

// TWV dossiers (empty default in 'Actie Fooks')
const TWV_DOSSIERS = {
  'Actie Fooks': [],
  'Actie UWV': [
    { id: 'tw1', employeeId: 'e-twv-1', medewerker: 'Oluwaseun Adeyemi', werkgever: 'Hotel Nieuwpoort', type: 'Nieuwe aanvraag', status: 'In behandeling bij UWV', geldigTot: null, aangemaakt: daysAgo(33), ingedienddoor: 'Saskia de Wit' },
    { id: 'tw2', employeeId: 'e-twv-2', medewerker: 'Youssef Haddad', werkgever: 'Brasserie De Waag', type: 'Verlenging', status: 'In behandeling bij UWV', geldigTot: daysAgo(-90), aangemaakt: daysAgo(45), ingedienddoor: 'Merel Groen' },
  ],
  'Actie Medewerker': [
    { id: 'tw3', employeeId: 'e-twv-2', medewerker: 'Youssef Haddad', werkgever: 'Brasserie De Waag', type: 'Nieuwe aanvraag', status: 'Documenten ontbreken', geldigTot: null, aangemaakt: daysAgo(6), ingedienddoor: 'Thijs Hoekstra' },
  ],
  'Afgerond': [
    { id: 'tw4', employeeId: 'e1', medewerker: 'Aylin Yıldız', werkgever: 'Brasserie De Waag', type: 'Verlenging', status: 'Goedgekeurd', geldigTot: daysAgo(-730), aangemaakt: daysAgo(120), ingedienddoor: 'Saskia de Wit' },
    { id: 'tw5', employeeId: 'e23', medewerker: 'Zara Khan', werkgever: 'Restaurant De Molen', type: 'Nieuwe aanvraag', status: 'Goedgekeurd', geldigTot: daysAgo(-365), aangemaakt: daysAgo(200), ingedienddoor: 'Bas Kuiper' },
  ],
  'Afgekeurd': [
    { id: 'tw6', employeeId: 'e-twv-1', medewerker: 'Ricardo Silva', werkgever: 'Grand Café Central', type: 'Nieuwe aanvraag', status: 'Afgekeurd', geldigTot: null, aangemaakt: daysAgo(75), ingedienddoor: 'Merel Groen' },
  ],
};

// Status history per dossier (audit trail)
const TWV_HISTORY = {
  tw1: [
    { status: 'Aangevraagd',          datum: daysAgo(33), door: 'Saskia de Wit', note: 'Aanvraag ingediend bij UWV' },
    { status: 'In behandeling bij UWV', datum: daysAgo(30), door: 'Systeem',      note: 'Ontvangstbevestiging binnen' },
  ],
  tw2: [
    { status: 'Aangevraagd',          datum: daysAgo(45), door: 'Merel Groen',   note: 'Verlengingsaanvraag' },
    { status: 'Aanvullende info',     datum: daysAgo(38), door: 'UWV',           note: 'Verzoek om loonstroken' },
    { status: 'In behandeling bij UWV', datum: daysAgo(31), door: 'Merel Groen',   note: 'Loonstroken verzonden' },
  ],
  tw3: [
    { status: 'Aangevraagd',          datum: daysAgo(12), door: 'Thijs Hoekstra', note: 'Initiële aanvraag' },
    { status: 'Documenten ontbreken', datum: daysAgo(6),  door: 'UWV',            note: 'Paspoortkopie onduidelijk — opnieuw uploaden' },
  ],
};

const COLLEAGUES = [
  { id: 'c1', name: 'Merel Groen',    role: 'Senior Compliance' },
  { id: 'c2', name: 'Thijs Hoekstra', role: 'Team lead' },
  { id: 'c3', name: 'Saskia de Wit',  role: 'Compliance' },
  { id: 'c4', name: 'Bas Kuiper',     role: 'Backoffice' },
];

// Categorised reject reasons (match spec: onleesbaar / verlopen / verkeerd document / fraude-vermoeden / overig)
const REJECT_CATEGORIES = [
  { key: 'onleesbaar', label: 'Onleesbaar / onscherp',
    reasons: ['Foto onscherp of onleesbaar', 'Document niet volledig zichtbaar (hoeken/randen)', 'Slechte belichting of reflectie'] },
  { key: 'verlopen',   label: 'Document verlopen',
    reasons: ['Document verlopen', 'Verblijfsvergunning verlopen', 'Werkvergunning verlopen'] },
  { key: 'verkeerd',   label: 'Verkeerd documenttype',
    reasons: ['Rijbewijs is geen geldig ID-document', 'Verkeerd documenttype voor deze nationaliteit', 'BSN-bewijs ontbreekt'] },
  { key: 'mismatch',   label: 'Gegevens komen niet overeen',
    reasons: ['Naam komt niet overeen met profiel', 'Geboortedatum wijkt af', 'Selfie komt niet overeen met pasfoto'] },
  { key: 'fraude',     label: 'Fraude-vermoeden',
    reasons: ['Document lijkt gemanipuleerd', 'Afwijkende lettertypen of veiligheidskenmerken', 'Meerdere accounts met zelfde document'] },
  { key: 'overig',     label: 'Overig',
    reasons: ['Overig — zie toelichting'] },
];

// Flat list for backward compat
const REJECT_REASONS = REJECT_CATEGORIES.flatMap(c => c.reasons);

function initialsOf(name) {
  return name.split(' ').filter(Boolean).slice(0, 2).map(s => s[0]).join('').toUpperCase();
}

function waitLabel(e) {
  if (!e.uploaded) return '—';
  if (e.waitDays === 0) return `${e.waitHours} uur`;
  if (e.waitDays < 7)   return `${e.waitDays} ${e.waitDays === 1 ? 'dag' : 'dagen'}`;
  const w = Math.floor(e.waitDays / 7);
  return `${w} ${w === 1 ? 'week' : 'weken'}`;
}

function waitBadgeClass(e) {
  const days = typeof e === 'object' ? e.waitDays : e;
  if (days <= 3) return 'badge-wait-low';
  if (days <= 10) return 'badge-wait-mid';
  return 'badge-wait-high';
}

// Cosigning checklist derivation
function cosignChecklist(emp) {
  const twvs = Object.values(TWV_DOSSIERS).flat().filter(d => d.employeeId === emp.id);
  const twvApproved = twvs.length > 0 ? twvs.every(d => d.status === 'Goedgekeurd') : !needsTwv(emp);
  const idApproved = emp.phase === 'done' || emp.phase === 'twv';
  const contractSigned = emp.phase === 'done' || emp.phase === 'twv';
  return [
    { key: 'reg',      label: 'Registratie voltooid',       done: true,            hint: 'Account aangemaakt en persoonsgegevens ingevuld.' },
    { key: 'id',       label: 'ID-document goedgekeurd',     done: idApproved,      hint: idApproved ? 'Alle ID-beoordelingen afgerond.' : 'Wacht op goedkeuring in ID-beoordelingen.' },
    { key: 'contract', label: 'Contract ondertekend',        done: contractSigned,  hint: contractSigned ? 'Handtekening ontvangen via signature canvas.' : 'Medewerker heeft contract nog niet ondertekend.' },
    { key: 'twv',      label: 'TWV goedgekeurd (indien vereist)', done: twvApproved, hint: needsTwv(emp) ? (twvApproved ? 'Alle TWV-dossiers zijn goedgekeurd.' : 'Minimaal één TWV-dossier staat nog niet op "Afgerond".') : 'Niet vereist voor deze medewerker.' },
  ];
}
function needsTwv(emp) {
  const eu = ['nederlands','pools','duits','spaans','portugees','italiaans','frans','belgisch','brits','iers','zweeds','deens','fins','oostenrijks','tsjechisch','slowaaks','hongaars','roemeens','bulgaars'];
  const nat = (emp.nationality || '').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu,'');
  return !eu.includes(nat);
}

window.AppData = {
  PHASES, EMPLOYEES, ID_QUEUE, TWV_DOSSIERS, TWV_HISTORY, COLLEAGUES,
  REJECT_CATEGORIES, REJECT_REASONS, CURRENT_USER,
  phaseCount, initialsOf, waitBadgeClass, waitLabel,
  fmtDate, fmtDateTime, daysAgo, hoursAgo,
  determineFourEyesRequired, cosignChecklist, needsTwv,
};
