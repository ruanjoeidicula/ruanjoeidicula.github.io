/* ==========================================================================
   RUAN JOE IDICULA — DARK MODE & TECH (ASTROFY KIT) JAVASCRIPT
   Sidebar drawer, copy actions, interactive simulation & toast notifications
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMobileSidebar();
  initCopyActions();
  initArduinoTelemetry();
  initScratchGame();
  initContactForm();
  initScrollSpy();
});

/* Mobile Drawer Toggle */
function initMobileSidebar() {
  const toggleBtn = document.getElementById('sidebar-toggle');
  const sidebar = document.getElementById('sidebar-drawer');
  const backdrop = document.getElementById('sidebar-backdrop');
  const closeBtn = document.getElementById('sidebar-close');

  if (!toggleBtn || !sidebar) return;

  function openDrawer() {
    sidebar.classList.remove('-translate-x-full');
    backdrop.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
  }

  function closeDrawer() {
    sidebar.classList.add('-translate-x-full');
    backdrop.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  }

  toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  // Close on nav link click in mobile
  const navLinks = sidebar.querySelectorAll('a[href^="#"]');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 1024) closeDrawer();
    });
  });
}

/* Copy to Clipboard Actions */
function initCopyActions() {
  const copyBtns = document.querySelectorAll('[data-copy]');
  copyBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const text = btn.getAttribute('data-copy');
      navigator.clipboard.writeText(text).then(() => {
        showToast(`Copied to clipboard: ${text}`);
      }).catch(() => {
        showToast(`Selected: ${text}`);
      });
    });
  });
}

