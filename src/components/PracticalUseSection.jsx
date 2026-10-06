import React from 'react';
import { HeartPulse, Ambulance, Plane, ShieldCheck, Zap } from 'lucide-react';

export function PracticalUseSection() {
  const applications = [
    {
      icon: Ambulance,
      title: 'Mass Casualty Incident (MCI) Ambulance Dispatch',
      desc: 'In highway collisions, building collapses, or industrial fires, paramedics deploy START triage tags: Immediate Red (w=10), Delayed Yellow (w=5), and Minor Green (w=2). GoldenHour Router ensures life-support transport reaches critical patients first while minimizing total system-wide patient waiting time.',
      color: '#ef4444'
    },
    {
      icon: Plane,
      title: 'Autonomous Medical Drone Delivery',
      desc: 'Unmanned Aerial Vehicles (UAVs) transporting temperature-sensitive blood units, anti-venom, automated external defibrillators (AEDs), and epinephrine to inaccessible mountainous areas and flood-isolated rural clinics.',
      color: '#06b6d4'
    },
    {
      icon: Zap,
      title: 'Post-Disaster Critical Infrastructure Restoration',
      desc: 'Following hurricanes, cyclones, or earthquakes, emergency power grid technicians prioritize sub-stations supplying trauma centers (w=10) and municipal water pumps (w=8) before residential circuits.',
      color: '#f59e0b'
    },
    {
      icon: ShieldCheck,
      title: 'Humanitarian Cold-Chain Supply Logistics',
      desc: 'Red Cross and UN disaster teams routing mobile medical vans and vaccine cool-boxes through high-degradation relief corridors under severe perishable time constraints.',
      color: '#10b981'
    }
  ];

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      <div className="stage-card" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.6rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
          <HeartPulse size={22} color="#ef4444" />
          <span>Real-World Emergency & Humanitarian Applications</span>
        </h2>

        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginTop: '1rem' }}>
          The term <strong>"Golden Hour"</strong> refers to the critical 60-minute window following traumatic injury or catastrophic shock. Immediate clinical intervention during this window directly determines victim survival rates.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
          {applications.map((app, idx) => {
            const Icon = app.icon;
            return (
              <div
                key={idx}
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}
              >
                <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-sm)', background: `${app.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: app.color }}>
                  <Icon size={22} />
                </div>
                <h3 style={{ fontSize: '1.05rem', color: '#fff', fontWeight: 700 }}>{app.title}</h3>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{app.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Triage Scale Table */}
      <div className="stage-card" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>
          🩺 Standard Emergency Triage Urgency Weights
        </h2>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)', textAlign: 'left', color: '#fff' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Weight Range</th>
                <th style={{ padding: '0.75rem 1rem' }}>START Tag</th>
                <th style={{ padding: '0.75rem 1rem' }}>Clinical Profile</th>
                <th style={{ padding: '0.75rem 1rem' }}>Response Window</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '0.75rem 1rem', color: '#ef4444', fontWeight: 800 }}>10 (Critical)</td>
                <td style={{ padding: '0.75rem 1rem' }}><span className="badge badge-danger">RED (Immediate)</span></td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)' }}>Arterial bleeding, respiratory failure, severe head trauma</td>
                <td style={{ padding: '0.75rem 1rem', color: '#f87171' }}>&lt; 15 Minutes</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '0.75rem 1rem', color: '#f97316', fontWeight: 800 }}>7 - 9 (Severe)</td>
                <td style={{ padding: '0.75rem 1rem' }}><span className="badge badge-warning">ORANGE / RED</span></td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)' }}>Major burns, compound fractures, acute neurological deficits</td>
                <td style={{ padding: '0.75rem 1rem' }}>&lt; 30 Minutes</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '0.75rem 1rem', color: '#eab308', fontWeight: 800 }}>4 - 6 (Moderate)</td>
                <td style={{ padding: '0.75rem 1rem' }}><span className="badge badge-warning">YELLOW (Delayed)</span></td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)' }}>Closed fractures, controlled lacerations, secondary triage</td>
                <td style={{ padding: '0.75rem 1rem' }}>&lt; 60 Minutes</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '0.75rem 1rem', color: '#10b981', fontWeight: 800 }}>1 - 3 (Minor)</td>
                <td style={{ padding: '0.75rem 1rem' }}><span className="badge badge-success">GREEN (Minor)</span></td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)' }}>Walking wounded, superficial abrasions, supply restocking</td>
                <td style={{ padding: '0.75rem 1rem' }}>&lt; 180 Minutes</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
