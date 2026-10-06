# 🚑 GoldenHour Router | Minimum Total Weighted Latency Solver

An interactive, dark-themed, single-page web application and algorithm visualizer for solving the **Minimum Total Weighted Latency Problem (MWLP)** / **Traveling Repairman Problem with Priority Weights**.

Designed for disaster relief dispatch, mass casualty triage logistics, and algorithmic analysis.

---

## 🌟 Key Features

1. **Interactive Command Canvas**:
   - **Tactical Map**: Click to add hospital, clinic, or shelter nodes; drag to reposition; right-click to delete.
   - **Visual Urgency Gradient**: Dynamic node sizes and colors reflecting triage weights from $w=1$ (minor/emerald) to $w=10$ (critical trauma/pulsing crimson).
   - **Depot Radar HQ**: Customizable vehicle speed and real-time path rendering with directional arrows and step ordering.
   - **5 Curated Presets**: Including the **"Greedy Trap"** scenario demonstrating severe heuristic failure where DP saves critical lives.

2. **Three Algorithmic Solvers (From Scratch in Vanilla JS)**:
   - **Dynamic Programming with Bitmask** ($\Theta(n^2 \cdot 2^n)$): Exact global optimum using remaining weight incremental penalty formulation with parent reconstruction. Supports $n \le 18$.
   - **Backtracking with Branch & Bound** ($O(n!)$ worst-case): Depth-first search with admissible lower bounding to prune suboptimal subtrees, plus toggle for naive exhaustive search.
   - **Greedy Priority Heuristic** ($O(n^2)$): Selects next stop by maximizing $\frac{w_j}{\text{travel\_time}(u, j)}$. Scalable to $n > 500$.

3. **Live Vehicle Simulation & Telemetry**:
   - Smooth animated emergency drone/ambulance following the route with headlight beams and flashing sirens.
   - Real-time **Weighted Delay Penalty** counter and live journey step ticker.
   - Multi-route **Compare Mode** overlaying all three algorithms simultaneously in distinct color-coded traces.

4. **🔍 DP Bitmask Step-Through Inspector ($n \le 5$)**:
   - Frame-by-frame debugger showing binary bitmasks (e.g., $01101_2$), visited subsets, remaining unvisited weights, incremental penalty calculations, and dynamic cell relaxation in the DP matrix.
   - Tailored specifically for video presentations and classroom demonstrations.

5. **📊 Empirical Benchmark Suite**:
   - Multi-trial automated benchmark across increasing $n$ (DP up to 17, B&B up to 11, Greedy up to 500).
   - Interactive **Chart.js** charts:
     - Logarithmic Runtime Scaling ($O(n!), O(n^2 2^n), O(n^2)$)
     - Greedy Optimality Gap % vs $n$
     - Branch & Bound Pruning Efficiency (Nodes Explored vs $n!$)
   - **One-Click CSV Export** for research reports.

6. **📚 Comprehensive Theory & Real-World Triage Tab**:
   - Mathematical proof of the incremental recurrence relation.
   - Clear distinction between TSP and MWLP.
   - Full pseudocode and formal time/space complexity proofs.
   - Practical case studies in emergency ambulance dispatch and medical drone routing.

---

## 📁 Project Structure

```
d:/DAA_CIA/
├── index.html          # Main single-page application entry point
├── README.md           # Comprehensive project documentation
├── css/
│   ├── style.css       # Design tokens, typography, dark tactical theme
│   ├── canvas.css      # Canvas HUD, layout, telemetry bar, weight editor
│   └── dp-stepper.css  # DP debugger, binary mask badges, benchmark charts
└── js/
    ├── algorithms.js   # Pure JS DP, Branch & Bound, Greedy solvers & metrics
    ├── presets.js      # 5 preset test scenarios (Greedy Trap, n=5 Demo, etc.)
    ├── canvas.js       # High-DPI canvas rendering, node dragging, vehicle animation
    ├── dp-stepper.js   # Step-by-step DP matrix inspector
    ├── benchmark.js    # Multi-trial benchmark suite and Chart.js integration
    └── app.js          # Main UI controller, event listeners, keyboard shortcuts
```