/* Toast Message */
function showToast(message) {
  let toast = document.getElementById('tech-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'tech-toast';
    toast.className = 'tech-toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<svg class="w-4 h-4 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> <span>${message}</span>`;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

/* Project 01: Arduino Telemetry Simulator */
function initArduinoTelemetry() {
  const gasFill = document.getElementById('tech-gauge-gas-fill');
  const gasVal = document.getElementById('tech-gauge-gas-val');
  const rainFill = document.getElementById('tech-gauge-rain-fill');
  const rainVal = document.getElementById('tech-gauge-rain-val');
  const tempFill = document.getElementById('tech-gauge-temp-fill');
  const tempVal = document.getElementById('tech-gauge-temp-val');
  const statusBadge = document.getElementById('tech-telemetry-status');
  const logBox = document.getElementById('tech-telemetry-log');
  const hazardBtn = document.getElementById('tech-btn-hazard');

  if (!gasFill || !hazardBtn) return;

  let isHazard = false;

  function appendLog(msg, type = 'info') {
    if (!logBox) return;
    const time = new Date().toLocaleTimeString('en-US', { hour12: false });
    const color = type === 'alert' ? 'text-red-400' : type === 'warn' ? 'text-amber-400' : 'text-slate-400';
    const p = document.createElement('p');
    p.className = `font-mono text-xs ${color}`;
    p.textContent = `[${time}] ${msg}`;
    logBox.prepend(p);
    if (logBox.children.length > 15) logBox.removeChild(logBox.lastChild);
  }

  function setSensors(gas, rain, temp) {
    if (gasFill && gasVal) {
      gasFill.style.width = `${Math.min(100, (gas / 600) * 100)}%`;
      gasVal.textContent = `${gas} PPM`;
      if (gas > 350) gasFill.className = 'h-full bg-red-500 transition-all duration-300';
      else gasFill.className = 'h-full bg-sky-400 transition-all duration-300';
    }
    if (rainFill && rainVal) {
      rainFill.style.width = `${rain}%`;
      rainVal.textContent = `${rain}%`;
      if (rain > 75) rainFill.className = 'h-full bg-red-500 transition-all duration-300';
      else rainFill.className = 'h-full bg-emerald-400 transition-all duration-300';
    }
    if (tempFill && tempVal) {
      tempFill.style.width = `${Math.min(100, (temp / 60) * 100)}%`;
      tempVal.textContent = `${temp.toFixed(1)} °C`;
      if (temp > 45) tempFill.className = 'h-full bg-red-500 transition-all duration-300';
      else tempFill.className = 'h-full bg-amber-400 transition-all duration-300';
    }
  }

  function loopTick() {
    if (isHazard) return;
    const g = Math.floor(90 + Math.random() * 40);
    const r = Math.floor(20 + Math.random() * 15);
    const t = 24.5 + Math.random() * 3.5;
    setSensors(g, r, t);
  }

  setInterval(loopTick, 3000);

  hazardBtn.addEventListener('click', () => {
    if (isHazard) {
      isHazard = false;
      statusBadge.textContent = 'NORMAL // MONITORING';
      statusBadge.className = 'px-2.5 py-1 text-xs font-mono font-medium rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30';
      hazardBtn.textContent = 'Simulate Hazard Condition';
      hazardBtn.className = 'w-full py-2 px-3 text-xs font-mono font-medium rounded bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/40 transition-colors';
      appendLog('Hazard cleared. Sensors returned to baseline.', 'info');
      loopTick();
    } else {
      isHazard = true;
      statusBadge.textContent = 'CRITICAL ALERT';
      statusBadge.className = 'px-2.5 py-1 text-xs font-mono font-medium rounded-full bg-red-500/20 text-red-400 border border-red-500/50 animate-pulse';
      hazardBtn.textContent = 'Reset Telemetry Sensors';
      hazardBtn.className = 'w-full py-2 px-3 text-xs font-mono font-medium rounded bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40 transition-colors';
      setSensors(490, 88, 52.0);
      appendLog('CRITICAL: Gas hazard threshold exceeded (> 450 PPM)!', 'alert');
      appendLog('ALERT: Water level / rain saturation reached 88%!', 'alert');
      appendLog('TRIGGER: Automated alert broadcasted to emergency relay.', 'warn');
    }
  });

  appendLog('Arduino I2C Telemetry Node online.', 'info');
  loopTick();
}

/* Project 03: Scratch Game Logic Grid */
function initScratchGame() {
  const board = document.getElementById('tech-game-board');
  const statusEl = document.getElementById('tech-game-status');
  const coordsEl = document.getElementById('tech-game-coords');
  if (!board) return;

  const SIZE = 5;
  let player = { x: 0, y: 0 };
  const goal = { x: 4, y: 4 };
  const obstacles = [{ x: 1, y: 1 }, { x: 2, y: 3 }, { x: 3, y: 1 }, { x: 1, y: 3 }];

  function draw() {
    board.innerHTML = '';
    for (let y = 0; y < SIZE; y++) {
      for (let x = 0; x < SIZE; x++) {
        const cell = document.createElement('div');
        cell.className = 'w-full aspect-square rounded flex items-center justify-center font-mono text-xs font-bold border transition-colors';

        const isPlayer = player.x === x && player.y === y;
        const isGoal = goal.x === x && goal.y === y;
        const isObs = obstacles.some(o => o.x === x && o.y === y);

        if (isPlayer) {
          cell.className += ' bg-sky-500 text-slate-900 border-sky-400 shadow-md shadow-sky-500/30';
          cell.textContent = '★';
        } else if (isGoal) {
          cell.className += ' bg-amber-500/20 text-amber-300 border-amber-500/40';
          cell.textContent = '◆';
        } else if (isObs) {
          cell.className += ' bg-slate-800 text-slate-500 border-slate-700';
          cell.textContent = '▲';
        } else {
          cell.className += ' bg-slate-900/60 text-slate-600 border-slate-800';
        }
        board.appendChild(cell);
      }
    }
    if (coordsEl) coordsEl.textContent = `(x: ${player.x}, y: ${player.y})`;
  }

  function move(dx, dy) {
    const nx = player.x + dx;
    const ny = player.y + dy;
    if (nx < 0 || nx >= SIZE || ny < 0 || ny >= SIZE) {
      if (statusEl) statusEl.textContent = 'Boundary limit reached.';
      return;
    }
    if (obstacles.some(o => o.x === nx && o.y === ny)) {
      if (statusEl) statusEl.textContent = 'Obstacle block encountered.';
      return;
    }
    player.x = nx;
    player.y = ny;
    draw();

    if (player.x === goal.x && player.y === goal.y) {
      if (statusEl) statusEl.innerHTML = '<span class="text-amber-400 font-bold">★ Treasure Unlocked! Foundational logic verified.</span>';
    } else {
      if (statusEl) statusEl.textContent = `Navigating coordinate grid...`;
    }
  }

  document.getElementById('tech-btn-up')?.addEventListener('click', () => move(0, -1));
  document.getElementById('tech-btn-down')?.addEventListener('click', () => move(0, 1));
  document.getElementById('tech-btn-left')?.addEventListener('click', () => move(-1, 0));
  document.getElementById('tech-btn-right')?.addEventListener('click', () => move(1, 0));
  document.getElementById('tech-btn-reset')?.addEventListener('click', () => {
    player = { x: 0, y: 0 };
    if (statusEl) statusEl.textContent = 'Grid reset. Use controls to reach treasure.';
    draw();
  });

  draw();
}

/* Quick Contact Mailto Form */
function initContactForm() {
  const form = document.getElementById('tech-contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('tech-name').value.trim();
    const subject = document.getElementById('tech-subject').value.trim();
    const message = document.getElementById('tech-message').value.trim();

    const mailto = `mailto:ruanjoeidicula@gmail.com?subject=${encodeURIComponent(`[Portfolio Tech Contact] ${subject} - ${name}`)}&body=${encodeURIComponent(`From: ${name}\n\n${message}`)}`;
    window.location.href = mailto;
    showToast('Launching email dispatch client...');
  });
}

/* Scroll Spy for Sidebar Navigation */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-menu-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const pos = window.scrollY + 150;
    sections.forEach(sec => {
      if (pos >= sec.offsetTop && pos < sec.offsetTop + sec.offsetHeight) {
        current = sec.getAttribute('id');
      }
    });

    links.forEach(link => {
      link.classList.remove('bg-slate-800', 'text-sky-400', 'font-semibold');
      link.classList.add('text-slate-400');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('bg-slate-800', 'text-sky-400', 'font-semibold');
        link.classList.remove('text-slate-400');
      }
    });
  }, { passive: true });
}
