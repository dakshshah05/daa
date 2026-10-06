import React, { useState, useEffect, useRef } from 'react';
import { RouteSolvers } from '../algorithms/solvers';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, FastForward, Cpu, Check, AlertCircle } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export function DPStepThrough({ depot, locations, speed, onLoadPreset }) {
  const [history, setHistory] = useState([]);
  const [stepIdx, setStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeedMs, setPlaybackSpeedMs] = useState(800);
  const timerRef = useRef(null);

  const n = locations.length;
  const isTooLarge = n > 5;

  useEffect(() => {
    if (isTooLarge || n === 0) {
      setHistory([]);
      setStepIdx(0);
      return;
    }

    // Solve with step recording
    const res = RouteSolvers.solveDP(depot, locations, speed, true);
    setHistory(res.stepHistory || []);
    setStepIdx(0);
  }, [depot, locations, speed, isTooLarge, n]);

  // Auto-play timer
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setStepIdx((prev) => {
          if (prev < history.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, playbackSpeedMs);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isPlaying, playbackSpeedMs, history.length]);

  const handleStepForward = () => {
    if (stepIdx < history.length - 1) {
      sounds.playClick();
      setStepIdx(stepIdx + 1);
    }
  };

  const handleStepBackward = () => {
    if (stepIdx > 0) {
      sounds.playClick();
      setStepIdx(stepIdx - 1);
    }
  };

  const handleReset = () => {
    sounds.playClick();
    setIsPlaying(false);
    setStepIdx(0);
  };

  const handleJumpToEnd = () => {
    sounds.playClick();
    setIsPlaying(false);
    if (history.length > 0) setStepIdx(history.length - 1);
  };

  const handleTogglePlay = () => {
    sounds.playClick();
    setIsPlaying(!isPlaying);
  };

  if (isTooLarge) {
    return (
      <div className="stage-card" style={{ textAlign: 'center', padding: '3rem 2rem', alignItems: 'center' }}>
        <AlertCircle size={48} color="#f59e0b" />
        <h3 style={{ color: '#fff', fontSize: '1.25rem', marginTop: '0.75rem' }}>
          Step-Through Mode is Designed for Small Instances (n ≤ 5)
        </h3>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '550px', fontSize: '0.9rem' }}>
          Your current map has <strong>n = {n}</strong> locations ($2^{n} = {1 << n}$ states). For video presentation clarity and tabular screen-recording, load the 5-node demo preset.
        </p>
        <button
          className="btn btn-primary"
          style={{ marginTop: '1rem' }}
          onClick={() => onLoadPreset('stepthrough_demo')}
        >
          ⚡ Load 5-Node Video Demo Preset
        </button>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="stage-card" style={{ textAlign: 'center', padding: '3rem' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Add up to 5 locations on the map canvas to inspect the DP Bitmask table.</p>
      </div>
    );
  }

  const curStep = history[stepIdx] || {};
  const numStates = 1 << n;

  // Build cell values up to current step
  const cellValues = {};
  for (let s = 0; s <= stepIdx; s++) {
    const item = history[s];
    if (item && item.isBetter !== false) {
      cellValues[`${item.mask}-${item.last}`] = item.totalCost;
    }
  }

  const maskToSetNotation = (mask) => {
    const arr = [];
    for (let i = 0; i < n; i++) {
      if ((mask & (1 << i)) !== 0) arr.push(i + 1);
    }
    return `{${arr.join(', ')}}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Top Controls Bar */}
      <div className="stage-card">
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button className="btn btn-secondary btn-sm" onClick={handleStepBackward} disabled={stepIdx === 0}>
              <SkipBack size={14} /> Prev Step
            </button>
            <button className="btn btn-primary btn-sm" onClick={handleTogglePlay}>
              {isPlaying ? <Pause size={14} /> : <Play size={14} fill="currentColor" />}
              {isPlaying ? 'Pause' : 'Auto-Play'}
            </button>
            <button className="btn btn-secondary btn-sm" onClick={handleStepForward} disabled={stepIdx >= history.length - 1}>
              Next Step <SkipForward size={14} />
            </button>
            <button className="btn btn-outline btn-sm" onClick={handleReset}>
              <RotateCcw size={14} /> Reset
            </button>
            <button className="btn btn-outline btn-sm" onClick={handleJumpToEnd}>
              <FastForward size={14} /> End
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            <label htmlFor="dp-speed-slider">Speed:</label>
            <input
              type="range"
              id="dp-speed-slider"
              min="200"
              max="2000"
              step="100"
              value={playbackSpeedMs}
              onChange={(e) => setPlaybackSpeedMs(Number(e.target.value))}
            />
            <span style={{ color: 'var(--accent-blue)', minWidth: '40px' }}>{(playbackSpeedMs / 1000).toFixed(1)}s</span>
          </div>

          <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.9rem', background: 'var(--bg-secondary)', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', color: 'var(--accent-blue)' }}>
            Step <strong>{stepIdx + 1}</strong> / {history.length}
          </div>

        </div>
      </div>

      {/* Active Step Mathematical Card */}
      <div className="stage-card" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-active)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.65rem', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className={`badge ${curStep.type === 'base_case' ? 'badge-warning' : curStep.isBetter ? 'badge-success' : 'badge-danger'}`}>
              {curStep.type === 'base_case' ? 'Base Case (Depot Start)' : curStep.isBetter ? 'Optimal State Relaxation' : 'Suboptimal Branch Pruned'}
            </span>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Mask: {curStep.maskBinary}₂</span>
          </div>

          <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.78rem', background: '#060911', padding: '0.3rem 0.6rem', borderRadius: '4px', color: '#38bdf8' }}>
            DP[S ∪ {'{v}'}][v] = min(DP[S][u] + travel_time(u, v) × W_rem)
          </div>
        </div>

        <div style={{ fontSize: '0.95rem', color: '#fff', lineHeight: 1.6, margin: '0.5rem 0' }}>
          {curStep.explanation}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
          <span className="seq-chip"><strong>Subset Mask:</strong> {curStep.maskBinary}₂ ({maskToSetNotation(curStep.mask)})</span>
          <span className="seq-chip"><strong>Target Facility:</strong> #{curStep.last + 1} ({locations[curStep.last]?.name})</span>
          <span className="seq-chip"><strong>From Node:</strong> {curStep.prev === 'Depot' ? 'HQ Depot' : `Node #${curStep.prev + 1}`}</span>
          <span className="seq-chip"><strong>Remaining Weight:</strong> {curStep.remWeight}</span>
          <span className="seq-chip"><strong>Δ Penalty:</strong> +{curStep.costAdded?.toFixed(1)}</span>
          <span className="seq-chip" style={{ borderLeft: '4px solid #10b981', color: '#34d399' }}>
            <strong>Accumulated Cost:</strong> {curStep.totalCost?.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Interactive Matrix Grid */}
      <div className="stage-card">
        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Cpu size={16} color="#06b6d4" />
          <span>Dynamic Programming Matrix State Explorer: DP[mask][last]</span>
        </div>

        <div style={{ overflowX: 'auto', maxHeight: '420px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'JetBrains Mono', fontSize: '0.8rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)', position: 'sticky', top: 0, zIndex: 5 }}>
                <th style={{ padding: '0.65rem 0.9rem', textAlign: 'left' }}>Subset Mask (Binary / Set)</th>
                {locations.map((loc, idx) => (
                  <th key={idx} style={{ padding: '0.65rem 0.9rem', textAlign: 'center' }}>
                    Last: #{idx + 1} ({loc.name.split(' ')[0]})
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: numStates - 1 }, (_, i) => i + 1).map((mask) => {
                const bin = mask.toString(2).padStart(n, '0');
                const isRowActive = curStep.mask === mask;
                return (
                  <tr
                    key={mask}
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      background: isRowActive ? 'rgba(56, 189, 248, 0.12)' : 'transparent'
                    }}
                  >
                    <td style={{ padding: '0.6rem 0.9rem', whiteSpace: 'nowrap' }}>
                      <span style={{ color: '#38bdf8', fontWeight: 700 }}>{bin}₂</span>{' '}
                      <span style={{ color: 'var(--text-muted)' }}>{maskToSetNotation(mask)}</span>
                    </td>
                    {locations.map((_, j) => {
                      const isMember = (mask & (1 << j)) !== 0;
                      const isCellActive = isRowActive && curStep.last === j;
                      const val = cellValues[`${mask}-${j}`];

                      if (!isMember) {
                        return (
                          <td key={j} style={{ padding: '0.6rem 0.9rem', textAlign: 'center', color: '#334155' }}>
                            -
                          </td>
                        );
                      }

                      return (
                        <td
                          key={j}
                          style={{
                            padding: '0.6rem 0.9rem',
                            textAlign: 'center',
                            background: isCellActive ? 'rgba(16, 185, 129, 0.3)' : 'transparent',
                            color: isCellActive ? '#fff' : val !== undefined ? 'var(--text-primary)' : 'var(--text-muted)',
                            fontWeight: isCellActive ? 800 : 500,
                            border: isCellActive ? '1px solid #10b981' : 'none'
                          }}
                        >
                          {val !== undefined ? val.toFixed(1) : '∞'}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
