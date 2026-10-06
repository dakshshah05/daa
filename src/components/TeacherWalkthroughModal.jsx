import React, { useState } from 'react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  GraduationCap, 
  CheckCircle2, 
  AlertTriangle, 
  Cpu, 
  TrendingUp, 
  Layers,
  Sparkles
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export function TeacherWalkthroughModal({ isOpen, onClose, onLoadPreset, setActiveTab }) {
  const [slide, setSlide] = useState(0);

  if (!isOpen) return null;

  const slides = [
    {
      title: "1. Core Problem: Minimum Total Weighted Latency (MWLP)",
      badge: "Problem Definition",
      icon: GraduationCap,
      color: "#38bdf8",
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ lineHeight: 1.7, color: 'var(--text-secondary)' }}>
            <strong>The Question to Teacher:</strong> <em>"In an emergency triage scenario with n casualties, why can't we simply use Dijkstra or Traveling Salesperson (TSP)?"</em>
          </p>
          <div className="bento-highlight-box">
            <div style={{ fontWeight: 700, color: '#fff', marginBottom: '0.4rem' }}>
              🎯 The Mathematical Objective:
            </div>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.92rem', color: '#38bdf8', background: '#070a13', padding: '0.75rem', borderRadius: '6px' }}>
              min ∑ (weight_i × arrival_time_i)
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              TSP minimizes <em>total distance traveled</em>, which treats the first patient identically to the last. MWLP minimizes <em>cumulative patient waiting time weighted by urgency</em> (weights 1 to 10).
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '0.75rem', borderRadius: '8px' }}>
              <strong style={{ color: '#f87171', fontSize: '0.85rem' }}>Standard TSP</strong>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Traversing edge (u, v) adds a constant distance d(u, v) regardless of step sequence.</p>
            </div>
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.75rem', borderRadius: '8px' }}>
              <strong style={{ color: '#34d399', fontSize: '0.85rem' }}>GoldenHour MWLP</strong>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Traversing edge (u, v) delays node v AND <em>all subsequent unvisited nodes</em>!</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "2. The 'Greedy Trap' — Why Heuristics Fail Drastically",
      badge: "Heuristic Failure Analysis",
      icon: AlertTriangle,
      color: "#f59e0b",
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ lineHeight: 1.7, color: 'var(--text-secondary)' }}>
            The natural heuristic is <strong>Greedy</strong>: pick next stop = max(urgency weight / travel time).
          </p>
          <div className="bento-highlight-box" style={{ borderColor: 'rgba(245, 158, 11, 0.4)' }}>
            <div style={{ fontWeight: 700, color: '#fde047', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <AlertTriangle size={16} /> Why Greedy gets trapped on Preset 1:
            </div>
            <ul style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginLeft: '1.2rem', lineHeight: 1.7 }}>
              <li>East Clinics A, B, C are close to the depot with low urgency (weight = 2).</li>
              <li>Greedy services the nearby cluster first because their distance is tiny, yielding high immediate ratio scores.</li>
              <li><strong>The Disaster:</strong> While visiting 4 minor clinics, the distant <strong>St. Jude Trauma ICU (weight = 10)</strong> waiting time accumulates to 4.6 seconds, multiplying by weight 10 and exploding the penalty!</li>
              <li><strong>DP Advantage:</strong> DP bypasses the local cluster, travels express to St. Jude first, saving <strong>+15.6% to 25% weighted delay</strong>!</li>
            </ul>
          </div>
          <button
            className="btn btn-sm btn-primary"
            style={{ alignSelf: 'flex-start' }}
            onClick={() => {
              onLoadPreset('greedy_trap');
              onClose();
            }}
          >
            ⚡ Load & Inspect Greedy Trap Preset
          </button>
        </div>
      )
    },
    {
      title: "3. The Dynamic Programming Breakthrough: Bitmask Recurrence",
      badge: "Algorithmic Formulation",
      icon: Cpu,
      color: "#10b981",
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ lineHeight: 1.7, color: 'var(--text-secondary)' }}>
            <strong>How DP avoids tracking continuous time:</strong> By recognizing that moving from node u to v adds Δt × W_rem to the global objective.
          </p>
          <div className="bento-highlight-box" style={{ borderColor: 'rgba(16, 185, 129, 0.4)' }}>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.85rem', color: '#34d399', background: '#070a13', padding: '0.75rem', borderRadius: '6px' }}>
              DP[mask ∪ {'{v}'}][v] = min_u ( DP[mask][u] + travel_time(u, v) × W_rem )
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.6rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <div><strong>State Space:</strong> 2ⁿ × n subproblems</div>
              <div><strong>Bitmask:</strong> integer binary flags (01101₂)</div>
              <div><strong>Transitions:</strong> n candidates per state</div>
              <div><strong>Total Complexity:</strong> Θ(n² · 2ⁿ)</div>
            </div>
          </div>
          <button
            className="btn btn-sm btn-success"
            style={{ alignSelf: 'flex-start' }}
            onClick={() => {
              setActiveTab('dp-stepper');
              onClose();
            }}
          >
            🔍 Open DP Step-Through Table Visualizer
          </button>
        </div>
      )
    },
    {
      title: "4. Complexity & Empirical Benchmarking Summary",
      badge: "Empirical Validation",
      icon: TrendingUp,
      color: "#06b6d4",
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ lineHeight: 1.7, color: 'var(--text-secondary)' }}>
            Summary of all three algorithms implemented from scratch:
          </p>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', fontFamily: 'JetBrains Mono' }}>
              <thead>
                <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)', color: '#fff', textAlign: 'left' }}>
                  <th style={{ padding: '0.5rem' }}>Solver</th>
                  <th style={{ padding: '0.5rem' }}>Time Complexity</th>
                  <th style={{ padding: '0.5rem' }}>Optimality</th>
                  <th style={{ padding: '0.5rem' }}>Practical Scale</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '0.5rem', color: '#10b981', fontWeight: 700 }}>Bitmask DP</td>
                  <td style={{ padding: '0.5rem' }}>Θ(n² · 2ⁿ)</td>
                  <td style={{ padding: '0.5rem', color: '#34d399' }}>Exact Minimum</td>
                  <td style={{ padding: '0.5rem' }}>n ≤ 18 (Instant)</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '0.5rem', color: '#06b6d4', fontWeight: 700 }}>Branch & Bound</td>
                  <td style={{ padding: '0.5rem' }}>O(n!) worst</td>
                  <td style={{ padding: '0.5rem', color: '#34d399' }}>Exact Minimum</td>
                  <td style={{ padding: '0.5rem' }}>n ≤ 12</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '0.5rem', color: '#f59e0b', fontWeight: 700 }}>Greedy Heuristic</td>
                  <td style={{ padding: '0.5rem' }}>O(n²)</td>
                  <td style={{ padding: '0.5rem', color: '#f87171' }}>Suboptimal (~15% gap)</td>
                  <td style={{ padding: '0.5rem' }}>n ≤ 10,000+</td>
                </tr>
              </tbody>
            </table>
          </div>
          <button
            className="btn btn-sm btn-secondary"
            style={{ alignSelf: 'flex-start' }}
            onClick={() => {
              setActiveTab('benchmark');
              onClose();
            }}
          >
            📊 View Interactive Log-Scale Charts
          </button>
        </div>
      )
    }
  ];

  const cur = slides[slide];
  const Icon = cur.icon;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: `${cur.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: cur.color }}>
              <Icon size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: cur.color, fontWeight: 700 }}>
                {cur.badge} (Slide {slide + 1} of {slides.length})
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff' }}>{cur.title}</h3>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {cur.content}
        </div>

        {/* Modal Footer / Navigation */}
        <div className="modal-footer">
          <button
            className="btn btn-sm btn-outline"
            disabled={slide === 0}
            onClick={() => {
              sounds.playClick();
              setSlide((s) => s - 1);
            }}
          >
            <ChevronLeft size={15} /> Previous
          </button>

          <div style={{ display: 'flex', gap: '0.35rem' }}>
            {slides.map((_, idx) => (
              <span
                key={idx}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: slide === idx ? 'var(--accent-blue)' : 'var(--bg-tertiary)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => {
                  sounds.playClick();
                  setSlide(idx);
                }}
              />
            ))}
          </div>

          <button
            className="btn btn-sm btn-primary"
            disabled={slide === slides.length - 1}
            onClick={() => {
              sounds.playClick();
              setSlide((s) => s + 1);
            }}
          >
            Next Slide <ChevronRight size={15} />
          </button>
        </div>

      </div>
    </div>
  );
}
