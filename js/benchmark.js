/**
 * GoldenHour Router - Empirical Benchmark Engine
 * Evaluates performance across increasing n with Chart.js visualization & CSV export.
 */

class BenchmarkRunner {
  constructor(chartContainerIds) {
    this.chartIds = chartContainerIds;
    this.charts = {};
    this.results = [];
    this.isRunning = false;
    this.shouldCancel = false;
  }

  initCharts() {
    if (typeof Chart === 'undefined') return;

    // 1. Runtime vs N Chart (Log scale)
    const ctxRuntime = document.getElementById('chart-runtime')?.getContext('2d');
    if (ctxRuntime && !this.charts.runtime) {
      this.charts.runtime = new Chart(ctxRuntime, {
        type: 'line',
        data: {
          labels: [],
          datasets: [
            {
              label: 'DP (O(n² 2ⁿ))',
              data: [],
              borderColor: '#10b981',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              borderWidth: 2.5,
              tension: 0.3,
              pointRadius: 4
            },
            {
              label: 'Backtracking B&B',
              data: [],
              borderColor: '#06b6d4',
              backgroundColor: 'rgba(6, 182, 212, 0.15)',
              borderWidth: 2.5,
              tension: 0.3,
              pointRadius: 4
            },
            {
              label: 'Backtracking (No Pruning O(n!))',
              data: [],
              borderColor: '#ef4444',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              borderWidth: 2,
              borderDash: [5, 5],
              tension: 0.3,
              pointRadius: 4
            },
            {
              label: 'Greedy (O(n²))',
              data: [],
              borderColor: '#f59e0b',
              backgroundColor: 'rgba(245, 158, 11, 0.15)',
              borderWidth: 2,
              tension: 0.3,
              pointRadius: 4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: 'index', intersect: false },
          plugins: {
            title: { display: true, text: 'Execution Runtime vs Number of Locations n (Log Scale)', color: '#f8fafc', font: { size: 14, weight: 'bold' } },
            legend: { labels: { color: '#cbd5e1' } }
          },
          scales: {
            x: {
              title: { display: true, text: 'Number of Locations (n)', color: '#94a3b8' },
              grid: { color: 'rgba(51, 65, 85, 0.3)' },
              ticks: { color: '#94a3b8' }
            },
            y: {
              type: 'logarithmic',
              title: { display: true, text: 'Runtime (milliseconds - log scale)', color: '#94a3b8' },
              grid: { color: 'rgba(51, 65, 85, 0.3)' },
              ticks: { color: '#94a3b8' }
            }
          }
        }
      });
    }

    // 2. Greedy Optimality Gap Chart
    const ctxGap = document.getElementById('chart-gap')?.getContext('2d');
    if (ctxGap && !this.charts.gap) {
      this.charts.gap = new Chart(ctxGap, {
        type: 'bar',
        data: {
          labels: [],
          datasets: [
            {
              label: 'Greedy Suboptimality Gap (%) vs Exact DP',
              data: [],
              backgroundColor: 'rgba(245, 158, 11, 0.7)',
              borderColor: '#f59e0b',
              borderWidth: 1.5,
              borderRadius: 4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: { display: true, text: 'Greedy Optimality Gap % vs Exact Solution', color: '#f8fafc', font: { size: 14, weight: 'bold' } },
            legend: { labels: { color: '#cbd5e1' } }
          },
          scales: {
            x: {
              title: { display: true, text: 'Number of Locations (n)', color: '#94a3b8' },
              grid: { color: 'rgba(51, 65, 85, 0.3)' },
              ticks: { color: '#94a3b8' }
            },
            y: {
              title: { display: true, text: 'Optimality Gap % ((Cost - Optimal) / Optimal * 100)', color: '#94a3b8' },
              grid: { color: 'rgba(51, 65, 85, 0.3)' },
              ticks: { color: '#94a3b8' }
            }
          }
        }
      });
    }

    // 3. Pruning Efficiency Chart (Explored Nodes)
    const ctxPruning = document.getElementById('chart-pruning')?.getContext('2d');
    if (ctxPruning && !this.charts.pruning) {
      this.charts.pruning = new Chart(ctxPruning, {
        type: 'line',
        data: {
          labels: [],
          datasets: [
            {
              label: 'Backtracking With B&B Pruning',
              data: [],
              borderColor: '#06b6d4',
              backgroundColor: 'rgba(6, 182, 212, 0.2)',
              borderWidth: 2.5,
              fill: true,
              pointRadius: 4
            },
            {
              label: 'Backtracking Without Pruning (n!)',
              data: [],
              borderColor: '#ef4444',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              borderWidth: 2,
              borderDash: [4, 4],
              pointRadius: 4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: { display: true, text: 'State Space Explored: B&B Pruning vs Naive Search (Log Scale)', color: '#f8fafc', font: { size: 14, weight: 'bold' } },
            legend: { labels: { color: '#cbd5e1' } }
          },
          scales: {
            x: {
              title: { display: true, text: 'Number of Locations (n)', color: '#94a3b8' },
              grid: { color: 'rgba(51, 65, 85, 0.3)' },
              ticks: { color: '#94a3b8' }
            },
            y: {
              type: 'logarithmic',
              title: { display: true, text: 'Nodes / States Explored', color: '#94a3b8' },
              grid: { color: 'rgba(51, 65, 85, 0.3)' },
              ticks: { color: '#94a3b8' }
            }
          }
        }
      });
    }
  }

  generateRandomInstance(n, width = 800, height = 600) {
    const depot = { x: Math.random() * width, y: Math.random() * height };
    const locations = [];
    for (let i = 0; i < n; i++) {
      locations.push({
        id: i + 1,
        name: `Node #${i + 1}`,
        x: Math.random() * width,
        y: Math.random() * height,
        weight: Math.floor(Math.random() * 10) + 1
      });
    }
    return { depot, locations };
  }

  async runBenchmarkSuite(options, onProgress) {
    if (this.isRunning) return;
    this.isRunning = true;
    this.shouldCancel = false;
    this.initCharts();

    const {
      kTrials = 3,
      dpMaxN = 16,
      bbMaxN = 10,
      bbNaiveMaxN = 9,
      greedyMaxN = 100,
      speed = 100
    } = options;

    this.results = [];

    // Define n values to evaluate
    const nValues = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 25, 50, 100, 200, 500].filter(n => n <= greedyMaxN);

    // Reset chart datasets
    if (this.charts.runtime) {
      this.charts.runtime.data.labels = [];
      this.charts.runtime.data.datasets.forEach(ds => ds.data = []);
    }
    if (this.charts.gap) {
      this.charts.gap.data.labels = [];
      this.charts.gap.data.datasets[0].data = [];
    }
    if (this.charts.pruning) {
      this.charts.pruning.data.labels = [];
      this.charts.pruning.data.datasets.forEach(ds => ds.data = []);
    }

    const totalSteps = nValues.length;
    let currentStep = 0;

    for (const n of nValues) {
      if (this.shouldCancel) break;

      currentStep++;
      if (onProgress) {
        onProgress({
          currentN: n,
          step: currentStep,
          totalSteps,
          pct: Math.round((currentStep / totalSteps) * 100)
        });
      }

      // Aggregate metrics across k trials
      let dpTotalTime = 0, dpTotalCost = 0, dpRuns = 0;
      let bbTotalTime = 0, bbTotalCost = 0, bbNodes = 0, bbRuns = 0;
      let bbNaiveTotalTime = 0, bbNaiveNodes = 0, bbNaiveRuns = 0;
      let greedyTotalTime = 0, greedyTotalCost = 0, greedyRuns = 0;
      let gapSum = 0, gapCount = 0;

      for (let trial = 0; trial < kTrials; trial++) {
        // Yield to browser event loop so UI stays responsive
        await new Promise(r => setTimeout(r, 5));
        if (this.shouldCancel) break;

        const inst = this.generateRandomInstance(n);

        // 1. Greedy
        const gRes = RouteSolvers.solveGreedy(inst.depot, inst.locations, speed);
        greedyTotalTime += gRes.runtimeMs;
        greedyTotalCost += gRes.totalCost;
        greedyRuns++;

        // 2. DP (if n <= dpMaxN)
        let dpRes = null;
        if (n <= dpMaxN) {
          dpRes = RouteSolvers.solveDP(inst.depot, inst.locations, speed);
          dpTotalTime += dpRes.runtimeMs;
          dpTotalCost += dpRes.totalCost;
          dpRuns++;

          if (dpRes.totalCost > 0) {
            const gap = ((gRes.totalCost - dpRes.totalCost) / dpRes.totalCost) * 100;
            gapSum += Math.max(0, gap);
            gapCount++;
          }
        }

        // 3. Backtracking B&B (if n <= bbMaxN)
        if (n <= bbMaxN) {
          const bbRes = RouteSolvers.solveBacktracking(inst.depot, inst.locations, speed, true);
          bbTotalTime += bbRes.runtimeMs;
          bbTotalCost += bbRes.totalCost;
          bbNodes += bbRes.nodesExplored;
          bbRuns++;
        }

        // 4. Backtracking Naive (if n <= bbNaiveMaxN)
        if (n <= bbNaiveMaxN) {
          const bbNRes = RouteSolvers.solveBacktracking(inst.depot, inst.locations, speed, false);
          bbNaiveTotalTime += bbNRes.runtimeMs;
          bbNaiveNodes += bbNRes.nodesExplored;
          bbNaiveRuns++;
        }
      }

      const rowResult = {
        n,
        dpAvgMs: dpRuns > 0 ? dpTotalTime / dpRuns : null,
        dpAvgCost: dpRuns > 0 ? dpTotalCost / dpRuns : null,
        bbAvgMs: bbRuns > 0 ? bbTotalTime / bbRuns : null,
        bbAvgCost: bbRuns > 0 ? bbTotalCost / bbRuns : null,
        bbAvgNodes: bbRuns > 0 ? Math.round(bbNodes / bbRuns) : null,
        bbNaiveAvgMs: bbNaiveRuns > 0 ? bbNaiveTotalTime / bbNaiveRuns : null,
        bbNaiveAvgNodes: bbNaiveRuns > 0 ? Math.round(bbNaiveNodes / bbNaiveRuns) : null,
        greedyAvgMs: greedyRuns > 0 ? greedyTotalTime / greedyRuns : null,
        greedyAvgCost: greedyRuns > 0 ? greedyTotalCost / greedyRuns : null,
        greedyGapPct: gapCount > 0 ? gapSum / gapCount : null
      };

      this.results.push(rowResult);
      this.updateChartsWithRow(rowResult);
    }

    this.isRunning = false;
    this.renderResultsTable();
    if (onProgress) onProgress({ done: true });
  }

  updateChartsWithRow(row) {
    const label = `n=${row.n}`;

    // Runtime Chart
    if (this.charts.runtime) {
      this.charts.runtime.data.labels.push(label);
      this.charts.runtime.data.datasets[0].data.push(row.dpAvgMs !== null ? Math.max(0.01, row.dpAvgMs) : null);
      this.charts.runtime.data.datasets[1].data.push(row.bbAvgMs !== null ? Math.max(0.01, row.bbAvgMs) : null);
      this.charts.runtime.data.datasets[2].data.push(row.bbNaiveAvgMs !== null ? Math.max(0.01, row.bbNaiveAvgMs) : null);
      this.charts.runtime.data.datasets[3].data.push(row.greedyAvgMs !== null ? Math.max(0.005, row.greedyAvgMs) : null);
      this.charts.runtime.update();
    }

    // Gap Chart
    if (this.charts.gap && row.greedyGapPct !== null) {
      this.charts.gap.data.labels.push(label);
      this.charts.gap.data.datasets[0].data.push(row.greedyGapPct.toFixed(2));
      this.charts.gap.update();
    }

    // Pruning Chart
    if (this.charts.pruning && (row.bbAvgNodes !== null || row.bbNaiveAvgNodes !== null)) {
      this.charts.pruning.data.labels.push(label);
      this.charts.pruning.data.datasets[0].data.push(row.bbAvgNodes);
      this.charts.pruning.data.datasets[1].data.push(row.bbNaiveAvgNodes);
      this.charts.pruning.update();
    }
  }

  cancel() {
    this.shouldCancel = true;
    this.isRunning = false;
  }

  renderResultsTable() {
    const tableContainer = document.getElementById('benchmark-table-container');
    if (!tableContainer) return;

    let rowsHtml = '';
    this.results.forEach(r => {
      rowsHtml += `
        <tr>
          <td><strong>n = ${r.n}</strong></td>
          <td>${r.dpAvgMs !== null ? r.dpAvgMs.toFixed(2) + ' ms' : '<span class="text-muted">N/A (>17)</span>'}</td>
          <td>${r.bbAvgMs !== null ? r.bbAvgMs.toFixed(2) + ' ms' : '<span class="text-muted">N/A (>10)</span>'}</td>
          <td>${r.bbNaiveAvgMs !== null ? r.bbNaiveAvgMs.toFixed(2) + ' ms' : '<span class="text-muted">N/A (>9)</span>'}</td>
          <td>${r.greedyAvgMs !== null ? r.greedyAvgMs.toFixed(3) + ' ms' : '-'}</td>
          <td>${r.bbAvgNodes !== null ? r.bbAvgNodes.toLocaleString() : '-'}</td>
          <td>${r.bbNaiveAvgNodes !== null ? r.bbNaiveAvgNodes.toLocaleString() : '-'}</td>
          <td><span class="badge ${r.greedyGapPct > 15 ? 'badge-danger' : 'badge-warning'}">${r.greedyGapPct !== null ? r.greedyGapPct.toFixed(2) + '%' : 'N/A'}</span></td>
        </tr>
      `;
    });

    tableContainer.innerHTML = `
      <table class="benchmark-data-table">
        <thead>
          <tr>
            <th>Instances (n)</th>
            <th>DP Runtime</th>
            <th>B&B Runtime</th>
            <th>Naive BT Runtime</th>
            <th>Greedy Runtime</th>
            <th>B&B Nodes</th>
            <th>Naive BT Nodes</th>
            <th>Greedy Gap %</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    `;
  }

  exportCSV() {
    if (this.results.length === 0) {
      alert('Please run the benchmark first before exporting results.');
      return;
    }

    let csv = 'n,DP_Runtime_ms,BB_Runtime_ms,Naive_BT_Runtime_ms,Greedy_Runtime_ms,BB_Nodes_Explored,Naive_BT_Nodes_Explored,Greedy_Gap_Pct\n';
    this.results.forEach(r => {
      csv += `${r.n},${r.dpAvgMs ?? ''},${r.bbAvgMs ?? ''},${r.bbNaiveAvgMs ?? ''},${r.greedyAvgMs ?? ''},${r.bbAvgNodes ?? ''},${r.bbNaiveAvgNodes ?? ''},${r.greedyGapPct ?? ''}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `goldenhour_benchmark_results_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

window.BenchmarkRunner = BenchmarkRunner;
