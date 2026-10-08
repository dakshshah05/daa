import React from 'react';
import { 
  Activity, 
  MapPin, 
  Cpu, 
  BarChart3, 
  Lightbulb, 
  Volume2, 
  VolumeX, 
  Github,
  GraduationCap
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export function Navbar({ activeTab, setActiveTab, audioEnabled, setAudioEnabled, onOpenTeacherGuide }) {
  const tabs = [
    { id: 'canvas', label: 'Command Canvas', icon: MapPin },
    { id: 'dp-stepper', label: 'DP Bitmask Matrix', icon: Cpu },
    { id: 'benchmark', label: 'Benchmark Suite', icon: BarChart3 },
    { id: 'why-dp', label: 'Why DP is Best', icon: Lightbulb }
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
        <div className="brand-icon-box" title="Emergency Response System">
          <Activity size={22} color="#FCF9EA" />
        </div>
        <div className="brand-title-wrap">
          <div className="brand-title">
            GoldenHour <span className="brand-accent">Router</span>
            <span className="badge badge-pro">
              DAA Project
            </span>
          </div>
          <div className="brand-subtitle">Minimum Weighted Latency & Emergency Dispatch Optimizer</div>
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
        {/* Presentation Walkthrough Button */}
        <button
          className="btn-presentation"
          onClick={() => {
            sounds.playClick();
            onOpenTeacherGuide();
          }}
          title="Open Academic Presentation Guide"
        >
          <GraduationCap size={16} />
          <span>Walkthrough</span>
        </button>

        <button
          className="icon-action-btn"
          onClick={handleAudioToggle}
          title={audioEnabled ? 'Mute Audio Effects' : 'Enable Audio Synthesizer'}
          aria-label="Toggle Sound Effects"
        >
          {audioEnabled ? <Volume2 size={17} color="#97A87A" /> : <VolumeX size={17} color="#5E6C58" />}
        </button>

        <a
          href="https://github.com/dakshshah05/daa"
          target="_blank"
          rel="noopener noreferrer"
          className="icon-action-btn"
          title="View Source on GitHub"
          aria-label="GitHub Repository"
        >
          <Github size={17} />
        </a>
      </div>
    </header>
  );
}
