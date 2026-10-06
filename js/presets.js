/**
 * GoldenHour Router - Preset Scenarios & Test Cases
 * Includes realistic disaster scenarios and a tailored Greedy failure trap.
 */

const PRESET_SCENARIOS = [
  {
    id: 'greedy_trap',
    name: '🚨 The Greedy Trap (Greedy Fails Suboptimally)',
    description: 'A deceptive setup where Greedy prioritizes nearby low-urgency triage points, delaying distant critical ICUs and causing massive cumulative penalty. DP finds the true global minimum.',
    badge: 'Greedy Gap > 20%',
    depot: { x: 200, y: 350, name: 'Central Relief Depot' },
    speed: 120,
    locations: [
      { id: 1, name: 'St. Jude Trauma ICU', x: 700, y: 340, weight: 10, type: 'hospital' },
      { id: 2, name: 'East Clinic A', x: 280, y: 330, weight: 2, type: 'clinic' },
      { id: 3, name: 'East Clinic B', x: 330, y: 310, weight: 2, type: 'clinic' },
      { id: 4, name: 'East Clinic C', x: 380, y: 370, weight: 2, type: 'clinic' },
      { id: 5, name: 'Regional Burn Center', x: 680, y: 460, weight: 9, type: 'hospital' },
      { id: 6, name: 'Suburban Aid Post', x: 440, y: 330, weight: 2, type: 'shelter' }
    ]
  },
  {
    id: 'stepthrough_demo',
    name: '🔍 Small Demo (n = 5 for DP Step-Through)',
    description: 'Clean 5-node setup specifically crafted for video presentation and the DP Bitmask table inspector (2^5 = 32 states).',
    badge: 'Video Ready (n=5)',
    depot: { x: 250, y: 300, name: 'HQ Relief Depot' },
    speed: 100,
    locations: [
      { id: 1, name: 'General Hospital', x: 450, y: 150, weight: 9, type: 'hospital' },
      { id: 2, name: 'North Shelter', x: 600, y: 220, weight: 5, type: 'shelter' },
      { id: 3, name: 'Metro Clinic', x: 650, y: 420, weight: 8, type: 'clinic' },
      { id: 4, name: 'South Aid Post', x: 420, y: 480, weight: 3, type: 'shelter' },
      { id: 5, name: 'Mobile ICU', x: 280, y: 450, weight: 7, type: 'hospital' }
    ]
  },
  {
    id: 'clustered_outbreak',
    name: '🏙️ Dual-Cluster Urban Outbreak (n = 8)',
    description: 'Two separate geographic clusters (Downtown Trauma Sector and Harbor Quarantine). Tests intra-cluster vs inter-cluster dispatch.',
    badge: 'Spatial Clusters',
    depot: { x: 450, y: 300, name: 'Central Logistics Hub' },
    speed: 130,
    locations: [
      { id: 1, name: 'Downtown Hospital', x: 200, y: 180, weight: 10, type: 'hospital' },
      { id: 2, name: 'Civic Shelter A', x: 160, y: 240, weight: 4, type: 'shelter' },
      { id: 3, name: 'Civic Shelter B', x: 240, y: 260, weight: 5, type: 'shelter' },
      { id: 4, name: 'West End Clinic', x: 180, y: 120, weight: 7, type: 'clinic' },
      { id: 5, name: 'Harbor Emergency ICU', x: 720, y: 420, weight: 10, type: 'hospital' },
      { id: 6, name: 'Port Triage Station', x: 780, y: 360, weight: 6, type: 'clinic' },
      { id: 7, name: 'Dockside Evac Point', x: 680, y: 490, weight: 3, type: 'shelter' },
      { id: 8, name: 'Coastal Aid Base', x: 820, y: 460, weight: 4, type: 'shelter' }
    ]
  },
  {
    id: 'critical_corridor',
    name: '⚡ Critical Highway Corridor (n = 7)',
    description: 'A linear transit corridor with urgent intermediate clinics and a massive regional disaster hospital at the frontier.',
    badge: 'Corridor Logistics',
    depot: { x: 120, y: 300, name: 'Highway Depot 0' },
    speed: 150,
    locations: [
      { id: 1, name: 'Mile 10 Outpost', x: 240, y: 280, weight: 2, type: 'clinic' },
      { id: 2, name: 'Mile 25 Triage Camp', x: 360, y: 320, weight: 4, type: 'shelter' },
      { id: 3, name: 'Mile 40 Community Hosp', x: 480, y: 260, weight: 8, type: 'hospital' },
      { id: 4, name: 'Mile 55 Aid Station', x: 600, y: 340, weight: 3, type: 'clinic' },
      { id: 5, name: 'Mile 70 Major Trauma ICU', x: 740, y: 270, weight: 10, type: 'hospital' },
      { id: 6, name: 'Mile 85 Shelter Zone', x: 840, y: 330, weight: 5, type: 'shelter' },
      { id: 7, name: 'Mile 90 Frontier Post', x: 920, y: 290, weight: 6, type: 'shelter' }
    ]
  },
  {
    id: 'mass_casualty',
    name: '🏥 Mass Casualty Field Triage (n = 12)',
    description: 'Dense 12-location disaster simulation with high-variance urgency weights (1 to 10), rigorously comparing DP vs B&B vs Greedy.',
    badge: 'Complex Scale (n=12)',
    depot: { x: 480, y: 280, name: 'Incident Command HQ' },
    speed: 140,
    locations: [
      { id: 1, name: 'University Medical Center', x: 220, y: 150, weight: 10, type: 'hospital' },
      { id: 2, name: 'North Sports Arena Shelter', x: 380, y: 120, weight: 6, type: 'shelter' },
      { id: 3, name: 'Riverside Clinic', x: 680, y: 130, weight: 4, type: 'clinic' },
      { id: 4, name: 'East General Hospital', x: 800, y: 200, weight: 9, type: 'hospital' },
      { id: 5, name: 'Harbor Evac Camp', x: 820, y: 380, weight: 3, type: 'shelter' },
      { id: 6, name: 'Industrial Aid Center', x: 700, y: 470, weight: 7, type: 'clinic' },
      { id: 7, name: 'South Children’s ICU', x: 500, y: 490, weight: 10, type: 'hospital' },
      { id: 8, name: 'Metro South Shelter', x: 320, y: 460, weight: 2, type: 'shelter' },
      { id: 9, name: 'West Valley Clinic', x: 150, y: 380, weight: 5, type: 'clinic' },
      { id: 10, name: 'Central Red Cross Station', x: 350, y: 260, weight: 8, type: 'shelter' },
      { id: 11, name: 'East End Field Hospital', x: 620, y: 270, weight: 9, type: 'hospital' },
      { id: 12, name: 'Transit Center Triage', x: 480, y: 380, weight: 6, type: 'clinic' }
    ]
  }
];

window.PRESET_SCENARIOS = PRESET_SCENARIOS;