---

## 🚀 How to Run

### Option 1: Direct File Opening (No Installation Required)
Simply double-click `index.html` or open it in any modern browser (Chrome, Firefox, Edge, Safari).

### Option 2: Local HTTP Server (Optional)
```bash
# Using Python 3
python -m http.server 8000

# Using Node / npx
npx serve .
```
Then navigate to `http://localhost:8000` in your web browser.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| <kbd>Space</kbd> | Start / Pause vehicle route animation |
| <kbd>R</kbd> | Recompute and solve all algorithms |
| <kbd>C</kbd> | Toggle multi-route Comparison Mode |
| <kbd>1</kbd> | Switch active route to **Dynamic Programming** |
| <kbd>2</kbd> | Switch active route to **Branch & Bound** |
| <kbd>3</kbd> | Switch active route to **Greedy Heuristic** |

---

## 📐 Mathematical Formulation

### Objective Function
Given $n$ locations with positions $p_i = (x_i, y_i)$ and weights $w_i \in [1, 10]$ departing depot $p_0$ at $t = 0$:

$$\min_{\pi \in S_n} \sum_{i=1}^n w_{\pi(i)} \cdot A(\pi(i))$$

$$\text{where } A(\pi(i)) = \sum_{k=1}^i \frac{\|p_{\pi(k-1)} - p_{\pi(k)}\|_2}{\text{speed}}$$

### Dynamic Programming Incremental Recurrence
Let bitmask $S \subseteq \{1, \dots, n\}$ represent the subset of visited locations, and let $u \in S$ be the last visited location:

$$DP[S \cup \{v\}][v] = \min_{u \in S} \Big( DP[S][u] + \text{travel\_time}(u, v) \times \sum_{k \notin S} w_k \Big)$$

$$\text{Base Case: } DP[\{v\}][v] = \text{travel\_time}(\text{depot}, v) \times \sum_{i=1}^n w_i \quad \forall v$$

---

## 📊 Complexity Comparison Table

| Algorithm | Time Complexity | Space Complexity | Optimality Guarantee |
| :--- | :--- | :--- | :--- |
| **Bitmask DP** | $\Theta(n^2 \cdot 2^n)$ | $\Theta(n \cdot 2^n)$ | **Exact Global Minimum** |
| **Branch & Bound (B&B)** | $O(n!)$ worst, $O(c^n)$ avg | $O(n)$ call stack | **Exact Global Minimum** |
| **Naive Backtracking** | $\Theta(n!)$ | $O(n)$ | **Exact Global Minimum** |
| **Greedy Heuristic** | $O(n^2)$ | $O(n)$ | Suboptimal ($>20\%$ gap on trap cases) |

---

## 🧪 Preset Test Cases

1. **🚨 The Greedy Trap**: Low-urgency clinics cluster close to the depot while high-urgency trauma centers are further away. Greedy visits the nearby clinics first, causing catastrophic delays for critical patients. DP routes directly to the critical center, achieving $\sim 25\%$ lower weighted penalty.
2. **🔍 Small Demo (n = 5)**: Specifically calibrated for the **DP Step-Through** inspector (32 bitmask states) for crystal-clear video walkthroughs.
3. **🏙️ Dual-Cluster Urban Outbreak (n = 8)**: Tests inter-cluster vs intra-cluster dispatch.
4. **⚡ Critical Highway Corridor (n = 7)**: Linear chain topology with frontier emergency center.
5. **🏥 Mass Casualty Field Triage (n = 12)**: Complex multi-facility disaster layout testing full solver scaling.

---

## 👨‍💻 Author & Repository
- **GitHub Repository**: [https://github.com/dakshshah05/daa.git](https://github.com/dakshshah05/daa.git)
- **Coursework**: Design & Analysis of Algorithms (DAA) CIA Project.
