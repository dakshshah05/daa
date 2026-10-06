import React, { useRef, useEffect, useState } from 'react';
import { sounds } from '../utils/soundEffects';

export function RouterCanvas({
  depot,
  setDepot,
  locations,
  setLocations,
  selectedNodeIndex,
  setSelectedNodeIndex,
  activeRoutes,
  currentSolver,
  compareMode,
  vehicleAnim,
  setVehicleAnim,
  speed,
  onStateModified
}) {
  const canvasRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragTarget, setDragTarget] = useState(null); // 'depot' | index
  const animPhaseRef = useRef(0);

  const getNodeColor = (weight) => {
    if (weight >= 9) return { bg: '#ef4444', glow: 'rgba(239, 68, 68, 0.65)', border: '#fca5a5' };
    if (weight >= 7) return { bg: '#f97316', glow: 'rgba(249, 115, 22, 0.55)', border: '#fdba74' };
    if (weight >= 4) return { bg: '#eab308', glow: 'rgba(234, 179, 8, 0.45)', border: '#fde047' };
    return { bg: '#10b981', glow: 'rgba(16, 185, 129, 0.45)', border: '#6ee7b7' };
  };

  const getNodeRadius = (weight) => 12 + ((weight - 1) / 9) * 8;

  const getCoords = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const findNodeAt = (x, y, hitRadius = 22) => {
    const dDepot = Math.hypot(depot.x - x, depot.y - y);
    if (dDepot <= hitRadius) return { type: 'depot', index: -1 };

    for (let i = locations.length - 1; i >= 0; i--) {
      const loc = locations[i];
      const d = Math.hypot(loc.x - x, loc.y - y);
      const r = getNodeRadius(loc.weight) + 6;
      if (d <= r) return { type: 'location', index: i };
    }
    return null;
  };

  const handleMouseDown = (e) => {
    if (e.button && e.button !== 0) return;
    const { x, y } = getCoords(e);
    const hit = findNodeAt(x, y);

    if (hit) {
      setIsDragging(true);
      setDragTarget(hit);
      if (hit.type === 'location') {
        setSelectedNodeIndex(hit.index);
        sounds.playClick();
      } else {
        setSelectedNodeIndex(-1);
      }
    } else {
      if (locations.length >= 20) return;
      const id = locations.length + 1;
      const types = ['hospital', 'clinic', 'shelter'];
      const newLoc = {
        id,
        name: `Triage Post #${id}`,
        x: Math.round(x),
        y: Math.round(y),
        weight: 6,
        type: types[(id - 1) % types.length]
      };
      const updated = [...locations, newLoc];
      setLocations(updated);
      setSelectedNodeIndex(updated.length - 1);
      sounds.playClick();
      if (onStateModified) onStateModified(updated, depot);
    }
  };

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { x, y } = getCoords(e);

    if (isDragging && dragTarget) {
      const rect = canvas.getBoundingClientRect();
      const clampedX = Math.max(30, Math.min(rect.width - 30, x));
      const clampedY = Math.max(30, Math.min(rect.height - 30, y));

      if (dragTarget.type === 'depot') {
        const updatedDepot = { ...depot, x: clampedX, y: clampedY };
        setDepot(updatedDepot);
        if (onStateModified) onStateModified(locations, updatedDepot);
      } else if (dragTarget.type === 'location') {
        const updatedLocs = [...locations];
        if (updatedLocs[dragTarget.index]) {
          updatedLocs[dragTarget.index] = {
            ...updatedLocs[dragTarget.index],
            x: clampedX,
            y: clampedY
          };
          setLocations(updatedLocs);
          if (onStateModified) onStateModified(updatedLocs, depot);
        }
      }
    } else {
      const hit = findNodeAt(x, y);
      canvas.style.cursor = hit ? 'grab' : 'crosshair';
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      setDragTarget(null);
    }
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    const { x, y } = getCoords(e);
    const hit = findNodeAt(x, y);

    if (hit && hit.type === 'location') {
      const updated = locations.filter((_, idx) => idx !== hit.index).map((loc, idx) => ({
        ...loc,
        id: idx + 1
      }));
      setLocations(updated);
      setSelectedNodeIndex(-1);
      sounds.playClick();
      if (onStateModified) onStateModified(updated, depot);
    }
  };

  const handleDoubleClick = (e) => {
    const { x, y } = getCoords(e);
    const hit = findNodeAt(x, y);
    if (hit && hit.type === 'location') {
      const updated = [...locations];
      const cur = updated[hit.index];
      cur.weight = (cur.weight % 10) + 1;
      setLocations(updated);
      sounds.playNodeVisit(cur.weight);
      if (onStateModified) onStateModified(updated, depot);
    }
  };

  useEffect(() => {
    let animationFrameId;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    const render = () => {
      animPhaseRef.current = (animPhaseRef.current + 0.04) % (Math.PI * 2);

      const rect = canvas.getBoundingClientRect();
      if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
      }
      ctx.resetTransform?.() || ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      const w = rect.width;
      const h = rect.height;

      // 1. Background Grid
      ctx.fillStyle = '#080d17';
      ctx.fillRect(0, 0, w, h);

      ctx.save();
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.4)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      ctx.beginPath();
      for (let x = 0; x < w; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
      }
      ctx.stroke();

      // Atmospheric radial gradient
      const bgGrad = ctx.createRadialGradient(depot.x, depot.y, 20, depot.x, depot.y, Math.max(w, h));
      bgGrad.addColorStop(0, 'rgba(6, 182, 212, 0.06)');
      bgGrad.addColorStop(1, 'rgba(8, 13, 23, 0)');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();

      // 2. Mesh connections
      if (locations.length > 1) {
        ctx.save();
        ctx.strokeStyle = 'rgba(51, 65, 85, 0.16)';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 5]);
        ctx.beginPath();
        for (let i = 0; i < locations.length; i++) {
          for (let j = i + 1; j < locations.length; j++) {
            const d = Math.hypot(locations[i].x - locations[j].x, locations[i].y - locations[j].y);
            if (d < 220) {
              ctx.moveTo(locations[i].x, locations[i].y);
              ctx.lineTo(locations[j].x, locations[j].y);
            }
          }
        }
        ctx.stroke();
        ctx.restore();
      }

      // 3. Draw Active Route(s)
      const routeConfigs = {
        dp: { color: '#10b981', glow: 'rgba(16, 185, 129, 0.5)', width: 3.5, dash: [], offset: 0 },
        backtracking: { color: '#06b6d4', glow: 'rgba(6, 182, 212, 0.5)', width: 2.5, dash: [6, 4], offset: -4 },
        greedy: { color: '#f59e0b', glow: 'rgba(245, 158, 11, 0.5)', width: 2.5, dash: [3, 4], offset: 4 }
      };

      const routesToRender = [];
      if (compareMode) {
        if (activeRoutes?.dp) routesToRender.push({ key: 'dp', sol: activeRoutes.dp });
        if (activeRoutes?.backtracking) routesToRender.push({ key: 'backtracking', sol: activeRoutes.backtracking });
        if (activeRoutes?.greedy) routesToRender.push({ key: 'greedy', sol: activeRoutes.greedy });
      } else {
        if (activeRoutes?.[currentSolver]) {
          routesToRender.push({ key: currentSolver, sol: activeRoutes[currentSolver] });
        } else if (activeRoutes?.dp) {
          routesToRender.push({ key: 'dp', sol: activeRoutes.dp });
        }
      }

      routesToRender.forEach(({ key, sol }) => {
        if (!sol?.order || sol.order.length === 0) return;
        const cfg = routeConfigs[key];
        ctx.save();
        ctx.strokeStyle = cfg.color;
        ctx.lineWidth = cfg.width;
        ctx.setLineDash(cfg.dash);
        ctx.shadowColor = cfg.glow;
        ctx.shadowBlur = 12;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();
        const startX = depot.x + cfg.offset;
        const startY = depot.y + cfg.offset;
        ctx.moveTo(startX, startY);

        const pts = [{ x: startX, y: startY }];
        for (let i = 0; i < sol.order.length; i++) {
          const loc = locations[sol.order[i]];
          if (loc) {
            const pt = { x: loc.x + cfg.offset, y: loc.y + cfg.offset };
            pts.push(pt);
            ctx.lineTo(pt.x, pt.y);
          }
        }
        ctx.stroke();

        for (let i = 0; i < pts.length - 1; i++) {
          const midX = (pts[i].x + pts[i + 1].x) / 2;
          const midY = (pts[i].y + pts[i + 1].y) / 2;
          const angle = Math.atan2(pts[i + 1].y - pts[i].y, pts[i + 1].x - pts[i].x);
          ctx.save();
          ctx.translate(midX, midY);
          ctx.rotate(angle);
          ctx.fillStyle = cfg.color;
          ctx.beginPath();
          ctx.moveTo(8, 0);
          ctx.lineTo(-8, -5);
          ctx.lineTo(-4, 0);
          ctx.lineTo(-8, 5);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }
        ctx.restore();
      });

      // 4. Locations & Urgency Circles
      locations.forEach((loc, idx) => {
        const isSelected = selectedNodeIndex === idx;
        const r = getNodeRadius(loc.weight);
        const col = getNodeColor(loc.weight);

        ctx.save();
        if (loc.weight >= 9) {
          const pulse = (Math.sin(animPhaseRef.current * 2.5) + 1) / 2;
          ctx.beginPath();
          ctx.arc(loc.x, loc.y, r + 6 + pulse * 8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(239, 68, 68, ${0.15 + pulse * 0.2})`;
          ctx.fill();
        }

        if (isSelected) {
          ctx.beginPath();
          ctx.arc(loc.x, loc.y, r + 7, 0, Math.PI * 2);
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 2.5;
          ctx.setLineDash([4, 4]);
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(loc.x, loc.y, r, 0, Math.PI * 2);
        ctx.fillStyle = col.bg;
        ctx.shadowColor = col.glow;
        ctx.shadowBlur = 15;
        ctx.fill();

        ctx.strokeStyle = isSelected ? '#ffffff' : col.border;
        ctx.lineWidth = isSelected ? 3 : 2;
        ctx.stroke();

        ctx.shadowBlur = 0;
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px JetBrains Mono, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`W${loc.weight}`, loc.x, loc.y);

        ctx.font = '500 10.5px Inter, sans-serif';
        ctx.fillStyle = '#cbd5e1';
        ctx.fillText(loc.name, loc.x, loc.y + r + 13);

        const activeSol = activeRoutes?.[currentSolver] || activeRoutes?.dp || activeRoutes?.greedy;
        if (activeSol?.order) {
          const stepIndex = activeSol.order.indexOf(idx);
          if (stepIndex !== -1) {
            ctx.beginPath();
            ctx.arc(loc.x - r * 0.7, loc.y - r * 0.7, 8.5, 0, Math.PI * 2);
            ctx.fillStyle = '#080d17';
            ctx.fill();
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 1.8;
            ctx.stroke();

            ctx.fillStyle = '#38bdf8';
            ctx.font = 'bold 8.5px JetBrains Mono, sans-serif';
            ctx.fillText(`${stepIndex + 1}`, loc.x - r * 0.7, loc.y - r * 0.7);
          }
        }
        ctx.restore();
      });

      // 5. Depot Marker
      ctx.save();
      const radarR = 22 + Math.sin(animPhaseRef.current) * 6;
      ctx.beginPath();
      ctx.arc(depot.x, depot.y, radarR, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(234, 179, 8, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      const dSize = 16;
      ctx.beginPath();
      ctx.moveTo(depot.x, depot.y - dSize);
      ctx.lineTo(depot.x + dSize, depot.y);
      ctx.lineTo(depot.x, depot.y + dSize);
      ctx.lineTo(depot.x - dSize, depot.y);
      ctx.closePath();
      ctx.fillStyle = '#eab308';
      ctx.shadowColor = 'rgba(234, 179, 8, 0.8)';
      ctx.shadowBlur = 16;
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.2;
      ctx.stroke();

      ctx.shadowBlur = 0;
      ctx.fillStyle = '#080d17';
      ctx.font = 'bold 10.5px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('HQ', depot.x, depot.y);

      ctx.font = '600 11.5px Inter, sans-serif';
      ctx.fillStyle = '#fde047';
      ctx.fillText(depot.name || 'HQ Relief Hub', depot.x, depot.y + dSize + 15);
      ctx.restore();

      // 6. Live Vehicle Animation Step
      if (vehicleAnim && vehicleAnim.running && !vehicleAnim.paused) {
        const seg = vehicleAnim.segments[vehicleAnim.segmentIdx];
        if (seg) {
          const delta = 0.016;
          vehicleAnim.segmentProgress += delta / seg.duration;
          vehicleAnim.liveTime += delta;

          if (vehicleAnim.segmentProgress >= 1) {
            vehicleAnim.segmentProgress = 0;
            vehicleAnim.segmentIdx++;

            if (seg.loc?.weight) {
              sounds.playNodeVisit(seg.loc.weight);
            }

            if (vehicleAnim.segmentIdx >= vehicleAnim.segments.length) {
              vehicleAnim.running = false;
              sounds.playSuccess();
            }
          }

          const t = Math.max(0, Math.min(1, vehicleAnim.segmentProgress));
          const vx = seg.from.x + (seg.to.x - seg.from.x) * t;
          const vy = seg.from.y + (seg.to.y - seg.from.y) * t;
          const angle = Math.atan2(seg.to.y - seg.from.y, seg.to.x - seg.from.x);

          ctx.save();
          ctx.translate(vx, vy);
          ctx.rotate(angle);

          const grad = ctx.createRadialGradient(10, 0, 2, 42, 0, 32);
          grad.addColorStop(0, 'rgba(56, 189, 248, 0.6)');
          grad.addColorStop(1, 'rgba(56, 189, 248, 0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.moveTo(10, -7);
          ctx.lineTo(42, -20);
          ctx.lineTo(42, 20);
          ctx.lineTo(10, 7);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = '#f8fafc';
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 14;
          ctx.beginPath();
          ctx.roundRect(-15, -9, 30, 18, [3, 7, 7, 3]);
          ctx.fill();
          ctx.strokeStyle = '#0284c7';
          ctx.lineWidth = 1.8;
          ctx.stroke();

          const isRed = Math.floor(animPhaseRef.current * 8) % 2 === 0;
          ctx.beginPath();
          ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
          ctx.fillStyle = isRed ? '#ef4444' : '#38bdf8';
          ctx.shadowColor = isRed ? '#ef4444' : '#38bdf8';
          ctx.shadowBlur = 10;
          ctx.fill();

          ctx.restore();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [depot, locations, selectedNodeIndex, activeRoutes, currentSolver, compareMode, vehicleAnim]);

  return (
    <div className="canvas-container">
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%', display: 'block' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onContextMenu={handleContextMenu}
        onDoubleClick={handleDoubleClick}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
      />

      <div className="canvas-hud-overlay">
        <div className="hud-pill">
          <span>Guide:</span>
          <strong>Click: Add | Drag: Move | R-Click: Delete</strong>
        </div>
      </div>

      <div className="hud-legend-box">
        <div className="legend-line"><span className="legend-swatch dp"></span> <span>DP Exact Global Optimal</span></div>
        <div className="legend-line"><span className="legend-swatch bb"></span> <span>Branch & Bound (B&B)</span></div>
        <div className="legend-line"><span className="legend-swatch greedy"></span> <span>Greedy Ratio Heuristic</span></div>
        <div className="legend-line"><span className="legend-swatch crit"></span> <span>Critical Trauma W=9-10</span></div>
      </div>
    </div>
  );
}
