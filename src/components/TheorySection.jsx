import React, { useEffect } from 'react';
import katex from 'katex';
import { BookOpen, Award, CheckCircle2, ShieldAlert } from 'lucide-react';

function MathFormula({ math, block = false }) {
  const containerRef = React.useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      try {
        katex.render(math, containerRef.current, {
          displayMode: block,
          throwOnError: false
        });
      } catch (err) {
        console.error(err);
      }
    }
  }, [math, block]);

  return <span ref={containerRef} />;
}

export function TheorySection() {
  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* 1. Problem Formulation */}
      <div className="stage-card" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.6rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
          <BookOpen size={22} color="#38bdf8" />
          <span>Problem Definition: Minimum Total Weighted Latency (MWLP)</span>
        </h2>
        
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginTop: '1rem' }}>
          In emergency triage and disaster relief, standard Traveling Salesperson (TSP) formulations fail because they only minimize total travel distance, treating immediate arrival identically to late arrival.
        </p>

        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          The <strong>Minimum Total Weighted Latency Problem</strong> (also known as the <em>Cumulative Capacitated VRP</em> or <em>Traveling Repairman Problem with Priority Weights</em>) models a single vehicle departing from depot <MathFormula math="p_0 = (x_0, y_0)" /> at <MathFormula math="t = 0" />. It must visit <MathFormula math="n" /> target facilities with urgency weights <MathFormula math="w_i \in [1, 10]" />.
        </p>

        <div style={{ background: '#060911', borderLeft: '4px solid var(--accent-blue)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', margin: '1rem 0' }}>
          <MathFormula
            block
            math="\text{Objective: } \quad \min_{\pi \in S_n} \sum_{i=1}^n w_{\pi(i)} \cdot A(\pi(i))"
          />
          <MathFormula
            block
            math="\text{where } A(\pi(i)) = \sum_{k=1}^i \frac{\|p_{\pi(k-1)} - p_{\pi(k)}\|_2}{\text{speed}}, \quad \pi(0) = \text{depot}"
          />
        </div>

        <h3 style={{ fontSize: '1.1rem', color: 'var(--accent-blue)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
          Why MWLP Fundamentally Differs from Standard TSP
        </h3>
        <ul style={{ color: 'var(--text-secondary)', marginLeft: '1.5rem', lineHeight: 1.8 }}>
          <li>
            <strong>Non-Local Edge Penalty:</strong> In TSP, traversing edge <MathFormula math="(u, v)" /> adds a constant distance <MathFormula math="d(u, v)" />. In MWLP, traversing <MathFormula math="(u, v)" /> at step <MathFormula math="k" /> delays node <MathFormula math="v" /> and <em>all subsequent unvisited nodes</em>.
          </li>
          <li>
            <strong>Tour Asymmetry:</strong> Reversing a TSP tour yields the exact same tour cost. In MWLP, reversing a sequence completely breaks triage priority, leading to severe mortality risks.
          </li>
          <li>
            <strong>NP-Hardness:</strong> MWLP is strongly NP-hard even in Euclidean metrics.
          </li>
        </ul>
      </div>

      {/* 2. DP Recurrence Formulation */}
      <div className="stage-card" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.6rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
          <Award size={22} color="#10b981" />
          <span>Dynamic Programming with Bitmask Formulation</span>
        </h2>

        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginTop: '1rem' }}>
          To avoid tracking continuous elapsed time in the DP state space, we utilize the <strong>incremental unvisited penalty formulation</strong>:
        </p>

        <div style={{ background: '#060911', borderLeft: '4px solid #10b981', padding: '1.25rem', borderRadius: 'var(--radius-sm)', margin: '1rem 0' }}>
          <MathFormula
            block
            math="\Delta \text{Cost}(u \to v) = \text{travel\_time}(u, v) \times \sum_{k \notin S} w_k"
          />
          <MathFormula
            block
            math="DP[S \cup \{v\}][v] = \min_{u \in S} \Big( DP[S][u] + \text{travel\_time}(u, v) \times W_{\text{rem}}(S) \Big)"
          />
          <MathFormula
            block
            math="\text{Base Case: } DP[\{v\}][v] = \text{travel\_time}(\text{depot}, v) \times \sum_{i=1}^n w_i \quad \forall v"
          />
          <MathFormula
            block
            math="\text{Optimal Answer: } \min_{j \in \{1, \dots, n\}} DP[(2^n - 1)][j]"
          />
        </div>

        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          Path reconstruction is accomplished in <MathFormula math="O(n)" /> using the predecessor table <MathFormula math="\text{parent}[S][v]" />.
        </p>
      </div>

      {/* 3. Complexity Derivations */}
      <div className="stage-card" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.6rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
          <ShieldAlert size={22} color="#f59e0b" />
          <span>Asymptotic Complexity Derivations</span>
        </h2>

        <div style={{ overflowX: 'auto', margin: '1rem 0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)', textAlign: 'left', color: '#fff' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Algorithm</th>
                <th style={{ padding: '0.75rem 1rem' }}>Time Complexity</th>
                <th style={{ padding: '0.75rem 1rem' }}>Space Complexity</th>
                <th style={{ padding: '0.75rem 1rem' }}>Optimality</th>
                <th style={{ padding: '0.75rem 1rem' }}>Applicability</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '0.75rem 1rem' }}><span className="algo-badge badge-dp">Bitmask DP</span></td>
                <td style={{ padding: '0.75rem 1rem', fontFamily: 'JetBrains Mono' }}>Θ(n² · 2ⁿ)</td>
                <td style={{ padding: '0.75rem 1rem', fontFamily: 'JetBrains Mono' }}>Θ(n · 2ⁿ)</td>
                <td style={{ padding: '0.75rem 1rem', color: '#34d399', fontWeight: 700 }}>Exact Global Minimum</td>
                <td style={{ padding: '0.75rem 1rem' }}>n ≤ 18 (Instant)</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '0.75rem 1rem' }}><span className="algo-badge badge-bb">Branch & Bound</span></td>
                <td style={{ padding: '0.75rem 1rem', fontFamily: 'JetBrains Mono' }}>O(n!) worst, O(cⁿ) avg</td>
                <td style={{ padding: '0.75rem 1rem', fontFamily: 'JetBrains Mono' }}>O(n) Call Stack</td>
                <td style={{ padding: '0.75rem 1rem', color: '#34d399', fontWeight: 700 }}>Exact Global Minimum</td>
                <td style={{ padding: '0.75rem 1rem' }}>n ≤ 12</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '0.75rem 1rem' }}><span className="algo-badge badge-greedy">Greedy Heuristic</span></td>
                <td style={{ padding: '0.75rem 1rem', fontFamily: 'JetBrains Mono' }}>O(n²)</td>
                <td style={{ padding: '0.75rem 1rem', fontFamily: 'JetBrains Mono' }}>O(n)</td>
                <td style={{ padding: '0.75rem 1rem', color: '#fbbf24' }}>Suboptimal Approximation</td>
                <td style={{ padding: '0.75rem 1rem' }}>n ≤ 10,000+</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 style={{ fontSize: '1.1rem', color: 'var(--accent-blue)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
          Formal Justification for Dynamic Programming
        </h3>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          For tactical emergency dispatch ($n \le 18$), Dynamic Programming provides deterministic runtime without the risk of exponential degradation in symmetric topologies, while completely eliminating the severe suboptimality pitfalls of greedy dispatch.
        </p>
      </div>

    </div>
  );
}
