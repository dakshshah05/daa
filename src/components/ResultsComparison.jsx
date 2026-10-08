import React from 'react';
import { Award, AlertTriangle, CheckCircle2, HelpCircle } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export function ResultsComparison({ allSol, currentSolver, onOpenTeacherGuide }) {
  if (!allSol) return null;

  const dp = allSol.dp;
  const bb = allSol.backtracking;
  const greedy = allSol.greedy;

  return (
    <div className="stage-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', borderBottom: '2px solid #000000', paddingBottom: '0.65rem' }}>
        <div style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '28px', height: '28px', background: '#fbbf24', borderRadius: '4px', border: '1.5px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '1px 1px 0px #000' }}>
            <Award size={18} color="#000000" />
          </div>
          <span>Algorithm Performance & Optimality Matrix</span>
        </div>
        {onOpenTeacherGuide && (
          <button
            className="btn btn-sm btn-outline"
            style={{ fontSize: '0.74rem', padding: '0.35rem 0.75rem' }}
            onClick={() => {
              sounds.playClick();
              onOpenTeacherGuide();
            }}
          >
            <HelpCircle size={14} color="#38bdf8" /> Explain Results
          </button>
        )}
      </div>

      {/* Greedy Failure Trap Alert */}
      {greedy && greedy.optimalityGapPct > 5 && (
        <div style={{ background: 'rgba(255, 51, 102, 0.18)', backdropFilter: 'var(--glass-blur)', border: '2px solid #000000', color: '#ffb3c6', padding: '0.85rem 1.15rem', borderRadius: 'var(--radius-sm)', fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '0.75rem', boxShadow: 'var(--neo-shadow-crimson)' }}>
          <AlertTriangle size={22} color="#ff3366" style={{ flexShrink: 0 }} />
          <div>
            <strong style={{ color: '#ffffff' }}>⚠️ Greedy Heuristic Suboptimality Warning:</strong> Greedy missed the global optimum by{' '}
            <strong style={{ color: '#ff4d7a', background: '#000', padding: '0.1rem 0.4rem', borderRadius: '4px', border: '1px solid #ff3366' }}>+{greedy.optimalityGapPct.toFixed(1)}%</strong> (+{(greedy.totalCost - (dp?.totalCost || bb?.totalCost || 0)).toFixed(1)} penalty units). DP prioritizes critical emergency trauma ICUs first!
          </div>
        </div>
      )}

      {/* Comparison Table */}
      <div style={{ overflowX: 'auto', width: '100%', borderRadius: 'var(--radius-sm)', border: '2px solid #000000', boxShadow: 'var(--neo-shadow-xs)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
          <thead>
            <tr style={{ background: 'rgba(6, 10, 20, 0.95)', borderBottom: '2px solid #000000', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              <th style={{ padding: '0.75rem 0.9rem' }}>Algorithm</th>
              <th style={{ padding: '0.75rem 0.9rem' }}>Weighted Penalty (Σ wᵢ·tᵢ)</th>
              <th style={{ padding: '0.75rem 0.9rem' }}>Runtime</th>
              <th style={{ padding: '0.75rem 0.9rem' }}>States / Nodes</th>
              <th style={{ padding: '0.75rem 0.9rem' }}>Memory</th>
              <th style={{ padding: '0.75rem 0.9rem' }}>Optimality Gap</th>
            </tr>
          </thead>
          <tbody>
            {/* DP Row */}
            {dp ? (
              <tr style={{ borderBottom: '1.5px solid #000000', background: currentSolver === 'dp' ? 'rgba(16, 185, 129, 0.22)' : 'rgba(15, 23, 42, 0.7)' }}>
                <td style={{ padding: '0.75rem 0.9rem' }}>
                  <span className="algo-badge badge-dp">Bitmask DP</span>
                </td>
                <td style={{ padding: '0.75rem 0.9rem', fontWeight: 800, color: '#34d399', fontSize: '0.92rem' }}>
                  {dp.totalCost.toFixed(1)} wt·s
                </td>
                <td style={{ padding: '0.75rem 0.9rem', fontFamily: 'JetBrains Mono', fontWeight: 700 }}>{dp.runtimeMs.toFixed(2)} ms</td>
                <td style={{ padding: '0.75rem 0.9rem', fontFamily: 'JetBrains Mono' }}>{dp.nodesExplored.toLocaleString()}</td>
                <td style={{ padding: '0.75rem 0.9rem', fontFamily: 'JetBrains Mono' }}>{dp.memoryEstimate}</td>
                <td style={{ padding: '0.75rem 0.9rem' }}>
                  <span className="badge badge-success"><CheckCircle2 size={12} /> 0.00% (Optimal)</span>
                </td>
              </tr>
            ) : allSol.dpError ? (
              <tr style={{ borderBottom: '1.5px solid #000000' }}>
                <td style={{ padding: '0.75rem 0.9rem' }}><span className="algo-badge badge-dp">Bitmask DP</span></td>
                <td colSpan={5} style={{ padding: '0.75rem 0.9rem', color: '#fbbf24' }}>{allSol.dpError}</td>
              </tr>
            ) : null}

            {/* B&B Row */}
            {bb ? (
              <tr style={{ borderBottom: '1.5px solid #000000', background: currentSolver === 'backtracking' ? 'rgba(6, 182, 212, 0.22)' : 'rgba(15, 23, 42, 0.5)' }}>
                <td style={{ padding: '0.75rem 0.9rem' }}>
                  <span className="algo-badge badge-bb">{bb.name}</span>
                </td>
                <td style={{ padding: '0.75rem 0.9rem', fontWeight: 800, color: '#22d3ee', fontSize: '0.92rem' }}>
                  {bb.totalCost.toFixed(1)} wt·s
                </td>
                <td style={{ padding: '0.75rem 0.9rem', fontFamily: 'JetBrains Mono', fontWeight: 700 }}>{bb.runtimeMs.toFixed(2)} ms</td>
                <td style={{ padding: '0.75rem 0.9rem', fontFamily: 'JetBrains Mono' }}>{bb.nodesExplored.toLocaleString()}</td>
                <td style={{ padding: '0.75rem 0.9rem', fontFamily: 'JetBrains Mono' }}>{bb.memoryEstimate}</td>
                <td style={{ padding: '0.75rem 0.9rem' }}>
                  {bb.optimalityGapPct > 0 ? (
                    <span className="badge badge-danger">+{bb.optimalityGapPct.toFixed(2)}%</span>
                  ) : (
                    <span className="badge badge-success"><CheckCircle2 size={12} /> 0.00% (Optimal)</span>
                  )}
                </td>
              </tr>
            ) : allSol.bbError ? (
              <tr style={{ borderBottom: '1.5px solid #000000' }}>
                <td style={{ padding: '0.75rem 0.9rem' }}><span className="algo-badge badge-bb">Branch & Bound</span></td>
                <td colSpan={5} style={{ padding: '0.75rem 0.9rem', color: '#fbbf24' }}>{allSol.bbError}</td>
              </tr>
            ) : null}

            {/* Greedy Row */}
            {greedy && (
              <tr style={{ background: currentSolver === 'greedy' ? 'rgba(245, 158, 11, 0.22)' : 'rgba(15, 23, 42, 0.7)' }}>
                <td style={{ padding: '0.75rem 0.9rem' }}>
                  <span className="algo-badge badge-greedy">Greedy (Max w/t)</span>
                </td>
                <td style={{ padding: '0.75rem 0.9rem', fontWeight: 800, color: greedy.optimalityGapPct > 5 ? '#ff4d7a' : '#fbbf24', fontSize: '0.92rem' }}>
                  {greedy.totalCost.toFixed(1)} wt·s
                </td>
                <td style={{ padding: '0.75rem 0.9rem', fontFamily: 'JetBrains Mono', fontWeight: 700 }}>{greedy.runtimeMs.toFixed(3)} ms</td>
                <td style={{ padding: '0.75rem 0.9rem', fontFamily: 'JetBrains Mono' }}>{greedy.nodesExplored.toLocaleString()}</td>
                <td style={{ padding: '0.75rem 0.9rem', fontFamily: 'JetBrains Mono' }}>{greedy.memoryEstimate}</td>
                <td style={{ padding: '0.75rem 0.9rem' }}>
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
