import React, { useState, useRef } from 'react';
import { RouteSolvers } from '../algorithms/solvers';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Play, Square, Download, TrendingUp, Cpu, Zap } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

ChartJS.register(
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export function BenchmarkSuite({ speed = 100 }) {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Ready to run empirical benchmark across n = 4 to 500.');
  const [kTrials, setKTrials] = useState(3);
  const [benchmarkData, setBenchmarkData] = useState([]);
  const cancelRef = useRef(false);

  const generateRandom = (n, w = 800, h = 600) => {
    const depot = { x: Math.random() * w, y: Math.random() * h };
    const locations = [];
    for (let i = 0; i < n; i++) {
      locations.push({
        id: i + 1,
        name: `Node #${i + 1}`,
        x: Math.random() * w,
        y: Math.random() * h,
        weight: Math.floor(Math.random() * 10) + 1
      });
    }
    return { depot, locations };
  };

  const handleRunBenchmark = async () => {
    if (isRunning) return;
    sounds.playClick();
    setIsRunning(true);
    cancelRef.current = false;
    setBenchmarkData([]);

    const nValues = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 25, 50, 100, 200, 500];
    const results = [];
    const total = nValues.length;

    for (let step = 0; step < total; step++) {
      if (cancelRef.current) break;
      const n = nValues[step];
      setProgress(Math.round(((step + 1) / total) * 100));
      setStatusText(`Evaluating n = ${n} (${step + 1}/${total}) across ${kTrials} random instances...`);

      let dpTime = 0, dpRuns = 0;
      let bbTime = 0, bbNodes = 0, bbRuns = 0;
      let bbNaiveTime = 0, bbNaiveNodes = 0, bbNaiveRuns = 0;
      let greedyTime = 0, greedyRuns = 0;
      let gapSum = 0, gapCount = 0;

      for (let t = 0; t < kTrials; t++) {
        if (cancelRef.current) break;
        await new Promise((r) => setTimeout(r, 4)); // Yield to main thread

        const inst = generateRandom(n);

        // 1. Greedy
        const gRes = RouteSolvers.solveGreedy(inst.depot, inst.locations, speed);
        greedyTime += gRes.runtimeMs;
        greedyRuns++;

        // 2. DP (n <= 17)
        if (n <= 17) {
          const dpRes = RouteSolvers.solveDP(inst.depot, inst.locations, speed);
          dpTime += dpRes.runtimeMs;
          dpRuns++;

          if (dpRes.totalCost > 0) {
            const gap = ((gRes.totalCost - dpRes.totalCost) / dpRes.totalCost) * 100;
            gapSum += Math.max(0, gap);
            gapCount++;
          }
        }

        // 3. B&B (n <= 11)
        if (n <= 11) {
          const bbRes = RouteSolvers.solveBacktracking(inst.depot, inst.locations, speed, true);
          bbTime += bbRes.runtimeMs;
          bbNodes += bbRes.nodesExplored;
          bbRuns++;
        }

        // 4. Naive Backtracking (n <= 9)
        if (n <= 9) {
          const bbNRes = RouteSolvers.solveBacktracking(inst.depot, inst.locations, speed, false);
          bbNaiveTime += bbNRes.runtimeMs;
          bbNaiveNodes += bbNRes.nodesExplored;
          bbNaiveRuns++;
        }
      }

      const row = {
        n,
        dpAvgMs: dpRuns > 0 ? dpTime / dpRuns : null,
        bbAvgMs: bbRuns > 0 ? bbTime / bbRuns : null,
        bbAvgNodes: bbRuns > 0 ? Math.round(bbNodes / bbRuns) : null,
        bbNaiveAvgMs: bbNaiveRuns > 0 ? bbNaiveTime / bbNaiveRuns : null,
        bbNaiveAvgNodes: bbNaiveRuns > 0 ? Math.round(bbNaiveNodes / bbNaiveRuns) : null,
        greedyAvgMs: greedyRuns > 0 ? greedyTime / greedyRuns : null,
        greedyGapPct: gapCount > 0 ? gapSum / gapCount : null
      };

      results.push(row);
      setBenchmarkData([...results]);
    }

    setIsRunning(false);
    setStatusText('✅ Benchmark completed successfully!');
    sounds.playSuccess();
  };

  const handleCancel = () => {
    cancelRef.current = true;
    setIsRunning(false);
    setStatusText('Benchmark cancelled.');
    sounds.playWarning();
  };

  const handleExportCSV = () => {
    if (benchmarkData.length === 0) return;
    sounds.playClick();

    let csv = 'n,DP_Runtime_ms,BB_Runtime_ms,Naive_BT_Runtime_ms,Greedy_Runtime_ms,BB_Nodes_Explored,Naive_BT_Nodes_Explored,Greedy_Gap_Pct\n';
    benchmarkData.forEach((r) => {
      csv += `${r.n},${r.dpAvgMs ?? ''},${r.bbAvgMs ?? ''},${r.bbNaiveAvgMs ?? ''},${r.greedyAvgMs ?? ''},${r.bbAvgNodes ?? ''},${r.bbNaiveAvgNodes ?? ''},${r.greedyGapPct?.toFixed(2) ?? ''}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `goldenhour_benchmark_results_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Chart configs
  const labels = benchmarkData.map((d) => `n=${d.n}`);

  const runtimeChartData = {
    labels,
    datasets: [
      {
        label: 'DP (O(n² 2ⁿ))',
        data: benchmarkData.map((d) => (d.dpAvgMs !== null ? Math.max(0.01, d.dpAvgMs) : null)),
        borderColor: '#97A87A',
        backgroundColor: 'rgba(151, 168, 122, 0.35)',
        borderWidth: 3,
        pointBackgroundColor: '#97A87A',
        pointBorderColor: '#232B20',
        pointBorderWidth: 2,
        pointRadius: 5,
        tension: 0.3
      },
      {
        label: 'Backtracking B&B',
        data: benchmarkData.map((d) => (d.bbAvgMs !== null ? Math.max(0.01, d.bbAvgMs) : null)),
        borderColor: '#A8BBA3',
        backgroundColor: 'rgba(168, 187, 163, 0.35)',
        borderWidth: 3,
        pointBackgroundColor: '#A8BBA3',
        pointBorderColor: '#232B20',
        pointBorderWidth: 2,
        pointRadius: 5,
        tension: 0.3
      },
      {
        label: 'Naive Search (O(n!))',
        data: benchmarkData.map((d) => (d.bbNaiveAvgMs !== null ? Math.max(0.01, d.bbNaiveAvgMs) : null)),
        borderColor: '#DB9558',
        backgroundColor: 'rgba(219, 149, 88, 0.3)',
        borderDash: [6, 6],
        borderWidth: 3,
        pointBackgroundColor: '#DB9558',
        pointBorderColor: '#232B20',
        pointBorderWidth: 2,
        pointRadius: 5,
        tension: 0.3
      },
      {
        label: 'Greedy (O(n²))',
        data: benchmarkData.map((d) => (d.greedyAvgMs !== null ? Math.max(0.005, d.greedyAvgMs) : null)),
        borderColor: '#DB9558',
        backgroundColor: 'rgba(219, 149, 88, 0.25)',
        borderWidth: 3,
        pointBackgroundColor: '#DB9558',
        pointBorderColor: '#232B20',
        pointBorderWidth: 2,
        pointRadius: 5,
        tension: 0.3
      }
    ]
  };

  const gapChartData = {
    labels: benchmarkData.filter((d) => d.greedyGapPct !== null).map((d) => `n=${d.n}`),
    datasets: [
      {
        label: 'Greedy Suboptimality Gap (%)',
        data: benchmarkData.filter((d) => d.greedyGapPct !== null).map((d) => d.greedyGapPct.toFixed(2)),
        backgroundColor: '#DB9558',
        borderColor: '#232B20',
        borderWidth: 2,
        borderRadius: 4
      }
    ]
  };

  const pruningChartData = {
    labels: benchmarkData.filter((d) => d.bbAvgNodes !== null).map((d) => `n=${d.n}`),
    datasets: [
      {
        label: 'B&B Explored Nodes',
        data: benchmarkData.filter((d) => d.bbAvgNodes !== null).map((d) => d.bbAvgNodes),
        borderColor: '#97A87A',
        backgroundColor: 'rgba(151, 168, 122, 0.35)',
        borderWidth: 3,
        fill: true,
        tension: 0.3
      },
      {
        label: 'Naive BT Explored Nodes (n!)',
        data: benchmarkData.filter((d) => d.bbAvgNodes !== null).map((d) => d.bbNaiveAvgNodes),
        borderColor: '#DB9558',
        borderDash: [5, 5],
        borderWidth: 3,
        tension: 0.3
      }
    ]
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Config Bar */}
      <div className="stage-card">
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.86rem', fontWeight: 800, color: '#1C2319' }}>
              <label htmlFor="k-trials-select">Averaging Trials:</label>
              <select
                id="k-trials-select"
                className="form-select"
                style={{ width: '130px' }}
                value={kTrials}
                onChange={(e) => setKTrials(Number(e.target.value))}
                disabled={isRunning}
              >
                <option value={3}>k = 3 Trials</option>
                <option value={5}>k = 5 Trials</option>
                <option value={10}>k = 10 Trials</option>
              </select>
            </div>

            <button className="btn btn-primary" onClick={handleRunBenchmark} disabled={isRunning}>
              <Play size={16} fill="currentColor" /> Run Benchmark Suite
            </button>
            <button className="btn btn-danger btn-sm" onClick={handleCancel} disabled={!isRunning}>
              <Square size={14} /> Cancel
            </button>
          </div>

          <button
            className="btn btn-secondary"
            onClick={handleExportCSV}
            disabled={benchmarkData.length === 0}
          >
            <Download size={16} /> Export Results as CSV
          </button>
        </div>

        {/* Progress Bar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginTop: '0.65rem' }}>
          <div style={{ width: '100%', height: '10px', background: 'rgba(168, 187, 163, 0.45)', borderRadius: '4px', overflow: 'hidden', border: '2px solid #232B20', boxShadow: 'var(--neo-shadow-xs)' }}>
            <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, #97A87A, #DB9558)', transition: 'width 0.2s ease' }} />
          </div>
          <span style={{ fontSize: '0.84rem', color: '#1C2319', fontWeight: 700 }}>{statusText}</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '1.5rem' }}>
        
        {/* Runtime Scaling (Full width) */}
        <div className="stage-card" style={{ gridColumn: '1 / -1', height: '400px' }}>
          <div style={{ fontSize: '1.02rem', fontWeight: 900, color: '#1C2319', display: 'flex', alignItems: 'center', gap: '0.55rem', borderBottom: '2px solid #232B20', paddingBottom: '0.5rem' }}>
            <div style={{ width: '28px', height: '28px', background: '#97A87A', borderRadius: '4px', border: '1.5px solid #232B20', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '1px 1px 0px #232B20' }}>
              <TrendingUp size={18} color="#FCF9EA" />
            </div>
            <span>Execution Runtime vs Number of Locations (n) — Logarithmic Scale</span>
          </div>
          <div style={{ flex: 1, position: 'relative', width: '100%', height: '100%' }}>
            <Line
              data={runtimeChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    type: 'logarithmic',
                    title: { display: true, text: 'Runtime (ms - log scale)', color: '#1C2319', font: { weight: 'bold' } },
                    grid: { color: 'rgba(35, 43, 32, 0.12)' },
                    ticks: { color: '#1C2319', font: { family: 'JetBrains Mono' } }
                  },
                  x: {
                    title: { display: true, text: 'Number of Locations (n)', color: '#1C2319', font: { weight: 'bold' } },
                    grid: { color: 'rgba(35, 43, 32, 0.12)' },
                    ticks: { color: '#1C2319', font: { family: 'JetBrains Mono' } }
                  }
                },
                plugins: { legend: { labels: { color: '#1C2319', font: { weight: 'bold' } } } }
              }}
            />
          </div>
        </div>

        {/* Greedy Gap */}
        <div className="stage-card" style={{ height: '360px' }}>
          <div style={{ fontSize: '1.02rem', fontWeight: 900, color: '#1C2319', display: 'flex', alignItems: 'center', gap: '0.55rem', borderBottom: '2px solid #232B20', paddingBottom: '0.5rem' }}>
            <div style={{ width: '28px', height: '28px', background: '#DB9558', borderRadius: '4px', border: '1.5px solid #232B20', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '1px 1px 0px #232B20' }}>
              <Zap size={18} color="#FCF9EA" />
            </div>
            <span>Greedy Heuristic Optimality Gap (%) vs Optimal DP</span>
          </div>
          <div style={{ flex: 1, position: 'relative', width: '100%', height: '100%' }}>
            <Bar
              data={gapChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    title: { display: true, text: 'Optimality Gap %', color: '#1C2319', font: { weight: 'bold' } },
                    grid: { color: 'rgba(35, 43, 32, 0.12)' },
                    ticks: { color: '#1C2319', font: { family: 'JetBrains Mono' } }
                  },
                  x: { grid: { color: 'rgba(35, 43, 32, 0.12)' }, ticks: { color: '#1C2319', font: { family: 'JetBrains Mono' } } }
                },
                plugins: { legend: { labels: { color: '#1C2319', font: { weight: 'bold' } } } }
              }}
            />
          </div>
        </div>

        {/* Pruning Efficiency */}
        <div className="stage-card" style={{ height: '360px' }}>
          <div style={{ fontSize: '1.02rem', fontWeight: 900, color: '#1C2319', display: 'flex', alignItems: 'center', gap: '0.55rem', borderBottom: '2px solid #232B20', paddingBottom: '0.5rem' }}>
            <div style={{ width: '28px', height: '28px', background: '#A8BBA3', borderRadius: '4px', border: '1.5px solid #232B20', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '1px 1px 0px #232B20' }}>
              <Cpu size={18} color="#1C2319" />
            </div>
            <span>Branch & Bound Pruning Efficiency (Nodes Explored)</span>
          </div>
          <div style={{ flex: 1, position: 'relative', width: '100%', height: '100%' }}>
            <Line
              data={pruningChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    type: 'logarithmic',
                    title: { display: true, text: 'Nodes Explored (log scale)', color: '#1C2319', font: { weight: 'bold' } },
                    grid: { color: 'rgba(35, 43, 32, 0.12)' },
                    ticks: { color: '#1C2319', font: { family: 'JetBrains Mono' } }
                  },
                  x: { grid: { color: 'rgba(35, 43, 32, 0.12)' }, ticks: { color: '#1C2319', font: { family: 'JetBrains Mono' } } }
                },
                plugins: { legend: { labels: { color: '#1C2319', font: { weight: 'bold' } } } }
              }}
            />
          </div>
        </div>

      </div>

      {/* Tabular Benchmark Output */}
      {benchmarkData.length > 0 && (
        <div className="stage-card">
          <div style={{ overflowX: 'auto', borderRadius: 'var(--radius-sm)', border: '2px solid #232B20', boxShadow: 'var(--neo-shadow-xs)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem', fontFamily: 'JetBrains Mono' }}>
              <thead>
                <tr style={{ background: 'rgba(168, 187, 163, 0.45)', borderBottom: '2px solid #232B20', textAlign: 'left', color: '#1C2319' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Instances (n)</th>
                  <th style={{ padding: '0.75rem 1rem' }}>DP Avg Runtime</th>
                  <th style={{ padding: '0.75rem 1rem' }}>B&B Avg Runtime</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Naive BT Runtime</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Greedy Runtime</th>
                  <th style={{ padding: '0.75rem 1rem' }}>B&B Nodes Explored</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Greedy Gap %</th>
                </tr>
              </thead>
              <tbody>
                {benchmarkData.map((r) => (
                  <tr key={r.n} style={{ borderBottom: '1.5px solid #232B20', background: 'rgba(252, 249, 234, 0.75)' }}>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 900, color: '#DB9558' }}>n = {r.n}</td>
                    <td style={{ padding: '0.75rem 1rem', color: '#526639', fontWeight: 800 }}>{r.dpAvgMs !== null ? `${r.dpAvgMs.toFixed(2)} ms` : '-'}</td>
                    <td style={{ padding: '0.75rem 1rem', color: '#44563A', fontWeight: 800 }}>{r.bbAvgMs !== null ? `${r.bbAvgMs.toFixed(2)} ms` : '-'}</td>
                    <td style={{ padding: '0.75rem 1rem', color: '#DB9558', fontWeight: 800 }}>{r.bbNaiveAvgMs !== null ? `${r.bbNaiveAvgMs.toFixed(2)} ms` : '-'}</td>
                    <td style={{ padding: '0.75rem 1rem', color: '#1C2319', fontWeight: 800 }}>{r.greedyAvgMs !== null ? `${r.greedyAvgMs.toFixed(3)} ms` : '-'}</td>
                    <td style={{ padding: '0.75rem 1rem', color: '#1C2319' }}>{r.bbAvgNodes !== null ? r.bbAvgNodes.toLocaleString() : '-'}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      {r.greedyGapPct !== null ? (
                        <span className="badge badge-warning">
                          {r.greedyGapPct.toFixed(2)}%
                        </span>
                      ) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
