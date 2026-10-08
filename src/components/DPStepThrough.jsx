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
        <div style={{ width: '64px', height: '64px', borderRadius: 'var(--radius-sm)', background: '#DB9558', border: '2px solid #232B20', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--neo-shadow-sm)' }}>
          <AlertCircle size={36} color="#FCF9EA" />
        </div>
        <h3 style={{ color: '#1C2319', fontSize: '1.35rem', fontWeight: 900 }}>
          Step-Through Mode is Designed for Small Instances (n ≤ 5)
        </h3>
        <p style={{ color: '#3D4838', maxWidth: '580px', fontSize: '0.92rem', lineHeight: 1.6, fontWeight: 600 }}>
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
        <p style={{ color: '#3D4838', fontSize: '0.95rem', fontWeight: 600 }}>Add up to 5 locations on the map canvas to inspect the DP Bitmask table.</p>
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.84rem', color: '#1C2319', fontWeight: 800 }}>
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
            <span className="badge badge-pro" style={{ fontSize: '0.74rem' }}>{(playbackSpeedMs / 1000).toFixed(1)}s</span>
          </div>

          <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.92rem', background: 'rgba(252, 249, 234, 0.95)', padding: '0.45rem 0.9rem', borderRadius: 'var(--radius-sm)', border: '2px solid #232B20', boxShadow: 'var(--neo-shadow-xs)', color: '#1C2319', fontWeight: 900 }}>
            Step <strong style={{ color: '#DB9558' }}>{stepIdx + 1}</strong> / {history.length}
          </div>

        </div>
      </div>

      {/* Active Step Mathematical Card */}
      <div className="stage-card" style={{ background: 'rgba(252, 249, 234, 0.85)', border: '2.5px solid #232B20', boxShadow: 'var(--neo-shadow-terracotta)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #232B20', paddingBottom: '0.75rem', gap: '0.6rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span className={`badge ${curStep.type === 'base_case' ? 'badge-warning' : curStep.isBetter ? 'badge-success' : 'badge-danger'}`}>
              {curStep.type === 'base_case' ? 'Base Case (Depot Start)' : curStep.isBetter ? 'Optimal State Relaxation' : 'Suboptimal Branch Pruned'}
            </span>
            <span style={{ fontSize: '0.84rem', color: '#3D4838', fontFamily: 'JetBrains Mono', fontWeight: 800 }}>Mask: {curStep.maskBinary}₂</span>
          </div>

          <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.82rem', background: '#232B20', padding: '0.4rem 0.75rem', borderRadius: '6px', border: '1.5px solid #232B20', color: '#FCF9EA', fontWeight: 800, boxShadow: '2px 2px 0px #DB9558' }}>
            DP[S ∪ {'{v}'}][v] = min(DP[S][u] + travel_time(u, v) × W_rem)
          </div>
        </div>

        <div style={{ fontSize: '1rem', color: '#1C2319', lineHeight: 1.65, margin: '0.65rem 0', fontWeight: 700 }}>
          {curStep.explanation}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginTop: '0.5rem' }}>
          <span className="seq-chip"><strong>Subset Mask:</strong> {curStep.maskBinary}₂ ({maskToSetNotation(curStep.mask)})</span>
          <span className="seq-chip"><strong>Target Facility:</strong> #{curStep.last + 1} ({locations[curStep.last]?.name})</span>
          <span className="seq-chip"><strong>From Node:</strong> {curStep.prev === 'Depot' ? 'HQ Depot' : `Node #${curStep.prev + 1}`}</span>
          <span className="seq-chip"><strong>Remaining Weight:</strong> {curStep.remWeight}</span>
          <span className="seq-chip"><strong>Δ Penalty:</strong> +{curStep.costAdded?.toFixed(1)}</span>
          <span className="seq-chip" style={{ borderLeft: '5px solid #97A87A', background: 'rgba(151, 168, 122, 0.25)', color: '#1C2319', fontWeight: 900 }}>
            <strong>Accumulated Cost:</strong> {curStep.totalCost?.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Interactive Matrix Grid */}
      <div className="stage-card">
        <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#1C2319', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.55rem', borderBottom: '2px solid #232B20', paddingBottom: '0.65rem' }}>
          <div style={{ width: '28px', height: '28px', background: '#97A87A', borderRadius: '4px', border: '1.5px solid #232B20', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '1px 1px 0px #232B20' }}>
            <Cpu size={18} color="#FCF9EA" />
          </div>
          <span>Dynamic Programming Matrix State Explorer: DP[mask][last]</span>
        </div>

        <div style={{ overflowX: 'auto', maxHeight: '440px', borderRadius: 'var(--radius-sm)', border: '2px solid #232B20', boxShadow: 'var(--neo-shadow-xs)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'JetBrains Mono', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ background: 'rgba(168, 187, 163, 0.45)', borderBottom: '2px solid #232B20', position: 'sticky', top: 0, zIndex: 5 }}>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#1C2319', fontWeight: 900 }}>Subset Mask (Binary / Set)</th>
                {locations.map((loc, idx) => (
                  <th key={idx} style={{ padding: '0.75rem 1rem', textAlign: 'center', color: '#DB9558', fontWeight: 900 }}>
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
                      borderBottom: '1.5px solid #232B20',
                      background: isRowActive ? 'rgba(219, 149, 88, 0.25)' : 'rgba(252, 249, 234, 0.75)'
                    }}
                  >
                    <td style={{ padding: '0.65rem 1rem', whiteSpace: 'nowrap' }}>
                      <span style={{ color: '#FCF9EA', fontWeight: 900, background: '#232B20', padding: '0.15rem 0.45rem', borderRadius: '4px', border: '1px solid #232B20' }}>{bin}₂</span>{' '}
                      <span style={{ color: '#3D4838', fontWeight: 700, marginLeft: '0.35rem' }}>{maskToSetNotation(mask)}</span>
                    </td>
                    {locations.map((_, j) => {
                      const isMember = (mask & (1 << j)) !== 0;
                      const isCellActive = isRowActive && curStep.last === j;
                      const val = cellValues[`${mask}-${j}`];

                      if (!isMember) {
                        return (
                          <td key={j} style={{ padding: '0.65rem 1rem', textAlign: 'center', color: '#A8BBA3' }}>
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
                            background: isCellActive ? '#97A87A' : 'transparent',
                            color: isCellActive ? '#FCF9EA' : val !== undefined ? '#1C2319' : '#8A9984',
                            fontWeight: isCellActive ? 900 : val !== undefined ? 800 : 500,
                            border: isCellActive ? '2px solid #232B20' : 'none',
                            boxShadow: isCellActive ? 'inset 0 0 0 1px #FCF9EA' : 'none'
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
