import React, { useState } from 'react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  GraduationCap, 
  AlertTriangle, 
  Cpu, 
  TrendingUp
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <p style={{ lineHeight: 1.7, color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            <strong style={{ color: '#fff' }}>The Question to Teacher:</strong> <em>"In an emergency triage scenario with n casualties, why can't we simply use Dijkstra or Traveling Salesperson (TSP)?"</em>
          </p>
          <div className="bento-highlight-box" style={{ border: '2px solid #38bdf8', boxShadow: 'var(--neo-shadow-blue)' }}>
            <div style={{ fontWeight: 800, color: '#fff', marginBottom: '0.45rem', fontSize: '0.95rem' }}>
              🎯 The Mathematical Objective:
            </div>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: '1rem', color: '#38bdf8', background: '#000000', padding: '0.85rem', borderRadius: '6px', border: '1.5px solid #334155', fontWeight: 800 }}>
              min ∑ (weight_i × arrival_time_i)
            </div>
            <p style={{ fontSize: '0.86rem', color: '#cbd5e1', marginTop: '0.65rem', lineHeight: 1.6 }}>
              TSP minimizes <em>total distance traveled</em>, which treats the first patient identically to the last. MWLP minimizes <em>cumulative patient waiting time weighted by urgency</em> (weights 1 to 10).
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
            <div style={{ background: 'rgba(255, 51, 102, 0.15)', border: '2px solid #000', padding: '0.85rem', borderRadius: '8px', boxShadow: 'var(--neo-shadow-xs)' }}>
              <strong style={{ color: '#ff4d7a', fontSize: '0.88rem' }}>Standard TSP</strong>
              <p style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '0.35rem' }}>Traversing edge (u, v) adds a constant distance d(u, v) regardless of step sequence.</p>
            </div>
            <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '2px solid #000', padding: '0.85rem', borderRadius: '8px', boxShadow: 'var(--neo-shadow-xs)' }}>
              <strong style={{ color: '#34d399', fontSize: '0.88rem' }}>GoldenHour MWLP</strong>
              <p style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '0.35rem' }}>Traversing edge (u, v) delays node v AND <em>all subsequent unvisited nodes</em>!</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "2. The 'Greedy Trap' — Why Heuristics Fail Drastically",
      badge: "Heuristic Failure Analysis",
      icon: AlertTriangle,
      color: "#fbbf24",
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <p style={{ lineHeight: 1.7, color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            The natural heuristic is <strong>Greedy</strong>: pick next stop = max(urgency weight / travel time).
          </p>
          <div className="bento-highlight-box" style={{ border: '2px solid #fbbf24', boxShadow: 'var(--neo-shadow-amber)' }}>
            <div style={{ fontWeight: 800, color: '#fde047', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem' }}>
              <AlertTriangle size={18} /> Why Greedy gets trapped on Preset 1:
            </div>
            <ul style={{ fontSize: '0.86rem', color: '#cbd5e1', marginLeft: '1.25rem', lineHeight: 1.75 }}>
              <li>East Clinics A, B, C are close to the depot with low urgency (weight = 2).</li>
              <li>Greedy services the nearby cluster first because their distance is tiny, yielding high immediate ratio scores.</li>
              <li><strong style={{ color: '#ff4d7a' }}>The Disaster:</strong> While visiting 4 minor clinics, the distant <strong>St. Jude Trauma ICU (weight = 10)</strong> waiting time accumulates to 4.6 seconds, multiplying by weight 10 and exploding the penalty!</li>
              <li><strong style={{ color: '#34d399' }}>DP Advantage:</strong> DP bypasses the local cluster, travels express to St. Jude first, saving <strong>+15.6% to 25% weighted delay</strong>!</li>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <p style={{ lineHeight: 1.7, color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            <strong style={{ color: '#fff' }}>How DP avoids tracking continuous time:</strong> By recognizing that moving from node u to v adds Δt × W_rem to the global objective.
          </p>
          <div className="bento-highlight-box" style={{ border: '2px solid #10b981', boxShadow: 'var(--neo-shadow-emerald)' }}>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.92rem', color: '#34d399', background: '#000000', padding: '0.85rem', borderRadius: '6px', border: '1.5px solid #10b981', fontWeight: 800 }}>
              DP[mask ∪ {'{v}'}][v] = min_u ( DP[mask][u] + travel_time(u, v) × W_rem )
            </div>
            <div style={{ fontSize: '0.84rem', color: '#cbd5e1', marginTop: '0.75rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <p style={{ lineHeight: 1.7, color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            Summary of all three algorithms implemented from scratch:
          </p>
          <div style={{ overflowX: 'auto', borderRadius: 'var(--radius-sm)', border: '2px solid #000', boxShadow: 'var(--neo-shadow-xs)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem', fontFamily: 'JetBrains Mono' }}>
              <thead>
                <tr style={{ background: 'rgba(6, 10, 20, 0.95)', borderBottom: '2px solid #000000', color: '#fff', textAlign: 'left' }}>
                  <th style={{ padding: '0.65rem 0.85rem' }}>Solver</th>
                  <th style={{ padding: '0.65rem 0.85rem' }}>Time Complexity</th>
                  <th style={{ padding: '0.65rem 0.85rem' }}>Optimality</th>
                  <th style={{ padding: '0.65rem 0.85rem' }}>Practical Scale</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1.5px solid #000', background: 'rgba(15, 23, 42, 0.65)' }}>
                  <td style={{ padding: '0.65rem 0.85rem', color: '#34d399', fontWeight: 800 }}>Bitmask DP</td>
                  <td style={{ padding: '0.65rem 0.85rem' }}>Θ(n² · 2ⁿ)</td>
                  <td style={{ padding: '0.65rem 0.85rem', color: '#34d399', fontWeight: 700 }}>Exact Minimum</td>
                  <td style={{ padding: '0.65rem 0.85rem' }}>n ≤ 18 (Instant)</td>
                </tr>
                <tr style={{ borderBottom: '1.5px solid #000', background: 'rgba(15, 23, 42, 0.45)' }}>
                  <td style={{ padding: '0.65rem 0.85rem', color: '#22d3ee', fontWeight: 800 }}>Branch & Bound</td>
                  <td style={{ padding: '0.65rem 0.85rem' }}>O(n!) worst</td>
                  <td style={{ padding: '0.65rem 0.85rem', color: '#34d399', fontWeight: 700 }}>Exact Minimum</td>
                  <td style={{ padding: '0.65rem 0.85rem' }}>n ≤ 12</td>
                </tr>
                <tr style={{ background: 'rgba(15, 23, 42, 0.65)' }}>
                  <td style={{ padding: '0.65rem 0.85rem', color: '#fbbf24', fontWeight: 800 }}>Greedy Heuristic</td>
                  <td style={{ padding: '0.65rem 0.85rem' }}>O(n²)</td>
                  <td style={{ padding: '0.65rem 0.85rem', color: '#ff4d7a', fontWeight: 700 }}>Suboptimal (~15% gap)</td>
                  <td style={{ padding: '0.65rem 0.85rem' }}>n ≤ 10,000+</td>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '8px', background: cur.color, border: '2px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', boxShadow: '2px 2px 0px #000' }}>
              <Icon size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: cur.color, fontWeight: 800, letterSpacing: '0.04em' }}>
                {cur.badge} (Slide {slide + 1} of {slides.length})
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#fff' }}>{cur.title}</h3>
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

          <div style={{ display: 'flex', gap: '0.45rem', alignItems: 'center' }}>
            {slides.map((_, idx) => (
              <span
                key={idx}
                style={{
                  width: slide === idx ? '22px' : '9px',
                  height: '9px',
                  borderRadius: '4px',
                  background: slide === idx ? '#38bdf8' : 'rgba(255, 255, 255, 0.2)',
                  border: '1.5px solid #000',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: slide === idx ? '1px 1px 0px #000' : 'none'
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
