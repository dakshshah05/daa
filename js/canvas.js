/**
 * GoldenHour Router - Interactive Canvas Manager
 * Handles map rendering, node dragging, adding, deleting, road overlay, and animations.
 */

class MapCanvas {
  constructor(canvasElement, onStateChange) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    this.onStateChange = onStateChange || (() => {});

    this.depot = { x: 250, y: 300, name: 'HQ Relief Depot' };
    this.locations = [];
    this.selectedNodeIndex = -1;
    this.isDragging = false;
    this.dragTarget = null; // 'depot' or index
    this.hoverTarget = null;

    // View & rendering properties
    this.dpr = window.devicePixelRatio || 1;
    this.animPhase = 0;
    this.activeRoutes = {
      dp: null,
      backtracking: null,
      greedy: null
    };
    this.showRoutes = {
      dp: true,
      backtracking: false,
      greedy: false
    };
    this.compareMode = false;
    this.vehicleAnim = null; // { route, t, currentSegment, speed, running, onStep, onComplete }

    this.initEvents();
    this.resize();
    this.startRenderLoop();
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;
    this.canvas.width = rect.width * this.dpr;
    this.canvas.height = rect.height * this.dpr;
    this.ctx.resetTransform?.() || this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(this.dpr, this.dpr);
    this.draw();
  }

  initEvents() {
    window.addEventListener('resize', () => this.resize());

    // Mouse events
    this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
    this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
    this.canvas.addEventListener('contextmenu', (e) => this.handleContextMenu(e));
    this.canvas.addEventListener('dblclick', (e) => this.handleDoubleClick(e));

    // Touch events for tablets/mobiles
    this.canvas.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: false });
    this.canvas.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
    this.canvas.addEventListener('touchend', (e) => this.handleTouchEnd(e));
  }

  getCanvasCoords(e) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }

  findNodeAt(x, y, hitRadius = 24) {
    // Check depot
    const dDepot = Math.hypot(this.depot.x - x, this.depot.y - y);
    if (dDepot <= hitRadius) {
      return { type: 'depot', index: -1 };
    }

    // Check locations (reverse to pick top-rendered node)
    for (let i = this.locations.length - 1; i >= 0; i--) {
      const loc = this.locations[i];
      const d = Math.hypot(loc.x - x, loc.y - y);
      const r = this.getNodeRadius(loc.weight) + 6;
      if (d <= r) {
        return { type: 'location', index: i };
      }
    }
    return null;
  }

  handleMouseDown(e) {
    if (e.button !== 0) return; // Left click only
    const { x, y } = this.getCanvasCoords(e);
    const hit = this.findNodeAt(x, y);

    if (hit) {
      this.isDragging = true;
      this.dragTarget = hit;
      if (hit.type === 'location') {
        this.selectedNodeIndex = hit.index;
      } else {
        this.selectedNodeIndex = -1;
      }
      this.onStateChange('select', { selectedIndex: this.selectedNodeIndex });
    } else {
      // Clicked on empty space: Add new node
      if (this.locations.length >= 20) {
        alert('Maximum 20 locations allowed on canvas.');
        return;
      }
      this.addLocation(x, y);
    }
  }

  handleMouseMove(e) {
    const { x, y } = this.getCanvasCoords(e);

    if (this.isDragging && this.dragTarget) {
      // Clamping within canvas bounds
      const clampedX = Math.max(30, Math.min(this.width - 30, x));
      const clampedY = Math.max(30, Math.min(this.height - 30, y));

      if (this.dragTarget.type === 'depot') {
        this.depot.x = clampedX;
        this.depot.y = clampedY;
      } else if (this.dragTarget.type === 'location') {
        const loc = this.locations[this.dragTarget.index];
        if (loc) {
          loc.x = clampedX;
          loc.y = clampedY;
        }
      }
      this.onStateChange('change', { triggerSolve: true });
    } else {
      const hit = this.findNodeAt(x, y);
      this.hoverTarget = hit;
      this.canvas.style.cursor = hit ? 'grab' : 'crosshair';
    }
  }

  handleMouseUp(e) {
    if (this.isDragging) {
      this.isDragging = false;
      this.dragTarget = null;
      this.canvas.style.cursor = 'crosshair';
      this.onStateChange('change', { triggerSolve: true });
    }
  }

  handleContextMenu(e) {
    e.preventDefault(); // Prevent default context menu
    const { x, y } = this.getCanvasCoords(e);
    const hit = this.findNodeAt(x, y);

    if (hit && hit.type === 'location') {
      this.deleteLocation(hit.index);
    }
  }

  handleDoubleClick(e) {
    const { x, y } = this.getCanvasCoords(e);
    const hit = this.findNodeAt(x, y);
    if (hit && hit.type === 'location') {
      // Cycle urgency weight on double-click
      const loc = this.locations[hit.index];
      loc.weight = (loc.weight % 10) + 1;
      this.onStateChange('change', { triggerSolve: true });
    }
  }

  handleTouchStart(e) {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      const rect = this.canvas.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      const hit = this.findNodeAt(x, y, 32);

      if (hit) {
        e.preventDefault();
        this.isDragging = true;
        this.dragTarget = hit;
        this.selectedNodeIndex = hit.type === 'location' ? hit.index : -1;
        this.onStateChange('select', { selectedIndex: this.selectedNodeIndex });
      }
    }
  }

  handleTouchMove(e) {
    if (this.isDragging && e.touches.length === 1) {
      e.preventDefault();
      const touch = e.touches[0];
      const rect = this.canvas.getBoundingClientRect();
      const x = Math.max(30, Math.min(this.width - 30, touch.clientX - rect.left));
      const y = Math.max(30, Math.min(this.height - 30, touch.clientY - rect.top));

      if (this.dragTarget.type === 'depot') {
        this.depot.x = x;
        this.depot.y = y;
      } else if (this.dragTarget.type === 'location') {
        const loc = this.locations[this.dragTarget.index];
        if (loc) {
          loc.x = x;
          loc.y = y;
        }
      }
      this.onStateChange('change', { triggerSolve: true });
    }
  }

  handleTouchEnd() {
    if (this.isDragging) {
      this.isDragging = false;
      this.dragTarget = null;
      this.onStateChange('change', { triggerSolve: true });
    }
  }

  addLocation(x, y, weight = 5, name = null, type = 'hospital') {
    const id = this.locations.length + 1;
    const types = ['hospital', 'clinic', 'shelter'];
    const assignedType = type || types[(id - 1) % types.length];
    
    const newLoc = {
      id,
      name: name || `Triage Post #${id}`,
      x: Math.round(x),
      y: Math.round(y),
      weight: Math.max(1, Math.min(10, weight)),
      type: assignedType
    };

    this.locations.push(newLoc);
    this.selectedNodeIndex = this.locations.length - 1;
    this.onStateChange('change', { triggerSolve: true, selectedIndex: this.selectedNodeIndex });
  }

  deleteLocation(index) {
    if (index >= 0 && index < this.locations.length) {
      this.locations.splice(index, 1);
      // Renumber IDs
      this.locations.forEach((loc, i) => {
        loc.id = i + 1;
      });
      this.selectedNodeIndex = Math.min(this.selectedNodeIndex, this.locations.length - 1);
      this.onStateChange('change', { triggerSolve: true, selectedIndex: this.selectedNodeIndex });
    }
  }

  loadPreset(preset) {
    this.depot = { ...preset.depot };
    this.locations = preset.locations.map(l => ({ ...l }));
    this.selectedNodeIndex = -1;
    this.stopVehicleAnimation();
    this.onStateChange('change', { triggerSolve: true, speed: preset.speed });
  }

  generateRandom(n = 8) {
    const w = this.width || 800;
    const h = this.height || 500;
    const padding = 70;

    this.depot = {
      x: Math.round(padding + Math.random() * (w - 2 * padding)),
      y: Math.round(padding + Math.random() * (h - 2 * padding)),
      name: 'HQ Relief Hub'
    };

    const types = ['hospital', 'clinic', 'shelter'];
    this.locations = [];

    for (let i = 0; i < n; i++) {
      // 30% chance high urgency (8-10), 40% moderate (4-7), 30% low (1-3)
      let weight = Math.floor(Math.random() * 10) + 1;
      const type = types[Math.floor(Math.random() * types.length)];
      
      this.locations.push({
        id: i + 1,
        name: `${type.charAt(0).toUpperCase() + type.slice(1)} #${i + 1}`,
        x: Math.round(padding + Math.random() * (w - 2 * padding)),
        y: Math.round(padding + Math.random() * (h - 2 * padding)),
        weight,
        type
      });
    }

    this.selectedNodeIndex = -1;
    this.stopVehicleAnimation();
    this.onStateChange('change', { triggerSolve: true });
  }

  clear() {
    this.locations = [];
    this.selectedNodeIndex = -1;
    this.stopVehicleAnimation();
    this.onStateChange('change', { triggerSolve: true });
  }

  getNodeRadius(weight) {
    // Weight 1..10 maps to radius 12..22
    return 12 + ((weight - 1) / 9) * 10;
  }

  getNodeColor(weight) {
    if (weight >= 9) return { bg: '#ef4444', glow: 'rgba(239, 68, 68, 0.6)', border: '#fca5a5' }; // Critical Red
    if (weight >= 7) return { bg: '#f97316', glow: 'rgba(249, 115, 22, 0.5)', border: '#fdba74' }; // High Orange
    if (weight >= 4) return { bg: '#eab308', glow: 'rgba(234, 179, 8, 0.4)', border: '#fde047' };  // Medium Amber
    return { bg: '#10b981', glow: 'rgba(16, 185, 129, 0.4)', border: '#6ee7b7' };                  // Low Emerald
  }

  // ==========================================
  // VEHICLE ANIMATION ENGINE
  // ==========================================
  startVehicleAnimation(solution, speedMultiplier = 1, onStepUpdate = null, onFinish = null) {
    if (!solution || !solution.order || solution.order.length === 0) return;

    const segments = [];
    let prev = this.depot;
    let accumulatedTime = 0;
    let accumulatedWeightedDelay = 0;

    for (let i = 0; i < solution.order.length; i++) {
      const idx = solution.order[i];
      const loc = this.locations[idx];
      const dist = Math.hypot(loc.x - prev.x, loc.y - prev.y);
      const segTime = dist / (100 * speedMultiplier); // base speed 100 px/sec

      segments.push({
        from: prev,
        to: loc,
        locIndex: idx,
        loc,
        dist,
        duration: Math.max(0.4, segTime),
        stepNumber: i + 1,
        weight: loc.weight,
        prevAccTime: accumulatedTime
      });

      accumulatedTime += segTime;
      prev = loc;
    }

    this.vehicleAnim = {
      segments,
      segmentIdx: 0,
      segmentProgress: 0,
      running: true,
      paused: false,
      speedMultiplier,
      liveTime: 0,
      liveWeightedDelay: 0,
      lastTimestamp: null,
      onStepUpdate,
      onFinish
    };
  }

  pauseVehicleAnimation() {
    if (this.vehicleAnim) {
      this.vehicleAnim.paused = !this.vehicleAnim.paused;
    }
  }

  stopVehicleAnimation() {
    this.vehicleAnim = null;
  }

  // ==========================================
  // RENDER LOOP & DRAWING
  // ==========================================
  startRenderLoop() {
    const loop = (timestamp) => {
      this.animPhase = (this.animPhase + 0.04) % (Math.PI * 2);

      // Advance vehicle animation if running
      if (this.vehicleAnim && this.vehicleAnim.running && !this.vehicleAnim.paused) {
        if (!this.vehicleAnim.lastTimestamp) this.vehicleAnim.lastTimestamp = timestamp;
        const delta = (timestamp - this.vehicleAnim.lastTimestamp) / 1000;
        this.vehicleAnim.lastTimestamp = timestamp;

        const seg = this.vehicleAnim.segments[this.vehicleAnim.segmentIdx];
        if (seg) {
          this.vehicleAnim.segmentProgress += delta / seg.duration;
          this.vehicleAnim.liveTime += delta;

          if (this.vehicleAnim.onStepUpdate) {
            const currentTotalDelay = this.calculateLiveDelay(this.vehicleAnim);
            this.vehicleAnim.onStepUpdate({
              step: this.vehicleAnim.segmentIdx + 1,
              totalSteps: this.vehicleAnim.segments.length,
              currentLoc: seg.loc,
              liveTime: this.vehicleAnim.liveTime,
              liveDelay: currentTotalDelay,
              progress: this.vehicleAnim.segmentProgress
            });
          }

          if (this.vehicleAnim.segmentProgress >= 1) {
            this.vehicleAnim.segmentProgress = 0;
            this.vehicleAnim.segmentIdx++;

            if (this.vehicleAnim.segmentIdx >= this.vehicleAnim.segments.length) {
              this.vehicleAnim.running = false;
              if (this.vehicleAnim.onFinish) this.vehicleAnim.onFinish();
            }
          }
        }
      } else if (this.vehicleAnim) {
        this.vehicleAnim.lastTimestamp = timestamp;
      }

      this.draw();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  calculateLiveDelay(anim) {
    let delay = 0;
    // Calculate completed arrivals
    for (let i = 0; i < anim.segmentIdx; i++) {
      const s = anim.segments[i];
      delay += s.weight * (s.prevAccTime + s.duration);
    }
    // Interpolate current segment arrival
    if (anim.segmentIdx < anim.segments.length) {
      const s = anim.segments[anim.segmentIdx];
      const curArrivalEst = s.prevAccTime + (s.duration * anim.segmentProgress);
      delay += s.weight * curArrivalEst * anim.segmentProgress;
    }
    return delay;
  }

  draw() {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    if (!w || !h) return;

    // Background Canvas Fill (Dark Cyber / Tactical Command Grid)
    ctx.fillStyle = '#0b0f19';
    ctx.fillRect(0, 0, w, h);

    // Draw Map Grid & Coordinate Overlay
    this.drawGrid(ctx, w, h);

    // Draw Potential Connection Lines (Subtle Graph mesh)
    this.drawNetworkMesh(ctx);

    // Draw Active Solver Routes (DP, Backtracking, Greedy)
    this.drawRoutes(ctx);

    // Draw Locations & Depot
    this.drawLocations(ctx);
    this.drawDepot(ctx);

    // Draw Animated Vehicle
    if (this.vehicleAnim) {
      this.drawVehicle(ctx);
    }
  }

  drawGrid(ctx, w, h) {
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

    // Subtle radar scan beam
    const gradient = ctx.createLinearGradient(0, 0, w, h);
    gradient.addColorStop(0, 'rgba(14, 165, 233, 0.02)');
    gradient.addColorStop(0.5, 'rgba(99, 102, 241, 0.04)');
    gradient.addColorStop(1, 'rgba(14, 165, 233, 0.02)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);

    ctx.restore();
  }

  drawNetworkMesh(ctx) {
    if (this.locations.length <= 1) return;
    ctx.save();
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.15)';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 5]);

    ctx.beginPath();
    for (let i = 0; i < this.locations.length; i++) {
      const a = this.locations[i];
      for (let j = i + 1; j < this.locations.length; j++) {
        const b = this.locations[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 220) {
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
        }
      }
    }
    ctx.stroke();
    ctx.restore();
  }

  drawRoutes(ctx) {
    const routeStyles = {
      dp: {
        color: '#10b981', // Emerald Green
        glow: 'rgba(16, 185, 129, 0.4)',
        dash: [],
        lineWidth: 3.5,
        offset: 0,
        label: 'DP (Optimal)'
      },
      backtracking: {
        color: '#06b6d4', // Cyan
        glow: 'rgba(6, 182, 212, 0.4)',
        dash: [6, 4],
        lineWidth: 2.5,
        offset: -4,
        label: 'B&B'
      },
      greedy: {
        color: '#f59e0b', // Amber / Gold
        glow: 'rgba(245, 158, 11, 0.4)',
        dash: [3, 4],
        lineWidth: 2.5,
        offset: 4,
        label: 'Greedy'
      }
    };

    const routesToDraw = [];
    if (this.compareMode) {
      if (this.activeRoutes.dp) routesToDraw.push({ key: 'dp', sol: this.activeRoutes.dp });
      if (this.activeRoutes.backtracking) routesToDraw.push({ key: 'backtracking', sol: this.activeRoutes.backtracking });
      if (this.activeRoutes.greedy) routesToDraw.push({ key: 'greedy', sol: this.activeRoutes.greedy });
    } else {
      if (this.showRoutes.dp && this.activeRoutes.dp) routesToDraw.push({ key: 'dp', sol: this.activeRoutes.dp });
      else if (this.showRoutes.backtracking && this.activeRoutes.backtracking) routesToDraw.push({ key: 'backtracking', sol: this.activeRoutes.backtracking });
      else if (this.showRoutes.greedy && this.activeRoutes.greedy) routesToDraw.push({ key: 'greedy', sol: this.activeRoutes.greedy });
    }

    routesToDraw.forEach(({ key, sol }) => {
      if (!sol || !sol.order || sol.order.length === 0) return;
      const style = routeStyles[key];
      this.drawSingleRoute(ctx, sol.order, style);
    });
  }

  drawSingleRoute(ctx, order, style) {
    ctx.save();
    let prev = this.depot;

    ctx.strokeStyle = style.color;
    ctx.lineWidth = style.lineWidth;
    ctx.setLineDash(style.dash);
    ctx.shadowColor = style.glow;
    ctx.shadowBlur = 10;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(prev.x + style.offset, prev.y + style.offset);

    const points = [{ x: prev.x + style.offset, y: prev.y + style.offset }];

    for (let i = 0; i < order.length; i++) {
      const loc = this.locations[order[i]];
      if (!loc) continue;
      const pt = { x: loc.x + style.offset, y: loc.y + style.offset };
      points.push(pt);
      ctx.lineTo(pt.x, pt.y);
    }
    ctx.stroke();

    // Draw directional arrows along segments
    for (let i = 0; i < points.length - 1; i++) {
      this.drawRouteArrow(ctx, points[i], points[i + 1], style.color, i + 1);
    }

    ctx.restore();
  }

  drawRouteArrow(ctx, p1, p2, color, stepNumber) {
    const midX = (p1.x + p2.x) / 2;
    const midY = (p1.y + p2.y) / 2;
    const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
    const arrowLen = 10;

    ctx.save();
    ctx.fillStyle = color;
    ctx.strokeStyle = '#0b0f19';
    ctx.lineWidth = 1.5;

    ctx.translate(midX, midY);
    ctx.rotate(angle);

    ctx.beginPath();
    ctx.moveTo(arrowLen, 0);
    ctx.lineTo(-arrowLen, -arrowLen * 0.6);
    ctx.lineTo(-arrowLen * 0.4, 0);
    ctx.lineTo(-arrowLen, arrowLen * 0.6);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }

  drawLocations(ctx) {
    this.locations.forEach((loc, index) => {
      const isSelected = this.selectedNodeIndex === index;
      const isHovered = this.hoverTarget && this.hoverTarget.type === 'location' && this.hoverTarget.index === index;
      const radius = this.getNodeRadius(loc.weight);
      const colorScheme = this.getNodeColor(loc.weight);

      ctx.save();

      // Pulsing aura for critical urgency (weight >= 9)
      if (loc.weight >= 9) {
        const pulse = (Math.sin(this.animPhase * 2) + 1) / 2;
        const pulseRadius = radius + 6 + pulse * 8;
        ctx.beginPath();
        ctx.arc(loc.x, loc.y, pulseRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(239, 68, 68, ${0.15 + pulse * 0.2})`;
        ctx.fill();
      }

      // Selection Halo
      if (isSelected) {
        ctx.beginPath();
        ctx.arc(loc.x, loc.y, radius + 8, 0, Math.PI * 2);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.5;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
      }

      // Node Circle
      ctx.beginPath();
      ctx.arc(loc.x, loc.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = colorScheme.bg;
      ctx.shadowColor = colorScheme.glow;
      ctx.shadowBlur = isHovered ? 20 : 12;
      ctx.fill();

      ctx.strokeStyle = isSelected ? '#ffffff' : colorScheme.border;
      ctx.lineWidth = isSelected ? 3 : 2;
      ctx.stroke();

      // Node Inner Icon / Urgency Number
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`W:${loc.weight}`, loc.x, loc.y);

      // Label below node
      ctx.font = '500 11px Inter, sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(loc.name, loc.x, loc.y + radius + 14);

      // Node order badge if part of primary route
      const activeSol = this.activeRoutes.dp || this.activeRoutes.backtracking || this.activeRoutes.greedy;
      if (activeSol && activeSol.order) {
        const orderIdx = activeSol.order.indexOf(index);
        if (orderIdx !== -1) {
          this.drawOrderBadge(ctx, loc.x - radius * 0.7, loc.y - radius * 0.7, orderIdx + 1);
        }
      }

      ctx.restore();
    });
  }

  drawOrderBadge(ctx, x, y, orderNum) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, 9, 0, Math.PI * 2);
    ctx.fillStyle = '#0f172a';
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 9px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${orderNum}`, x, y);
    ctx.restore();
  }

  drawDepot(ctx) {
    const { x, y, name } = this.depot;
    const isHovered = this.hoverTarget && this.hoverTarget.type === 'depot';

    ctx.save();

    // Radar scan ring
    const radarRadius = 24 + Math.sin(this.animPhase) * 6;
    ctx.beginPath();
    ctx.arc(x, y, radarRadius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(234, 179, 8, 0.3)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Depot Outer Diamond / Hexagon
    ctx.beginPath();
    const size = 18;
    ctx.moveTo(x, y - size);
    ctx.lineTo(x + size, y);
    ctx.lineTo(x, y + size);
    ctx.lineTo(x - size, y);
    ctx.closePath();

    ctx.fillStyle = '#eab308'; // Amber Gold
    ctx.shadowColor = 'rgba(234, 179, 8, 0.7)';
    ctx.shadowBlur = isHovered ? 25 : 15;
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Depot Icon Symbol (H / HQ / Cross)
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('HQ', x, y);

    // Label
    ctx.font = '600 12px Inter, sans-serif';
    ctx.fillStyle = '#fde047';
    ctx.fillText(name, x, y + size + 16);

    ctx.restore();
  }

  drawVehicle(ctx) {
    const anim = this.vehicleAnim;
    if (!anim) return;

    const seg = anim.segments[anim.segmentIdx];
    if (!seg) return;

    // Linear interpolation along current segment
    const t = Math.max(0, Math.min(1, anim.segmentProgress));
    const curX = seg.from.x + (seg.to.x - seg.from.x) * t;
    const curY = seg.from.y + (seg.to.y - seg.from.y) * t;
    const angle = Math.atan2(seg.to.y - seg.from.y, seg.to.x - seg.from.x);

    ctx.save();
    ctx.translate(curX, curY);
    ctx.rotate(angle);

    // Headlight cone
    const grad = ctx.createRadialGradient(10, 0, 2, 40, 0, 35);
    grad.addColorStop(0, 'rgba(56, 189, 248, 0.6)');
    grad.addColorStop(1, 'rgba(56, 189, 248, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(10, -8);
    ctx.lineTo(45, -24);
    ctx.lineTo(45, 24);
    ctx.lineTo(10, 8);
    ctx.closePath();
    ctx.fill();

    // Vehicle Body (Emergency Transport Drone / Ambulance)
    ctx.fillStyle = '#f8fafc';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 15;

    // Body rectangle with rounded edges
    ctx.beginPath();
    ctx.roundRect(-16, -10, 32, 20, [4, 8, 8, 4]);
    ctx.fill();
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Flashing Emergency Siren on top
    const sirenRed = (Math.floor(this.animPhase * 8) % 2 === 0);
    ctx.beginPath();
    ctx.arc(0, 0, 4, 0, Math.PI * 2);
    ctx.fillStyle = sirenRed ? '#ef4444' : '#38bdf8';
    ctx.shadowColor = sirenRed ? '#ef4444' : '#38bdf8';
    ctx.shadowBlur = 10;
    ctx.fill();

    ctx.restore();
  }
}

window.MapCanvas = MapCanvas;
