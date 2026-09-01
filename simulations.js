/* ==========================================================================
   RUAN JOE IDICULA — EDITORIAL PROJECT SIMULATIONS & INTERACTIVITY
   Interactive demonstrations for Arduino Telemetry & Scratch Game Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initArduinoSimulation();
  initFilmstripViewer();
  initScratchGameLogic();
});

/* ==========================================================================
   1. ARDUINO DISASTER PREDICTION & RESPONSE TELEMETRY SIMULATOR
   ========================================================================== */
function initArduinoSimulation() {
  const gasFill = document.getElementById('gauge-gas-fill');
  const gasVal = document.getElementById('gauge-gas-val');
  const rainFill = document.getElementById('gauge-rain-fill');
  const rainVal = document.getElementById('gauge-rain-val');
  const tempFill = document.getElementById('gauge-temp-fill');
  const tempVal = document.getElementById('gauge-temp-val');
  const statusBadge = document.getElementById('telemetry-status');
  const logBox = document.getElementById('telemetry-log');
  const hazardBtn = document.getElementById('btn-test-hazard');

  if (!gasFill || !hazardBtn) return;

  let isHazardActive = false;
  let intervalId = null;

  function appendLog(msg, type = 'info') {
    if (!logBox) return;
    const time = new Date().toLocaleTimeString('en-US', { hour12: false });
    const logLine = document.createElement('div');
    logLine.style.color = type === 'alert' ? '#F87171' : type === 'warn' ? '#FBBF24' : '#A0AEC0';
    logLine.textContent = `[${time}] ${msg}`;
    logBox.prepend(logLine);
    if (logBox.children.length > 20) {
      logBox.removeChild(logBox.lastChild);
    }
  }

  function updateSensors(gas, rain, temp) {
    if (gasFill && gasVal) {
      gasFill.style.width = `${Math.min(100, (gas / 600) * 100)}%`;
      gasVal.textContent = `${gas} PPM`;
      if (gas > 350) gasFill.classList.add('hazard');
      else gasFill.classList.remove('hazard');
    }

    if (rainFill && rainVal) {
      rainFill.style.width = `${rain}%`;
      rainVal.textContent = `${rain}%`;
      if (rain > 75) rainFill.classList.add('hazard');
      else rainFill.classList.remove('hazard');
    }

    if (tempFill && tempVal) {
      tempFill.style.width = `${Math.min(100, (temp / 60) * 100)}%`;
      tempVal.textContent = `${temp.toFixed(1)} °C`;
      if (temp > 45) tempFill.classList.add('hazard');
      else tempFill.classList.remove('hazard');
    }
  }

  function tickTelemetry() {
    if (isHazardActive) return;
    // Normal environmental fluctuation
    const gas = Math.floor(85 + Math.random() * 40);
    const rain = Math.floor(18 + Math.random() * 15);
    const temp = 24.5 + Math.random() * 3.5;
    updateSensors(gas, rain, temp);
  }

  intervalId = setInterval(tickTelemetry, 2500);

  hazardBtn.addEventListener('click', () => {
    if (isHazardActive) {
      // Reset to normal
      isHazardActive = false;
      statusBadge.textContent = 'SYSTEM NORMAL // MONITORING';
      statusBadge.className = 'telemetry-status-badge';
      hazardBtn.textContent = 'Simulate Hazard Event';
      hazardBtn.style.backgroundColor = '#D9381E';
      appendLog('Hazard cleared. Resetting telemetry threshold.', 'info');
      tickTelemetry();
    } else {
      // Trigger Hazard
      isHazardActive = true;
      statusBadge.textContent = 'CRITICAL ALERT // HAZARD DETECTED';
      statusBadge.className = 'telemetry-status-badge alert';
      hazardBtn.textContent = 'Clear Alert / Reset Sensors';
      hazardBtn.style.backgroundColor = '#10B981';

      // Spike sensor telemetry
      updateSensors(480, 88, 51.2);
      appendLog('CRITICAL: Gas/Smoke Spike detected > 450 PPM!', 'alert');
      appendLog('ALERT: Excessive moisture saturation > 85%!', 'alert');
      appendLog('TRIGGER: Automated siren & safety relay broadcasted.', 'warn');
    }
  });

  // Initial log
  appendLog('Arduino Telemetry Node online (Sensor I2C Bus ready).', 'info');
  tickTelemetry();
}

