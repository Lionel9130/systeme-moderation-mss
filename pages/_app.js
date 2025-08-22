import React, { useState, useEffect } from 'react';

// Icônes en texte simple pour éviter les dépendances
const ChevronLeft = () => <span>‹</span>;
const ChevronRight = () => <span>›</span>;
const Moon = () => <span>🌙</span>;
const Sun = () => <span>☀️</span>;
const Clock = () => <span>⏰</span>;
const LogOut = () => <span>🚪</span>;
const User = () => <span>👤</span>;
const Shield = () => <span>🛡️</span>;
const Eye = () => <span>👁️</span>;
const Users = () => <span>👥</span>;
const Plus = () => <span>+</span>;
const Edit3 = () => <span>✏️</span>;
const Trash2 = () => <span>🗑️</span>;
const Save = () => <span>💾</span>;
const X = () => <span>×</span>;
const Search = () => <span>🔍</span>;
const Download = () => <span>⬇️</span>;
const Home = () => <span>🏠</span>;
const Calendar = () => <span>📅</span>;
const Settings = () => <span>⚙️</span>;
const Database = () => <span>🗄️</span>;
const CheckCircle = () => <span>✅</span>;
const AlertCircle = () => <span>⚠️</span>;
const AlertTriangle = () => <span>⚠️</span>;
const TrendingUp = () => <span>📈</span>;
const Activity = () => <span>📊</span>;
const BarChart3 = () => <span>📊</span>;

