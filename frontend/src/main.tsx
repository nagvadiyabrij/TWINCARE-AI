import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { Activity, AlertTriangle, BellRing, BrainCircuit, ChevronRight, ClipboardList, FileText, HeartPulse, LayoutDashboard, Search, Settings, Sparkles, Users, Watch } from 'lucide-react';
import { Area, AreaChart, Bar, BarChart, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import './styles.css';

type Role = 'ADMIN' | 'DOCTOR' | 'RESEARCHER' | 'VIEWER';

type Session = { email: string; name: string; role: Role };

type PatientRecord = {
  id: string;
  name: string;
  age: number;
  gender: string;
  diagnosis: string;
  risk: 'Low' | 'Moderate' | 'High';
  prediction: string;
  lastSync: string;
};

const patientData: PatientRecord[] = [
  { id: 'TC1024', name: 'Maya Rao', age: 54, gender: 'Female', diagnosis: 'Type 2 Diabetes', risk: 'Moderate', prediction: 'Elevated glucose risk', lastSync: '2 min ago' },
  { id: 'TC1091', name: 'Arjun Mehta', age: 61, gender: 'Male', diagnosis: 'Hypertension', risk: 'High', prediction: 'Cardiovascular strain', lastSync: '5 min ago' },
  { id: 'TC1117', name: 'Leela Nair', age: 43, gender: 'Female', diagnosis: 'Prediabetes', risk: 'Low', prediction: 'Stable trend', lastSync: '8 min ago' },
  { id: 'TC1073', name: 'Kabir Singh', age: 68, gender: 'Male', diagnosis: 'Cardiac follow-up', risk: 'High', prediction: 'HRV anomaly', lastSync: '11 min ago' },
];

const alerts = [
  { patient: 'Maya Rao', type: 'Glucose Spike', severity: 'Warning', message: 'Elevated glucose risk detected', time: '2 min ago' },
  { patient: 'Arjun Mehta', type: 'Heart Rate', severity: 'Critical', message: 'Abnormal heart-rate pattern', time: '5 min ago' },
  { patient: 'Leela Nair', type: 'Sleep', severity: 'Warning', message: 'Reduced sleep quality', time: '8 min ago' },
];

const pieData = [
  { name: 'Low Risk', value: 18, color: '#10B981' },
  { name: 'Moderate Risk', value: 8, color: '#F59E0B' },
  { name: 'High Risk', value: 4, color: '#EF4444' },
];

const trendData = [
  { name: 'Mon', value: 51 },
  { name: 'Tue', value: 58 },
  { name: 'Wed', value: 62 },
  { name: 'Thu', value: 69 },
  { name: 'Fri', value: 72 },
  { name: 'Sat', value: 65 },
  { name: 'Sun', value: 77 },
];

const demoUsers: Session[] = [
  { email: 'admin@twincare.ai', name: 'System Admin', role: 'ADMIN' },
  { email: 'doctor@twincare.ai', name: 'Dr. Sharma', role: 'DOCTOR' },
  { email: 'researcher@twincare.ai', name: 'Research Reviewer', role: 'RESEARCHER' },
  { email: 'viewer@twincare.ai', name: 'Clinical Viewer', role: 'VIEWER' },
];

function getRiskClass(risk: string) {
  if (risk === 'High') return 'risk-high';
  if (risk === 'Moderate') return 'risk-moderate';
  return 'risk-low';
}

function MetricCard({ icon: Icon, label, value, trend }: { icon: any; label: string; value: string; trend: string }) {
  return (
    <div className="metric-card">
      <div className="metric-icon"><Icon size={18} /></div>
      <div>
        <div className="metric-label">{label}</div>
        <div className="metric-value">{value}</div>
        <div className="metric-trend">↑ {trend}</div>
      </div>
    </div>
  );
}

function DoctorDashboard() {
  const [page, setPage] = useState('Dashboard');
  const [selectedPatient, setSelectedPatient] = useState(patientData[0]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const navItems = ['Dashboard', 'Patients', 'Digital Twins', 'Live Monitoring', 'AI Predictions', 'Alerts', 'Reports', 'Settings'];

  const renderContent = () => {
    if (page === 'Patients') {
      return (
        <div className="card">
          <div className="card-header">
            <h3>Patient Management</h3>
            <button className="pill-button">Search patients</button>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Patient</th><th>ID</th><th>Diagnosis</th><th>Risk</th><th>Prediction</th><th>Last Sync</th><th>Action</th></tr>
              </thead>
              <tbody>
                {patientData.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.id}</td>
                    <td>{p.diagnosis}</td>
                    <td><span className={`badge ${getRiskClass(p.risk)}`}>{p.risk}</span></td>
                    <td>{p.prediction}</td>
                    <td>{p.lastSync}</td>
                    <td><button className="table-button" onClick={() => setSelectedPatient(p)}>Open</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    if (page === 'Digital Twins') {
      return (
        <div className="digital-twin-grid">
          <div className="card twin-panel">
            <div className="card-header">
              <h3>Digital Twin — {selectedPatient.id}</h3>
              <span className="badge risk-moderate">Moderate</span>
            </div>
            <div className="digital-human">
              <div className="body-core">
                <button className="organ brain">Brain</button>
                <button className="organ heart">Heart</button>
                <button className="organ lung">Lungs</button>
                <button className="organ liver">Liver</button>
                <button className="organ pancreas">Pancreas</button>
              </div>
            </div>
            <div className="data-fusion-box">
              <div>EHR Data</div>
              <div>Wearable / IoT</div>
              <div>AI / ML</div>
              <div>Digital Twin</div>
            </div>
          </div>
          <div className="card detail-panel">
            <h3>Selected region</h3>
            <div className="stat-big">78 bpm</div>
            <p>Heart rate • HRV 42 ms • resting rhythm is stable with mild afternoon elevation.</p>
            <ResponsiveContainer width="100%" height={120}>
              <LineChart data={trendData}><Line type="monotone" dataKey="value" stroke="#2563EB" strokeWidth={2} dot={false} /></LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      );
    }

    if (page === 'Live Monitoring') {
      return (
        <div className="card">
          <div className="card-header"><h3>Live Monitoring</h3><span className="status-dot">Synthetic stream</span></div>
          <div className="metrics-row-mini">
            <div className="mini-stat"><span>Heart Rate</span><strong>78 bpm</strong></div>
            <div className="mini-stat"><span>HRV</span><strong>42 ms</strong></div>
            <div className="mini-stat"><span>Glucose</span><strong>142 mg/dL</strong></div>
            <div className="mini-stat"><span>SpO₂</span><strong>98%</strong></div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trendData}><XAxis dataKey="name" /><Tooltip /><Line type="monotone" dataKey="value" stroke="#0EA5E9" strokeWidth={3} /></LineChart>
          </ResponsiveContainer>
        </div>
      );
    }

    if (page === 'AI Predictions') {
      return (
        <div className="card">
          <div className="card-header"><h3>Predictive Health Intelligence</h3><button className="pill-button">Run model</button></div>
          <div className="prediction-box">
            <div>
              <div className="kicker">Glucose Spike Risk</div>
              <h2>Elevated</h2>
              <p>Potential glucose increase within next 2 hours.</p>
              <div className="confidence-row"><strong>87%</strong><span>model confidence</span></div>
            </div>
            <div className="forecast-stack">
              <span>Current</span><span>30 min</span><span>1 hr</span><span>2 hr</span>
              <div className="forecast-values"><b>142</b><b>149</b><b>158</b><b>166</b></div>
            </div>
          </div>
        </div>
      );
    }

    if (page === 'Alerts') {
      return (
        <div className="card">
          <div className="card-header"><h3>Alert Management</h3><button className="pill-button">New alert</button></div>
          <div className="alert-list">
            {alerts.map((alert) => (
              <div className="alert-item" key={`${alert.patient}-${alert.time}`}>
                <div><strong>{alert.patient}</strong><div>{alert.type}</div></div>
                <div className={`badge ${alert.severity === 'Critical' ? 'risk-high' : 'risk-moderate'}`}>{alert.severity}</div>
                <div>{alert.message}</div>
                <div>{alert.time}</div>
                <button className="table-button">View</button>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (page === 'Reports') {
      return (
        <div className="card">
          <div className="card-header"><h3>Reports</h3><button className="pill-button">Generate Report</button></div>
          <div className="report-grid">
            <div className="report-box"><h4>Patient Summary</h4><p>Maya Rao · Type 2 Diabetes · overall risk score 62/100</p></div>
            <div className="report-box"><h4>Digital Twin</h4><p>Active / Synced / Model v2.4</p></div>
            <div className="report-box"><h4>AI Insights</h4><p>Elevated glucose risk for next 2 hours</p></div>
            <div className="report-box"><h4>Model Confidence</h4><p>87% / research prototype</p></div>
          </div>
        </div>
      );
    }

    if (page === 'Settings') {
      return (
        <div className="card">
          <div className="card-header"><h3>System Settings</h3><button className="pill-button">Save</button></div>
          <div className="setting-grid">
            <div className="setting-box"><span>Alert threshold</span><strong>Moderate</strong></div>
            <div className="setting-box"><span>EHR sync</span><strong>Enabled</strong></div>
            <div className="setting-box"><span>Model version</span><strong>v2.4</strong></div>
            <div className="setting-box"><span>Audit log</span><strong>Enabled</strong></div>
          </div>
        </div>
      );
    }

    return (
      <div className="dashboard-grid">
        <div className="card wide">
          <div className="card-header"><h3>Patient Risk Overview</h3><button className="pill-button" onClick={() => setPage('Patients')}>Open patient list</button></div>
          <div className="risk-layout">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} dataKey="value" innerRadius={58} outerRadius={82} paddingAngle={4}>
                  {pieData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="risk-legend">
              {pieData.map((item) => <div key={item.name}><span style={{ background: item.color }} />{item.name}<strong>{item.value}</strong></div>)}
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-header"><h3>Recent Alerts</h3><button className="pill-button" onClick={() => setPage('Alerts')}>View all</button></div>
          <div className="alert-stack">
            {alerts.map((a) => <div className="mini-alert" key={a.patient}><strong>{a.patient}</strong><span>{a.message}</span><small>{a.time}</small></div>)}
          </div>
        </div>
        <div className="card wide">
          <div className="card-header"><h3>Prediction Activity</h3></div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={trendData}><Bar dataKey="value" radius={[8, 8, 0, 0]} fill="#2563EB" /></BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-row">
          <div className="brand-mark">T</div>
          <div>
            <strong>TwinCare AI</strong>
            <small>Clinical Portal</small>
          </div>
        </div>
        <nav>
          {navItems.map((item) => (
            <button key={item} className={page === item ? 'nav-item active' : 'nav-item'} onClick={() => setPage(item)}>
              <span>{item}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button className="nav-item"><span>Doctor Profile</span></button>
        </div>
      </aside>
      <div className="main-area">
        <header className="topbar">
          <div className="crumbs">Clinical Workspace / {page}</div>
          <div className="top-actions">
            <button className="ghost-button"><Search size={15} /> Search</button>
            <button className="icon-button" onClick={() => setNotificationsOpen((prev) => !prev)}><BellRing size={18} /></button>
            {notificationsOpen && (
              <div className="notification-panel">
                <h4>Notifications</h4>
                <div>New AI prediction generated</div>
                <div>Wearable data synchronized</div>
                <div>Patient risk changed</div>
              </div>
            )}
          </div>
        </header>
        <div className="page-header">
          <div className="eyebrow">TWINCARE / CLINICAL WORKSPACE</div>
          <h1>Good morning, Dr. Sharma</h1>
          <p>Monitor your patients and review AI-powered health predictions.</p>
        </div>
        <div className="metrics-row">
          <MetricCard icon={Users} label="Total Patients" value="128" trend="12%" />
          <MetricCard icon={BrainCircuit} label="Active Twins" value="84" trend="8%" />
          <MetricCard icon={AlertTriangle} label="High Risk" value="12" trend="3 new" />
          <MetricCard icon={Sparkles} label="Predictions" value="246" trend="18%" />
        </div>
        {renderContent()}
      </div>
    </div>
  );
}

function AdminDashboard() {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="brand-row">
          <div className="brand-mark secondary">T</div>
          <div>
            <strong>TwinCare AI</strong>
            <small>Admin Console</small>
          </div>
        </div>
        <nav>
          {['Dashboard', 'Users', 'Doctors', 'Patients', 'Digital Twins', 'AI Models', 'Alerts', 'Reports', 'Audit Logs', 'System Settings'].map((item) => (
            <button key={item} className="admin-nav-item">{item}</button>
          ))}
        </nav>
      </aside>
      <div className="admin-main">
        <header className="admin-topbar">
          <h2>Enterprise Administration</h2>
          <button className="primary-button">System Health: Stable</button>
        </header>
        <div className="admin-kpis">
          <div className="admin-kpi"><div>Total Users</div><strong>24</strong></div>
          <div className="admin-kpi"><div>Total Doctors</div><strong>8</strong></div>
          <div className="admin-kpi"><div>Active Digital Twins</div><strong>84</strong></div>
          <div className="admin-kpi"><div>High-Risk Patients</div><strong>12</strong></div>
          <div className="admin-kpi"><div>Predictions Generated</div><strong>246</strong></div>
          <div className="admin-kpi"><div>Active Alerts</div><strong>18</strong></div>
        </div>
        <div className="admin-grid">
          <div className="card">
            <div className="card-header"><h3>Patient Growth</h3></div>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={trendData}><defs><linearGradient id="adminArea" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#2563EB" stopOpacity={0.9} /><stop offset="100%" stopColor="#2563EB" stopOpacity={0.15} /></linearGradient></defs><Area dataKey="value" stroke="#2563EB" fill="url(#adminArea)" /></AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="card">
            <div className="card-header"><h3>Risk Distribution</h3></div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={pieData}><Bar dataKey="value" fill="#7C3AED" radius={[8, 8, 0, 0]} /></BarChart>
            </ResponsiveContainer>
          </div>
          <div className="card wide">
            <div className="card-header"><h3>User Activity</h3></div>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={trendData}><Line dataKey="value" stroke="#10B981" strokeWidth={3} /></LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('doctor@twincare.ai');
  const [password, setPassword] = useState('Demo@123');
  const [error, setError] = useState('');

  const handleLogin = () => {
    const isAdmin = email.toLowerCase() === 'admin@twincare.ai' && password === 'Admin@123';
    const isDoctor = email.toLowerCase() === 'doctor@twincare.ai' && password === 'Demo@123';

    if (!isAdmin && !isDoctor) {
      setError('Use admin@twincare.ai / Admin@123 or doctor@twincare.ai / Demo@123');
      return;
    }

    const session: Session = {
      email: email.toLowerCase(),
      name: isAdmin ? 'System Admin' : 'Dr. Sharma',
      role: isAdmin ? 'ADMIN' : 'DOCTOR',
    };

    localStorage.setItem('twincare-session', JSON.stringify(session));
    navigate(isAdmin ? '/admin' : '/dashboard');
  };

  return (
    <div className="login-shell">
      <div className="login-card">
        <div className="login-brand">
          <div className="brand-mark">T</div>
          <div>
            <strong>TwinCare AI</strong>
            <span>Clinical Intelligence Platform</span>
          </div>
        </div>
        <h1>Welcome back</h1>
        <p>Secure digital twin access for predictive care.</p>

        <div className="field-group">
          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="field-group">
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        {error && <div className="error-box">{error}</div>}

        <button className="primary-button full" onClick={handleLogin}>Sign In</button>

        <div className="demo-row"><span>Admin</span><span>admin@twincare.ai / Admin@123</span></div>
        <div className="demo-row"><span>Doctor</span><span>doctor@twincare.ai / Demo@123</span></div>
      </div>

      <div className="login-visual">
        <div className="orb" />
        <div className="visual-box">
          <div className="mini-pulse" />
          <div className="mini-pulse" />
          <div className="mini-pulse" />
          <div className="visual-data-card">
            <span>Digital Twin</span>
            <strong>Synced</strong>
            <small>Patient risk model active</small>
          </div>
        </div>
      </div>
    </div>
  );
}

function AppRouter() {
  const [session, setSession] = useState<Session | null>(() => {
    try {
      const raw = localStorage.getItem('twincare-session');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (session) {
      localStorage.setItem('twincare-session', JSON.stringify(session));
    } else {
      localStorage.removeItem('twincare-session');
    }
  }, [session]);

  const logout = () => setSession(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={session ? (session.role === 'ADMIN' ? <Navigate to="/admin" replace /> : <Navigate to="/dashboard" replace />) : <LoginPage />} />
        <Route path="/dashboard" element={session ? <DoctorDashboard /> : <Navigate to="/" replace />} />
        <Route path="/admin" element={session?.role === 'ADMIN' ? <AdminDashboard /> : <Navigate to="/" replace />} />
      </Routes>
      {session && <button className="logout-button" onClick={logout}>Logout</button>}
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')!).render(<AppRouter />);
