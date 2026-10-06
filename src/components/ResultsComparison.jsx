import React from 'react';
import { Award, AlertTriangle, CheckCircle2 } from 'lucide-react';

export function ResultsComparison({ allSol, currentSolver }) {
  if (!allSol) return null;

  const dp = allSol.dp;
  const bb = allSol.backtracking;
  const greedy = allSol.greedy;

  return (
    <div className="stage-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Award size={18} color="#fbbf24" />
          <span>Algorithm Performance & Optimality Benchmark</span>
        </div>
      </div>

      {/* Greedy Failure Trap Alert */}
      {greedy && greedy.optimalityGapPct > 10 && (
        <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#fca5a5', padding: '0.65rem 0.9rem', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <AlertTriangle size={18} color="#ef4444" style={{ flexShrink: 0 }} />
          <div>
            <strong>⚠️ Greedy Heuristic Suboptimality:</strong> The greedy algorithm missed the global optimum by{' '}
            <strong>+{greedy.optimalityGapPct.toFixed(1)}%</strong> (+{(greedy.totalCost - (dp?.totalCost || bb?.totalCost || 0)).toFixed(1)} penalty delay). DP guarantees the absolute minimum mortality risk!
          </div>
        </div>
      )}

      {/* Comparison Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '0.6rem 0.75rem' }}>Algorithm</th>
              <th style={{ padding: '0.6rem 0.75rem' }}>Weighted Penalty (Σ wᵢ·tᵢ)</th>
              <th style={{ padding: '0.6rem 0.75rem' }}>Execution Time</th>
              <th style={{ padding: '0.6rem 0.75rem' }}>States Explored</th>
              <th style={{ padding: '0.6rem 0.75rem' }}>Memory Footprint</th>
              <th style={{ padding: '0.6rem 0.75rem' }}>Optimality Gap</th>
            </tr>
          </thead>
          <tbody>
            {/* DP Row */}
            {dp ? (
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: currentSolver === 'dp' ? 'rgba(16, 185, 129, 0.1)' : 'transparent' }}>
                <td style={{ padding: '0.65rem 0.75rem' }}>
                  <span className="algo-badge badge-dp">Bitmask DP</span>
                </td>
                <td style={{ padding: '0.65rem 0.75rem', fontWeight: 700, color: '#10b981' }}>
                  {dp.totalCost.toFixed(1)} wt·s
                </td>
                <td style={{ padding: '0.65rem 0.75rem' }}>{dp.runtimeMs.toFixed(2)} ms</td>
                <td style={{ padding: '0.65rem 0.75rem' }}>{dp.nodesExplored.toLocaleString()}</td>
                <td style={{ padding: '0.65rem 0.75rem' }}>{dp.memoryEstimate}</td>
                <td style={{ padding: '0.65rem 0.75rem' }}>
                  <span className="badge badge-success"><CheckCircle2 size={12} /> 0.00% (Optimal)</span>
                </td>
              </tr>
            ) : allSol.dpError ? (
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '0.65rem 0.75rem' }}><span className="algo-badge badge-dp">Bitmask DP</span></td>
                <td colSpan={5} style={{ padding: '0.65rem 0.75rem', color: '#fbbf24' }}>{allSol.dpError}</td>
              </tr>
            ) : null}

            {/* B&B Row */}
            {bb ? (
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: currentSolver === 'backtracking' ? 'rgba(6, 182, 212, 0.1)' : 'transparent' }}>
                <td style={{ padding: '0.65rem 0.75rem' }}>
                  <span className="algo-badge badge-bb">{bb.name}</span>
                </td>
                <td style={{ padding: '0.65rem 0.75rem', fontWeight: 700 }}>
                  {bb.totalCost.toFixed(1)} wt·s
                </td>
                <td style={{ padding: '0.65rem 0.75rem' }}>{bb.runtimeMs.toFixed(2)} ms</td>
                <td style={{ padding: '0.65rem 0.75rem' }}>{bb.nodesExplored.toLocaleString()}</td>
                <td style={{ padding: '0.65rem 0.75rem' }}>{bb.memoryEstimate}</td>
                <td style={{ padding: '0.65rem 0.75rem' }}>
                  {bb.optimalityGapPct > 0 ? (
                    <span className="badge badge-danger">+{bb.optimalityGapPct.toFixed(2)}%</span>
                  ) : (
                    <span className="badge badge-success"><CheckCircle2 size={12} /> 0.00% (Optimal)</span>
                  )}
                </td>
              </tr>
            ) : allSol.bbError ? (
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '0.65rem 0.75rem' }}><span className="algo-badge badge-bb">Branch & Bound</span></td>
                <td colSpan={5} style={{ padding: '0.65rem 0.75rem', color: '#fbbf24' }}>{allSol.bbError}</td>
              </tr>
            ) : null}

            {/* Greedy Row */}
            {greedy && (
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: currentSolver === 'greedy' ? 'rgba(245, 158, 11, 0.1)' : 'transparent' }}>
                <td style={{ padding: '0.65rem 0.75rem' }}>
                  <span className="algo-badge badge-greedy">Greedy (Max w/t)</span>
                </td>
                <td style={{ padding: '0.65rem 0.75rem', fontWeight: 700, color: greedy.optimalityGapPct > 5 ? '#f87171' : 'inherit' }}>
                  {greedy.totalCost.toFixed(1)} wt·s
                </td>
                <td style={{ padding: '0.65rem 0.75rem' }}>{greedy.runtimeMs.toFixed(3)} ms</td>
                <td style={{ padding: '0.65rem 0.75rem' }}>{greedy.nodesExplored.toLocaleString()}</td>
                <td style={{ padding: '0.65rem 0.75rem' }}>{greedy.memoryEstimate}</td>
                <td style={{ padding: '0.65rem 0.75rem' }}>
                  {greedy.optimalityGapPct > 0 ? (
                    <span className="badge badge-danger">+{greedy.optimalityGapPct.toFixed(2)}% Suboptimal</span>
                  ) : (
                    <span className="badge badge-success">0.00%</span>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
