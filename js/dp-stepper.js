/**
 * GoldenHour Router - DP Bitmask Step-Through Visualizer
 * Provides an interactive step-by-step debugger and table visualizer for n <= 5.
 */

class DPStepper {
  constructor(containerElement, onStepChange) {
    this.container = containerElement;
    this.onStepChange = onStepChange || (() => {});
    
    this.history = [];
    this.currentStepIdx = 0;
    this.locations = [];
    this.depot = null;
    this.speed = 100;
    this.isPlaying = false;
    this.timer = null;
    this.playbackSpeedMs = 800;
  }

  loadInstance(depot, locations, speed) {
    this.stopAutoPlay();
    this.depot = depot;
    this.locations = locations;
    this.speed = speed;

    if (locations.length > 5) {
      this.history = [];
      this.currentStepIdx = 0;
      this.renderTooLargeWarning();
      return;
    }

    if (locations.length === 0) {
      this.history = [];
      this.currentStepIdx = 0;
      this.renderEmpty();
      return;
    }

    // Solve with step recording enabled
    const dpResult = RouteSolvers.solveDP(depot, locations, speed, true);
    this.history = dpResult.stepHistory || [];
    this.currentStepIdx = 0;
    this.numStates = 1 << locations.length;
    this.totalWeight = locations.reduce((sum, l) => sum + l.weight, 0);

    this.render();
  }

  stepForward() {
    if (this.currentStepIdx < this.history.length - 1) {
      this.currentStepIdx++;
      this.updateUI();
    } else {
      this.stopAutoPlay();
    }
  }

  stepBackward() {
    if (this.currentStepIdx > 0) {
      this.currentStepIdx--;
      this.updateUI();
    }
  }

  goToStep(index) {
    if (index >= 0 && index < this.history.length) {
      this.currentStepIdx = index;
      this.updateUI();
    }
  }

  reset() {
    this.stopAutoPlay();
    this.currentStepIdx = 0;
    this.updateUI();
  }

  jumpToEnd() {
    this.stopAutoPlay();
    if (this.history.length > 0) {
      this.currentStepIdx = this.history.length - 1;
      this.updateUI();
    }
  }

  toggleAutoPlay() {
    if (this.isPlaying) {
      this.stopAutoPlay();
    } else {
      this.startAutoPlay();
    }
  }

  startAutoPlay() {
    this.isPlaying = true;
    const playBtn = document.getElementById('dp-play-btn');
    if (playBtn) playBtn.innerHTML = '⏸️ Pause';

    if (this.currentStepIdx >= this.history.length - 1) {
      this.currentStepIdx = 0;
    }

    this.timer = setInterval(() => {
      if (this.currentStepIdx < this.history.length - 1) {
        this.stepForward();
      } else {
        this.stopAutoPlay();
      }
    }, this.playbackSpeedMs);
  }

  stopAutoPlay() {
    this.isPlaying = false;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    const playBtn = document.getElementById('dp-play-btn');
    if (playBtn) playBtn.innerHTML = '▶️ Auto-Play';
  }

  setSpeed(ms) {
    this.playbackSpeedMs = ms;
    if (this.isPlaying) {
      this.stopAutoPlay();
      this.startAutoPlay();
    }
  }

  renderTooLargeWarning() {
    this.container.innerHTML = `
      <div class="dp-warning-box">
        <div class="warning-icon">⚠️</div>
        <h3>Step-Through Mode is Designed for n ≤ 5</h3>
        <p>The current canvas has <strong>n = ${this.locations.length}</strong> locations (2<sup>${this.locations.length}</sup> = ${1 << this.locations.length} states).</p>
        <p>To demonstrate and explain DP bitmask states cleanly for a video or class walkthrough, please load the <strong>"Small Demo (n = 5)"</strong> preset or reduce the canvas nodes to 5 or fewer.</p>
        <button class="btn btn-primary" id="btn-load-n5-preset">⚡ Load 5-Node Demo Preset</button>
      </div>
    `;
    const btn = document.getElementById('btn-load-n5-preset');
    if (btn) {
      btn.onclick = () => {
        if (window.app) window.app.loadPresetById('stepthrough_demo');
      };
    }
  }

