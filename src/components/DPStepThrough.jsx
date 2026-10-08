import React, { useState, useEffect, useRef } from 'react';
import { RouteSolvers } from '../algorithms/solvers';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, FastForward, Cpu, AlertCircle } from 'lucide-react';
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
      <div className="stage-card" style={{ textAlign: 'center', padding: '3.5rem 2rem', alignItems: 'center', gap: '1.25rem' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: 'var(--radius-sm)', background: '#fbbf24', border: '2px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--neo-shadow-sm)' }}>
          <AlertCircle size={36} color="#000" />
        </div>
        <h3 style={{ color: '#fff', fontSize: '1.35rem', fontWeight: 800 }}>
          Step-Through Mode is Designed for Small Instances (n ≤ 5)
        </h3>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '580px', fontSize: '0.92rem', lineHeight: 1.6 }}>
          Your current map has <strong>n = {n}</strong> locations ($2^{n} = {1 << n}$ states). For academic screen-recording and step-by-step matrix evaluation, load the 5-node presentation preset.
        </p>
        <button
          className="btn btn-primary"
          style={{ marginTop: '0.5rem' }}
          onClick={() => onLoadPreset('stepthrough_demo')}
        >
          ⚡ Load 5-Node Video Demo Preset
        </button>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="stage-card" style={{ textAlign: 'center', padding: '3.5rem', alignItems: 'center' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Add up to 5 locations on the map canvas to inspect the DP Bitmask table.</p>
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Top Controls Bar */}
      <div className="stage-card">
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <button className="btn btn-secondary btn-sm" onClick={handleStepBackward} disabled={stepIdx === 0}>
              <SkipBack size={15} /> Prev Step
            </button>
            <button className="btn btn-primary btn-sm" onClick={handleTogglePlay}>
              {isPlaying ? <Pause size={15} /> : <Play size={15} fill="currentColor" />}
              {isPlaying ? 'Pause' : 'Auto-Play'}
            </button>
            <button className="btn btn-secondary btn-sm" onClick={handleStepForward} disabled={stepIdx >= history.length - 1}>
              Next Step <SkipForward size={15} />
            </button>
            <button className="btn btn-outline btn-sm" onClick={handleReset}>
              <RotateCcw size={15} /> Reset
            </button>
            <button className="btn btn-outline btn-sm" onClick={handleJumpToEnd}>
              <FastForward size={15} /> End
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.84rem', color: 'var(--text-secondary)', fontWeight: 700 }}>
            <label htmlFor="dp-speed-slider">Speed:</label>
            <input
              type="range"
              id="dp-speed-slider"
              min="200"
              max="2000"
              step="100"
              style={{ width: '120px' }}
              value={playbackSpeedMs}
              onChange={(e) => setPlaybackSpeedMs(Number(e.target.value))}
            />
            <span className="badge badge-pro" style={{ fontSize: '0.72rem' }}>{(playbackSpeedMs / 1000).toFixed(1)}s</span>
          </div>

          <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.9rem', background: 'rgba(6, 10, 20, 0.9)', padding: '0.45rem 0.9rem', borderRadius: 'var(--radius-sm)', border: '2px solid #000000', boxShadow: 'var(--neo-shadow-xs)', color: '#38bdf8', fontWeight: 800 }}>
            Step <strong style={{ color: '#fff' }}>{stepIdx + 1}</strong> / {history.length}
          </div>

        </div>
      </div>

      {/* Active Step Mathematical Card */}
      <div className="stage-card" style={{ background: 'rgba(13, 20, 36, 0.85)', border: '2.5px solid #000000', boxShadow: 'var(--neo-shadow-blue)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #000000', paddingBottom: '0.75rem', gap: '0.6rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span className={`badge ${curStep.type === 'base_case' ? 'badge-warning' : curStep.isBetter ? 'badge-success' : 'badge-danger'}`}>
              {curStep.type === 'base_case' ? 'Base Case (Depot Start)' : curStep.isBetter ? 'Optimal State Relaxation' : 'Suboptimal Branch Pruned'}
            </span>
            <span style={{ fontSize: '0.84rem', color: '#cbd5e1', fontFamily: 'JetBrains Mono', fontWeight: 700 }}>Mask: {curStep.maskBinary}₂</span>
          </div>

          <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.82rem', background: '#000000', padding: '0.4rem 0.75rem', borderRadius: '6px', border: '1.5px solid #38bdf8', color: '#38bdf8', fontWeight: 800, boxShadow: '2px 2px 0px #000' }}>
            DP[S ∪ {'{v}'}][v] = min(DP[S][u] + travel_time(u, v) × W_rem)
          </div>
        </div>

        <div style={{ fontSize: '1rem', color: '#ffffff', lineHeight: 1.65, margin: '0.65rem 0', fontWeight: 600 }}>
          {curStep.explanation}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginTop: '0.5rem' }}>
          <span className="seq-chip"><strong>Subset Mask:</strong> {curStep.maskBinary}₂ ({maskToSetNotation(curStep.mask)})</span>
          <span className="seq-chip"><strong>Target Facility:</strong> #{curStep.last + 1} ({locations[curStep.last]?.name})</span>
          <span className="seq-chip"><strong>From Node:</strong> {curStep.prev === 'Depot' ? 'HQ Depot' : `Node #${curStep.prev + 1}`}</span>
          <span className="seq-chip"><strong>Remaining Weight:</strong> {curStep.remWeight}</span>
          <span className="seq-chip"><strong>Δ Penalty:</strong> +{curStep.costAdded?.toFixed(1)}</span>
          <span className="seq-chip" style={{ borderLeft: '5px solid #10b981', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', fontWeight: 800 }}>
            <strong>Accumulated Cost:</strong> {curStep.totalCost?.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Interactive Matrix Grid */}
      <div className="stage-card">
        <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.55rem', borderBottom: '2px solid #000000', paddingBottom: '0.65rem' }}>
          <div style={{ width: '28px', height: '28px', background: '#06b6d4', borderRadius: '4px', border: '1.5px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '1px 1px 0px #000' }}>
            <Cpu size={18} color="#000000" />
          </div>
          <span>Dynamic Programming Matrix State Explorer: DP[mask][last]</span>
        </div>

        <div style={{ overflowX: 'auto', maxHeight: '440px', borderRadius: 'var(--radius-sm)', border: '2px solid #000000', boxShadow: 'var(--neo-shadow-xs)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'JetBrains Mono', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ background: 'rgba(6, 10, 20, 0.95)', borderBottom: '2px solid #000000', position: 'sticky', top: 0, zIndex: 5 }}>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#ffffff', fontWeight: 800 }}>Subset Mask (Binary / Set)</th>
                {locations.map((loc, idx) => (
                  <th key={idx} style={{ padding: '0.75rem 1rem', textAlign: 'center', color: '#38bdf8', fontWeight: 800 }}>
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
                      borderBottom: '1.5px solid #000000',
                      background: isRowActive ? 'rgba(56, 189, 248, 0.22)' : 'rgba(15, 23, 42, 0.65)'
                    }}
                  >
                    <td style={{ padding: '0.65rem 1rem', whiteSpace: 'nowrap' }}>
                      <span style={{ color: '#38bdf8', fontWeight: 800, background: '#000', padding: '0.1rem 0.4rem', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.2)' }}>{bin}₂</span>{' '}
                      <span style={{ color: '#cbd5e1', fontWeight: 600, marginLeft: '0.35rem' }}>{maskToSetNotation(mask)}</span>
                    </td>
                    {locations.map((_, j) => {
                      const isMember = (mask & (1 << j)) !== 0;
                      const isCellActive = isRowActive && curStep.last === j;
                      const val = cellValues[`${mask}-${j}`];

                      if (!isMember) {
                        return (
                          <td key={j} style={{ padding: '0.65rem 1rem', textAlign: 'center', color: '#475569' }}>
                            -
                          </td>
                        );
                      }

                      return (
                        <td
                          key={j}
                          style={{
                            padding: '0.65rem 1rem',
                            textAlign: 'center',
                            background: isCellActive ? '#10b981' : 'transparent',
                            color: isCellActive ? '#000000' : val !== undefined ? '#ffffff' : 'var(--text-muted)',
                            fontWeight: isCellActive ? 900 : val !== undefined ? 700 : 500,
                            border: isCellActive ? '2px solid #000000' : 'none',
                            boxShadow: isCellActive ? 'inset 0 0 0 1px #fff' : 'none'
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