/* ==========================================================================
   2. CULTURAL FEST FILMSTRIP VIEWER
   ========================================================================== */
function initFilmstripViewer() {
  const cards = document.querySelectorAll('.film-frame-card');
  cards.forEach((card, idx) => {
    card.addEventListener('mouseenter', () => {
      card.style.borderColor = 'var(--accent-color)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.borderColor = 'var(--border-color)';
    });
  });
}

/* ==========================================================================
   3. SCRATCH TREASURE HUNT GAME LOGIC VISUALIZER
   ========================================================================== */
function initScratchGameLogic() {
  const board = document.getElementById('game-canvas-board');
  const statusEl = document.getElementById('game-status-text');
  const coordEl = document.getElementById('game-coords');
  if (!board) return;

  const GRID_SIZE = 5;
  let playerPos = { x: 0, y: 0 };
  const treasurePos = { x: 4, y: 4 };
  const obstacles = [
    { x: 1, y: 1 },
    { x: 2, y: 3 },
    { x: 3, y: 1 },
    { x: 1, y: 3 }
  ];

  function renderGrid() {
    board.innerHTML = '';
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const cell = document.createElement('div');
        cell.className = 'game-cell';

        const isPlayer = playerPos.x === x && playerPos.y === y;
        const isTreasure = treasurePos.x === x && treasurePos.y === y;
        const isObstacle = obstacles.some(o => o.x === x && o.y === y);

        if (isPlayer) {
          cell.classList.add('player');
          cell.textContent = '★';
          cell.title = 'Player Position';
        } else if (isTreasure) {
          cell.classList.add('treasure');
          cell.textContent = '◆';
          cell.title = 'Treasure Goal';
        } else if (isObstacle) {
          cell.classList.add('obstacle');
          cell.textContent = '▲';
          cell.title = 'Obstacle Block';
        } else {
          cell.textContent = '';
        }

        board.appendChild(cell);
      }
    }

    if (coordEl) {
      coordEl.textContent = `X: ${playerPos.x}, Y: ${playerPos.y}`;
    }
  }

  function move(dx, dy) {
    const newX = playerPos.x + dx;
    const newY = playerPos.y + dy;

    // Check boundaries
    if (newX < 0 || newX >= GRID_SIZE || newY < 0 || newY >= GRID_SIZE) {
      if (statusEl) statusEl.textContent = 'Boundary hit! Logic prevented off-grid movement.';
      return;
    }

    // Check obstacles
    if (obstacles.some(o => o.x === newX && o.y === newY)) {
      if (statusEl) statusEl.textContent = 'Obstacle encountered! Change direction.';
      return;
    }

    playerPos.x = newX;
    playerPos.y = newY;
    renderGrid();

    // Check win condition
    if (playerPos.x === treasurePos.x && playerPos.y === treasurePos.y) {
      if (statusEl) {
        statusEl.innerHTML = '<span style="color:var(--accent-color); font-weight:bold;">★ TREASURE UNLOCKED! Foundational logic verified.</span>';
      }
    } else {
      if (statusEl) {
        statusEl.textContent = `Navigating... Step logged at (${playerPos.x}, ${playerPos.y})`;
      }
    }
  }

  // Bind D-Pad buttons
  const btnUp = document.getElementById('dpad-up');
  const btnDown = document.getElementById('dpad-down');
  const btnLeft = document.getElementById('dpad-left');
  const btnRight = document.getElementById('dpad-right');
  const btnReset = document.getElementById('btn-reset-game');

  if (btnUp) btnUp.addEventListener('click', () => move(0, -1));
  if (btnDown) btnDown.addEventListener('click', () => move(0, 1));
  if (btnLeft) btnLeft.addEventListener('click', () => move(-1, 0));
  if (btnRight) btnRight.addEventListener('click', () => move(1, 0));

  if (btnReset) {
    btnReset.addEventListener('click', () => {
      playerPos = { x: 0, y: 0 };
      if (statusEl) statusEl.textContent = 'Grid reset. Use controls to reach the treasure.';
      renderGrid();
    });
  }

  renderGrid();
}
