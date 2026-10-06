import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Cpu, 
  Flame, 
  Zap, 
  Scale, 
  ShieldCheck, 
  Clock, 
  Sparkles,
  BookOpen,
  Code2,
  Calculator,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export function WhyDPSection({ onLoadPreset, setActiveTab }) {
  const [activeCodeTab, setActiveCodeTab] = useState('dp'); // 'dp' | 'bb' | 'greedy'

  return (
    <div style={{ maxWidth: '1180px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* 1. Header Hero Banner */}
      <div className="stage-card" style={{ padding: '2rem', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(6, 182, 212, 0.08) 100%)', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#10b981', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <Sparkles size={16} /> DAA Project Core Defense & Justification
        </div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#fff', marginTop: '0.4rem', letterSpacing: '-0.02em' }}>
          Why Dynamic Programming is the Optimal Choice
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.96rem', lineHeight: 1.7, marginTop: '0.6rem', maxWidth: '950px' }}>
          In emergency triage logistics, choosing the wrong algorithm costs human lives. 
          Below is the rigorous mathematical derivation of time and space complexity, basic algorithmic pseudocode, and an analytical comparison showing why <strong>Bitmask Dynamic Programming</strong> outperforms Greedy and Backtracking.
        </p>
      </div>

      {/* 2. 3-Card Comparative Bento Verdict */}
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

          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>1. Dynamic Programming</h3>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.82rem', color: '#34d399', fontWeight: 700 }}>
            Time: Θ(n² · 2ⁿ) | Space: Θ(n · 2ⁿ)
          </div>

          <ul style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', lineHeight: 1.7, marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
              <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span><strong>Guaranteed Global Minimum:</strong> Always minimizes total weighted patient delay (∑ wᵢ · Aᵢ).</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
              <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span><strong>Deterministic Performance:</strong> Solves exactly 2ⁿ × n subproblems. No unpredictable runtime spikes.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
              <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span><strong>Memoized Subproblems:</strong> Eliminates re-evaluating identical sets of visited facilities.</span>
            </li>
          </ul>

          <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
            <div style={{ background: '#070b14', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.65rem 0.85rem', borderRadius: '8px', fontSize: '0.78rem', color: '#34d399' }}>
              ✅ <strong>Verdict:</strong> Ideal for single-vehicle dispatch with n ≤ 18 triage stations per sortie.
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

          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>2. Why NOT Greedy?</h3>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.82rem', color: '#fbbf24', fontWeight: 700 }}>
            Time: O(n²) | Space: O(n)
          </div>

          <ul style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', lineHeight: 1.7, marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
              <XCircle size={16} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span><strong>Shortsighted Ratio Heuristic:</strong> Greedily picks next node maximizing (weight / travel_time).</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
              <XCircle size={16} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span><strong>Catastrophic Local Traps:</strong> Easily lured into visiting clusters of minor clinics (w=2) near depot first.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
              <XCircle size={16} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span><strong>+15.75% Higher Delay on Preset 1:</strong> St. Jude Trauma ICU (w=10) waits an extra 4.6s, multiplying mortality risk.</span>
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

          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>3. Why NOT Backtracking?</h3>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.82rem', color: '#38bdf8', fontWeight: 700 }}>
            Time: O(n!) Worst-Case | Space: O(n) Call Stack
          </div>

          <ul style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', lineHeight: 1.7, marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
              <XCircle size={16} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span><strong>Factorial Combinatorial Explosion:</strong> For n=14, 14! = 87.1 billion routes. The browser crashes.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
              <XCircle size={16} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span><strong>Unpredictable Pruning:</strong> In uniform distributions, lower bounding fails to prune branches early.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
              <XCircle size={16} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span><strong>No Memory Reuse:</strong> Recomputes the same subsets repeatedly because it lacks DP table memoization.</span>
            </li>
          </ul>

          <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
            <div style={{ background: '#070b14', border: '1px solid rgba(6, 182, 212, 0.3)', padding: '0.65rem 0.85rem', borderRadius: '8px', fontSize: '0.78rem', color: '#38bdf8' }}>
              ⚠️ <strong>Limitation:</strong> Impractical for n &gt; 12 in mission-critical systems.
            </div>
          </div>
        </div>

      </div>

      {/* 3. Mathematical Derivations of Complexity */}
      <div className="stage-card" style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calculator size={20} color="#38bdf8" />
          <span>Step-by-Step Derivation of Time & Space Complexity</span>
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '1.5rem', marginTop: '1.25rem' }}>
          
          {/* Time Complexity Derivation */}
          <div className="bento-highlight-box">
            <h4 style={{ color: '#10b981', fontSize: '1.05rem', fontWeight: 800, marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Clock size={16} /> 1. Time Complexity Derivation: Θ(n² · 2ⁿ)
            </h4>
            <ol style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', lineHeight: 1.8, marginLeft: '1.2rem' }}>
              <li>
                <strong>State Count:</strong> A state is defined by a pair <code>(S, u)</code> where <code>S ⊆ {'{1..n}'}</code> is the subset of visited locations (represented as an integer bitmask from <code>0</code> to <code>2ⁿ - 1</code>), and <code>u ∈ S</code> is the last visited location.
                <div style={{ fontFamily: 'JetBrains Mono', color: '#38bdf8', marginTop: '0.2rem' }}>
                  Total States = ∑ [k=1 to n] (n choose k) × k = n · 2ⁿ⁻¹ = O(n · 2ⁿ)
                </div>
              </li>
              <li>
                <strong>Transitions per State:</strong> From state <code>(S, u)</code>, we can transition to any unvisited location <code>v ∉ S</code>. There are <code>(n - |S|)</code> possible choices of <code>v</code>.
              </li>
              <li>
                <strong>Total Operations Count:</strong>
                <div style={{ fontFamily: 'JetBrains Mono', color: '#34d399', background: '#070a13', padding: '0.5rem', borderRadius: '6px', margin: '0.4rem 0' }}>
                  Total Transitions = ∑ [k=1 to n] (n choose k) × k × (n - k) = n(n - 1) · 2ⁿ⁻² = Θ(n² · 2ⁿ)
                </div>
              </li>
              <li>
                <strong>Work per Transition:</strong> Each transition performs <code>O(1)</code> arithmetic operations (travel time calculation, multiplication by precalculated remaining weight <code>W_rem</code>, and min comparison).
              </li>
              <li>
                <strong>Conclusion:</strong> Overall Time Complexity is <strong>Θ(n² · 2ⁿ)</strong>.
              </li>
            </ol>
          </div>

          {/* Space Complexity Derivation */}
          <div className="bento-highlight-box">
            <h4 style={{ color: '#06b6d4', fontSize: '1.05rem', fontWeight: 800, marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Cpu size={16} /> 2. Space Complexity Derivation: Θ(n · 2ⁿ)
            </h4>
            <ol style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', lineHeight: 1.8, marginLeft: '1.2rem' }}>
              <li>
                <strong>DP Penalty Matrix:</strong> <code>dp[mask][last]</code> has dimensions <code>2ⁿ × n</code>. Using 64-bit IEEE floating-point numbers (<code>Float64Array</code>), each entry takes 8 bytes.
                <div style={{ fontFamily: 'JetBrains Mono', color: '#38bdf8', marginTop: '0.2rem' }}>
                  DP Table Size = 2ⁿ × n × 8 bytes
                </div>
              </li>
              <li>
                <strong>Predecessor Parent Table:</strong> <code>parent[mask][last]</code> stores the index of the preceding node <code>u</code> for path reconstruction using 16-bit integers (<code>Int16Array</code>, 2 bytes per entry).
                <div style={{ fontFamily: 'JetBrains Mono', color: '#38bdf8', marginTop: '0.2rem' }}>
                  Parent Table Size = 2ⁿ × n × 2 bytes
                </div>
              </li>
              <li>
                <strong>Mask Weight Cache:</strong> <code>weightOfMask[mask]</code> stores the sum of weights for each mask (<code>2ⁿ × 8 bytes</code>).
              </li>
              <li>
                <strong>Concrete Memory Footprint:</strong>
                <div style={{ fontFamily: 'JetBrains Mono', color: '#34d399', background: '#070a13', padding: '0.5rem', borderRadius: '6px', margin: '0.4rem 0' }}>
                  Total Memory = 2ⁿ · (10n + 8) bytes
                </div>
                For <code>n = 10</code>: 2¹⁰ × 108 B = <strong>108 KB</strong>.<br />
                For <code>n = 18</code>: 2¹⁸ × 188 B = <strong>49.3 MB</strong> (fits comfortably in browser memory).
              </li>
              <li>
                <strong>Conclusion:</strong> Overall Space Complexity is <strong>Θ(n · 2ⁿ)</strong>.
              </li>
            </ol>
          </div>

        </div>
      </div>

      {/* 4. Basic Algorithm & Pseudocode Section */}
      <div className="stage-card" style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Code2 size={20} color="#f59e0b" />
          <span>Basic Algorithms for the Three Approaches</span>
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '0.4rem' }}>
          Clean, step-by-step algorithms designed to be easily read and explained during a presentation.
        </p>

        {/* Algorithm Switcher Tabs */}
        <div style={{ display: 'flex', gap: '0.4rem', marginTop: '1rem', background: 'var(--bg-secondary)', padding: '0.25rem', borderRadius: '8px', width: 'fit-content' }}>
          <button
            className={`btn btn-sm ${activeCodeTab === 'dp' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveCodeTab('dp')}
          >
            1. Bitmask DP Algorithm
          </button>
          <button
            className={`btn btn-sm ${activeCodeTab === 'bb' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveCodeTab('bb')}
          >
            2. Branch & Bound Algorithm
          </button>
          <button
            className={`btn btn-sm ${activeCodeTab === 'greedy' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveCodeTab('greedy')}
          >
            3. Greedy Heuristic Algorithm
          </button>
        </div>

        {/* DP Pseudocode */}
        {activeCodeTab === 'dp' && (
          <div style={{ marginTop: '1rem' }}>
            <div style={{ background: '#070a13', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '1.25rem', fontFamily: 'JetBrains Mono', fontSize: '0.82rem', color: '#e2e8f0', lineHeight: 1.7, overflowX: 'auto' }}>
              <span style={{ color: '#10b981', fontWeight: 700 }}>// ================================================================</span><br />
              <span style={{ color: '#10b981', fontWeight: 700 }}>// ALGORITHM 1: Bitmask Dynamic Programming (Exact Optimal Solver)</span><br />
              <span style={{ color: '#10b981', fontWeight: 700 }}>// ================================================================</span><br /><br />
              <span style={{ color: '#38bdf8' }}>function</span> <span style={{ color: '#fbbf24' }}>SolveDynamicProgramming</span>(depot, locations, speed):<br />
              &nbsp;&nbsp;n = locations.length<br />
              &nbsp;&nbsp;numStates = 1 &lt;&lt; n <span style={{ color: '#64748b' }}>// 2ⁿ possible visited subsets</span><br />
              &nbsp;&nbsp;totalWeight = sum of all locations[i].weight<br />
              &nbsp;&nbsp;<br />
              &nbsp;&nbsp;<span style={{ color: '#64748b' }}>// Step 1: Initialize dp[mask][last] and parent[mask][last]</span><br />
              &nbsp;&nbsp;dp = Array(numStates, n).fill(Infinity)<br />
              &nbsp;&nbsp;parent = Array(numStates, n).fill(-1)<br />
              &nbsp;&nbsp;<br />
              &nbsp;&nbsp;<span style={{ color: '#64748b' }}>// Step 2: Base Cases (Travel from Depot to first location v)</span><br />
              &nbsp;&nbsp;<span style={{ color: '#38bdf8' }}>for</span> v = 0 <span style={{ color: '#38bdf8' }}>to</span> n - 1:<br />
              &nbsp;&nbsp;&nbsp;&nbsp;mask = 1 &lt;&lt; v<br />
              &nbsp;&nbsp;&nbsp;&nbsp;dp[mask][v] = travel_time(depot, locations[v]) * totalWeight<br />
              &nbsp;&nbsp;&nbsp;&nbsp;parent[mask][v] = -1 <span style={{ color: '#64748b' }}>// Started from depot</span><br />
              &nbsp;&nbsp;<br />
              &nbsp;&nbsp;<span style={{ color: '#64748b' }}>// Step 3: Populate Subproblems by Mask Size</span><br />
              &nbsp;&nbsp;<span style={{ color: '#38bdf8' }}>for</span> mask = 1 <span style={{ color: '#38bdf8' }}>to</span> numStates - 1:<br />
              &nbsp;&nbsp;&nbsp;&nbsp;remWeight = totalWeight - weight_of(mask)<br />
              &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#38bdf8' }}>if</span> remWeight &lt;= 0: <span style={{ color: '#38bdf8' }}>continue</span><br />
              &nbsp;&nbsp;&nbsp;&nbsp;<br />
              &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#38bdf8' }}>for</span> u = 0 <span style={{ color: '#38bdf8' }}>to</span> n - 1 (<span style={{ color: '#38bdf8' }}>where</span> u is in mask):<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#38bdf8' }}>if</span> dp[mask][u] == Infinity: <span style={{ color: '#38bdf8' }}>continue</span><br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#38bdf8' }}>for</span> v = 0 <span style={{ color: '#38bdf8' }}>to</span> n - 1 (<span style={{ color: '#38bdf8' }}>where</span> v is NOT in mask):<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;nextMask = mask | (1 &lt;&lt; v)<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;addedPenalty = travel_time(locations[u], locations[v]) * remWeight<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;cost = dp[mask][u] + addedPenalty<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#38bdf8' }}>if</span> cost &lt; dp[nextMask][v]:<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;dp[nextMask][v] = cost<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;parent[nextMask][v] = u<br />
              &nbsp;&nbsp;<br />
              &nbsp;&nbsp;<span style={{ color: '#64748b' }}>// Step 4: Reconstruct Optimal Route from Parent Table</span><br />
              &nbsp;&nbsp;bestLastNode = argmin_{v} (dp[(1 &lt;&lt; n) - 1][v])<br />
              &nbsp;&nbsp;optimalRoute = BacktrackParents(parent, bestLastNode)<br />
              &nbsp;&nbsp;<span style={{ color: '#38bdf8' }}>return</span> optimalRoute, dp[(1 &lt;&lt; n) - 1][bestLastNode]
            </div>
          </div>
        )}

        {/* B&B Pseudocode */}
        {activeCodeTab === 'bb' && (
          <div style={{ marginTop: '1rem' }}>
            <div style={{ background: '#070a13', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '1.25rem', fontFamily: 'JetBrains Mono', fontSize: '0.82rem', color: '#e2e8f0', lineHeight: 1.7, overflowX: 'auto' }}>
              <span style={{ color: '#06b6d4', fontWeight: 700 }}>// ================================================================</span><br />
              <span style={{ color: '#06b6d4', fontWeight: 700 }}>// ALGORITHM 2: Backtracking with Branch & Bound Pruning</span><br />
              <span style={{ color: '#06b6d4', fontWeight: 700 }}>// ================================================================</span><br /><br />
              <span style={{ color: '#38bdf8' }}>function</span> <span style={{ color: '#fbbf24' }}>SolveBranchAndBound</span>(depot, locations, speed):<br />
              &nbsp;&nbsp;bestCost = Infinity<br />
              &nbsp;&nbsp;bestRoute = []<br />
              &nbsp;&nbsp;<br />
              &nbsp;&nbsp;<span style={{ color: '#38bdf8' }}>function</span> <span style={{ color: '#fbbf24' }}>Search</span>(depth, lastNode, currentCost, remWeight):<br />
              &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#38bdf8' }}>if</span> depth == n:<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#38bdf8' }}>if</span> currentCost &lt; bestCost:<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;bestCost = currentCost<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;bestRoute = currentPath.clone()<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#38bdf8' }}>return</span><br />
              &nbsp;&nbsp;&nbsp;&nbsp;<br />
              &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#64748b' }}>// Branch and Bound Lower Bound Pruning</span><br />
              &nbsp;&nbsp;&nbsp;&nbsp;lowerBound = currentCost + min_exit_time(lastNode) * remWeight<br />
              &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#38bdf8' }}>if</span> lowerBound &gt;= bestCost:<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#38bdf8' }}>return</span> <span style={{ color: '#ef4444' }}>// PRUNE SUBTREE</span><br />
              &nbsp;&nbsp;&nbsp;&nbsp;<br />
              &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#38bdf8' }}>for each</span> unvisited location v:<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;visited[v] = true<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;deltaCost = travel_time(lastNode, locations[v]) * remWeight<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Search(depth + 1, v, currentCost + deltaCost, remWeight - locations[v].weight)<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;visited[v] = false<br />
              &nbsp;&nbsp;<br />
              &nbsp;&nbsp;Search(depth=0, lastNode=Depot, currentCost=0, remWeight=totalWeight)<br />
              &nbsp;&nbsp;<span style={{ color: '#38bdf8' }}>return</span> bestRoute, bestCost
            </div>
          </div>
        )}

        {/* Greedy Pseudocode */}
        {activeCodeTab === 'greedy' && (
          <div style={{ marginTop: '1rem' }}>
            <div style={{ background: '#070a13', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '1.25rem', fontFamily: 'JetBrains Mono', fontSize: '0.82rem', color: '#e2e8f0', lineHeight: 1.7, overflowX: 'auto' }}>
              <span style={{ color: '#f59e0b', fontWeight: 700 }}>// ================================================================</span><br />
              <span style={{ color: '#f59e0b', fontWeight: 700 }}>// ALGORITHM 3: Greedy Priority Heuristic (Shortsighted w/t Ratio)</span><br />
              <span style={{ color: '#f59e0b', fontWeight: 700 }}>// ================================================================</span><br /><br />
              <span style={{ color: '#38bdf8' }}>function</span> <span style={{ color: '#fbbf24' }}>SolveGreedy</span>(depot, locations, speed):<br />
              &nbsp;&nbsp;currentPos = depot<br />
              &nbsp;&nbsp;unvisited = Set(0, 1, ..., n - 1)<br />
              &nbsp;&nbsp;order = []<br />
              &nbsp;&nbsp;<br />
              &nbsp;&nbsp;<span style={{ color: '#38bdf8' }}>while</span> unvisited is not empty:<br />
              &nbsp;&nbsp;&nbsp;&nbsp;bestNode = -1<br />
              &nbsp;&nbsp;&nbsp;&nbsp;bestRatio = -Infinity<br />
              &nbsp;&nbsp;&nbsp;&nbsp;<br />
              &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#38bdf8' }}>for each</span> candidate v in unvisited:<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;t = travel_time(currentPos, locations[v], speed)<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ratio = locations[v].weight / max(t, 0.0001)<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#38bdf8' }}>if</span> ratio &gt; bestRatio:<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;bestRatio = ratio<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;bestNode = v<br />
              &nbsp;&nbsp;&nbsp;&nbsp;<br />
              &nbsp;&nbsp;&nbsp;&nbsp;order.append(bestNode)<br />
              &nbsp;&nbsp;&nbsp;&nbsp;unvisited.remove(bestNode)<br />
              &nbsp;&nbsp;&nbsp;&nbsp;currentPos = locations[bestNode]<br />
              &nbsp;&nbsp;<br />
              &nbsp;&nbsp;<span style={{ color: '#38bdf8' }}>return</span> order, EvaluateRouteCost(order)
            </div>
          </div>
        )}
      </div>

      {/* 5. Head-to-Head Comparison Table */}
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
                <td style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>Space Complexity</td>
                <td style={{ padding: '0.75rem 1rem', fontFamily: 'JetBrains Mono' }}>Θ(n · 2ⁿ)</td>
                <td style={{ padding: '0.75rem 1rem', fontFamily: 'JetBrains Mono' }}>O(n)</td>
                <td style={{ padding: '0.75rem 1rem', fontFamily: 'JetBrains Mono' }}>O(n) Call Stack</td>
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
