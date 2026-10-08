import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { RouterCanvas } from './components/RouterCanvas';
import { TelemetryPanel } from './components/TelemetryPanel';
import { SidebarEditor } from './components/SidebarEditor';
import { ResultsComparison } from './components/ResultsComparison';
import { DPStepThrough } from './components/DPStepThrough';
import { BenchmarkSuite } from './components/BenchmarkSuite';
import { WhyDPSection } from './components/WhyDPSection';
import { TeacherWalkthroughModal } from './components/TeacherWalkthroughModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { PRESET_SCENARIOS } from './algorithms/presets';
import { RouteSolvers } from './algorithms/solvers';
import { sounds } from './utils/soundEffects';
import { Dices, Trash2, Sparkles } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState('canvas'); // 'canvas' | 'dp-stepper' | 'benchmark' | 'why-dp'
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [currentPresetId, setCurrentPresetId] = useState('greedy_trap');
  const [depot, setDepot] = useState({ x: 140, y: 280, name: 'Central Relief Depot' });
  const [locations, setLocations] = useState([]);
  const [speed, setSpeed] = useState(120);
  const [selectedNodeIndex, setSelectedNodeIndex] = useState(-1);
  const [randomN, setRandomN] = useState(8);

  const [currentSolver, setCurrentSolver] = useState('dp'); // 'dp' | 'backtracking' | 'greedy'
  const [enablePruning, setEnablePruning] = useState(true);
  const [compareMode, setCompareMode] = useState(false);
  const [activeRoutes, setActiveRoutes] = useState(null);
  const [vehicleAnim, setVehicleAnim] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [isTeacherGuideOpen, setIsTeacherGuideOpen] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  const solveAll = useCallback((dep, locs, spd, prune) => {
    if (!locs || locs.length === 0) {
      setActiveRoutes(null);
      return;
    }
    const sol = RouteSolvers.solveAll(dep, locs, spd, prune);
    setActiveRoutes(sol);
  }, []);

  const loadPresetById = useCallback((presetId) => {
    const preset = PRESET_SCENARIOS.find((p) => p.id === presetId);
    if (!preset) return;

    setCurrentPresetId(presetId);
    setDepot({ ...preset.depot });
    setLocations(preset.locations.map((l) => ({ ...l })));
    setSpeed(preset.speed || 100);
    setSelectedNodeIndex(-1);
    setVehicleAnim(null);
    sounds.playClick();
    showToast(`Loaded Preset: ${preset.name}`);

    solveAll(preset.depot, preset.locations, preset.speed || 100, enablePruning);
  }, [enablePruning, solveAll]);

  // Initial load
  useEffect(() => {
    loadPresetById('greedy_trap');
  }, []);

  // Re-solve when solver flags or speed change
  useEffect(() => {
    solveAll(depot, locations, speed, enablePruning);
  }, [depot, locations, speed, enablePruning, solveAll]);

  const handleStateModified = (newLocs, newDepot) => {
    solveAll(newDepot || depot, newLocs, speed, enablePruning);
  };

  const handleGenerateRandom = () => {
    sounds.playClick();
    const padding = 60;
    const w = 700;
    const h = 420;

    const newDepot = {
      x: Math.round(padding + Math.random() * (w - 2 * padding)),
      y: Math.round(padding + Math.random() * (h - 2 * padding)),
      name: 'HQ Relief Hub'
    };

    const types = ['hospital', 'clinic', 'shelter'];
    const newLocs = [];

    for (let i = 0; i < randomN; i++) {
      const weight = Math.floor(Math.random() * 10) + 1;
      const type = types[Math.floor(Math.random() * types.length)];
      newLocs.push({
        id: i + 1,
        name: `${type.charAt(0).toUpperCase() + type.slice(1)} #${i + 1}`,
        x: Math.round(padding + Math.random() * (w - 2 * padding)),
        y: Math.round(padding + Math.random() * (h - 2 * padding)),
        weight,
        type
      });
    }

    setDepot(newDepot);
    setLocations(newLocs);
    setSelectedNodeIndex(-1);
    setVehicleAnim(null);
    showToast(`Generated random instance with n = ${randomN}`);
    solveAll(newDepot, newLocs, speed, enablePruning);
  };

  const handleClear = () => {
    sounds.playClick();
    setLocations([]);
    setSelectedNodeIndex(-1);
    setVehicleAnim(null);
    setActiveRoutes(null);
    showToast('Canvas cleared');
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        const btn = document.querySelector('.telemetry-ribbon .btn-primary');
        if (btn) btn.click();
      } else if (e.key === 'r' || e.key === 'R') {
        solveAll(depot, locations, speed, enablePruning);
        sounds.playClick();
        showToast('Recomputed all routes');
      } else if (e.key === 'c' || e.key === 'C') {
        setCompareMode((prev) => !prev);
        sounds.playClick();
      } else if (e.key === '1') {
        setCurrentSolver('dp');
        sounds.playClick();
      } else if (e.key === '2') {
        setCurrentSolver('backtracking');
        sounds.playClick();
      } else if (e.key === '3') {
        setCurrentSolver('greedy');
        sounds.playClick();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [depot, locations, speed, enablePruning, solveAll]);

  const currentPreset = PRESET_SCENARIOS.find((p) => p.id === currentPresetId);
  const activeSol = activeRoutes?.[currentSolver] || activeRoutes?.dp || activeRoutes?.greedy;

  return (
    <div className="app-container">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        audioEnabled={audioEnabled}
        setAudioEnabled={setAudioEnabled}
        onOpenTeacherGuide={() => setIsTeacherGuideOpen(false) || setActiveTab('why-dp')}
      />

      <main className="main-content">
        <ErrorBoundary onReset={() => setActiveTab('canvas')}>
          {activeTab === 'canvas' && (
            <div className="router-layout-grid">
              
              {/* Left Stage */}
              <section style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', minWidth: 0 }}>
                
                {/* Presets & Scenario Toolbar */}
                <div className="stage-card" style={{ padding: '0.75rem 1.15rem' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
                    
                    {/* Preset Chips */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', flex: 1 }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Scenarios:</span>
                      <div className="preset-pills-bar">
                        {PRESET_SCENARIOS.map((p) => {
                          const isActive = p.id === currentPresetId;
                          return (
                            <button
                              key={p.id}
                              className={`preset-chip-btn ${isActive ? 'active' : ''}`}
                              onClick={() => loadPresetById(p.id)}
                            >
                              <span>{p.name.split('(')[0]}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Generator Controls */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'var(--bg-primary)', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                        <label htmlFor="random-n-field" style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', fontWeight: 600 }}>n =</label>
                        <input
                          type="number"
                          id="random-n-field"
                          style={{ width: '38px', background: 'transparent', border: 'none', color: '#fff', textAlign: 'center', fontSize: '0.8rem', fontWeight: 700, outline: 'none' }}
                          min="3"
                          max="18"
                          value={randomN}
                          onChange={(e) => setRandomN(Number(e.target.value))}
                        />
                      </div>
                      <button className="btn btn-secondary btn-sm" onClick={handleGenerateRandom} title="Generate Random Graph">
                        <Dices size={13} /> Random
                      </button>
                      <button className="btn btn-outline btn-sm" onClick={handleClear} title="Clear All Nodes">
                        <Trash2 size={13} /> Clear
                      </button>
                    </div>

                  </div>

                  {currentPreset && (
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.5rem', marginTop: '0.25rem' }}>
                      <strong>Premise:</strong> {currentPreset.description}
                    </div>
                  )}
                </div>

                {/* Interactive Canvas */}
                <RouterCanvas
                  depot={depot}
                  setDepot={setDepot}
                  locations={locations}
                  setLocations={setLocations}
                  selectedNodeIndex={selectedNodeIndex}
                  setSelectedNodeIndex={setSelectedNodeIndex}
                  activeRoutes={activeRoutes}
                  currentSolver={currentSolver}
                  compareMode={compareMode}
                  vehicleAnim={vehicleAnim}
                  setVehicleAnim={setVehicleAnim}
                  speed={speed}
                  onStateModified={handleStateModified}
                />

                {/* Telemetry & Timeline */}
                <TelemetryPanel
                  activeSol={activeSol}
                  vehicleAnim={vehicleAnim}
                  setVehicleAnim={setVehicleAnim}
                  locations={locations}
                  depot={depot}
                  speed={speed}
                />

                {/* Solvers Comparison Results Table */}
                <ResultsComparison
                  allSol={activeRoutes}
                  currentSolver={currentSolver}
                  onOpenTeacherGuide={() => setActiveTab('why-dp')}
                />

              </section>

              {/* Right Sidebar Editor */}
              <SidebarEditor
                locations={locations}
                setLocations={setLocations}
                selectedNodeIndex={selectedNodeIndex}
                setSelectedNodeIndex={setSelectedNodeIndex}
                currentSolver={currentSolver}
                setCurrentSolver={setCurrentSolver}
                enablePruning={enablePruning}
                setEnablePruning={setEnablePruning}
                compareMode={compareMode}
                setCompareMode={setCompareMode}
                speed={speed}
                setSpeed={setSpeed}
                onStateModified={handleStateModified}
                depot={depot}
              />

            </div>
          )}

          {activeTab === 'dp-stepper' && (
            <DPStepThrough
              depot={depot}
              locations={locations}
              speed={speed}
              onLoadPreset={loadPresetById}
            />
          )}

          {activeTab === 'benchmark' && (
            <BenchmarkSuite speed={speed} />
          )}

          {activeTab === 'why-dp' && (
            <WhyDPSection
              onLoadPreset={loadPresetById}
              setActiveTab={setActiveTab}
            />
          )}
        </ErrorBoundary>
      </main>

      {/* Presentation Walkthrough Modal */}
      <TeacherWalkthroughModal
        isOpen={isTeacherGuideOpen}
        onClose={() => setIsTeacherGuideOpen(false)}
        onLoadPreset={loadPresetById}
        setActiveTab={setActiveTab}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="toast-box">
          <Sparkles size={15} color="#38bdf8" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
