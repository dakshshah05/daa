/**
 * GoldenHour Router - Main Application Controller
 */

class GoldenHourApp {
  constructor() {
    this.canvas = null;
    this.dpStepper = null;
    this.benchmark = null;

    this.currentSolver = 'dp'; // 'dp' | 'backtracking' | 'greedy'
    this.enablePruning = true;
    this.speed = 100; // px/s
    this.currentPresetIndex = 0;

    this.initDOM();
    this.initCanvas();
    this.initTabs();
    this.initEvents();
    this.initKeybindings();

    // Load initial preset
    this.loadPresetById('greedy_trap');
  }

  initDOM() {
    // Populate preset dropdown
    const presetSelect = document.getElementById('preset-select');
    if (presetSelect && window.PRESET_SCENARIOS) {
      presetSelect.innerHTML = window.PRESET_SCENARIOS.map((p, idx) => `
        <option value="${p.id}">${p.name}</option>
      `).join('');
    }
  }

  initCanvas() {
    const canvasEl = document.getElementById('map-canvas');
    if (!canvasEl) return;

    this.canvas = new MapCanvas(canvasEl, (event, data) => {
      if (event === 'change') {
        if (data && data.speed) {
          this.speed = data.speed;
          const speedSlider = document.getElementById('speed-slider');
          const speedVal = document.getElementById('speed-val');
          if (speedSlider) speedSlider.value = this.speed;
          if (speedVal) speedVal.innerText = `${this.speed} px/s`;
        }
        this.renderLocationsList();
        this.solveAllAndRefresh();
      } else if (event === 'select') {
        this.renderLocationsList();
      }
    });

    // DP Stepper
    const stepperContainer = document.getElementById('dp-stepper-view');
    if (stepperContainer) {
      this.dpStepper = new DPStepper(stepperContainer);
    }

    // Benchmark Runner
    this.benchmark = new BenchmarkRunner();
  }

