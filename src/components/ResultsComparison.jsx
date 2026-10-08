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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', borderBottom: '2px solid #232B20', paddingBottom: '0.65rem' }}>
        <div style={{ fontSize: '1.02rem', fontWeight: 900, color: '#1C2319', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '30px', height: '30px', background: '#DB9558', borderRadius: '4px', border: '1.5px solid #232B20', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '1px 1px 0px #232B20' }}>
            <Award size={18} color="#FCF9EA" />
          </div>
          <span>Algorithm Performance & Optimality Matrix</span>
        </div>
        {onOpenTeacherGuide && (
          <button
            className="btn btn-sm btn-outline"
            style={{ fontSize: '0.76rem', padding: '0.35rem 0.75rem' }}
            onClick={() => {
              sounds.playClick();
              onOpenTeacherGuide();
            }}
          >
            <HelpCircle size={15} color="#DB9558" /> Explain Results
          </button>
        )}
      </div>

      {/* Greedy Failure Trap Alert */}
      {greedy && greedy.optimalityGapPct > 5 && (
        <div style={{ background: 'rgba(219, 149, 88, 0.25)', backdropFilter: 'var(--glass-blur)', border: '2px solid #232B20', color: '#1C2319', padding: '0.85rem 1.15rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.75rem', boxShadow: 'var(--neo-shadow-terracotta)' }}>
          <AlertTriangle size={22} color="#DB9558" style={{ flexShrink: 0 }} />
          <div>
            <strong style={{ color: '#1C2319' }}>⚠️ Greedy Heuristic Suboptimality Warning:</strong> Greedy missed the global optimum by{' '}
            <strong style={{ color: '#FCF9EA', background: '#DB9558', padding: '0.15rem 0.45rem', borderRadius: '4px', border: '1px solid #232B20' }}>+{greedy.optimalityGapPct.toFixed(1)}%</strong> (+{(greedy.totalCost - (dp?.totalCost || bb?.totalCost || 0)).toFixed(1)} penalty units). DP prioritizes critical emergency trauma ICUs first!
          </div>
        </div>
      )}

      {/* Comparison Table */}
      <div style={{ overflowX: 'auto', width: '100%', borderRadius: 'var(--radius-sm)', border: '2px solid #232B20', boxShadow: 'var(--neo-shadow-xs)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
          <thead>
            <tr style={{ background: 'rgba(168, 187, 163, 0.45)', borderBottom: '2px solid #232B20', textAlign: 'left', color: '#1C2319', fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
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
              <tr style={{ borderBottom: '1.5px solid #232B20', background: currentSolver === 'dp' ? 'rgba(151, 168, 122, 0.35)' : 'rgba(252, 249, 234, 0.75)' }}>
                <td style={{ padding: '0.75rem 0.9rem' }}>
                  <span className="algo-badge badge-dp">Bitmask DP</span>
                </td>
                <td style={{ padding: '0.75rem 0.9rem', fontWeight: 900, color: '#526639', fontSize: '0.94rem' }}>
                  {dp.totalCost.toFixed(1)} wt·s
                </td>
                <td style={{ padding: '0.75rem 0.9rem', fontFamily: 'JetBrains Mono', fontWeight: 700, color: '#1C2319' }}>{dp.runtimeMs.toFixed(2)} ms</td>
                <td style={{ padding: '0.75rem 0.9rem', fontFamily: 'JetBrains Mono', color: '#1C2319' }}>{dp.nodesExplored.toLocaleString()}</td>
                <td style={{ padding: '0.75rem 0.9rem', fontFamily: 'JetBrains Mono', color: '#1C2319' }}>{dp.memoryEstimate}</td>
                <td style={{ padding: '0.75rem 0.9rem' }}>
                  <span className="badge badge-success"><CheckCircle2 size={12} /> 0.00% (Optimal)</span>
                </td>
              </tr>
            ) : allSol.dpError ? (
              <tr style={{ borderBottom: '1.5px solid #232B20' }}>
                <td style={{ padding: '0.75rem 0.9rem' }}><span className="algo-badge badge-dp">Bitmask DP</span></td>
                <td colSpan={5} style={{ padding: '0.75rem 0.9rem', color: '#DB9558' }}>{allSol.dpError}</td>
              </tr>
            ) : null}

            {/* B&B Row */}
            {bb ? (
              <tr style={{ borderBottom: '1.5px solid #232B20', background: currentSolver === 'backtracking' ? 'rgba(168, 187, 163, 0.45)' : 'rgba(252, 249, 234, 0.6)' }}>
                <td style={{ padding: '0.75rem 0.9rem' }}>
                  <span className="algo-badge badge-bb">{bb.name}</span>
                </td>
                <td style={{ padding: '0.75rem 0.9rem', fontWeight: 900, color: '#44563A', fontSize: '0.94rem' }}>
                  {bb.totalCost.toFixed(1)} wt·s
                </td>
                <td style={{ padding: '0.75rem 0.9rem', fontFamily: 'JetBrains Mono', fontWeight: 700, color: '#1C2319' }}>{bb.runtimeMs.toFixed(2)} ms</td>
                <td style={{ padding: '0.75rem 0.9rem', fontFamily: 'JetBrains Mono', color: '#1C2319' }}>{bb.nodesExplored.toLocaleString()}</td>
                <td style={{ padding: '0.75rem 0.9rem', fontFamily: 'JetBrains Mono', color: '#1C2319' }}>{bb.memoryEstimate}</td>
                <td style={{ padding: '0.75rem 0.9rem' }}>
                  {bb.optimalityGapPct > 0 ? (
                    <span className="badge badge-danger">+{bb.optimalityGapPct.toFixed(2)}%</span>
                  ) : (
                    <span className="badge badge-success"><CheckCircle2 size={12} /> 0.00% (Optimal)</span>
                  )}
                </td>
              </tr>
            ) : allSol.bbError ? (
              <tr style={{ borderBottom: '1.5px solid #232B20' }}>
                <td style={{ padding: '0.75rem 0.9rem' }}><span className="algo-badge badge-bb">Branch & Bound</span></td>
                <td colSpan={5} style={{ padding: '0.75rem 0.9rem', color: '#DB9558' }}>{allSol.bbError}</td>
              </tr>
            ) : null}

            {/* Greedy Row */}
            {greedy && (
              <tr style={{ background: currentSolver === 'greedy' ? 'rgba(219, 149, 88, 0.3)' : 'rgba(252, 249, 234, 0.75)' }}>
                <td style={{ padding: '0.75rem 0.9rem' }}>
                  <span className="algo-badge badge-greedy">Greedy (Max w/t)</span>
                </td>
                <td style={{ padding: '0.75rem 0.9rem', fontWeight: 900, color: greedy.optimalityGapPct > 5 ? '#DB9558' : '#1C2319', fontSize: '0.94rem' }}>
                  {greedy.totalCost.toFixed(1)} wt·s
                </td>
                <td style={{ padding: '0.75rem 0.9rem', fontFamily: 'JetBrains Mono', fontWeight: 700, color: '#1C2319' }}>{greedy.runtimeMs.toFixed(3)} ms</td>
                <td style={{ padding: '0.75rem 0.9rem', fontFamily: 'JetBrains Mono', color: '#1C2319' }}>{greedy.nodesExplored.toLocaleString()}</td>
                <td style={{ padding: '0.75rem 0.9rem', fontFamily: 'JetBrains Mono', color: '#1C2319' }}>{greedy.memoryEstimate}</td>
                <td style={{ padding: '0.75rem 0.9rem' }}>
                  {greedy.optimalityGapPct > 0 ? (
                    <span className="badge badge-warning">+{greedy.optimalityGapPct.toFixed(2)}% Suboptimal</span>
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
