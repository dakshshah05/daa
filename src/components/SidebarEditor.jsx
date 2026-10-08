import React, { useState } from 'react';
import { Sliders, Plus, Trash2, Gauge, Layers, Eye, MapPin } from 'lucide-react';
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
    if (weight >= 9) return '#ff3366';
    if (weight >= 7) return '#f97316';
    if (weight >= 4) return '#fbbf24';
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
    <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', minWidth: 0, width: '100%' }}>
      
      {/* Solver Configuration Bento Box */}
      <div className="stage-card">
        <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #000000', paddingBottom: '0.65rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sliders size={17} color="#38bdf8" />
            <span>Algorithm Engine</span>
          </div>
          <span className="badge badge-pro" style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem' }}>Active</span>
        </div>

        {/* 3 Solver Mode Pills */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.4rem', background: 'rgba(6, 10, 20, 0.85)', padding: '0.35rem', borderRadius: 'var(--radius-sm)', border: '2px solid #000000', boxShadow: 'var(--neo-shadow-xs)' }}>
          <button
            className={`btn btn-sm ${currentSolver === 'dp' ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '0.45rem 0.2rem', fontSize: '0.74rem' }}
            onClick={() => handleSolverChange('dp')}
          >
            Bitmask DP
          </button>
          <button
            className={`btn btn-sm ${currentSolver === 'backtracking' ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '0.45rem 0.2rem', fontSize: '0.74rem' }}
            onClick={() => handleSolverChange('backtracking')}
          >
            B&B
          </button>
          <button
            className={`btn btn-sm ${currentSolver === 'greedy' ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '0.45rem 0.2rem', fontSize: '0.74rem' }}
            onClick={() => handleSolverChange('greedy')}
          >
            Greedy
          </button>
        </div>

        {/* Toggle Switches */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', background: 'rgba(9, 14, 28, 0.75)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '2px solid #000000', boxShadow: 'var(--neo-shadow-xs)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
            <label htmlFor="toggle-pruning-react" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Layers size={14} color="#38bdf8" /> Branch & Bound Pruning
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

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
            <label htmlFor="toggle-compare-react" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Eye size={14} color="#fbbf24" /> Compare All Overlaid
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', background: 'rgba(9, 14, 28, 0.75)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '2px solid #000000', boxShadow: 'var(--neo-shadow-xs)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 700 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Gauge size={14} color="#38bdf8" /> Vehicle Speed:</span>
            <span className="badge badge-pro" style={{ fontSize: '0.72rem', padding: '0.15rem 0.45rem' }}>{speed} px/s</span>
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
      <div className="stage-card" style={{ flex: 1, minHeight: '340px' }}>
        
        {/* Header & Add Button */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #000000', paddingBottom: '0.65rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={17} color="#ff3366" />
            <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#fff' }}>Facilities ({locations.length})</span>
          </div>
          <button
            className="btn btn-sm btn-outline"
            style={{ padding: '0.35rem 0.65rem', fontSize: '0.74rem' }}
            onClick={() => setShowAddForm(!showAddForm)}
          >
            <Plus size={13} /> {showAddForm ? 'Close' : 'Add New'}
          </button>
        </div>

        {/* Collapsible Add Form */}
        {showAddForm && (
          <form onSubmit={handleAddFacility} style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', background: 'rgba(6, 10, 20, 0.9)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '2px solid #000000', boxShadow: 'var(--neo-shadow-sm)' }}>
            <input
              type="text"
              className="form-input"
              style={{ fontSize: '0.82rem', padding: '0.45rem 0.75rem' }}
              placeholder="Facility Name (e.g. Trauma ICU)"
              value={newFacilityName}
              onChange={(e) => setNewFacilityName(e.target.value)}
            />
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <select
                className="form-select"
                style={{ flex: 1, fontSize: '0.82rem', padding: '0.45rem 0.65rem' }}
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
                style={{ width: '60px', fontSize: '0.82rem', padding: '0.45rem 0.5rem', textAlign: 'center' }}
                min="1"
                max="10"
                value={newFacilityWeight}
                onChange={(e) => setNewFacilityWeight(e.target.value)}
                title="Urgency Weight (1-10)"
              />
            </div>
            <button type="submit" className="btn btn-primary btn-sm" style={{ width: '100%', marginTop: '0.2rem' }}>
              Add to Map
            </button>
          </form>
        )}

        {/* Facility Cards List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', maxHeight: '350px', overflowY: 'auto', paddingRight: '0.2rem' }}>
          {locations.map((loc, idx) => {
            const isSelected = selectedNodeIndex === idx;
            const col = getNodeColor(loc.weight);
            return (
              <div
                key={loc.id || idx}
                style={{
                  background: isSelected ? 'rgba(56, 189, 248, 0.22)' : 'rgba(9, 14, 28, 0.85)',
                  backdropFilter: 'var(--glass-blur)',
                  border: isSelected ? '2px solid #38bdf8' : '2px solid #000000',
                  boxShadow: isSelected ? 'var(--neo-shadow-blue)' : 'var(--neo-shadow-xs)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.65rem 0.85rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.45rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  transform: isSelected ? 'translate(-2px, -2px)' : 'none'
                }}
                onClick={() => setSelectedNodeIndex(idx)}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: col, border: '1.5px solid #000', boxShadow: '1px 1px 0px #000', flexShrink: 0 }}></span>
                    <strong style={{ fontSize: '0.82rem', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {loc.name}
                    </strong>
                  </div>
                  <button
                    style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1.5px solid #000', borderRadius: '4px', color: '#ff4d7a', cursor: 'pointer', padding: '0.25rem 0.35rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteNode(idx);
                    }}
                    title="Remove facility"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.74rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  <span>Urgency: <strong style={{ color: col }}>{loc.weight} / 10</strong></span>
                  <span style={{ textTransform: 'capitalize', background: '#000', color: '#38bdf8', padding: '0.1rem 0.45rem', borderRadius: '4px', fontSize: '0.68rem', fontWeight: 800, border: '1px solid rgba(255,255,255,0.2)' }}>
                    {loc.type || 'hospital'}
                  </span>
                </div>

                <input
                  type="range"
                  min="1"
                  max="10"
                  value={loc.weight}
                  style={{ accentColor: col, height: '6px' }}
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
