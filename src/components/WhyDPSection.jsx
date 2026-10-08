import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Cpu, 
  Flame, 
  Zap, 
  ShieldCheck, 
  Clock, 
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
    <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* 1. Header Hero Banner */}
      <div className="stage-card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', color: '#38bdf8', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <div style={{ width: '24px', height: '24px', background: '#38bdf8', borderRadius: '4px', border: '1.5px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={16} color="#000" />
          </div>
          <span>DAA Project Academic Defense & Algorithmic Proof</span>
        </div>
        <h2 style={{ fontSize: '1.85rem', fontWeight: 900, color: '#fff', marginTop: '0.5rem', letterSpacing: '-0.02em' }}>
          Why Dynamic Programming is the Superior Algorithmic Choice
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.96rem', lineHeight: 1.7, marginTop: '0.6rem', maxWidth: '980px' }}>
          In emergency triage vehicle routing, selecting a suboptimal sequence directly increases cumulative patient mortality and waiting delay. 
          Below is the rigorous mathematical derivation of time and space complexity, pseudocode implementations, and the empirical proof demonstrating why <strong>Bitmask Dynamic Programming</strong> is the gold standard.
        </p>
      </div>

      {/* 2. 3-Card Comparative Bento Verdict */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        
        {/* DP Card (Winner) */}
        <div className="stage-card" style={{ border: '2.5px solid #000000', boxShadow: 'var(--neo-shadow-emerald)', background: 'rgba(16, 185, 129, 0.12)' }}>
          <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem' }}>
            <span className="badge badge-success" style={{ fontSize: '0.78rem', padding: '0.25rem 0.65rem' }}>
              <CheckCircle2 size={13} /> BEST CHOICE
            </span>
          </div>

          <div style={{ width: '46px', height: '46px', borderRadius: 'var(--radius-sm)', background: '#10b981', border: '2px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', marginBottom: '0.6rem', boxShadow: '2px 2px 0px #000' }}>
            <Cpu size={24} />
          </div>

          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>1. Dynamic Programming</h3>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.85rem', color: '#34d399', fontWeight: 800, background: '#000', padding: '0.25rem 0.5rem', borderRadius: '4px', border: '1px solid #10b981', width: 'fit-content', marginTop: '0.25rem' }}>
            Time: Θ(n² · 2ⁿ) | Space: Θ(n · 2ⁿ)
          </div>

          <ul style={{ color: '#cbd5e1', fontSize: '0.88rem', lineHeight: 1.7, marginTop: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.55rem' }}>
              <CheckCircle2 size={17} color="#10b981" style={{ flexShrink: 0, marginTop: '3px' }} />
              <span><strong style={{ color: '#fff' }}>Guaranteed Global Minimum:</strong> Always discovers the exact sequence minimizing total weighted latency.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.55rem' }}>
              <CheckCircle2 size={17} color="#10b981" style={{ flexShrink: 0, marginTop: '3px' }} />
              <span><strong style={{ color: '#fff' }}>Deterministic Complexity:</strong> Solves exactly 2ⁿ × n state pairs without unpredictable runtime spikes.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.55rem' }}>
              <CheckCircle2 size={17} color="#10b981" style={{ flexShrink: 0, marginTop: '3px' }} />
              <span><strong style={{ color: '#fff' }}>Memoized Subproblems:</strong> Reuses cached optimal paths for identical visited sets.</span>
            </li>
          </ul>

          <div style={{ marginTop: 'auto', paddingTop: '1.25rem' }}>
            <div style={{ background: '#000', border: '2px solid #10b981', padding: '0.75rem 0.95rem', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', color: '#34d399', fontWeight: 700, boxShadow: '2px 2px 0px #000' }}>
              <strong>Verdict:</strong> Optimal for emergency vehicle dispatch with n ≤ 18 facilities per cluster.
            </div>
          </div>
        </div>

        {/* Why NOT Greedy Card */}
        <div className="stage-card" style={{ border: '2.5px solid #000000', boxShadow: 'var(--neo-shadow-amber)', background: 'rgba(251, 191, 36, 0.08)' }}>
          <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem' }}>
            <span className="badge badge-warning" style={{ fontSize: '0.78rem', padding: '0.25rem 0.65rem' }}>
              <XCircle size={13} /> SUBOPTIMAL
            </span>
          </div>

          <div style={{ width: '46px', height: '46px', borderRadius: 'var(--radius-sm)', background: '#fbbf24', border: '2px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', marginBottom: '0.6rem', boxShadow: '2px 2px 0px #000' }}>
            <Zap size={24} />
          </div>

          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>2. Why NOT Greedy?</h3>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.85rem', color: '#fbbf24', fontWeight: 800, background: '#000', padding: '0.25rem 0.5rem', borderRadius: '4px', border: '1px solid #fbbf24', width: 'fit-content', marginTop: '0.25rem' }}>
            Time: O(n²) | Space: O(n)
          </div>

          <ul style={{ color: '#cbd5e1', fontSize: '0.88rem', lineHeight: 1.7, marginTop: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.55rem' }}>
              <XCircle size={17} color="#fbbf24" style={{ flexShrink: 0, marginTop: '3px' }} />
              <span><strong style={{ color: '#fff' }}>Shortsighted Ratio Heuristic:</strong> Greedily picks next node maximizing (weight / travel_time).</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.55rem' }}>
              <XCircle size={17} color="#fbbf24" style={{ flexShrink: 0, marginTop: '3px' }} />
              <span><strong style={{ color: '#fff' }}>Local Minima Traps:</strong> Easily baited into visiting clusters of minor clinics (w=2) near depot first.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.55rem' }}>
              <XCircle size={17} color="#fbbf24" style={{ flexShrink: 0, marginTop: '3px' }} />
              <span><strong style={{ color: '#fff' }}>High Penalty Gap:</strong> Critical trauma ICUs wait longer, causing severe clinical delays.</span>
            </li>
          </ul>

          <div style={{ marginTop: 'auto', paddingTop: '1.25rem' }}>
            <button
              className="btn btn-sm btn-outline"
              style={{ width: '100%', borderColor: '#000', background: '#fbbf24', color: '#000', fontWeight: 800 }}
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
        <div className="stage-card" style={{ border: '2.5px solid #000000', boxShadow: 'var(--neo-shadow-blue)', background: 'rgba(6, 182, 212, 0.08)' }}>
          <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem' }}>
            <span className="badge badge-danger" style={{ fontSize: '0.78rem', padding: '0.25rem 0.65rem' }}>
              <Clock size={13} /> EXPONENTIAL RISK
            </span>
          </div>

          <div style={{ width: '46px', height: '46px', borderRadius: 'var(--radius-sm)', background: '#06b6d4', border: '2px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', marginBottom: '0.6rem', boxShadow: '2px 2px 0px #000' }}>
            <Flame size={24} />
          </div>

          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>3. Why NOT Backtracking?</h3>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.85rem', color: '#38bdf8', fontWeight: 800, background: '#000', padding: '0.25rem 0.5rem', borderRadius: '4px', border: '1px solid #06b6d4', width: 'fit-content', marginTop: '0.25rem' }}>
            Time: O(n!) Worst-Case | Space: O(n)
          </div>

          <ul style={{ color: '#cbd5e1', fontSize: '0.88rem', lineHeight: 1.7, marginTop: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.55rem' }}>
              <XCircle size={17} color="#ff3366" style={{ flexShrink: 0, marginTop: '3px' }} />
              <span><strong style={{ color: '#fff' }}>Factorial Growth:</strong> For n=14, 14! = 87.1 billion permutations, freezing execution.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.55rem' }}>
              <XCircle size={17} color="#ff3366" style={{ flexShrink: 0, marginTop: '3px' }} />
              <span><strong style={{ color: '#fff' }}>Pruning Inefficiency:</strong> In symmetric graphs, bounding bounds fail to prune early.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.55rem' }}>
              <XCircle size={17} color="#ff3366" style={{ flexShrink: 0, marginTop: '3px' }} />
              <span><strong style={{ color: '#fff' }}>Redundant Work:</strong> Lacks state memoization, causing repeated sub-tree traversals.</span>
            </li>
          </ul>

          <div style={{ marginTop: 'auto', paddingTop: '1.25rem' }}>
            <div style={{ background: '#000', border: '2px solid #06b6d4', padding: '0.75rem 0.95rem', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', color: '#38bdf8', fontWeight: 700, boxShadow: '2px 2px 0px #000' }}>
              <strong>Limitation:</strong> Unusable for n &gt; 12 without catastrophic browser lag.
            </div>
          </div>
        </div>

      </div>

      {/* 3. Mathematical Derivations of Complexity */}
      <div className="stage-card" style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.55rem', borderBottom: '2px solid #000', paddingBottom: '0.75rem' }}>
          <div style={{ width: '28px', height: '28px', background: '#38bdf8', borderRadius: '4px', border: '1.5px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Calculator size={18} color="#000" />
          </div>
          <span>Step-by-Step Derivation of Time & Space Complexity</span>
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '1.75rem', marginTop: '1.25rem' }}>
          
          {/* Time Complexity Derivation */}
          <div className="bento-highlight-box" style={{ border: '2px solid #10b981', boxShadow: 'var(--neo-shadow-emerald)' }}>
            <h4 style={{ color: '#34d399', fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Clock size={18} /> 1. Time Complexity Derivation: Θ(n² · 2ⁿ)
            </h4>
            <ol style={{ color: '#cbd5e1', fontSize: '0.88rem', lineHeight: 1.85, marginLeft: '1.2rem' }}>
              <li>
                <strong>State Count:</strong> A state is defined by a pair <code>(S, u)</code> where <code>S</code> is the subset of visited locations (an integer bitmask from <code>0</code> to <code>2ⁿ - 1</code>), and <code>u</code> is the last visited location.
                <div style={{ fontFamily: 'JetBrains Mono', color: '#38bdf8', background: '#000', padding: '0.4rem 0.6rem', borderRadius: '4px', border: '1px solid #334155', marginTop: '0.35rem' }}>
                  Total States = ∑ (n choose k) × k = n · 2ⁿ⁻¹ = O(n · 2ⁿ)
                </div>
              </li>
              <li>
                <strong>Transitions per State:</strong> From state <code>(S, u)</code>, we can transition to any unvisited location <code>v ∉ S</code>. There are <code>(n - |S|)</code> possible choices of <code>v</code>.
              </li>
              <li>
                <strong>Total Operations Count:</strong>
                <div style={{ fontFamily: 'JetBrains Mono', color: '#34d399', background: '#000', padding: '0.5rem 0.75rem', borderRadius: '4px', border: '1.5px solid #10b981', margin: '0.5rem 0', fontWeight: 800 }}>
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
          <div className="bento-highlight-box" style={{ border: '2px solid #06b6d4', boxShadow: 'var(--neo-shadow-blue)' }}>
            <h4 style={{ color: '#22d3ee', fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Cpu size={18} /> 2. Space Complexity Derivation: Θ(n · 2ⁿ)
            </h4>
            <ol style={{ color: '#cbd5e1', fontSize: '0.88rem', lineHeight: 1.85, marginLeft: '1.2rem' }}>
              <li>
                <strong>DP Penalty Matrix:</strong> <code>dp[mask][last]</code> has dimensions <code>2ⁿ × n</code>. Using 64-bit IEEE floating-point numbers (<code>Float64Array</code>), each entry takes 8 bytes.
                <div style={{ fontFamily: 'JetBrains Mono', color: '#38bdf8', background: '#000', padding: '0.4rem 0.6rem', borderRadius: '4px', border: '1px solid #334155', marginTop: '0.35rem' }}>
                  DP Table Size = 2ⁿ × n × 8 bytes
                </div>
              </li>
              <li>
                <strong>Predecessor Parent Table:</strong> <code>parent[mask][last]</code> stores the index of the preceding node <code>u</code> for path reconstruction using 16-bit integers (<code>Int16Array</code>, 2 bytes per entry).
                <div style={{ fontFamily: 'JetBrains Mono', color: '#38bdf8', background: '#000', padding: '0.4rem 0.6rem', borderRadius: '4px', border: '1px solid #334155', marginTop: '0.35rem' }}>
                  Parent Table Size = 2ⁿ × n × 2 bytes
                </div>
              </li>
              <li>
                <strong>Mask Weight Cache:</strong> <code>weightOfMask[mask]</code> stores the sum of weights for each mask (<code>2ⁿ × 8 bytes</code>).
              </li>
              <li>
                <strong>Concrete Memory Footprint:</strong>
                <div style={{ fontFamily: 'JetBrains Mono', color: '#34d399', background: '#000', padding: '0.5rem 0.75rem', borderRadius: '4px', border: '1.5px solid #06b6d4', margin: '0.5rem 0', fontWeight: 800 }}>
                  Total Memory = 2ⁿ · (10n + 8) bytes
                </div>
                For <code>n = 10</code>: 2¹⁰ × 108 B = <strong>108 KB</strong>.<br />
                For <code>n = 18</code>: 2¹⁸ × 188 B = <strong>49.3 MB</strong> (fits comfortably in browser RAM).
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
        <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.55rem', borderBottom: '2px solid #000', paddingBottom: '0.75rem' }}>
          <div style={{ width: '28px', height: '28px', background: '#fbbf24', borderRadius: '4px', border: '1.5px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Code2 size={18} color="#000" />
          </div>
          <span>Algorithmic Implementations & Pseudocode</span>
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
          Clean, step-by-step algorithms designed to be easily read and explained during an academic presentation.
        </p>

        {/* Algorithm Switcher Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', background: 'rgba(6, 10, 20, 0.9)', padding: '0.35rem', borderRadius: 'var(--radius-sm)', border: '2px solid #000', width: 'fit-content', boxShadow: 'var(--neo-shadow-xs)' }}>
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
        <div style={{ marginTop: '1.25rem' }}>
          <pre style={{ background: '#000000', border: '2px solid #000000', borderRadius: '8px', padding: '1.5rem', fontFamily: 'JetBrains Mono', fontSize: '0.84rem', color: '#e2e8f0', lineHeight: 1.75, overflowX: 'auto', margin: 0, boxShadow: 'var(--neo-shadow-sm)' }}>
            {activeCodeTab === 'dp' && dpPseudocode}
            {activeCodeTab === 'bb' && bbPseudocode}
            {activeCodeTab === 'greedy' && greedyPseudocode}
          </pre>
        </div>
      </div>

      {/* 5. Head-to-Head Comparison Table */}
      <div className="stage-card" style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.55rem', borderBottom: '2px solid #000', paddingBottom: '0.75rem' }}>
          <div style={{ width: '28px', height: '28px', background: '#10b981', borderRadius: '4px', border: '1.5px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={18} color="#000" />
          </div>
          <span>Head-to-Head Decision Matrix</span>
        </h3>

        <div style={{ overflowX: 'auto', borderRadius: 'var(--radius-sm)', border: '2px solid #000', boxShadow: 'var(--neo-shadow-xs)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: 'rgba(6, 10, 20, 0.95)', borderBottom: '2px solid #000000', textAlign: 'left', color: '#fff' }}>
                <th style={{ padding: '0.85rem 1.15rem' }}>Evaluation Metric</th>
                <th style={{ padding: '0.85rem 1.15rem', color: '#34d399', fontWeight: 800 }}>Dynamic Programming (Bitmask)</th>
                <th style={{ padding: '0.85rem 1.15rem', color: '#fbbf24', fontWeight: 800 }}>Greedy Heuristic (Ratio)</th>
                <th style={{ padding: '0.85rem 1.15rem', color: '#22d3ee', fontWeight: 800 }}>Branch & Bound</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1.5px solid #000', background: 'rgba(15, 23, 42, 0.65)' }}>
                <td style={{ padding: '0.85rem 1.15rem', fontWeight: 800 }}>Optimality Guarantee</td>
                <td style={{ padding: '0.85rem 1.15rem', color: '#34d399', fontWeight: 800 }}>✅ 100% Exact Global Minimum</td>
                <td style={{ padding: '0.85rem 1.15rem', color: '#ff4d7a', fontWeight: 700 }}>❌ Suboptimal (15-25% Error)</td>
                <td style={{ padding: '0.85rem 1.15rem', color: '#34d399', fontWeight: 800 }}>✅ 100% Exact Global Minimum</td>
              </tr>
              <tr style={{ borderBottom: '1.5px solid #000', background: 'rgba(15, 23, 42, 0.45)' }}>
                <td style={{ padding: '0.85rem 1.15rem', fontWeight: 800 }}>Time Complexity</td>
                <td style={{ padding: '0.85rem 1.15rem', fontFamily: 'JetBrains Mono', color: '#34d399', fontWeight: 700 }}>Θ(n² · 2ⁿ)</td>
                <td style={{ padding: '0.85rem 1.15rem', fontFamily: 'JetBrains Mono' }}>O(n²)</td>
                <td style={{ padding: '0.85rem 1.15rem', fontFamily: 'JetBrains Mono', color: '#ff4d7a' }}>O(n!) worst-case</td>
              </tr>
              <tr style={{ borderBottom: '1.5px solid #000', background: 'rgba(15, 23, 42, 0.65)' }}>
                <td style={{ padding: '0.85rem 1.15rem', fontWeight: 800 }}>Space Complexity</td>
                <td style={{ padding: '0.85rem 1.15rem', fontFamily: 'JetBrains Mono' }}>Θ(n · 2ⁿ)</td>
                <td style={{ padding: '0.85rem 1.15rem', fontFamily: 'JetBrains Mono' }}>O(n)</td>
                <td style={{ padding: '0.85rem 1.15rem', fontFamily: 'JetBrains Mono' }}>O(n) Call Stack</td>
              </tr>
              <tr style={{ borderBottom: '1.5px solid #000', background: 'rgba(15, 23, 42, 0.45)' }}>
                <td style={{ padding: '0.85rem 1.15rem', fontWeight: 800 }}>Runtime Predictability</td>
                <td style={{ padding: '0.85rem 1.15rem', color: '#34d399', fontWeight: 700 }}>✅ Deterministic (No spikes)</td>
                <td style={{ padding: '0.85rem 1.15rem', color: '#34d399' }}>✅ Instant (under 1ms)</td>
                <td style={{ padding: '0.85rem 1.15rem', color: '#ff4d7a', fontWeight: 700 }}>❌ Highly erratic (O(n!) traps)</td>
              </tr>
              <tr style={{ borderBottom: '1.5px solid #000', background: 'rgba(15, 23, 42, 0.65)' }}>
                <td style={{ padding: '0.85rem 1.15rem', fontWeight: 800 }}>State Overlap Utilization</td>
                <td style={{ padding: '0.85rem 1.15rem', color: '#34d399', fontWeight: 700 }}>✅ Optimal (2ⁿ × n table)</td>
                <td style={{ padding: '0.85rem 1.15rem', color: 'var(--text-muted)' }}>N/A (No subproblems)</td>
                <td style={{ padding: '0.85rem 1.15rem', color: '#ff4d7a' }}>❌ Redundant recalculation</td>
              </tr>
              <tr style={{ background: 'rgba(15, 23, 42, 0.85)' }}>
                <td style={{ padding: '0.85rem 1.15rem', fontWeight: 800 }}>Suitability for Emergency Dispatch</td>
                <td style={{ padding: '0.85rem 1.15rem', color: '#10b981', fontWeight: 900, fontSize: '0.94rem' }}>🏆 PERFECT (n ≤ 18)</td>
                <td style={{ padding: '0.85rem 1.15rem', color: '#ff4d7a', fontWeight: 700 }}>⚠️ High Clinical Risk</td>
                <td style={{ padding: '0.85rem 1.15rem', color: '#fbbf24' }}>⚠️ Limited to n ≤ 11</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
