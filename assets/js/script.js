// ============ Theme toggle ============
(() => {
  const root = document.documentElement;
  const key = 'llf-theme';
  const btn = document.getElementById('modeToggle');
  const set = m => { root.setAttribute('data-theme', m); localStorage.setItem(key, m); btn?.setAttribute('aria-pressed', String(m==='dark')); };
  set(localStorage.getItem(key) || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  btn?.addEventListener('click', () => set(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'));
})();

// ============ Active nav & footer year ============
(() => {
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a').forEach(a => {
    if (a.getAttribute('href') === path) a.classList.add('active');
  });
  const y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();
})();

// ============ QR Modal ============
(() => {
  const modal = document.getElementById('qrModal');
  document.getElementById('qrBtn')?.addEventListener('click', () => modal?.showModal());
  document.getElementById('qrClose')?.addEventListener('click', () => modal?.close());
})();

// ============ Verse of the day (best-effort) ============
(async () => {
  const box = document.getElementById('verseBox'); if (!box) return;
  try {
    const res = await fetch('https://raw.githubusercontent.com/public-apis-demos/bible-votd/main/today.json', {cache:'no-store'});
    if (!res.ok) throw new Error('Unavailable');
    const data = await res.json();
    box.textContent = `${data.reference} — ${data.text}`;
  } catch (e) {
    box.textContent = "You matter. You're welcome here.";
  }
})();

// ============ Events & Home Updates ============
(async () => {
  const list = document.getElementById('eventList');
  const pastList = document.getElementById('pastEventList');
  const nextBox = document.getElementById('nextEvent');
  const homeUpdates = document.getElementById('homeUpdates');
  try {
    const res = await fetch('data/events.json', {cache:'no-store'});
    const items = await res.json();
    const now = new Date();
    const upcoming = items.filter(e => new Date(e.date) >= now).sort((a,b)=> new Date(a.date)-new Date(b.date));
    const past = items.filter(e => new Date(e.date) < now).sort((a,b)=> new Date(a.date)-new Date(b.date));

    // render next event on home
    if (nextBox && upcoming[0]) {
      const n = upcoming[0];
      const when = new Date(n.date).toLocaleString([], {weekday:'long', month:'long', day:'numeric', hour:'numeric', minute:'2-digit'});
      nextBox.innerHTML = `<strong>Next up:</strong> ${n.title} — ${when} · ${n.location}${n.signup_url ? ` · <a class="btn small" href="${n.signup_url}">Sign up</a>`:''}`;
    }

    // render event pages
    const render = (e) => {
      const when = new Date(e.date).toLocaleString([], {weekday:'long', month:'short', day:'numeric', hour:'numeric', minute:'2-digit'});
      const meta = `${when} · ${e.location}`;
      return `<li class="card"><h3>${e.title}</h3><p class="muted">${meta}</p><p>${e.excerpt||''}</p>${e.signup_url?`<a class="btn" href="${e.signup_url}">Sign up</a>`:''}</li>`;
    };
    if (list) list.innerHTML = upcoming.map(render).join('') || '<li class="muted">No upcoming events</li>';
    if (pastList) pastList.innerHTML = past.reverse().map(render).join('') || '';

    // minimal "What's new" on home from events
    if (homeUpdates) homeUpdates.innerHTML = upcoming.slice(0,4).map(e => `<li class="card"><strong>${e.title}</strong><br><span class="muted">${new Date(e.date).toLocaleDateString()}</span></li>`).join('');
  } catch (e) {
    if (list) list.innerHTML = '<li class="muted">Could not load events.</li>';
  }
})();

// ============ Songs (from data/songs.txt) ============
(async () => {
  const list = document.getElementById('songList'); if (!list) return;
  const search = document.getElementById('songSearch');
  const btn = document.getElementById('downloadAll');

  const parseLine = (line) => {
    // Format: Title - tags | URL
    const [left, url] = line.split('|').map(s => s?.trim());
    if (!left || !url) return null;
    const [title, tagsPart] = left.split('-').map(s => s.trim());
    const tags = (tagsPart || '').split(',').map(s => s.trim()).filter(Boolean);
    return { title, tags, url };
  };

  const text = await (await fetch('data/songs.txt', {cache:'no-store'})).text();
  const items = text.split(/\\r?\\n/).map(parseLine).filter(Boolean);

  const render = (it) => `<li class="card"><a href="${it.url}" target="_blank" rel="noopener"><strong>${it.title}</strong></a>${it.tags.length?`<div class="muted small">#${it.tags.join(' #')}</div>`:''}</li>`;
  const update = () => {
    const q = (search.value || '').toLowerCase();
    const filtered = items.filter(it => [it.title, ...it.tags].join(' ').toLowerCase().includes(q));
    list.innerHTML = filtered.map(render).join('') || '<li class="muted">No matches</li>';
  };
  search?.addEventListener('input', update);
  update();

  btn?.addEventListener('click', () => {
    const blob = new Blob([text], {type:'text/plain'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'songs.txt';
    a.click();
    URL.revokeObjectURL(a.href);
  });
})();

// ============ Prayer form status (optional progressive enhancement) ============
(() => {
  const form = document.getElementById('prayForm'); if (!form) return;
  const status = document.getElementById('prayStatus');
  form.addEventListener('submit', () => { if (status) status.textContent = 'Sending…'; });
})();
