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
  GraduationCap,
  Sparkles
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export function Navbar({ activeTab, setActiveTab, audioEnabled, setAudioEnabled, onOpenTeacherGuide }) {
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
          <Ambulance size={22} />
        </div>
        <div>
          <div className="brand-title">
            GoldenHour Router
            <span className="badge badge-pro">
              <Sparkles size={11} /> DAA CIA
            </span>
          </div>
          <div className="brand-subtitle">Emergency Triage & Weighted Latency Optimizer</div>
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
              <Icon size={15} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="navbar-actions">
        {/* Presentation Mode Button for Teachers */}
        <button
          className="btn btn-presentation"
          onClick={() => {
            sounds.playClick();
            onOpenTeacherGuide();
          }}
          title="Open Academic Presentation Walkthrough"
        >
          <GraduationCap size={16} />
          <span>Teacher Mode</span>
        </button>

        <button
          className="icon-action-btn"
          onClick={handleAudioToggle}
          title={audioEnabled ? 'Mute Audio FX' : 'Enable Audio FX (Web Audio Synth)'}
        >
          {audioEnabled ? <Volume2 size={16} color="#10b981" /> : <VolumeX size={16} color="#64748b" />}
        </button>

        <a
          href="https://github.com/dakshshah05/daa"
          target="_blank"
          rel="noopener noreferrer"
          className="icon-action-btn"
          title="GitHub Repository"
        >
          <Github size={16} />
        </a>
      </div>
    </header>
  );
}
