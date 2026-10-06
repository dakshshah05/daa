import React, { useState } from 'react';
import { Sliders, Plus, Trash2, Gauge, Layers, Eye } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export function SidebarEditor({
  locations,
  setLocations,
  selectedNodeIndex,
  setSelectedNodeIndex,
  currentSolver,
  setCurrentSolver,
  enablePruning,
  setEnablePruning,
  compareMode,
  setCompareMode,
  speed,
  setSpeed,
  onStateModified,
  depot
}) {
  const [newFacilityName, setNewFacilityName] = useState('');
  const [newFacilityType, setNewFacilityType] = useState('hospital');
  const [newFacilityWeight, setNewFacilityWeight] = useState(8);

  const getNodeColor = (weight) => {
    if (weight >= 9) return '#ef4444';
    if (weight >= 7) return '#f97316';
    if (weight >= 4) return '#eab308';
    return '#10b981';
  };

  const handleSolverChange = (solver) => {
    sounds.playClick();
    setCurrentSolver(solver);
  };

  const handleAddFacility = (e) => {
    e.preventDefault();
    if (locations.length >= 20) return;

    sounds.playClick();
    const id = locations.length + 1;
    const name = newFacilityName.trim() || `Triage Post #${id}`;
    const x = 100 + Math.random() * 600;
    const y = 100 + Math.random() * 350;

    const newLoc = {
      id,
      name,
      x: Math.round(x),
      y: Math.round(y),
      weight: Number(newFacilityWeight),
      type: newFacilityType
    };

    const updated = [...locations, newLoc];
    setLocations(updated);
    setSelectedNodeIndex(updated.length - 1);
    setNewFacilityName('');
    if (onStateModified) onStateModified(updated, depot);
  };

  const handleWeightChange = (index, newWeight) => {
    const updated = [...locations];
    updated[index] = { ...updated[index], weight: Number(newWeight) };
    setLocations(updated);
    sounds.playNodeVisit(Number(newWeight));
    if (onStateModified) onStateModified(updated, depot);
  };

  const handleDeleteNode = (index) => {
    sounds.playClick();
    const updated = locations.filter((_, idx) => idx !== index).map((loc, idx) => ({
      ...loc,
      id: idx + 1
    }));
    setLocations(updated);
    setSelectedNodeIndex(-1);
    if (onStateModified) onStateModified(updated, depot);
  };

  return (
    <aside style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      
      {/* Solver Configuration */}
      <div className="stage-card">
        <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
          <Sliders size={16} color="#38bdf8" />
          <span>Solver Engine</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.35rem', background: 'var(--bg-secondary)', padding: '0.25rem', borderRadius: 'var(--radius-sm)' }}>
          <button
            className={`btn btn-sm ${currentSolver === 'dp' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => handleSolverChange('dp')}
          >
            Bitmask DP
          </button>
          <button
            className={`btn btn-sm ${currentSolver === 'backtracking' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => handleSolverChange('backtracking')}
          >
            B&B
          </button>
          <button
            className={`btn btn-sm ${currentSolver === 'greedy' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => handleSolverChange('greedy')}
          >
            Greedy
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
          <label htmlFor="toggle-pruning-react" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Layers size={14} /> Branch & Bound Pruning
          </label>
          <input
            type="checkbox"
            id="toggle-pruning-react"
            checked={enablePruning}
            onChange={(e) => {
              sounds.playClick();
              setEnablePruning(e.target.checked);
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
          <label htmlFor="toggle-compare-react" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Eye size={14} /> Overlay All Routes
          </label>
          <input
            type="checkbox"
            id="toggle-compare-react"
            checked={compareMode}
            onChange={(e) => {
              sounds.playClick();
              setCompareMode(e.target.checked);
            }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Gauge size={12} /> Vehicle Speed:</span>
            <strong style={{ color: 'var(--accent-blue)' }}>{speed} px/s</strong>
          </div>
          <input
            type="range"
            min="30"
            max="350"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
          />
        </div>
      </div>

      {/* Quick Add Form */}
      <div className="stage-card">
        <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
          <Plus size={16} color="#10b981" />
          <span>Add Facility</span>
        </div>

        <form onSubmit={handleAddFacility} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Facility Name (e.g. Trauma Unit)"
            value={newFacilityName}
            onChange={(e) => setNewFacilityName(e.target.value)}
          />
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <select
              className="form-select"
              style={{ flex: 1 }}
              value={newFacilityType}
              onChange={(e) => setNewFacilityType(e.target.value)}
            >
              <option value="hospital">Hospital / ICU</option>
              <option value="clinic">Field Clinic</option>
              <option value="shelter">Evacuation Shelter</option>
            </select>
            <input
              type="number"
              className="form-input"
              style={{ width: '65px' }}
              min="1"
              max="10"
              value={newFacilityWeight}
              onChange={(e) => setNewFacilityWeight(e.target.value)}
              title="Urgency Weight (1-10)"
            />
          </div>
          <button type="submit" className="btn btn-secondary btn-sm">
            Place on Map
          </button>
        </form>
      </div>

      {/* Facility Urgency Weight List */}
      <div className="stage-card" style={{ flex: 1, minHeight: '300px' }}>
        <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
          <span>📍 Facilities ({locations.length})</span>
          <small style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>Adjust urgency 1-10</small>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '360px', overflowY: 'auto', paddingRight: '0.2rem' }}>
          {locations.map((loc, idx) => {
            const isSelected = selectedNodeIndex === idx;
            const col = getNodeColor(loc.weight);
            return (
              <div
                key={loc.id || idx}
                style={{
                  background: isSelected ? 'rgba(56, 189, 248, 0.12)' : 'var(--bg-secondary)',
                  border: `1px solid ${isSelected ? 'var(--accent-blue)' : 'var(--border-subtle)'}`,
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.6rem 0.8rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem',
                  cursor: 'pointer'
                }}
                onClick={() => setSelectedNodeIndex(idx)}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: col }}></span>
                    <strong style={{ fontSize: '0.82rem', color: '#fff' }}>{loc.name}</strong>
                  </div>
                  <button
                    style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteNode(idx);
                    }}
                    title="Remove facility"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  <span>Urgency Weight: <strong style={{ color: col }}>{loc.weight} / 10</strong></span>
                  <span style={{ textTransform: 'capitalize', background: 'var(--bg-tertiary)', padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.68rem' }}>
                    {loc.type || 'hospital'}
                  </span>
                </div>

                <input
                  type="range"
                  min="1"
                  max="10"
                  value={loc.weight}
                  style={{ accentColor: col }}
                  onChange={(e) => handleWeightChange(idx, e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            );
          })}
        </div>
      </div>

    </aside>
  );
}