  renderEmpty() {
    this.container.innerHTML = `
      <div class="dp-empty-state">
        <p>No locations on the map. Add up to 5 locations on the Router canvas or load a preset to inspect the DP table.</p>
      </div>
    `;
  }

  render() {
    const n = this.locations.length;
    const numStates = 1 << n;

    let columnsHtml = '<th>Mask (Binary & Set)</th>';
    for (let i = 0; i < n; i++) {
      columnsHtml += `<th>Last: Node #${i + 1} (${this.locations[i].name.split(' ')[0]})</th>`;
    }

    let rowsHtml = '';
    for (let mask = 1; mask < numStates; mask++) {
      const bin = mask.toString(2).padStart(n, '0');
      const setNotation = this.maskToSetNotation(mask, n);
      const popCount = this.countBits(mask);

      rowsHtml += `
        <tr id="dp-row-${mask}" data-mask="${mask}">
          <td class="dp-mask-col">
            <span class="mask-bin">${bin}₂</span>
            <span class="mask-set">${setNotation}</span>
            <span class="mask-badge">k=${popCount}</span>
          </td>
      `;

      for (let j = 0; j < n; j++) {
        const isMember = (mask & (1 << j)) !== 0;
        if (!isMember) {
          rowsHtml += `<td class="dp-cell dp-cell-invalid">-</td>`;
        } else {
          rowsHtml += `<td class="dp-cell dp-cell-valid" id="dp-cell-${mask}-${j}">∞</td>`;
        }
      }
      rowsHtml += `</tr>`;
    }

    this.container.innerHTML = `
      <div class="dp-stepper-wrapper">
        <!-- Controls Bar -->
        <div class="dp-controls-bar">
          <div class="dp-controls-group">
            <button class="btn btn-sm btn-secondary" id="dp-prev-btn">⏮ Prev Step</button>
            <button class="btn btn-sm btn-primary" id="dp-play-btn">▶️ Auto-Play</button>
            <button class="btn btn-sm btn-secondary" id="dp-next-btn">Next Step ⏭</button>
            <button class="btn btn-sm btn-outline" id="dp-reset-btn">🔄 Reset</button>
            <button class="btn btn-sm btn-outline" id="dp-end-btn">⏩ End</button>
          </div>

          <div class="dp-speed-control">
            <label for="dp-speed-slider">Speed:</label>
            <input type="range" id="dp-speed-slider" min="200" max="2000" step="100" value="800">
            <span id="dp-speed-val">0.8s</span>
          </div>

          <div class="dp-step-counter">
            Step <strong id="dp-cur-step">1</strong> / <span id="dp-total-steps">${this.history.length}</span>
          </div>
        </div>

        <!-- Live Step Explanation Box -->
        <div class="dp-explanation-card" id="dp-explanation-card">
          <div class="explanation-header">
            <div class="step-badge" id="dp-step-badge">Base Case</div>
            <div class="formula-box" id="dp-formula-box">dp[mask][v] = min(dp[mask][v], dp[prev_mask][u] + travel_time × rem_weight)</div>
          </div>
          <div class="explanation-body" id="dp-explanation-text">
            Initializing base cases from Depot...
          </div>
          <div class="step-metrics-chips" id="dp-step-chips">
            <!-- Dynamic parameter chips -->
          </div>
        </div>

        <!-- Interactive DP Matrix Table -->
        <div class="dp-table-container">
          <table class="dp-matrix-table">
            <thead>
              <tr>${columnsHtml}</tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Attach Event Listeners
    document.getElementById('dp-prev-btn').onclick = () => this.stepBackward();
    document.getElementById('dp-next-btn').onclick = () => this.stepForward();
    document.getElementById('dp-play-btn').onclick = () => this.toggleAutoPlay();
    document.getElementById('dp-reset-btn').onclick = () => this.reset();
    document.getElementById('dp-end-btn').onclick = () => this.jumpToEnd();

    const speedSlider = document.getElementById('dp-speed-slider');
    const speedVal = document.getElementById('dp-speed-val');
    speedSlider.oninput = (e) => {
      const val = parseInt(e.target.value);
      speedVal.innerText = `${(val / 1000).toFixed(1)}s`;
      this.setSpeed(val);
    };

    this.updateUI();
  }

  updateUI() {
    if (this.history.length === 0) return;

    const step = this.history[this.currentStepIdx];
    const n = this.locations.length;

    // Update Counter
    const curStepEl = document.getElementById('dp-cur-step');
    if (curStepEl) curStepEl.innerText = this.currentStepIdx + 1;

    // Clear previous cell highlights
    document.querySelectorAll('.dp-cell-active, .dp-cell-updated, .dp-row-active').forEach(el => {
      el.classList.remove('dp-cell-active', 'dp-cell-updated', 'dp-row-active');
    });

    // Replay state up to currentStepIdx to set cell text values
    const tempDP = {};
    for (let s = 0; s <= this.currentStepIdx; s++) {
      const st = this.history[s];
      if (st.isBetter !== false) {
        const key = `${st.mask}-${st.last}`;
        tempDP[key] = st.totalCost;
      }
    }

    // Update table cell values
    const numStates = 1 << n;
    for (let mask = 1; mask < numStates; mask++) {
      for (let j = 0; j < n; j++) {
        if ((mask & (1 << j)) !== 0) {
          const cell = document.getElementById(`dp-cell-${mask}-${j}`);
          const val = tempDP[`${mask}-${j}`];
          if (cell) {
            cell.innerText = val !== undefined ? val.toFixed(1) : '∞';
          }
        }
      }
    }

    // Highlight current active row and cell
    const activeRow = document.getElementById(`dp-row-${step.mask}`);
    if (activeRow) {
      activeRow.classList.add('dp-row-active');
      activeRow.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    const activeCell = document.getElementById(`dp-cell-${step.mask}-${step.last}`);
    if (activeCell) {
      activeCell.classList.add('dp-cell-active');
      if (step.isBetter !== false) {
        activeCell.classList.add('dp-cell-updated');
      }
    }

    // Update Explanation Card
    const badgeEl = document.getElementById('dp-step-badge');
    const textEl = document.getElementById('dp-explanation-text');
    const chipsEl = document.getElementById('dp-step-chips');

    if (badgeEl) {
      badgeEl.className = `step-badge badge-${step.type}`;
      badgeEl.innerText = step.type === 'base_case' ? 'Base Case (Depot Start)' : (step.isBetter ? 'State Relaxed (Optimal)' : 'State Pruned (Suboptimal)');
    }

    if (textEl) {
      textEl.innerHTML = step.explanation;
    }

    if (chipsEl) {
      chipsEl.innerHTML = `
        <span class="chip"><strong>Mask:</strong> ${step.maskBinary}₂ (${this.maskToSetNotation(step.mask, n)})</span>
        <span class="chip"><strong>Target Node:</strong> #${step.last + 1} (${this.locations[step.last].name})</span>
        <span class="chip"><strong>From:</strong> ${step.prev === 'Depot' ? 'HQ Depot' : 'Node #' + (step.prev + 1)}</span>
        <span class="chip"><strong>Remaining Weight:</strong> ${step.remWeight}</span>
        <span class="chip"><strong>Δ Penalty:</strong> +${step.costAdded.toFixed(1)}</span>
        <span class="chip chip-highlight"><strong>Accumulated Cost:</strong> ${step.totalCost.toFixed(1)}</span>
      `;
    }
  }

  maskToSetNotation(mask, n) {
    const set = [];
    for (let i = 0; i < n; i++) {
      if ((mask & (1 << i)) !== 0) {
        set.push(i + 1);
      }
    }
    return `{${set.join(', ')}}`;
  }

  countBits(mask) {
    let count = 0;
    while (mask > 0) {
      count += mask & 1;
      mask >>= 1;
    }
    return count;
  }
}

window.DPStepper = DPStepper;
