/**
 * GoldenHour Router - Algorithm Implementations
 * 
 * Solves the Minimum Total Weighted Latency Problem / Cumulative Capacitated VRP
 * Objective: Minimize sum_{i=1..n} (weight_i * arrival_time_i)
 */

class RouteSolvers {
  /**
   * Euclidean distance between two 2D points
   */
  static distance(p1, p2) {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Travel time between two points given vehicle speed (units/sec)
   */
  static travelTime(p1, p2, speed) {
    const d = RouteSolvers.distance(p1, p2);
    return speed > 0 ? d / speed : 0;
  }

  /**
   * Compute arrival times and total weighted cost for a given visiting order
   * order: array of location indices [p0, p1, ..., pn-1]
   */
  static evaluateRoute(depot, locations, order, speed) {
    const n = order.length;
    const arrivalTimes = new Array(n);
    let currentTime = 0;
    let totalCost = 0;
    let prev = depot;

    for (let i = 0; i < n; i++) {
      const idx = order[i];
      const loc = locations[idx];
      const t = RouteSolvers.travelTime(prev, loc, speed);
      currentTime += t;
      arrivalTimes[i] = {
        locationIndex: idx,
        location: loc,
        arrivalTime: currentTime,
        stepWeightedDelay: loc.weight * currentTime,
        travelSegmentTime: t,
        distanceFromPrev: RouteSolvers.distance(prev, loc)
      };
      totalCost += loc.weight * currentTime;
      prev = loc;
    }

    return {
      order,
      totalCost,
      arrivalTimes,
      totalDuration: currentTime
    };
  }

  // ==========================================
  // 1. DYNAMIC PROGRAMMING WITH BITMASK (O(n^2 * 2^n))
  // ==========================================
  /**
   * Exact optimal solver using Bitmask DP.
   * State: dp[mask][last] = min penalty accumulated when visited subset = mask, ending at last.
   * Incremental penalty formulation:
   *   Transition to next node v adds: travelTime(last, v) * (Sum of weights of all unvisited nodes including v)
   */
  static solveDP(depot, locations, speed, recordSteps = false) {
    const startTime = performance.now();
    const n = locations.length;

    if (n === 0) {
      return {
        name: 'Dynamic Programming',
        order: [],
        totalCost: 0,
        arrivalTimes: [],
        runtimeMs: 0,
        nodesExplored: 1,
        memoryEstimate: '0 KB',
        stepHistory: []
      };
    }

    if (n > 20) {
      throw new Error(`Dynamic Programming is restricted to n <= 20 to prevent browser memory exhaustion (Requested: n=${n}).`);
    }

    const numStates = 1 << n;
    const totalWeight = locations.reduce((sum, loc) => sum + loc.weight, 0);

    // Precalculate weights for each mask: weightOfMask[mask]
    const weightOfMask = new Float64Array(numStates);
    for (let mask = 0; mask < numStates; mask++) {
      let w = 0;
      for (let i = 0; i < n; i++) {
        if ((mask & (1 << i)) !== 0) {
          w += locations[i].weight;
        }
      }
      weightOfMask[mask] = w;
    }

    // Precalculate travel time matrix
    // 0..n-1 are locations, n is depot
    const timeMatrix = Array.from({ length: n + 1 }, () => new Float64Array(n + 1));
    for (let i = 0; i < n; i++) {
      timeMatrix[n][i] = RouteSolvers.travelTime(depot, locations[i], speed);
      timeMatrix[i][n] = timeMatrix[n][i];
      for (let j = 0; j < n; j++) {
        timeMatrix[i][j] = RouteSolvers.travelTime(locations[i], locations[j], speed);
      }
    }

    // dp[mask * n + last]
    const dp = new Float64Array(numStates * n);
    const parent = new Int16Array(numStates * n);
    dp.fill(Infinity);
    parent.fill(-1);

    let statesComputed = 0;
    const stepHistory = [];

    // Base cases: single node visited from depot
    for (let i = 0; i < n; i++) {
      const mask = 1 << i;
      const initialCost = timeMatrix[n][i] * totalWeight;
      const stateIdx = mask * n + i;
      dp[stateIdx] = initialCost;
      parent[stateIdx] = -1; // came from depot
      statesComputed++;

      if (recordSteps && n <= 5) {
        stepHistory.push({
          type: 'base_case',
          mask,
          maskBinary: mask.toString(2).padStart(n, '0'),
          visitedIndices: [i],
          last: i,
          prev: 'Depot',
          remWeight: totalWeight,
          travelTime: timeMatrix[n][i],
          costAdded: initialCost,
          totalCost: initialCost,
          explanation: `Base Case: Move from Depot to Node #${i + 1} (${locations[i].name || 'Loc ' + (i + 1)}). Travel time ${timeMatrix[n][i].toFixed(1)}s × Total Weight ${totalWeight} = penalty ${initialCost.toFixed(1)}`
        });
      }
    }

    // Fill DP table ordered by number of set bits (popcount)
    for (let mask = 1; mask < numStates; mask++) {
      const remWeight = totalWeight - weightOfMask[mask];
      if (remWeight <= 0) continue; // Full mask reached

      for (let u = 0; u < n; u++) {
        if ((mask & (1 << u)) === 0) continue;
        const currentCost = dp[mask * n + u];
        if (currentCost === Infinity) continue;

        for (let v = 0; v < n; v++) {
          if ((mask & (1 << v)) !== 0) continue; // v already visited

          const nextMask = mask | (1 << v);
          const t = timeMatrix[u][v];
          const addedPenalty = t * remWeight;
          const newCost = currentCost + addedPenalty;
          const nextStateIdx = nextMask * n + v;

          statesComputed++;

          if (newCost < dp[nextStateIdx]) {
            const wasInf = dp[nextStateIdx] === Infinity;
            dp[nextStateIdx] = newCost;
            parent[nextStateIdx] = u;

            if (recordSteps && n <= 5) {
              const visitedArr = [];
              for (let b = 0; b < n; b++) {
                if ((nextMask & (1 << b)) !== 0) visitedArr.push(b);
              }
              stepHistory.push({
                type: 'transition',
                mask: nextMask,
                maskBinary: nextMask.toString(2).padStart(n, '0'),
                visitedIndices: visitedArr,
                last: v,
                prev: u,
                remWeight,
                travelTime: t,
                costAdded: addedPenalty,
                totalCost: newCost,
                isBetter: true,
                wasInf,
                explanation: `From state [${mask.toString(2).padStart(n, '0')}, Node #${u + 1}] -> visit Node #${v + 1}: +(${t.toFixed(1)}s × ${remWeight} rem wt) = +${addedPenalty.toFixed(1)} penalty. Total: ${newCost.toFixed(1)} (New Optimal)`
              });
            }
          } else if (recordSteps && n <= 5) {
            stepHistory.push({
              type: 'transition_pruned',
              mask: nextMask,
              maskBinary: nextMask.toString(2).padStart(n, '0'),
              last: v,
              prev: u,
              remWeight,
              travelTime: t,
              costAdded: addedPenalty,
              totalCost: newCost,
              existingCost: dp[nextStateIdx],
              isBetter: false,
              explanation: `From state [${mask.toString(2).padStart(n, '0')}, Node #${u + 1}] -> Node #${v + 1} cost ${newCost.toFixed(1)} is worse than existing ${dp[nextStateIdx].toFixed(1)}`
            });
          }
        }
      }
    }

    // Find optimal ending node at full mask (2^n - 1)
    const fullMask = numStates - 1;
    let minCost = Infinity;
    let bestLast = -1;

    for (let i = 0; i < n; i++) {
      const cost = dp[fullMask * n + i];
      if (cost < minCost) {
        minCost = cost;
        bestLast = i;
      }
    }

    // Reconstruct path
    const order = [];
    if (bestLast !== -1) {
      let currMask = fullMask;
      let currNode = bestLast;

      while (currNode !== -1) {
        order.push(currNode);
        const p = parent[currMask * n + currNode];
        currMask = currMask ^ (1 << currNode);
        currNode = p;
      }
      order.reverse();
    }

    const endTime = performance.now();
    const runtimeMs = Math.max(0.01, endTime - startTime);
    const evalResult = RouteSolvers.evaluateRoute(depot, locations, order, speed);

    // Memory estimation
    const bytesUsed = (numStates * n * 8) + (numStates * n * 2) + (numStates * 8);
    const memoryEstimate = bytesUsed > 1048576 
      ? `${(bytesUsed / 1048576).toFixed(2)} MB` 
      : `${(bytesUsed / 1024).toFixed(1)} KB`;

    return {
      name: 'Dynamic Programming (Bitmask)',
      code: 'DP',
      order,
      totalCost: evalResult.totalCost,
      arrivalTimes: evalResult.arrivalTimes,
      totalDuration: evalResult.totalDuration,
      runtimeMs,
      nodesExplored: statesComputed,
      memoryEstimate,
      dpTable: recordSteps && n <= 6 ? dp : null,
      stepHistory,
      numStates
    };
  }

  // ==========================================
  // 2. BACKTRACKING WITH BRANCH & BOUND
  // ==========================================
  /**
   * Backtracking solver with Branch-and-Bound pruning toggle.
   * Explores permutation tree.
   * Pruning bound: If current accumulated cost >= bestCost, prune branch immediately.
   * Enhanced bound: current_cost + min_unvisited_distance * remaining_weight.
   */
  static solveBacktracking(depot, locations, speed, enablePruning = true) {
    const startTime = performance.now();
    const n = locations.length;

    if (n === 0) {
      return {
        name: enablePruning ? 'Backtracking (B&B)' : 'Exhaustive Backtracking',
        order: [],
        totalCost: 0,
        arrivalTimes: [],
        runtimeMs: 0,
        nodesExplored: 1,
        memoryEstimate: '< 1 KB'
      };
    }

    const totalWeight = locations.reduce((sum, loc) => sum + loc.weight, 0);

    // Travel time matrix
    const timeMatrix = Array.from({ length: n + 1 }, () => new Float64Array(n + 1));
    for (let i = 0; i < n; i++) {
      timeMatrix[n][i] = RouteSolvers.travelTime(depot, locations[i], speed);
      timeMatrix[i][n] = timeMatrix[n][i];
      for (let j = 0; j < n; j++) {
        timeMatrix[i][j] = RouteSolvers.travelTime(locations[i], locations[j], speed);
      }
    }

    // Min distance from node i to any other node (admissible lower bound)
    const minExitTime = new Float64Array(n + 1);
    for (let i = 0; i <= n; i++) {
      let m = Infinity;
      for (let j = 0; j < n; j++) {
        if (i !== j) {
          m = Math.min(m, timeMatrix[i][j]);
        }
      }
      minExitTime[i] = m === Infinity ? 0 : m;
    }

    let bestCost = Infinity;
    let bestOrder = [];
    let nodesExplored = 0;

    const currentOrder = new Int32Array(n);
    const visited = new Uint8Array(n);

    // Initial Greedy estimate to seed bestCost for rapid B&B pruning
    if (enablePruning) {
      const greedyRes = RouteSolvers.solveGreedy(depot, locations, speed);
      bestCost = greedyRes.totalCost;
      bestOrder = [...greedyRes.order];
    }

    function search(depth, lastNodeIndex, currentCost, remWeight) {
      nodesExplored++;

      if (depth === n) {
        if (currentCost < bestCost) {
          bestCost = currentCost;
          bestOrder = Array.from(currentOrder);
        }
        return;
      }

      // Branch and Bound Pruning Check
      if (enablePruning) {
        // Lower bound: currentCost + (min travel time from lastNodeIndex) * remWeight
        const lowerBound = currentCost + minExitTime[lastNodeIndex] * remWeight;
        if (lowerBound >= bestCost) {
          return; // PRUNED
        }
      }

      // Safety recursion limit check for unpruned deep instances
      if (!enablePruning && nodesExplored > 10000000) {
        return; // Guard against browser hang on huge unpruned n!
      }

      // Try next candidates
      for (let i = 0; i < n; i++) {
        if (!visited[i]) {
          visited[i] = 1;
          currentOrder[depth] = i;

          const t = timeMatrix[lastNodeIndex][i];
          const addedPenalty = t * remWeight;
          const nextCost = currentCost + addedPenalty;
          const nextRemWeight = remWeight - locations[i].weight;

          search(depth + 1, i, nextCost, nextRemWeight);

          visited[i] = 0;
        }
      }
    }

    // Start from depot (depot index = n in timeMatrix)
    search(0, n, 0, totalWeight);

    const endTime = performance.now();
    const runtimeMs = Math.max(0.01, endTime - startTime);
    const evalResult = RouteSolvers.evaluateRoute(depot, locations, bestOrder, speed);

    return {
      name: enablePruning ? 'Backtracking (Branch & Bound)' : 'Exhaustive Backtracking (No Pruning)',
      code: enablePruning ? 'B&B' : 'BT_NAIVE',
      order: bestOrder,
      totalCost: evalResult.totalCost,
      arrivalTimes: evalResult.arrivalTimes,
      totalDuration: evalResult.totalDuration,
      runtimeMs,
      nodesExplored,
      memoryEstimate: `${((n * 4 * 2) / 1024).toFixed(2)} KB (O(n) Call Stack)`
    };
  }

  // ==========================================
  // 3. GREEDY HEURISTIC SOLVER (O(n^2))
  // ==========================================
  /**
   * Greedy Heuristic:
   * At each step, selects the next unvisited location that maximizes:
   *   Score(j) = weight_j / travelTime(current, j)
   * (Urgency-to-travel-cost ratio heuristic)
   */
  static solveGreedy(depot, locations, speed) {
    const startTime = performance.now();
    const n = locations.length;

    if (n === 0) {
      return {
        name: 'Greedy Heuristic',
        code: 'GREEDY',
        order: [],
        totalCost: 0,
        arrivalTimes: [],
        runtimeMs: 0,
        nodesExplored: 1,
        memoryEstimate: '< 1 KB'
      };
    }

    const unvisited = new Set(locations.map((_, i) => i));
    const order = [];
    let currentPos = depot;
    let comparisons = 0;

    while (unvisited.size > 0) {
      let bestIdx = -1;
      let bestRatio = -Infinity;

      for (const idx of unvisited) {
        comparisons++;
        const loc = locations[idx];
        const dist = RouteSolvers.distance(currentPos, loc);
        const time = RouteSolvers.travelTime(currentPos, loc, speed);

        // Score: weight / time. Avoid division by zero with small epsilon.
        const ratio = time > 0.0001 ? loc.weight / time : loc.weight * 1e6;

        if (ratio > bestRatio) {
          bestRatio = ratio;
          bestIdx = idx;
        }
      }

      order.push(bestIdx);
      unvisited.delete(bestIdx);
      currentPos = locations[bestIdx];
    }

    const endTime = performance.now();
    const runtimeMs = Math.max(0.01, endTime - startTime);
    const evalResult = RouteSolvers.evaluateRoute(depot, locations, order, speed);

    return {
      name: 'Greedy Heuristic (Max Weight/Time)',
      code: 'GREEDY',
      order,
      totalCost: evalResult.totalCost,
      arrivalTimes: evalResult.arrivalTimes,
      totalDuration: evalResult.totalDuration,
      runtimeMs,
      nodesExplored: comparisons,
      memoryEstimate: '< 2 KB'
    };
  }

  /**
   * Solve with all 3 solvers and compute comparative statistics
   */
  static solveAll(depot, locations, speed, enablePruning = true) {
    const n = locations.length;
    const greedy = RouteSolvers.solveGreedy(depot, locations, speed);

    let dp = null;
    let dpError = null;
    if (n <= 18) {
      try {
        dp = RouteSolvers.solveDP(depot, locations, speed);
      } catch (err) {
        dpError = err.message;
      }
    } else {
      dpError = `DP bypassed (n = ${n} > 18 limit)`;
    }

    let bb = null;
    let bbError = null;
    if (n <= 13) {
      try {
        bb = RouteSolvers.solveBacktracking(depot, locations, speed, enablePruning);
      } catch (err) {
        bbError = err.message;
      }
    } else {
      bbError = `Backtracking bypassed (n = ${n} > 13 limit)`;
    }

    const baselineCost = dp ? dp.totalCost : (bb ? bb.totalCost : greedy.totalCost);

    const enrich = (sol) => {
      if (!sol) return null;
      const gap = baselineCost > 0 ? ((sol.totalCost - baselineCost) / baselineCost) * 100 : 0;
      return {
        ...sol,
        optimalityGapPct: Math.max(0, gap)
      };
    };

    return {
      dp: enrich(dp),
      dpError,
      backtracking: enrich(bb),
      bbError,
      greedy: enrich(greedy),
      baselineCost
    };
  }
}

window.RouteSolvers = RouteSolvers;
