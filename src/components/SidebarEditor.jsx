import React, { useState } from 'react';
import { Sliders, Plus, Trash2, Gauge, Layers, Eye, ChevronDown, ChevronUp, MapPin } from 'lucide-react';
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
  const [showAddForm, setShowAddForm] = useState(false);

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
    const x = 80 + Math.random() * 500;
    const y = 80 + Math.random() * 300;

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
    setShowAddForm(false);
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
    <aside style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', minWidth: 0, width: '100%' }}>
      
      {/* Solver Configuration Bento Box */}
      <div className="stage-card">
        <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.45rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <Sliders size={15} color="#38bdf8" />
            <span>Algorithm Engine</span>
          </div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Choose Solver</span>
        </div>

        {/* 3 Solver Mode Pills */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.3rem', background: 'var(--bg-secondary)', padding: '0.25rem', borderRadius: 'var(--radius-sm)' }}>
          <button
            className={`btn btn-sm ${currentSolver === 'dp' ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '0.35rem 0.2rem', fontSize: '0.72rem' }}
            onClick={() => handleSolverChange('dp')}
          >
            Bitmask DP
          </button>
          <button
            className={`btn btn-sm ${currentSolver === 'backtracking' ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '0.35rem 0.2rem', fontSize: '0.72rem' }}
            onClick={() => handleSolverChange('backtracking')}
          >
            B&B
          </button>
          <button
            className={`btn btn-sm ${currentSolver === 'greedy' ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '0.35rem 0.2rem', fontSize: '0.72rem' }}
            onClick={() => handleSolverChange('greedy')}
          >
            Greedy
          </button>
        </div>

        {/* Toggle Switches */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginTop: '0.2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            <label htmlFor="toggle-pruning-react" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Layers size={13} /> Branch & Bound Pruning
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

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            <label htmlFor="toggle-compare-react" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Eye size={13} /> Compare All Overlaid
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
        </div>

        {/* Speed Slider */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
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

      {/* Facility Triage Nodes List Bento Box */}
      <div className="stage-card" style={{ flex: 1, minHeight: '320px' }}>
        
        {/* Header & Add Button */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.45rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <MapPin size={15} color="#ef4444" />
            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff' }}>Facilities ({locations.length})</span>
          </div>
          <button
            className="btn btn-sm btn-outline"
            style={{ padding: '0.25rem 0.5rem', fontSize: '0.72rem' }}
            onClick={() => setShowAddForm(!showAddForm)}
          >
            <Plus size={13} /> {showAddForm ? 'Close' : 'Add New'}
          </button>
        </div>

        {/* Collapsible Add Form */}
        {showAddForm && (
          <form onSubmit={handleAddFacility} style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', background: 'var(--bg-secondary)', padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <input
              type="text"
              className="form-input"
              style={{ fontSize: '0.78rem', padding: '0.35rem 0.6rem' }}
              placeholder="Facility Name (e.g. Trauma ICU)"
              value={newFacilityName}
              onChange={(e) => setNewFacilityName(e.target.value)}
            />
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <select
                className="form-select"
                style={{ flex: 1, fontSize: '0.78rem', padding: '0.35rem 0.5rem' }}
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
                style={{ width: '55px', fontSize: '0.78rem', padding: '0.35rem 0.4rem' }}
                min="1"
                max="10"
                value={newFacilityWeight}
                onChange={(e) => setNewFacilityWeight(e.target.value)}
                title="Urgency Weight (1-10)"
              />
            </div>
            <button type="submit" className="btn btn-primary btn-sm" style={{ width: '100%' }}>
              Add to Map
            </button>
          </form>
        )}

        {/* Facility Cards List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', maxHeight: '340px', overflowY: 'auto', paddingRight: '0.15rem' }}>
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
                  padding: '0.5rem 0.65rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onClick={() => setSelectedNodeIndex(idx)}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', minWidth: 0 }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: col, flexShrink: 0 }}></span>
                    <strong style={{ fontSize: '0.78rem', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {loc.name}
                    </strong>
                  </div>
                  <button
                    style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer', padding: '0.2rem' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteNode(idx);
                    }}
                    title="Remove facility"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                  <span>Urgency Weight: <strong style={{ color: col }}>{loc.weight} / 10</strong></span>
                  <span style={{ textTransform: 'capitalize', background: 'var(--bg-tertiary)', padding: '0.05rem 0.35rem', borderRadius: '4px', fontSize: '0.65rem' }}>
                    {loc.type || 'hospital'}
                  </span>
                </div>

                <input
                  type="range"
                  min="1"
                  max="10"
                  value={loc.weight}
                  style={{ accentColor: col, height: '4px' }}
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
