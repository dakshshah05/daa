import React from 'react';
import { Play, Pause, RotateCcw, Clock, Zap, Activity } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/soundEffects';

export function TelemetryPanel({
  activeSol,
  vehicleAnim,
  setVehicleAnim,
  locations,
  depot,
  speed
}) {
  const handleStartAnimation = () => {
    if (!activeSol || !activeSol.order || activeSol.order.length === 0) return;

    sounds.playClick();
    const segments = [];
    let prev = depot;
    let accumulatedTime = 0;

    for (let i = 0; i < activeSol.order.length; i++) {
      const idx = activeSol.order[i];
      const loc = locations[idx];
      const dist = Math.hypot(loc.x - prev.x, loc.y - prev.y);
      const segTime = dist / speed;

      segments.push({
        from: prev,
        to: loc,
        locIndex: idx,
        loc,
        dist,
        duration: Math.max(0.3, segTime),
        stepNumber: i + 1,
        weight: loc.weight,
        prevAccTime: accumulatedTime
      });

      accumulatedTime += segTime;
      prev = loc;
    }

    setVehicleAnim({
      segments,
      segmentIdx: 0,
      segmentProgress: 0,
      running: true,
      paused: false,
      liveTime: 0
    });

    // Fire winning confetti if exact DP
    if (activeSol.code === 'DP') {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#10b981', '#38bdf8', '#fbbf24']
      });
    }
  };

  const handlePauseToggle = () => {
    if (!vehicleAnim) return;
    sounds.playClick();
    setVehicleAnim({
      ...vehicleAnim,
      paused: !vehicleAnim.paused
    });
  };

  const handleReset = () => {
    sounds.playClick();
    setVehicleAnim(null);
  };

  // Calculate live weighted delay
  let liveDelay = 0;
  let liveTime = 0;
  let currentStepText = 'Standby';

  if (vehicleAnim) {
    liveTime = vehicleAnim.liveTime;
    const currentSegIdx = vehicleAnim.segmentIdx;
    currentStepText = `Stop ${Math.min(currentSegIdx + 1, vehicleAnim.segments.length)} / ${vehicleAnim.segments.length}`;

    for (let i = 0; i < currentSegIdx; i++) {
      const s = vehicleAnim.segments[i];
      liveDelay += s.weight * (s.prevAccTime + s.duration);
    }
    if (currentSegIdx < vehicleAnim.segments.length) {
      const s = vehicleAnim.segments[currentSegIdx];
      const curArrivalEst = s.prevAccTime + (s.duration * vehicleAnim.segmentProgress);
      liveDelay += s.weight * curArrivalEst * vehicleAnim.segmentProgress;
    }
  }

  const getNodeColor = (weight) => {
    if (weight >= 9) return '#ef4444';
    if (weight >= 7) return '#f97316';
    if (weight >= 4) return '#eab308';
    return '#10b981';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      
      {/* Telemetry Strip */}
      <div className="telemetry-ribbon">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button className="btn btn-primary" onClick={handleStartAnimation}>
            <Play size={16} fill="currentColor" /> Animate Route
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={handlePauseToggle}
            disabled={!vehicleAnim}
          >
            <Pause size={14} /> {vehicleAnim?.paused ? 'Resume' : 'Pause'}
          </button>
          <button
            className="btn btn-outline btn-sm"
            onClick={handleReset}
            disabled={!vehicleAnim}
          >
            <RotateCcw size={14} /> Reset
          </button>
        </div>

        <div className="telemetry-metrics">
          <div className="metric-unit">
            <span className="metric-label"><Activity size={10} style={{ display: 'inline' }} /> Transit Progress</span>
            <span className="metric-value">{currentStepText}</span>
          </div>
          <div className="metric-unit">
            <span className="metric-label"><Clock size={10} style={{ display: 'inline' }} /> Elapsed Time</span>
            <span className="metric-value">{liveTime.toFixed(1)}s</span>
          </div>
          <div className="metric-unit">
            <span className="metric-label"><Zap size={10} style={{ display: 'inline' }} /> Weighted Delay Penalty</span>
            <span className="metric-value highlight-red">{liveDelay.toFixed(1)}</span>
          </div>
        </div>
      </div>

      {/* Sequence Chips */}
      <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem' }}>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
          Route Dispatch Schedule ({activeSol?.name || 'Active Solver'})
        </div>

        <div className="route-sequence-wrapper">
          <span className="seq-chip depot">
            <strong>🏁 HQ Depot</strong>
            <small>t = 0.0s</small>
          </span>

          {activeSol?.arrivalTimes?.map((step, idx) => {
            const loc = step.location || (locations && locations[step.locationIndex]) || {};
            const weight = loc?.weight ?? 1;
            const name = loc?.name || `Facility #${idx + 1}`;
            const arrTime = typeof step.arrivalTime === 'number' ? step.arrivalTime.toFixed(1) : '0.0';
            const penVal = typeof step.stepWeightedDelay === 'number' ? step.stepWeightedDelay.toFixed(1) : '0.0';
            return (
              <React.Fragment key={idx}>
                <span className="seq-arrow">➔</span>
                <span className="seq-chip" style={{ borderLeft: `4px solid ${getNodeColor(weight)}` }}>
                  <strong>#{idx + 1} {name}</strong>
                  <small>
                    t = {arrTime}s (W{weight}, pen: {penVal})
                  </small>
                </span>
              </React.Fragment>
            );
          })}
        </div>
      </div>

    </div>
  );
}