  initTabs() {
    const tabButtons = document.querySelectorAll('.nav-tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');

        tabButtons.forEach(b => b.classList.remove('active'));
        tabPanes.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const activePane = document.getElementById(`tab-${targetTab}`);
        if (activePane) activePane.classList.add('active');

        // Tab specific activations
        if (targetTab === 'canvas') {
          setTimeout(() => this.canvas.resize(), 50);
        } else if (targetTab === 'dp-stepper') {
          this.dpStepper.loadInstance(this.canvas.depot, this.canvas.locations, this.speed);
        } else if (targetTab === 'benchmark') {
          this.benchmark.initCharts();
        }
      });
    });
  }

  initEvents() {
    // Presets
    const presetSelect = document.getElementById('preset-select');
    if (presetSelect) {
      presetSelect.addEventListener('change', (e) => {
        this.loadPresetById(e.target.value);
      });
    }

    // Random Instance Button
    const btnRandom = document.getElementById('btn-random');
    if (btnRandom) {
      btnRandom.addEventListener('click', () => {
        const nInput = document.getElementById('random-n-input');
        const n = nInput ? parseInt(nInput.value, 10) : 8;
        this.canvas.generateRandom(n);
        this.showToast(`Generated random instance with n = ${n}`);
      });
    }

    // Clear Canvas Button
    const btnClear = document.getElementById('btn-clear');
    if (btnClear) {
      btnClear.addEventListener('click', () => {
        if (confirm('Clear all locations from the canvas?')) {
          this.canvas.clear();
          this.showToast('Canvas cleared');
        }
      });
    }

    // Solvers Selector Radios/Buttons
    document.querySelectorAll('.solver-choice-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.solver-choice-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentSolver = btn.getAttribute('data-solver');
        this.updateCanvasRouteDisplay();
      });
    });

    // Pruning Toggle
    const pruningCheckbox = document.getElementById('toggle-pruning');
    if (pruningCheckbox) {
      pruningCheckbox.addEventListener('change', (e) => {
        this.enablePruning = e.target.checked;
        this.solveAllAndRefresh();
      });
    }

    // Compare Mode Toggle
    const compareCheckbox = document.getElementById('toggle-compare');
    if (compareCheckbox) {
      compareCheckbox.addEventListener('change', (e) => {
        this.canvas.compareMode = e.target.checked;
        this.updateCanvasRouteDisplay();
      });
    }

    // Speed Slider
    const speedSlider = document.getElementById('speed-slider');
    const speedVal = document.getElementById('speed-val');
    if (speedSlider) {
      speedSlider.addEventListener('input', (e) => {
        this.speed = parseInt(e.target.value, 10);
        if (speedVal) speedVal.innerText = `${this.speed} px/s`;
        this.solveAllAndRefresh();
      });
    }

    // Animation Controls
    const btnPlayAnim = document.getElementById('btn-play-anim');
    const btnPauseAnim = document.getElementById('btn-pause-anim');
    const btnStopAnim = document.getElementById('btn-stop-anim');

    if (btnPlayAnim) {
      btnPlayAnim.addEventListener('click', () => this.startVehicleRun());
    }
    if (btnPauseAnim) {
      btnPauseAnim.addEventListener('click', () => this.canvas.pauseVehicleAnimation());
    }
    if (btnStopAnim) {
      btnStopAnim.addEventListener('click', () => {
        this.canvas.stopVehicleAnimation();
        this.resetLiveDelayTicker();
      });
    }

    // Benchmark Controls
    const btnRunBenchmark = document.getElementById('btn-run-benchmark');
    const btnCancelBenchmark = document.getElementById('btn-cancel-benchmark');
    const btnExportCSV = document.getElementById('btn-export-csv');

    if (btnRunBenchmark) {
      btnRunBenchmark.addEventListener('click', () => this.startBenchmark());
    }
    if (btnCancelBenchmark) {
      btnCancelBenchmark.addEventListener('click', () => this.benchmark.cancel());
    }
    if (btnExportCSV) {
      btnExportCSV.addEventListener('click', () => this.benchmark.exportCSV());
    }

    // Add Location from Form
    const btnAddLoc = document.getElementById('btn-add-loc-manual');
    if (btnAddLoc) {
      btnAddLoc.addEventListener('click', () => {
        const nameInput = document.getElementById('new-loc-name');
        const weightInput = document.getElementById('new-loc-weight');
        const typeInput = document.getElementById('new-loc-type');

        const name = nameInput ? nameInput.value : 'Triage Center';
        const weight = weightInput ? parseInt(weightInput.value, 10) : 5;
        const type = typeInput ? typeInput.value : 'hospital';

        const x = 100 + Math.random() * (this.canvas.width - 200);
        const y = 100 + Math.random() * (this.canvas.height - 200);

        this.canvas.addLocation(x, y, weight, name, type);
        this.showToast(`Added ${name} (Weight: ${weight})`);
      });
    }
  }

  initKeybindings() {
    window.addEventListener('keydown', (e) => {
      // Ignore when typing in an input
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        this.startVehicleRun();
      } else if (e.key === 'r' || e.key === 'R') {
        this.solveAllAndRefresh();
        this.showToast('Recomputed all routes');
      } else if (e.key === 'c' || e.key === 'C') {
        const cmp = document.getElementById('toggle-compare');
        if (cmp) {
          cmp.checked = !cmp.checked;
          this.canvas.compareMode = cmp.checked;
          this.updateCanvasRouteDisplay();
        }
      } else if (e.key === '1') {
        this.selectSolver('dp');
      } else if (e.key === '2') {
        this.selectSolver('backtracking');
      } else if (e.key === '3') {
        this.selectSolver('greedy');
      }
    });
  }

  selectSolver(solverKey) {
    this.currentSolver = solverKey;
    document.querySelectorAll('.solver-choice-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-solver') === solverKey);
    });
    this.updateCanvasRouteDisplay();
    this.showToast(`Selected Solver: ${solverKey.toUpperCase()}`);
  }

  loadPresetById(presetId) {
    const preset = window.PRESET_SCENARIOS.find(p => p.id === presetId);
    if (!preset) return;

    const presetSelect = document.getElementById('preset-select');
    if (presetSelect) presetSelect.value = presetId;

    const descEl = document.getElementById('preset-description');
    if (descEl) descEl.innerText = preset.description;

    this.canvas.loadPreset(preset);
    this.showToast(`Loaded Preset: ${preset.name}`);
  }

  solveAllAndRefresh() {
    if (!this.canvas) return;

    const depot = this.canvas.depot;
    const locations = this.canvas.locations;

    if (locations.length === 0) {
      this.canvas.activeRoutes = { dp: null, backtracking: null, greedy: null };
      this.renderResultsTable(null);
      return;
    }

    const sol = RouteSolvers.solveAll(depot, locations, this.speed, this.enablePruning);
    this.canvas.activeRoutes = {
      dp: sol.dp,
      backtracking: sol.backtracking,
      greedy: sol.greedy
    };

    this.updateCanvasRouteDisplay();
    this.renderResultsTable(sol);
    this.renderRouteBreakdown(sol);
  }

  updateCanvasRouteDisplay() {
    this.canvas.showRoutes = {
      dp: this.currentSolver === 'dp',
      backtracking: this.currentSolver === 'backtracking',
      greedy: this.currentSolver === 'greedy'
    };
  }

  renderResultsTable(sol) {
    const container = document.getElementById('results-comparison-tbody');
    if (!container || !sol) return;

    const dp = sol.dp;
    const bb = sol.backtracking;
    const greedy = sol.greedy;

    const makeRow = (name, s, err, colorBadge) => {
      if (err) {
        return `
          <tr>
            <td><span class="algo-badge ${colorBadge}">${name}</span></td>
            <td colspan="5" class="text-warning">${err}</td>
          </tr>
        `;
      }
      if (!s) return '';

      const gapHtml = s.optimalityGapPct > 0 
        ? `<span class="badge badge-danger">+${s.optimalityGapPct.toFixed(2)}%</span>`
        : `<span class="badge badge-success">0.00% (Optimal)</span>`;

      return `
        <tr class="${s.code.toLowerCase() === this.currentSolver ? 'row-selected' : ''}">
          <td><span class="algo-badge ${colorBadge}">${s.name}</span></td>
          <td><strong>${s.totalCost.toFixed(1)}</strong> wt·s</td>
          <td>${s.runtimeMs.toFixed(2)} ms</td>
          <td>${s.nodesExplored.toLocaleString()}</td>
          <td>${s.memoryEstimate}</td>
          <td>${gapHtml}</td>
        </tr>
      `;
    };

    container.innerHTML = `
      ${makeRow('Dynamic Programming', dp, sol.dpError, 'badge-dp')}
      ${makeRow(this.enablePruning ? 'Backtracking (B&B)' : 'Backtracking (Naive)', bb, sol.bbError, 'badge-bb')}
      ${makeRow('Greedy Priority', greedy, null, 'badge-greedy')}
    `;

    // Highlight Greedy Failure Trap Note if greedy gap > 10%
    const alertBox = document.getElementById('greedy-trap-notice');
    if (alertBox) {
      if (greedy && greedy.optimalityGapPct > 10) {
        alertBox.style.display = 'block';
        alertBox.innerHTML = `
          <strong>⚠️ Suboptimality Detected:</strong> Greedy algorithm missed the global optimum by 
          <strong>${greedy.optimalityGapPct.toFixed(1)}%</strong> (+${(greedy.totalCost - (dp?.totalCost || bb?.totalCost || 0)).toFixed(1)} penalty units).
        `;
      } else {
        alertBox.style.display = 'none';
      }
    }
  }

  renderRouteBreakdown(sol) {
    const breakdownEl = document.getElementById('route-sequence-display');
    if (!breakdownEl || !sol) return;

    const activeSol = sol[this.currentSolver] || sol.dp || sol.greedy;
    if (!activeSol || !activeSol.arrivalTimes) {
      breakdownEl.innerHTML = '<span class="text-muted">No route active</span>';
      return;
    }

    let html = `
      <div class="route-sequence-chips">
        <span class="route-chip chip-depot">🏁 HQ Depot (t=0s)</span>
    `;

    activeSol.arrivalTimes.forEach((step, idx) => {
      const loc = step.location;
      html += `
        <span class="route-arrow">➔</span>
        <span class="route-chip" style="border-left: 4px solid ${this.canvas.getNodeColor(loc.weight).bg}">
          <strong>#${idx + 1} ${loc.name}</strong>
          <small>t=${step.arrivalTime.toFixed(1)}s (w=${loc.weight}, pen=${step.stepWeightedDelay.toFixed(1)})</small>
        </span>
      `;
    });

    html += `</div>`;
    breakdownEl.innerHTML = html;
  }

  renderLocationsList() {
    const listEl = document.getElementById('locations-list');
    if (!listEl) return;

    if (this.canvas.locations.length === 0) {
      listEl.innerHTML = '<p class="text-muted empty-text">No triage locations added yet. Click anywhere on the map grid to place a node.</p>';
      return;
    }

    let html = '';
    this.canvas.locations.forEach((loc, idx) => {
      const isSelected = this.canvas.selectedNodeIndex === idx;
      const colorScheme = this.canvas.getNodeColor(loc.weight);

      html += `
        <div class="loc-card ${isSelected ? 'selected' : ''}" data-idx="${idx}">
          <div class="loc-card-header">
            <span class="loc-color-dot" style="background: ${colorScheme.bg}"></span>
            <input type="text" class="loc-name-input" value="${loc.name}" data-idx="${idx}">
            <button class="btn-delete-node" data-idx="${idx}" title="Delete node">🗑️</button>
          </div>
          <div class="loc-card-body">
            <div class="weight-control">
              <label>Urgency Weight: <strong class="weight-display" id="w-disp-${idx}">${loc.weight}</strong>/10</label>
              <input type="range" class="weight-slider" min="1" max="10" value="${loc.weight}" data-idx="${idx}">
            </div>
            <div class="loc-coords">
              <span>Pos: (${loc.x}, ${loc.y})</span>
              <span class="type-tag">${loc.type || 'hospital'}</span>
            </div>
          </div>
        </div>
      `;
    });

    listEl.innerHTML = html;

    // Attach listeners
    listEl.querySelectorAll('.loc-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') return;
        const idx = parseInt(card.getAttribute('data-idx'), 10);
        this.canvas.selectedNodeIndex = idx;
        this.canvas.draw();
        this.renderLocationsList();
      });
    });

    listEl.querySelectorAll('.loc-name-input').forEach(input => {
      input.addEventListener('change', (e) => {
        const idx = parseInt(e.target.getAttribute('data-idx'), 10);
        this.canvas.locations[idx].name = e.target.value;
        this.canvas.draw();
        this.solveAllAndRefresh();
      });
    });

    listEl.querySelectorAll('.weight-slider').forEach(slider => {
      slider.addEventListener('input', (e) => {
        const idx = parseInt(e.target.getAttribute('data-idx'), 10);
        const val = parseInt(e.target.value, 10);
        this.canvas.locations[idx].weight = val;
        const disp = document.getElementById(`w-disp-${idx}`);
        if (disp) disp.innerText = val;
        this.canvas.draw();
        this.solveAllAndRefresh();
      });
    });

    listEl.querySelectorAll('.btn-delete-node').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.target.getAttribute('data-idx'), 10);
        this.canvas.deleteLocation(idx);
      });
    });
  }

  startVehicleRun() {
    const activeSol = this.canvas.activeRoutes[this.currentSolver] 
      || this.canvas.activeRoutes.dp 
      || this.canvas.activeRoutes.greedy;

    if (!activeSol || !activeSol.order || activeSol.order.length === 0) {
      this.showToast('No valid route to simulate.');
      return;
    }

    const liveTicker = document.getElementById('live-delay-ticker');
    const liveTimeTicker = document.getElementById('live-time-ticker');
    const liveStepTicker = document.getElementById('live-step-ticker');

    this.canvas.startVehicleAnimation(
      activeSol,
      this.speed / 100,
      (status) => {
        if (liveTicker) liveTicker.innerText = status.liveDelay.toFixed(1);
        if (liveTimeTicker) liveTimeTicker.innerText = `${status.liveTime.toFixed(1)}s`;
        if (liveStepTicker) liveStepTicker.innerText = `Step ${status.step}/${status.totalSteps}`;
      },
      () => {
        this.showToast(`Simulation complete! Total weighted delay: ${activeSol.totalCost.toFixed(1)}`);
      }
    );
  }

  resetLiveDelayTicker() {
    const liveTicker = document.getElementById('live-delay-ticker');
    const liveTimeTicker = document.getElementById('live-time-ticker');
    const liveStepTicker = document.getElementById('live-step-ticker');

    if (liveTicker) liveTicker.innerText = '0.0';
    if (liveTimeTicker) liveTimeTicker.innerText = '0.0s';
    if (liveStepTicker) liveStepTicker.innerText = 'Standby';
  }

  async startBenchmark() {
    const progressEl = document.getElementById('benchmark-progress-bar');
    const statusEl = document.getElementById('benchmark-status-text');
    const btnRun = document.getElementById('btn-run-benchmark');
    const btnCancel = document.getElementById('btn-cancel-benchmark');

    if (btnRun) btnRun.disabled = true;
    if (btnCancel) btnCancel.disabled = false;

    const trialsSelect = document.getElementById('bench-trials-select');
    const kTrials = trialsSelect ? parseInt(trialsSelect.value, 10) : 3;

    await this.benchmark.runBenchmarkSuite({
      kTrials,
      dpMaxN: 17,
      bbMaxN: 11,
      bbNaiveMaxN: 9,
      greedyMaxN: 500,
      speed: this.speed
    }, (progress) => {
      if (progress.done) {
        if (statusEl) statusEl.innerText = '✅ Benchmark suite finished!';
        if (progressEl) progressEl.style.width = '100%';
        if (btnRun) btnRun.disabled = false;
        if (btnCancel) btnCancel.disabled = true;
      } else {
        if (statusEl) statusEl.innerText = `Testing instances with n = ${progress.currentN} (${progress.step}/${progress.totalSteps})...`;
        if (progressEl) progressEl.style.width = `${progress.pct}%`;
      }
    });
  }

  showToast(message) {
    let toast = document.getElementById('app-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'app-toast';
      toast.className = 'app-toast';
      document.body.appendChild(toast);
    }
    toast.innerText = message;
    toast.classList.add('visible');
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      toast.classList.remove('visible');
    }, 2800);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.app = new GoldenHourApp();
});
