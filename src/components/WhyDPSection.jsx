import React from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Cpu, 
  Flame, 
  Zap, 
  TrendingDown, 
  Scale, 
  ArrowRight,
  ShieldCheck,
  Clock,
  Sparkles
} from 'lucide-react';

export function WhyDPSection({ onLoadPreset, setActiveTab }) {
  return (
    <div style={{ maxWidth: '1180px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Hero Banner: Direct Verdict */}
      <div className="stage-card" style={{ padding: '2rem', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(6, 182, 212, 0.08) 100%)', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#10b981', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <Sparkles size={16} /> DAA Project Core Justification
        </div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#fff', marginTop: '0.4rem', letterSpacing: '-0.02em' }}>
          Why Dynamic Programming is the Optimal Choice
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.96rem', lineHeight: 1.7, marginTop: '0.6rem', maxWidth: '900px' }}>
          In emergency triage logistics, choosing the wrong algorithm costs human lives. 
          Here is the direct algorithmic, mathematical, and practical breakdown of why <strong>Bitmask Dynamic Programming</strong> is the superior solution over Greedy and Backtracking.
        </p>
      </div>

      {/* 3-Column Comparative Verdict Cards (Bento Grid) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        
        {/* DP Card (Winner) */}
        <div className="stage-card" style={{ border: '2px solid #10b981', background: 'rgba(16, 185, 129, 0.06)', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
            <span className="badge badge-success" style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}>
              <CheckCircle2 size={12} /> BEST CHOICE
            </span>
          </div>

          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', marginBottom: '0.5rem' }}>
            <Cpu size={24} />
          </div>

          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>Dynamic Programming</h3>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.82rem', color: '#34d399', fontWeight: 700 }}>
            Complexity: Θ(n² · 2ⁿ) Time | Θ(n · 2ⁿ) Space
          </div>

          <ul style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', lineHeight: 1.7, marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
              <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span><strong>Guaranteed Global Optimum:</strong> Finds the true minimum weighted arrival delay every single time.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
              <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span><strong>Deterministic Runtime:</strong> Exact 2ⁿ × n states. No worst-case execution spikes or browser hangs.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
              <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span><strong>Subproblem Overlap:</strong> Reuses optimal sub-paths rather than re-evaluating permutations from scratch.</span>
            </li>
          </ul>

          <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
            <div style={{ background: '#070b14', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.65rem 0.85rem', borderRadius: '8px', fontSize: '0.78rem', color: '#34d399' }}>
              ✅ <strong>Verdict:</strong> Ideal for real-time dispatch with n ≤ 18 facilities per vehicle sortie.
            </div>
          </div>
        </div>

        {/* Why NOT Greedy Card */}
        <div className="stage-card" style={{ border: '1px solid rgba(245, 158, 11, 0.4)' }}>
          <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
            <span className="badge badge-danger" style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}>
              <XCircle size={12} /> SUBOPTIMAL
            </span>
          </div>

          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b', marginBottom: '0.5rem' }}>
            <Zap size={24} />
          </div>

          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>Why NOT Greedy?</h3>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.82rem', color: '#fbbf24', fontWeight: 700 }}>
            Complexity: O(n²) Time | O(n) Space
          </div>

          <ul style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', lineHeight: 1.7, marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
              <XCircle size={16} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span><strong>Myopic & Shortsighted:</strong> Only evaluates the immediate next step ratio (urgency weight / travel time).</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
              <XCircle size={16} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span><strong>Catastrophic Traps:</strong> Easily tricked by clusters of nearby mild patients, delaying distant critical trauma victims by minutes.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
              <XCircle size={16} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span><strong>Suboptimality Gap Exceeding 15-25%:</strong> As proven in our Preset 1 test case, patients die waiting while greedy visits minor clinics.</span>
            </li>
          </ul>

          <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
            <button
              className="btn btn-sm btn-outline"
              style={{ width: '100%', borderColor: '#f59e0b', color: '#fbbf24' }}
              onClick={() => {
                onLoadPreset('greedy_trap');
                setActiveTab('canvas');
              }}
            >
              🚨 Test the Greedy Trap Live on Canvas
            </button>
          </div>
        </div>

        {/* Why NOT Backtracking Card */}
        <div className="stage-card" style={{ border: '1px solid rgba(6, 182, 212, 0.4)' }}>
          <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
            <span className="badge badge-warning" style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}>
              <Clock size={12} /> EXPONENTIAL RISK
            </span>
          </div>

          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#06b6d4', marginBottom: '0.5rem' }}>
            <Flame size={24} />
          </div>

          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>Why NOT Backtracking?</h3>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.82rem', color: '#38bdf8', fontWeight: 700 }}>
            Complexity: O(n!) Worst-Case Time | O(n) Space
          </div>

          <ul style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', lineHeight: 1.7, marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
              <XCircle size={16} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span><strong>Factorial Combinatorial Explosion:</strong> For n=14, 14! = 87,178,291,200 permutations. Browser freezes completely.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
              <XCircle size={16} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span><strong>Unpredictable Pruning:</strong> In symmetric layouts, lower bounding fails to prune branches early, causing massive latency spikes.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
              <XCircle size={16} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span><strong>Redundant Sub-Search:</strong> Evaluates identical subsets multiple times because it lacks state memoization.</span>
            </li>
          </ul>

          <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
            <div style={{ background: '#070b14', border: '1px solid rgba(6, 182, 212, 0.3)', padding: '0.65rem 0.85rem', borderRadius: '8px', fontSize: '0.78rem', color: '#38bdf8' }}>
              ⚠️ <strong>Limitation:</strong> Unusable in production for n &gt; 12.
            </div>
          </div>
        </div>

      </div>

      {/* Deep-Dive Section: The Mathematical Breakthrough */}
      <div className="stage-card" style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Scale size={20} color="#38bdf8" />
          <span>The Mathematical Insight: How DP Eliminates Continuous Time</span>
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
          <div>
            <h4 style={{ color: '#f87171', fontSize: '0.95rem', marginBottom: '0.4rem' }}>❌ The Naive Flaw (Tracking Elapsed Time)</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6 }}>
              If you try writing DP as <code>DP[visited_nodes][last_node][current_time]</code>, the state space explodes to infinity because continuous time has infinite values.
            </p>
          </div>

          <div>
            <h4 style={{ color: '#34d399', fontSize: '0.95rem', marginBottom: '0.4rem' }}>✅ The DP Incremental Formulation (Our Solution)</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6 }}>
              When traveling from u to v, the transit time Δt delays node v <strong>AND all remaining unvisited nodes</strong>. 
              The added penalty is simply:
            </p>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.88rem', color: '#10b981', background: '#070a13', padding: '0.65rem 0.85rem', borderRadius: '6px', marginTop: '0.4rem' }}>
              ΔCost = travel_time(u, v) × ∑(weights of all unvisited nodes)
            </div>
          </div>
        </div>

        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginTop: '1.5rem' }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', marginBottom: '0.35rem' }}>
            🎯 Recurrence Relation (Used in our code):
          </div>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.85rem', color: '#38bdf8', background: '#070a13', padding: '0.85rem', borderRadius: '6px', overflowX: 'auto' }}>
            DP[mask ∪ {'{v}'}][v] = min_u ( DP[mask][u] + travel_time(u, v) × (TotalWeight - Weight(mask)) )
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            This reduces the state space from infinite continuous time down to exactly <strong>2ⁿ × n discrete subproblems</strong>, solvable in milliseconds!
          </p>
        </div>
      </div>

      {/* Head-to-Head Comparison Matrix Table */}
      <div className="stage-card" style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck size={20} color="#10b981" />
          <span>Head-to-Head Decision Matrix</span>
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem', fontFamily: 'Inter, sans-serif' }}>
            <thead>
              <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)', textAlign: 'left', color: '#fff' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Evaluation Metric</th>
                <th style={{ padding: '0.75rem 1rem', color: '#10b981' }}>Dynamic Programming (Bitmask)</th>
                <th style={{ padding: '0.75rem 1rem', color: '#f59e0b' }}>Greedy Heuristic (Ratio)</th>
                <th style={{ padding: '0.75rem 1rem', color: '#06b6d4' }}>Branch & Bound</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>Optimality Guarantee</td>
                <td style={{ padding: '0.75rem 1rem', color: '#34d399', fontWeight: 700 }}>✅ 100% Exact Global Minimum</td>
                <td style={{ padding: '0.75rem 1rem', color: '#f87171' }}>❌ Suboptimal (15-25% Error)</td>
                <td style={{ padding: '0.75rem 1rem', color: '#34d399', fontWeight: 700 }}>✅ 100% Exact Global Minimum</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>Time Complexity</td>
                <td style={{ padding: '0.75rem 1rem', fontFamily: 'JetBrains Mono' }}>Θ(n² · 2ⁿ)</td>
                <td style={{ padding: '0.75rem 1rem', fontFamily: 'JetBrains Mono' }}>O(n²)</td>
                <td style={{ padding: '0.75rem 1rem', fontFamily: 'JetBrains Mono' }}>O(n!) worst-case</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>Runtime Predictability</td>
                <td style={{ padding: '0.75rem 1rem', color: '#34d399' }}>✅ Deterministic (No spikes)</td>
                <td style={{ padding: '0.75rem 1rem', color: '#34d399' }}>✅ Instant (under 1ms)</td>
                <td style={{ padding: '0.75rem 1rem', color: '#f87171' }}>❌ Highly erratic (O(n!) traps)</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>State Overlap Utilization</td>
                <td style={{ padding: '0.75rem 1rem', color: '#34d399' }}>✅ Optimal (2ⁿ × n table)</td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>N/A (No subproblems)</td>
                <td style={{ padding: '0.75rem 1rem', color: '#f87171' }}>❌ Redundant recalculation</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>Suitability for Emergency Dispatch</td>
                <td style={{ padding: '0.75rem 1rem', color: '#10b981', fontWeight: 800 }}>🏆 PERFECT (n ≤ 18)</td>
                <td style={{ padding: '0.75rem 1rem', color: '#f87171' }}>⚠️ High Clinical Risk</td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>⚠️ Limited to n ≤ 11</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
