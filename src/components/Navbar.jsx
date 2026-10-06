import React from 'react';
import { 
  Ambulance, 
  MapPin, 
  Cpu, 
  BarChart3, 
  BookOpen, 
  HeartPulse, 
  Volume2, 
  VolumeX, 
  Github,
  Sparkles
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export function Navbar({ activeTab, setActiveTab, audioEnabled, setAudioEnabled }) {
  const tabs = [
    { id: 'canvas', label: 'Command Canvas', icon: MapPin },
    { id: 'dp-stepper', label: 'DP Bitmask Debugger', icon: Cpu },
    { id: 'benchmark', label: 'Benchmark Suite', icon: BarChart3 },
    { id: 'theory', label: 'Theory & Proofs', icon: BookOpen },
    { id: 'practical', label: 'Field Triage', icon: HeartPulse }
  ];

  const handleTabClick = (tabId) => {
    sounds.playClick();
    setActiveTab(tabId);
  };

  const handleAudioToggle = () => {
    const newState = sounds.toggle();
    setAudioEnabled(newState);
    if (newState) sounds.playSuccess();
  };

  return (
    <header className="navbar">
      <div className="brand-section">
        <div className="brand-icon-box">
          <Ambulance size={24} />
        </div>
        <div>
          <div className="brand-title">
            GoldenHour Router
            <span className="badge badge-warning" style={{ fontSize: '0.65rem' }}>
              <Sparkles size={10} /> DAA Pro
            </span>
          </div>
          <div className="brand-subtitle">Minimum Weighted Latency Emergency Dispatcher</div>
        </div>
      </div>

      <nav className="nav-tabs-wrapper" role="tablist">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              className={`nav-tab-button ${isActive ? 'active' : ''}`}
              onClick={() => handleTabClick(tab.id)}
              role="tab"
              aria-selected={isActive}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="navbar-actions">
        <button
          className="icon-action-btn"
          onClick={handleAudioToggle}
          title={audioEnabled ? 'Mute Sound Effects' : 'Enable Sound FX (Web Audio API)'}
        >
          {audioEnabled ? <Volume2 size={18} color="#10b981" /> : <VolumeX size={18} color="#64748b" />}
        </button>

        <a
          href="https://github.com/dakshshah05/daa"
          target="_blank"
          rel="noopener noreferrer"
          className="icon-action-btn"
          title="View on GitHub"
        >
          <Github size={18} />
        </a>
      </div>
    </header>
  );
}
