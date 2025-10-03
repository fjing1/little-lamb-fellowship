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
  const box = document.getElementById('verseBox');
  if (!box) return;
  
  // Show loading state
  box.textContent = 'Loading verse...';
  box.setAttribute('aria-live', 'polite');
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const res = await fetch('https://raw.githubusercontent.com/public-apis-demos/bible-votd/main/today.json', {
      cache: 'no-store',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    
    if (data.reference && data.text) {
      box.textContent = `${data.reference} — ${data.text}`;
    } else {
      throw new Error('Invalid data format');
    }
  } catch (e) {
    console.log('Verse loading failed:', e.message);
    box.textContent = "You matter. You're welcome here.";
  }
})();

// ============ Events & Home Updates ============
(async () => {
  const list = document.getElementById('eventList');
  const pastList = document.getElementById('pastEventList');
  const nextBox = document.getElementById('nextEvent');
  const homeUpdates = document.getElementById('homeUpdates');
  
  // Show loading states
  if (list) list.innerHTML = '<li class="muted loading">Loading events...</li>';
  if (pastList) pastList.innerHTML = '<li class="muted loading">Loading past events...</li>';
  if (homeUpdates) homeUpdates.innerHTML = '<li class="muted loading">Loading updates...</li>';
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const res = await fetch('data/events.json', {
      cache: 'no-store',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const items = await res.json();
    
    if (!Array.isArray(items)) throw new Error('Invalid data format');
    
    const now = new Date();
    const upcoming = items
      .filter(e => e.date && new Date(e.date) >= now)
      .sort((a,b) => new Date(a.date) - new Date(b.date));
    const past = items
      .filter(e => e.date && new Date(e.date) < now)
      .sort((a,b) => new Date(b.date) - new Date(a.date)); // Most recent first

    // Render next event on home with better error handling
    if (nextBox && upcoming[0]) {
      const n = upcoming[0];
      try {
        const when = new Date(n.date).toLocaleString([], {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit'
        });
        const signupBtn = n.signup_url ?
          ` · <a class="btn small" href="${escapeHtml(n.signup_url)}" target="_blank" rel="noopener">Sign up</a>` :
          '';
        nextBox.innerHTML = `<strong>Next up:</strong> ${escapeHtml(n.title)} — ${when} · ${escapeHtml(n.location || 'TBD')}${signupBtn}`;
      } catch (dateError) {
        nextBox.innerHTML = `<strong>Next up:</strong> ${escapeHtml(n.title)} — ${escapeHtml(n.location || 'TBD')}`;
      }
    }

    // Enhanced render function with better accessibility
    const render = (e) => {
      try {
        const when = new Date(e.date).toLocaleString([], {
          weekday: 'long',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit'
        });
        const meta = `${when} · ${escapeHtml(e.location || 'TBD')}`;
        const signupBtn = e.signup_url ?
          `<a class="btn" href="${escapeHtml(e.signup_url)}" target="_blank" rel="noopener">Sign up</a>` :
          '';
        return `<li class="card">
          <h3>${escapeHtml(e.title)}</h3>
          <p class="muted">${meta}</p>
          <p>${escapeHtml(e.excerpt || '')}</p>
          ${signupBtn}
        </li>`;
      } catch (renderError) {
        return `<li class="card">
          <h3>${escapeHtml(e.title)}</h3>
          <p class="muted">Date/time unavailable</p>
          <p>${escapeHtml(e.excerpt || '')}</p>
        </li>`;
      }
    };

    // Update DOM with proper fallbacks
    if (list) {
      list.innerHTML = upcoming.length > 0 ?
        upcoming.map(render).join('') :
        '<li class="muted">No upcoming events scheduled.</li>';
    }
    
    if (pastList) {
      pastList.innerHTML = past.length > 0 ?
        past.map(render).join('') :
        '<li class="muted">No past events to display.</li>';
    }

    // Enhanced "What's new" section
    if (homeUpdates) {
      const updates = upcoming.slice(0, 4).map(e => {
        try {
          const dateStr = new Date(e.date).toLocaleDateString();
          return `<li class="card">
            <strong>${escapeHtml(e.title)}</strong><br>
            <span class="muted">${dateStr}</span>
          </li>`;
        } catch {
          return `<li class="card">
            <strong>${escapeHtml(e.title)}</strong><br>
            <span class="muted">Date TBD</span>
          </li>`;
        }
      });
      homeUpdates.innerHTML = updates.length > 0 ?
        updates.join('') :
        '<li class="muted">No recent updates.</li>';
    }
    
  } catch (e) {
    console.error('Events loading failed:', e.message);
    const errorMsg = '<li class="muted">Could not load events. Please try again later.</li>';
    if (list) list.innerHTML = errorMsg;
    if (pastList) pastList.innerHTML = errorMsg;
    if (homeUpdates) homeUpdates.innerHTML = errorMsg;
  }
})();

// ============ Utility Functions ============
function escapeHtml(text) {
  if (typeof text !== 'string') return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ============ Songs (from data/songs.txt) ============
(async () => {
  const list = document.getElementById('songList');
  if (!list) return;
  
  const search = document.getElementById('songSearch');
  const btn = document.getElementById('downloadAll');
  
  // Show loading state
  list.innerHTML = '<li class="muted loading">Loading songs...</li>';

  const parseLine = (line) => {
    // Format: Title - tags | URL
    const [left, url] = line.split('|').map(s => s?.trim());
    if (!left || !url) return null;
    const [title, tagsPart] = left.split('-').map(s => s.trim());
    const tags = (tagsPart || '').split(',').map(s => s.trim()).filter(Boolean);
    return { title, tags, url };
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch('data/songs.txt', {
      cache: 'no-store',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const text = await response.text();
    const items = text.split(/\r?\n/).map(parseLine).filter(Boolean);

    const render = (it) => `<li class="card">
      <a href="${escapeHtml(it.url)}" target="_blank" rel="noopener">
        <strong>${escapeHtml(it.title)}</strong>
      </a>
      ${it.tags.length ? `<div class="muted small">#${it.tags.map(escapeHtml).join(' #')}</div>` : ''}
    </li>`;
    
    const update = () => {
      try {
        const q = (search?.value || '').toLowerCase();
        const filtered = items.filter(it =>
          [it.title, ...it.tags].join(' ').toLowerCase().includes(q)
        );
        list.innerHTML = filtered.length > 0 ?
          filtered.map(render).join('') :
          '<li class="muted">No songs match your search.</li>';
      } catch (e) {
        console.error('Search error:', e);
        list.innerHTML = '<li class="muted">Search error occurred.</li>';
      }
    };
    
    // Initial render
    update();
    
    // Add search functionality with debouncing
    let searchTimeout;
    search?.addEventListener('input', () => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(update, 300);
    });

    // Enhanced download functionality
    btn?.addEventListener('click', () => {
      try {
        const blob = new Blob([text], { type: 'text/plain' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'llf-songs.txt';
        a.click();
        URL.revokeObjectURL(a.href);
        
        // Show feedback
        const originalText = btn.textContent;
        btn.textContent = 'Downloaded!';
        btn.disabled = true;
        setTimeout(() => {
          btn.textContent = originalText;
          btn.disabled = false;
        }, 2000);
      } catch (e) {
        console.error('Download error:', e);
        alert('Download failed. Please try again.');
      }
    });
    
  } catch (e) {
    console.error('Songs loading failed:', e.message);
    list.innerHTML = '<li class="muted">Could not load songs. Please try again later.</li>';
    
    // Disable search and download if loading failed
    if (search) search.disabled = true;
    if (btn) btn.disabled = true;
  }
})();

// ============ Prayer form status (optional progressive enhancement) ============
(() => {
  const form = document.getElementById('prayForm'); if (!form) return;
  const status = document.getElementById('prayStatus');
  form.addEventListener('submit', () => { if (status) status.textContent = 'Sending…'; });
})();
