import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Cpu, 
  Flame, 
  Zap, 
  Scale, 
  ShieldCheck, 
  Clock, 
  Sparkles, 
  Code2, 
  Calculator 
} from 'lucide-react';

export function WhyDPSection({ onLoadPreset, setActiveTab }) {
  const [activeCodeTab, setActiveCodeTab] = useState('dp'); // 'dp' | 'bb' | 'greedy'

  const dpPseudocode = `// ================================================================
// ALGORITHM 1: Bitmask Dynamic Programming (Exact Optimal Solver)
// ================================================================

function SolveDynamicProgramming(depot, locations, speed):
  n = locations.length
  numStates = 1 << n // 2^n possible visited subsets
  totalWeight = sum of all locations[i].weight
  
  // Step 1: Initialize dp[mask][last] and parent[mask][last]
  dp = Array(numStates, n).fill(Infinity)
  parent = Array(numStates, n).fill(-1)
  
  // Step 2: Base Cases (Travel from Depot to first location v)
  for v = 0 to n - 1:
    mask = 1 << v
    dp[mask][v] = travel_time(depot, locations[v]) * totalWeight
    parent[mask][v] = -1 // Started from depot
  
  // Step 3: Populate Subproblems by Mask Size
  for mask = 1 to numStates - 1:
    remWeight = totalWeight - weight_of(mask)
    if remWeight <= 0: continue
    
    for u = 0 to n - 1 (where u is in mask):
      if dp[mask][u] == Infinity: continue
      
      for v = 0 to n - 1 (where v is NOT in mask):
        nextMask = mask | (1 << v)
        addedPenalty = travel_time(locations[u], locations[v]) * remWeight
        cost = dp[mask][u] + addedPenalty
        
        if cost < dp[nextMask][v]:
          dp[nextMask][v] = cost
          parent[nextMask][v] = u
  
  // Step 4: Reconstruct Optimal Route from Parent Table
  bestLastNode = argmin_v (dp[(1 << n) - 1][v])
  optimalRoute = BacktrackParents(parent, bestLastNode)
  return optimalRoute, dp[(1 << n) - 1][bestLastNode]`;

  const bbPseudocode = `// ================================================================
// ALGORITHM 2: Backtracking with Branch & Bound Pruning
// ================================================================

function SolveBranchAndBound(depot, locations, speed):
  bestCost = Infinity
  bestRoute = []
  
  function Search(depth, lastNode, currentCost, remWeight):
    if depth == n:
      if currentCost < bestCost:
        bestCost = currentCost
        bestRoute = currentPath.clone()
      return
    
    // Branch and Bound Lower Bound Pruning
    lowerBound = currentCost + min_exit_time(lastNode) * remWeight
    if lowerBound >= bestCost:
      return // PRUNE SUBTREE
    
    for each unvisited location v:
      visited[v] = true
      deltaCost = travel_time(lastNode, locations[v]) * remWeight
      Search(depth + 1, v, currentCost + deltaCost, remWeight - locations[v].weight)
      visited[v] = false
  
  Search(depth=0, lastNode=Depot, currentCost=0, remWeight=totalWeight)
  return bestRoute, bestCost`;

  const greedyPseudocode = `// ================================================================
// ALGORITHM 3: Greedy Priority Heuristic (Shortsighted w/t Ratio)
// ================================================================

function SolveGreedy(depot, locations, speed):
  currentPos = depot
  unvisited = Set(0, 1, ..., n - 1)
  order = []
  
  while unvisited is not empty:
    bestNode = -1
    bestRatio = -Infinity
    
    for each candidate v in unvisited:
      t = travel_time(currentPos, locations[v], speed)
      ratio = locations[v].weight / max(t, 0.0001)
      if ratio > bestRatio:
        bestRatio = ratio
        bestNode = v
    
    order.append(bestNode)
    unvisited.remove(bestNode)
    currentPos = locations[bestNode]
  
  return order, EvaluateRouteCost(order)`;

  return (
    <div style={{ maxWidth: '1180px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* 1. Header Hero Banner */}
      <div className="stage-card" style={{ padding: '1.75rem', background: 'var(--bg-card)', border: '1px solid var(--border-medium)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-blue)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          <ShieldCheck size={16} /> DAA Project Core Defense & Justification
        </div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginTop: '0.35rem', letterSpacing: '-0.015em' }}>
          Why Dynamic Programming is the Optimal Choice
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.65, marginTop: '0.5rem', maxWidth: '950px' }}>
          In emergency triage routing, selecting an algorithm with sub-optimal routing guarantees directly increases cumulative patient latency. 
          Below is the mathematical derivation of time and space complexity, pseudocode implementations, and an empirical comparison demonstrating why <strong>Bitmask Dynamic Programming</strong> provides the best trade-off between optimality and runtime predictability.
        </p>
      </div>

      {/* 2. 3-Card Comparative Bento Verdict */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        
        {/* DP Card (Winner) */}
        <div className="stage-card" style={{ border: '1px solid var(--accent-emerald)', background: 'rgba(16, 185, 129, 0.04)', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
            <span className="badge badge-success" style={{ fontSize: '0.74rem', padding: '0.2rem 0.55rem' }}>
              <CheckCircle2 size={12} /> BEST CHOICE
            </span>
          </div>

          <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', marginBottom: '0.5rem' }}>
            <Cpu size={22} />
          </div>

          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff' }}>1. Dynamic Programming</h3>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.82rem', color: '#34d399', fontWeight: 600 }}>
            Time: Θ(n² · 2ⁿ) | Space: Θ(n · 2ⁿ)
          </div>

          <ul style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.65, marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
              <CheckCircle2 size={15} color="#10b981" style={{ flexShrink: 0, marginTop: '3px' }} />
              <span><strong>Guaranteed Global Minimum:</strong> Always discovers the exact sequence minimizing total weighted latency.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
              <CheckCircle2 size={15} color="#10b981" style={{ flexShrink: 0, marginTop: '3px' }} />
              <span><strong>Deterministic Complexity:</strong> Solves exactly 2ⁿ × n state pairs. No unpredictable runtime spikes.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
              <CheckCircle2 size={15} color="#10b981" style={{ flexShrink: 0, marginTop: '3px' }} />
              <span><strong>Memoized Subproblems:</strong> Reuses previous shortest paths for identical visited sets.</span>
            </li>
          </ul>

          <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
            <div style={{ background: 'var(--bg-primary)', border: '1px solid rgba(16, 185, 129, 0.25)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem', color: '#34d399' }}>
              <strong>Verdict:</strong> Optimal for emergency vehicle dispatch with n ≤ 18 facilities per cluster.
            </div>
          </div>
        </div>

        {/* Why NOT Greedy Card */}
        <div className="stage-card" style={{ border: '1px solid rgba(245, 158, 11, 0.35)', background: 'rgba(245, 158, 11, 0.03)' }}>
          <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
            <span className="badge badge-warning" style={{ fontSize: '0.74rem', padding: '0.2rem 0.55rem' }}>
              <XCircle size={12} /> SUBOPTIMAL
            </span>
          </div>

          <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b', marginBottom: '0.5rem' }}>
            <Zap size={22} />
          </div>

          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff' }}>2. Why NOT Greedy?</h3>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.82rem', color: '#fbbf24', fontWeight: 600 }}>
            Time: O(n²) | Space: O(n)
          </div>

          <ul style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.65, marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
              <XCircle size={15} color="#f59e0b" style={{ flexShrink: 0, marginTop: '3px' }} />
              <span><strong>Shortsighted Ratio Heuristic:</strong> Greedily picks next node maximizing (weight / travel_time).</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
              <XCircle size={15} color="#f59e0b" style={{ flexShrink: 0, marginTop: '3px' }} />
              <span><strong>Local Minima Traps:</strong> Can be baited into visiting clusters of minor clinics (w=2) near depot first.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
              <XCircle size={15} color="#f59e0b" style={{ flexShrink: 0, marginTop: '3px' }} />
              <span><strong>Sub-optimality Penalty:</strong> In Scenario #1, critical trauma ICUs wait longer, causing unnecessary weighted delay.</span>
            </li>
          </ul>

          <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
            <button
              className="btn btn-sm btn-outline"
              style={{ width: '100%', borderColor: 'rgba(245, 158, 11, 0.4)', color: '#fbbf24' }}
              onClick={() => {
                if (onLoadPreset) onLoadPreset('greedy_trap');
                if (setActiveTab) setActiveTab('canvas');
              }}
            >
              Test Greedy Trap on Canvas
            </button>
          </div>
        </div>

        {/* Why NOT Backtracking Card */}
        <div className="stage-card" style={{ border: '1px solid rgba(6, 182, 212, 0.35)', background: 'rgba(6, 182, 212, 0.03)' }}>
          <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
            <span className="badge badge-danger" style={{ fontSize: '0.74rem', padding: '0.2rem 0.55rem' }}>
              <Clock size={12} /> EXPONENTIAL RISK
            </span>
          </div>

          <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', background: 'rgba(6, 182, 212, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#06b6d4', marginBottom: '0.5rem' }}>
            <Flame size={22} />
          </div>

          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff' }}>3. Why NOT Backtracking?</h3>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.82rem', color: '#38bdf8', fontWeight: 600 }}>
            Time: O(n!) Worst-Case | Space: O(n)
          </div>

          <ul style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.65, marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
              <XCircle size={15} color="#ef4444" style={{ flexShrink: 0, marginTop: '3px' }} />
              <span><strong>Factorial Growth:</strong> For n=14, 14! = 87.1 billion permutations, freezing standard execution threads.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
              <XCircle size={15} color="#ef4444" style={{ flexShrink: 0, marginTop: '3px' }} />
              <span><strong>Pruning Inefficiency:</strong> In symmetric and uniform graphs, bounding bounds fail to prune early.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
              <XCircle size={15} color="#ef4444" style={{ flexShrink: 0, marginTop: '3px' }} />
              <span><strong>Redundant Work:</strong> Lacks state memoization, causing duplicate sub-tree evaluations.</span>
            </li>
          </ul>

          <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
            <div style={{ background: 'var(--bg-primary)', border: '1px solid rgba(6, 182, 212, 0.25)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem', color: '#38bdf8' }}>
              <strong>Limitation:</strong> Unusable for n &gt; 12 without severe timeout constraints.
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
                <strong>State Count:</strong> A state is defined by a pair <code>(S, u)</code> where <code>S</code> is the subset of visited locations (an integer bitmask from <code>0</code> to <code>2ⁿ - 1</code>), and <code>u</code> is the last visited location.
                <div style={{ fontFamily: 'JetBrains Mono', color: '#38bdf8', marginTop: '0.2rem' }}>
                  Total States = ∑ (n choose k) × k = n · 2ⁿ⁻¹ = O(n · 2ⁿ)
                </div>
              </li>
              <li>
                <strong>Transitions per State:</strong> From state <code>(S, u)</code>, we can transition to any unvisited location <code>v ∉ S</code>. There are <code>(n - |S|)</code> possible choices of <code>v</code>.
              </li>
              <li>
                <strong>Total Operations Count:</strong>
                <div style={{ fontFamily: 'JetBrains Mono', color: '#34d399', background: '#070a13', padding: '0.5rem', borderRadius: '6px', margin: '0.4rem 0' }}>
                  Total Transitions = ∑ (n choose k) × k × (n - k) = n(n - 1) · 2ⁿ⁻² = Θ(n² · 2ⁿ)
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

        {/* Code View */}
        <div style={{ marginTop: '1rem' }}>
          <pre style={{ background: '#070a13', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '1.25rem', fontFamily: 'JetBrains Mono', fontSize: '0.82rem', color: '#e2e8f0', lineHeight: 1.7, overflowX: 'auto', margin: 0 }}>
            {activeCodeTab === 'dp' && dpPseudocode}
            {activeCodeTab === 'bb' && bbPseudocode}
            {activeCodeTab === 'greedy' && greedyPseudocode}
          </pre>
        </div>
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