const ModerationSystemComplete = () => {
  // États globaux
  const [mainView, setMainView] = useState('home');
  const [currentUser, setCurrentUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  
  // Utilisateur administrateur par défaut
  const initialUsers = {
    'mosley.admin@mssclick.planning': { 
      password: 'New12345678', 
      role: 'admin', 
      token: 'adm_001',
      firstName: 'Mosley',
      lastName: 'Admin',
      createdAt: '2024-01-01T00:00:00Z',
      lastLogin: new Date().toISOString(),
      status: 'active'
    }
  };

  const [users, setUsers] = useState(initialUsers);
  
  // États du planning
  const [planningDate, setPlanningDate] = useState(new Date());
  const [planningView, setPlanningView] = useState('dashboard');
  const [weekStart, setWeekStart] = useState('monday');
  const [scheduleData, setScheduleData] = useState({});
  const [peakData, setPeakData] = useState({});
  
  // États de la gestion des utilisateurs
  const [userManagementView, setUserManagementView] = useState('list');
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [userForm, setUserForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'trainee',
    status: 'active'
  });
  
  // États de connexion
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');

  // Sauvegarde localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUsers = localStorage.getItem('moderation_users');
      const savedSchedule = localStorage.getItem('moderation_schedule');
      const savedPeaks = localStorage.getItem('moderation_peaks');
      
      if (savedUsers) setUsers(JSON.parse(savedUsers));
      if (savedSchedule) setScheduleData(JSON.parse(savedSchedule));
      if (savedPeaks) setPeakData(JSON.parse(savedPeaks));
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('moderation_users', JSON.stringify(users));
      localStorage.setItem('moderation_schedule', JSON.stringify(scheduleData));
      localStorage.setItem('moderation_peaks', JSON.stringify(peakData));
    }
  }, [users, scheduleData, peakData]);

  // Configuration
  const moderationHours = [
    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
    '20:00', '20:30', '21:00', '21:30', '22:00', '22:30',
    '23:00', '23:30', '00:00', '00:30', '01:00', '01:30', '02:00'
  ];

  const daysOfWeek = weekStart === 'monday' 
    ? ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
    : ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  const roles = [
    { value: 'admin', label: 'Administrateur', icon: Shield, color: 'red' },
    { value: 'forma staff', label: 'Formation Staff', icon: User, color: 'purple' },
    { value: 'moderator', label: 'Modérateur', icon: User, color: 'blue' },
    { value: 'trainee', label: 'Stagiaire', icon: Eye, color: 'yellow' }
  ];

  const statuses = [
    { value: 'active', label: 'Actif', color: 'green' },
    { value: 'inactive', label: 'Inactif', color: 'gray' },
    { value: 'pending', label: 'En attente', color: 'yellow' },
    { value: 'suspended', label: 'Suspendu', color: 'red' }
  ];

  // Vérification des permissions
  const canModifySchedule = () => {
    return currentUser?.role === 'admin' || 
           currentUser?.role === 'forma staff' || 
           currentUser?.role === 'moderator' || 
           currentUser?.role === 'trainee';
  };

  const canManagePeaks = () => {
    return currentUser?.role === 'admin' || currentUser?.role === 'forma staff';
  };

  const canViewAll = () => {
    return currentUser?.role === 'admin' || currentUser?.role === 'forma staff';
  };

  const canManageUsers = () => {
    return currentUser?.role === 'admin' || currentUser?.role === 'forma staff';
  };

  const canManageDatabase = () => {
    return currentUser?.role === 'admin';
  };

  // Helpers UI
  const getRoleInfo = (role) => roles.find(r => r.value === role);
  const getStatusInfo = (status) => statuses.find(s => s.value === status);

  const themeClasses = darkMode 
    ? 'bg-gray-900 text-white' 
    : 'bg-white text-gray-900';

  const secondaryTheme = darkMode 
    ? 'bg-gray-800 border-gray-700' 
    : 'bg-gray-50 border-gray-200';

  const handleLogin = (e) => {
    if (e) {
      e.preventDefault();
    }
    
    const email = loginForm.email.trim();
    const password = loginForm.password.trim();
    
    if (!email || !password) {
      setLoginError('Veuillez remplir tous les champs');
      return;
    }
    
    const user = users[email];
    
    if (user && user.password === password) {
      const userData = {
        email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        token: user.token,
        loginTime: new Date().toISOString()
      };
      
      setCurrentUser(userData);
      setLoginError('');
      setLoginForm({ email: '', password: '' });
      setMainView('home');
    } else {
      setLoginError('Email ou mot de passe incorrect');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setMainView('home');
  };

  // Fonctions du planning
  const formatDateKey = (date) => {
    return date.toISOString().split('T')[0];
  };

  const getWeekDates = (date) => {
    const week = [];
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = weekStart === 'monday' 
      ? (day === 0 ? -6 : 1 - day)
      : -day;
    
    startOfWeek.setDate(startOfWeek.getDate() + diff);
    
    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(startOfWeek);
      currentDay.setDate(startOfWeek.getDate() + i);
      week.push(currentDay);
    }
    return week;
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const updatePeakPlayers = (date, hour, players) => {
    const dateKey = formatDateKey(date);
    setPeakData(prev => ({
      ...prev,
      [dateKey]: {
        ...prev[dateKey],
        [hour]: parseInt(players) || 0
      }
    }));
  };

  const getPeakPlayers = (date, hour) => {
    const dateKey = formatDateKey(date);
    return peakData[dateKey]?.[hour] || 0;
  };

  const toggleModeratorSlot = (date, hour) => {
    if (!canModifySchedule()) {
      alert('Vous n\'avez pas les permissions pour modifier le planning');
      return;
    }

    const dateKey = formatDateKey(date);
    const daySlots = scheduleData[dateKey] || {};
    const userSlotKey = `${hour}-${currentUser.token}`;
    
    const assignedMods = Object.keys(daySlots).filter(key => 
      key.startsWith(hour) && daySlots[key]?.assigned
    );
    const currentModCount = assignedMods.length;
    const isUserAssigned = daySlots[userSlotKey]?.assigned;
    
    if (isUserAssigned) {
      setScheduleData(prev => ({
        ...prev,
        [dateKey]: {
          ...prev[dateKey],
          [userSlotKey]: null
        }
      }));
      return;
    }
    
    if (currentModCount >= 3) {
      alert('Créneau complet ! Maximum 3 modérateurs par créneau.');
      return;
    }
    
    setScheduleData(prev => ({
      ...prev,
      [dateKey]: {
        ...prev[dateKey],
        [userSlotKey]: {
          assigned: true,
          assignedBy: currentUser.email,
          assignedAt: new Date().toISOString(),
          role: currentUser.role
        }
      }
    }));
  };

  const navigatePlanningDate = (direction) => {
    const newDate = new Date(planningDate);
    if (planningView === 'week') {
      newDate.setDate(planningDate.getDate() + (direction * 7));
    } else {
      newDate.setMonth(planningDate.getMonth() + direction);
    }
    setPlanningDate(newDate);
  };

  const getPlanningDateTitle = () => {
    if (planningView === 'week') {
      const weekDates = getWeekDates(planningDate);
      const start = weekDates[0];
      const end = weekDates[6];
      return `${start.getDate()}/${start.getMonth() + 1} - ${end.getDate()}/${end.getMonth() + 1}/${end.getFullYear()}`;
    } else {
      return planningDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
    }
  };

  // Page de connexion
  const renderLoginPage = () => (
    <div className="min-h-screen flex items-center justify-center text-white" 
         style={{
           background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 25%, #1e3c72 50%, #0f2027 75%, #203a43 100%)',
           backgroundSize: '400% 400%',
           animation: 'gradientShift 8s ease infinite'
         }}>
      <style jsx>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
      
      <div className="abs
