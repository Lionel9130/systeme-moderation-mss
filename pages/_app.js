import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Moon, 
  Sun, 
  Clock, 
  LogOut, 
  User, 
  Shield, 
  Eye, 
  Users,
  Plus,
  Edit3,
  Trash2,
  Save,
  X,
  Search,
  Download,
  Upload,
  Home,
  Calendar,
  Settings,
  Database,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  TrendingUp,
  Activity,
  BarChart3
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Configuration Supabase
const supabaseUrl = 'https://lrxwqhqaxgkifkwscifz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxyeHdxaHFheGdraWZrd3NjaWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MjI1MjEsImV4cCI6MjA3MTI5ODUyMX0.FB_xkwCXFtvhJDc7vgCmHiEEV619uEQ5cix3Op0ZJL4';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Système de Modération Professionnel
const ModerationSystemProfessional = () => {
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

  // États de sauvegarde (simulés)
  const [saveStatus, setSaveStatus] = useState('saved');
  const [lastSaveTime, setLastSaveTime] = useState(new Date());
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);

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

  // Sauvegarde automatique simulée
  useEffect(() => {
    if (Object.keys(users).length > 0) {
      const saveTimer = setTimeout(() => {
        setSaveStatus('saved');
        setLastSaveTime(new Date());
      }, 1000);
      
      return () => clearTimeout(saveTimer);
    }
  }, [users, scheduleData, peakData]);

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

  // Fonctions de sauvegarde simulées
  const saveAllData = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('saved');
      setLastSaveTime(new Date());
      alert('Données sauvegardées avec succès !');
    }, 1000);
  };

  const exportData = () => {
    const allData = {
      users,
      scheduleData,
      peakData,
      currentUser,
      darkMode,
      settings: { weekStart, autoSaveEnabled },
      metadata: {
        version: '1.0',
        lastSave: new Date().toISOString(),
        totalUsers: Object.keys(users).length,
        exportType: 'manual'
      }
    };
    
    const dataStr = JSON.stringify(allData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const timestamp = new Date().toISOString().split('T')[0];
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `moderation_export_${timestamp}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    alert('Données exportées avec succès !');
  };

  const resetAllData = () => {
    if (confirm('ATTENTION !\n\nCette action va supprimer TOUTES les données :\n• Tous les utilisateurs (sauf les comptes par défaut)\n• Tout le planning\n• Tous les pics de joueurs\n\nÊtes-vous sûr de vouloir continuer ?')) {
      if (confirm('DERNIÈRE CONFIRMATION\n\nCette action est IRRÉVERSIBLE !\n\nConfirmez-vous la suppression complète ?')) {
        setUsers(initialUsers);
        setScheduleData({});
        setPeakData({});
        setCurrentUser(null);
        setMainView('home');
        alert('Toutes les données ont été réinitialisées.');
      }
    }
  };
  
  const handleLogin = async (e) => {
    if (e) {
      e.preventDefault();
    }
    
    const email = loginForm.email.trim();
    const password = loginForm.password.trim();
    
    if (!email || !password) {
      setLoginError('Veuillez remplir tous les champs');
      return;
    }
    
    try {
      // Authentification avec Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        setLoginError('Email ou mot de passe incorrect');
        return;
      }

      // Récupérer les infos utilisateur depuis la table users
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (userError || !userData) {
        setLoginError('Erreur lors de la récupération des données utilisateur');
        return;
      }

      // Mettre à jour lastLogin
      await supabase
        .from('users')
        .update({ lastLogin: new Date().toISOString() })
        .eq('email', email);

      setCurrentUser({
        ...userData,
        loginTime: new Date().toISOString()
      });
      
      setLoginError('');
      setLoginForm({ email: '', password: '' });
      setMainView('home');
      
    } catch (error) {
      console.error('Erreur de connexion:', error);
      setLoginError('Erreur de connexion au serveur');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setMainView('home');
  };

  // Fonctions de gestion des utilisateurs
  const generateToken = async (role) => {
    const prefix = {
      'admin': 'adm',
      'forma staff': 'frm',
      'moderator': 'mod',
      'trainee': 'tst'
    }[role] || 'usr';
    
    try {
      // Récupérer tous les tokens existants pour ce type de rôle
      const { data, error } = await supabase
        .from('users')
        .select('token')
        .like('token', `${prefix}_%`);

      if (error) {
        console.error('Erreur génération token:', error);
        // Fallback avec timestamp
        return `${prefix}_${Date.now().toString().slice(-3)}`;
      }

      const existingNumbers = data
        .map(user => {
          const parts = user.token.split('_');
          return parseInt(parts[1]);
        })
        .filter(num => !isNaN(num));
      
      const nextNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1;
      return `${prefix}_${nextNumber.toString().padStart(3, '0')}`;
      
    } catch (error) {
      console.error('Erreur réseau token:', error);
      return `${prefix}_${Date.now().toString().slice(-3)}`;
    }
  };

  const createUser = async () => {
    if (!userForm.email || !userForm.password || !userForm.firstName || !userForm.lastName) {
      alert('Tous les champs obligatoires doivent être remplis');
      return;
    }

    try {
      // Vérifier si l'email existe déjà
      const { data: existingUser } = await supabase
        .from('users')
        .select('email')
        .eq('email', userForm.email)
        .single();

      if (existingUser) {
        alert('Cet email existe déjà');
        return;
      }

      // Créer l'utilisateur dans Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userForm.email,
        password: userForm.password
      });

      if (authError) {
        alert('Erreur lors de la création du compte: ' + authError.message);
        return;
      }

      // Créer l'entrée dans la table users
      const { error: dbError } = await supabase
        .from('users')
        .insert({
          email: userForm.email,
          password: userForm.password, // En prod, ne pas stocker le mot de passe en clair
          firstName: userForm.firstName,
          lastName: userForm.lastName,
          role: userForm.role,
          status: userForm.status,
          token: await generateToken(userForm.role),
          createdAt: new Date().toISOString()
        });

      if (dbError) {
        alert('Erreur lors de la création: ' + dbError.message);
        return;
      }

      setUserForm({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        role: 'trainee',
        status: 'active'
      });

      setUserManagementView('list');
      alert('Utilisateur créé avec succès !');
      
      // Recharger la liste des utilisateurs
      await loadUsers();
      
    } catch (error) {
      console.error('Erreur création utilisateur:', error);
      alert('Erreur lors de la création de l\'utilisateur');
    }
  };

  const updateUser = () => {
    if (!editingUser || !userForm.email || !userForm.firstName || !userForm.lastName) {
      alert('Tous les champs obligatoires doivent être remplis');
      return;
    }

    const updatedUsers = { ...users };
    
    if (editingUser !== userForm.email && users[editingUser]) {
      delete updatedUsers[editingUser];
    }

    const oldUser = users[editingUser];
    const newToken = oldUser && oldUser.role === userForm.role 
      ? oldUser.token 
      : generateToken(userForm.role);

    updatedUsers[userForm.email] = {
      ...oldUser,
      ...userForm,
      password: userForm.password || oldUser.password,
      token: newToken,
      updatedAt: new Date().toISOString()
    };

    setUsers(updatedUsers);
    setEditingUser(null);
    setUserManagementView('list');
    setUserForm({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      role: 'trainee',
      status: 'active'
    });

    alert('Utilisateur mis à jour avec succès !');
  };

  // Chargement des utilisateurs depuis Supabase
  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('createdAt', { ascending: false });

      if (error) {
        console.error('Erreur chargement utilisateurs:', error);
        return {};
      }

      // Convertir en format objet pour compatibilité avec le code existant
      const usersObject = {};
      data.forEach(user => {
        usersObject[user.email] = user;
      });

      setUsers(usersObject);
      return usersObject;
    } catch (error) {
      console.error('Erreur réseau:', error);
      return {};
    }
  };

  const deleteUser = async (email) => {
    if (email === currentUser?.email) {
      alert('Vous ne pouvez pas supprimer votre propre compte');
      return;
    }

    if (confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur ${email} ?`)) {
      try {
        const { error } = await supabase
          .from('users')
          .delete()
          .eq('email', email);

        if (error) {
          alert('Erreur lors de la suppression: ' + error.message);
          return;
        }

        alert('Utilisateur supprimé avec succès !');
        
        // Recharger la liste
        await loadUsers();
        
      } catch (error) {
        console.error('Erreur suppression:', error);
        alert('Erreur lors de la suppression');
      }
    }
  };

  const startEditUser = (email) => {
    const user = users[email];
    setUserForm({
      email,
      password: user.password,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      status: user.status
    });
    setEditingUser(email);
    setUserManagementView('edit');
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

  // Chargement des données de planning
  const loadScheduleData = async () => {
    try {
      const { data, error } = await supabase
        .from('schedule_slots')
        .select('*');

      if (error) {
        console.error('Erreur chargement planning:', error);
        return;
      }

      // Convertir en format objet pour compatibilité
      const scheduleObject = {};
      data.forEach(slot => {
        if (!scheduleObject[slot.date_key]) {
          scheduleObject[slot.date_key] = {};
        }
        scheduleObject[slot.date_key][slot.slot_key] = {
          assigned: slot.assigned,
          assignedBy: slot.assigned_by,
          assignedAt: slot.assigned_at,
          role: slot.role
        };
      });

      setScheduleData(scheduleObject);
    } catch (error) {
      console.error('Erreur réseau planning:', error);
    }
  };

  const loadPeakData = async () => {
    try {
      const { data, error } = await supabase
        .from('peak_players')
        .select('*');

      if (error) {
        console.error('Erreur chargement pics:', error);
        return;
      }

      // Convertir en format objet
      const peakObject = {};
      data.forEach(peak => {
        if (!peakObject[peak.date_key]) {
          peakObject[peak.date_key] = {};
        }
        peakObject[peak.date_key][peak.hour] = peak.player_count;
      });

      setPeakData(peakObject);
    } catch (error) {
      console.error('Erreur réseau pics:', error);
    }
  };

  const updatePeakPlayers = async (date, hour, players) => {
    const dateKey = formatDateKey(date);
    const playerCount = parseInt(players) || 0;

    try {
      if (playerCount === 0) {
        // Supprimer l'entrée si 0 joueurs
        await supabase
          .from('peak_players')
          .delete()
          .eq('date_key', dateKey)
          .eq('hour', hour);
      } else {
        // Upsert (insert ou update)
        await supabase
          .from('peak_players')
          .upsert({
            date_key: dateKey,
            hour: hour,
            player_count: playerCount
          });
      }

      // Recharger les données
      await loadPeakData();
      
    } catch (error) {
      console.error('Erreur mise à jour pics:', error);
    }
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

  // Fonctions dashboard
  const getWeekStats = () => {
    const weekDates = getWeekDates(planningDate);
    const totalSlots = weekDates.length * moderationHours.length;
    let coveredSlots = 0;
    let userSlots = 0;
    const dailyStats = {};
    const moderatorStats = {};

    weekDates.forEach((date, dayIndex) => {
      const dateKey = formatDateKey(date);
      const daySlots = scheduleData[dateKey] || {};
      let dayCovered = 0;
      
      moderationHours.forEach(hour => {
        const hourSlots = Object.keys(daySlots).filter(key => 
          key.startsWith(hour) && daySlots[key]?.assigned
        );
        
        if (hourSlots.length > 0) {
          coveredSlots++;
          dayCovered++;
        }
        
        hourSlots.forEach(slotKey => {
          const token = slotKey.split('-')[1];
          if (!moderatorStats[token]) {
            moderatorStats[token] = { slots: 0 };
          }
          moderatorStats[token].slots++;
        });
        
        const userSlot = hourSlots.find(key => key.includes(currentUser?.token));
        if (userSlot) userSlots++;
      });
      
      const dayName = daysOfWeek[dayIndex];
      dailyStats[dayName] = {
        covered: dayCovered,
        total: moderationHours.length,
        coverage: Math.round((dayCovered / moderationHours.length) * 100)
      };
    });

    const topModerator = Object.entries(moderatorStats)
      .sort(([,a], [,b]) => b.slots - a.slots)[0];

    return {
      totalSlots,
      coveredSlots,
      userSlots,
      overallCoverage: Math.round((coveredSlots / totalSlots) * 100),
      dailyStats,
      moderatorStats,
      topModerator
    };
  };

  // Planning - Vue dashboard
  const renderPlanningDashboard = () => {
    const stats = getWeekStats();
    
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold flex items-center justify-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Dashboard - Analyse des besoins
          </h2>
          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-1">
            Semaine du {getPlanningDateTitle()}
          </p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <button
              onClick={() => navigatePlanningDate(-1)}
              className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => navigatePlanningDate(1)}
              className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className={`p-4 rounded-lg ${secondaryTheme} border`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Couverture globale</p>
                <p className="text-2xl font-bold text-purple-600">{stats.overallCoverage}%</p>
              </div>
              <div className={`p-2 rounded-full ${
                stats.overallCoverage >= 80 ? 'bg-green-100 text-green-600' :
                stats.overallCoverage >= 60 ? 'bg-yellow-100 text-yellow-600' :
                'bg-red-100 text-red-600'
              }`}>
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-lg ${secondaryTheme} border`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Créneaux couverts</p>
                <p className="text-2xl font-bold text-blue-600">{stats.coveredSlots}/{stats.totalSlots}</p>
              </div>
              <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                <CheckCircle className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-lg ${secondaryTheme} border`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Vos créneaux</p>
                <p className="text-2xl font-bold text-green-600">{stats.userSlots}</p>
              </div>
              <div className="p-2 rounded-full bg-green-100 text-green-600">
                <User className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-lg ${secondaryTheme} border`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Modérateurs actifs</p>
                <p className="text-2xl font-bold text-orange-600">{Object.keys(stats.moderatorStats).length}</p>
              </div>
              <div className="p-2 rounded-full bg-orange-100 text-orange-600">
                <Users className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {stats.topModerator && (
          <div className={`p-6 rounded-lg ${secondaryTheme} border`}>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-500" />
              Statistiques des Modérateurs
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3 text-green-600 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Modérateur le plus actif cette semaine
                </h4>
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-green-900/20' : 'bg-green-50'} border border-green-200`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-green-700 dark:text-green-300">
                        Token: {stats.topModerator[0]}
                      </div>
                      <div className="text-sm text-green-600 dark:text-green-400">
                        {stats.topModerator[1].slots} créneaux assignés
                      </div>
                    </div>
                    <div className="p-2 bg-green-100 rounded-full">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-3 text-blue-600 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Répartition des créneaux
                </h4>
                <div className="space-y-2">
                  {Object.entries(stats.moderatorStats)
                    .sort(([,a], [,b]) => b.slots - a.slots)
                    .slice(0, 5)
                    .map(([token, data]) => (
                    <div key={token} className="flex items-center justify-between text-sm">
                      <span className="font-mono">{token}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${(data.slots / Math.max(...Object.values(stats.moderatorStats).map(m => m.slots))) * 100}%` }}
                          ></div>
                        </div>
                        <span className="w-8 text-right">{data.slots}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className={`p-6 rounded-lg ${secondaryTheme} border`}>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Couverture par jour
            </h3>
            <div className="space-y-3">
              {Object.entries(stats.dailyStats).map(([day, data]) => (
                <div key={day} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{day}</span>
                  <div className="flex items-center gap-2 flex-1 mx-4">
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          data.coverage >= 80 ? 'bg-green-500' :
                          data.coverage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${data.coverage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium w-12">{data.coverage}%</span>
                  </div>
                  <span className="text-xs text-gray-500">{data.covered}/{data.total}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={`p-6 rounded-lg ${secondaryTheme} border`}>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Créneaux horaires
            </h3>
            <div className="space-y-2">
              {moderationHours.slice(0, 8).map(hour => {
                const weekDates = getWeekDates(planningDate);
                let totalCovered = 0;
                let totalSlots = weekDates.length;
                
                weekDates.forEach(date => {
                  const dateKey = formatDateKey(date);
                  const daySlots = scheduleData[dateKey] || {};
                  const hourSlots = Object.keys(daySlots).filter(key => 
                    key.startsWith(hour) && daySlots[key]?.assigned
                  );
                  if (hourSlots.length > 0) totalCovered++;
                });
                
                const coverage = Math.round((totalCovered / totalSlots) * 100);
                
                return (
                  <div key={hour} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{hour}</span>
                    <div className="flex items-center gap-2 flex-1 mx-4">
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            coverage >= 80 ? 'bg-green-500' :
                            coverage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${coverage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium w-12">{coverage}%</span>
                    </div>
                    {coverage < 50 && (
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Planning - Vue mois
  const renderPlanningMonth = () => {
    const getMonthDates = (date) => {
      const year = date.getFullYear();
      const month = date.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const startDate = new Date(firstDay);
      const endDate = new Date(lastDay);
      
      const startDay = firstDay.getDay();
      const diff = weekStart === 'monday' 
        ? (startDay === 0 ? -6 : 1 - startDay)
        : -startDay;
      startDate.setDate(firstDay.getDate() + diff);
      
      const endDay = lastDay.getDay();
      const endDiff = weekStart === 'monday'
        ? (endDay === 0 ? 0 : 7 - endDay)
        : (6 - endDay);
      endDate.setDate(lastDay.getDate() + endDiff);
      
      const dates = [];
      const currentDate = new Date(startDate);
      
      while (currentDate <= endDate) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      return dates;
    };

    const isCurrentMonth = (date) => {
      return date.getMonth() === planningDate.getMonth() && 
             date.getFullYear() === planningDate.getFullYear();
    };

    return (
      <div>
        <div className="grid grid-cols-7 gap-2 mb-4">
          {daysOfWeek.map((day) => (
            <div key={day} className={`font-semibold text-center py-2 ${secondaryTheme} rounded`}>
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {getMonthDates(planningDate).map((date, index) => {
            const dateKey = formatDateKey(date);
            const daySlots = scheduleData[dateKey] || {};
            const userSlotCount = Object.keys(daySlots).filter(key => 
              key.includes(currentUser?.token) && daySlots[key]?.assigned
            ).length;
            const totalSlotCount = Object.keys(daySlots).filter(key => 
              daySlots[key]?.assigned
            ).length;
            
            return (
              <div
                key={index}
                className={`p-3 rounded border min-h-[120px] ${
                  isCurrentMonth(date)
                    ? (darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300')
                    : (darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-100 border-gray-200')
                } ${
                  isToday(date)
                    ? (darkMode ? 'ring-2 ring-blue-500' : 'ring-2 ring-blue-400')
                    : ''
                } transition-all hover:shadow-md`}
              >
                <div className={`font-semibold mb-2 ${
                  isCurrentMonth(date) 
                    ? (darkMode ? 'text-white' : 'text-gray-900')
                    : (darkMode ? 'text-gray-500' : 'text-gray-400')
                }`}>
                  {date.getDate()}
                </div>
                
                <div className="space-y-1">
                  {userSlotCount > 0 && (
                    <div className={`text-xs px-2 py-1 rounded ${
                      darkMode ? 'bg-green-700 text-green-100' : 'bg-green-100 text-green-800'
                    }`}>
                      {userSlotCount} vos créneaux
                    </div>
                  )}
                  {canViewAll() && totalSlotCount > userSlotCount && (
                    <div className={`text-xs px-2 py-1 rounded ${
                      darkMode ? 'bg-blue-700 text-blue-100' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {totalSlotCount - userSlotCount} autres
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Planning - Vue semaine
  const renderPlanningWeek = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigatePlanningDate(-1)}
          className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <h2 className="text-xl font-semibold">{getPlanningDateTitle()}</h2>
        
        <button
          onClick={() => navigatePlanningDate(1)}
          className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-full">
          <div className="grid grid-cols-8 gap-2 mb-4">
            <div className="font-semibold text-center py-2">Heures</div>
            {getWeekDates(planningDate).map((date, index) => (
              <div
                key={index}
                className={`font-semibold text-center py-2 rounded ${
                  isToday(date)
                    ? (darkMode ? 'bg-blue-700 text-white' : 'bg-blue-100 text-blue-800')
                    : (darkMode ? 'bg-gray-800' : 'bg-gray-100')
                }`}
              >
                <div>{daysOfWeek[index]}</div>
                <div className="text-sm">{date.getDate()}/{date.getMonth() + 1}</div>
              </div>
            ))}
          </div>
          
          {moderationHours.slice(0, 10).map((hour) => (
            <div key={hour} className="grid grid-cols-8 gap-2 mb-2">
              <div className={`text-center py-3 rounded font-medium ${secondaryTheme} border`}>
                {hour}
              </div>
              {getWeekDates(planningDate).map((date, dateIndex) => {
                const dateKey = formatDateKey(date);
                const slotData = scheduleData[dateKey];
                
                const assignedMods = slotData ? Object.keys(slotData).filter(key => 
                  key.startsWith(hour) && slotData[key]?.assigned
                ).map(key => ({
                  token: key.split('-')[1],
                  data: slotData[key],
                  isUser: key.includes(currentUser?.token)
                })) : [];
                
                const hasUserAssignment = assignedMods.some(mod => mod.isUser);
                const modCount = assignedMods.length;
                const peakPlayers = getPeakPlayers(date, hour);
                
                // Calcul du ratio et alertes avec plus de niveaux
                let alertLevel = 'normal';
                if (modCount > 0 && peakPlayers > 0) {
                  const ratio = peakPlayers / modCount;
                  if (ratio > 80) {
                    alertLevel = 'extreme';
                  } else if (ratio > 60) {
                    alertLevel = 'critical';
                  } else if (ratio > 40) {
                    alertLevel = 'overloaded';
                  }
                }
                
                let cellStyle = '';
                let borderStyle = '';
                
                if (alertLevel === 'extreme') {
                  borderStyle = 'border-2 border-red-600 shadow-lg shadow-red-500/50';
                } else if (alertLevel === 'critical') {
                  borderStyle = 'border-2 border-red-500';
                } else if (alertLevel === 'overloaded') {
                  borderStyle = 'border-2 border-orange-500';
                }
                
                if (hasUserAssignment) {
                  cellStyle = darkMode ? 'bg-green-700 border-green-600' : 'bg-green-100 border-green-300';
                } else if (modCount > 0) {
                  cellStyle = darkMode ? 'bg-blue-700 border-blue-600' : 'bg-blue-100 border-blue-300';
                } else {
                  cellStyle = darkMode 
                    ? 'bg-gray-800 border-gray-600 hover:bg-gray-700' 
                    : 'bg-white border-gray-300 hover:bg-gray-50';
                }
                
                return (
                  <div
                    key={dateIndex}
                    className={`p-2 rounded border min-h-[80px] ${cellStyle} ${borderStyle} transition-colors cursor-pointer relative`}
                    onClick={() => toggleModeratorSlot(date, hour)}
                    title={`${modCount}/3 modérateurs${peakPlayers > 0 && modCount > 0 ? ` - Ratio: ${Math.round(peakPlayers/modCount)} joueurs/modo` : ''}`}
                  >
                    {/* Alertes visuelles par niveau */}
                    {alertLevel === 'extreme' && (
                      <div className="absolute -top-1 -right-1 bg-red-700 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                        <AlertTriangle className="w-3 h-3" />
                      </div>
                    )}
                    {alertLevel === 'critical' && (
                      <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                        <AlertCircle className="w-3 h-3" />
                      </div>
                    )}
                    {alertLevel === 'overloaded' && (
                      <div className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                        !
                      </div>
                    )}
                    
                    <div className="text-xs space-y-1">
                      {canManagePeaks() && (
                        <input
                          type="number"
                          min="0"
                          max="150"
                          placeholder="Peak"
                          value={getPeakPlayers(date, hour) || ''}
                          onChange={(e) => {
                            e.stopPropagation();
                            updatePeakPlayers(date, hour, e.target.value);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className={`w-full text-xs p-1 rounded border ${
                            darkMode 
                              ? 'bg-gray-700 border-gray-500 text-white' 
                              : 'bg-white border-gray-300 text-gray-900'
                          }`}
                        />
                      )}
                      
                      <div className="flex justify-between items-center">
                        <div className={`text-xs font-bold px-1 py-0.5 rounded ${
                          modCount === 0 ? 'bg-red-200 text-red-800' :
                          modCount === 1 ? 'bg-yellow-200 text-yellow-800' :
                          modCount === 2 ? 'bg-blue-200 text-blue-800' :
                          'bg-green-200 text-green-800'
                        }`}>
                          {modCount}/3
                        </div>
                        
                        {/* Affichage du ratio avec couleur selon niveau */}
                        {peakPlayers > 0 && modCount > 0 && (
                          <div className={`text-xs font-bold px-1 py-0.5 rounded ${
                            alertLevel === 'extreme' ? 'bg-red-700 text-white' :
                            alertLevel === 'critical' ? 'bg-red-200 text-red-800' :
                            alertLevel === 'overloaded' ? 'bg-orange-200 text-orange-800' :
                            'bg-green-200 text-green-800'
                          }`}>
                            {Math.round(peakPlayers/modCount)}:1
                          </div>
                        )}
                      </div>
                      
                      {/* Messages d'alerte selon le niveau */}
                      {alertLevel === 'extreme' && (
                        <div className="text-xs bg-red-700 text-white px-1 py-0.5 rounded font-bold">
                          CRITIQUE
                        </div>
                      )}
                      {alertLevel === 'critical' && (
                        <div className="text-xs bg-red-600 text-white px-1 py-0.5 rounded font-bold">
                          URGENT
                        </div>
                      )}
                      {alertLevel === 'overloaded' && (
                        <div className="text-xs bg-orange-600 text-white px-1 py-0.5 rounded font-bold">
                          Surcharge
                        </div>
                      )}
                      
                      {assignedMods.map((mod, index) => (
                        <div key={index} className={`px-1 py-0.5 rounded text-xs font-medium ${
                          mod.isUser 
                            ? (darkMode ? 'bg-green-600 text-green-100' : 'bg-green-300 text-green-800')
                            : (darkMode ? 'bg-blue-600 text-blue-100' : 'bg-blue-300 text-blue-800')
                        }`}>
                          {mod.isUser ? 'Vous' : mod.token}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Gestion des utilisateurs - Liste
  const renderUsersList = () => {
    const filteredUsers = Object.entries(users).filter(([email, user]) => {
      const matchesSearch = 
        email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.token && user.token.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesRole = filterRole === 'all' || user.role === filterRole;
      
      return matchesSearch && matchesRole;
    });

    return (
      <div className="space-y-4">
        <div className={`p-4 rounded-lg ${secondaryTheme} border`}>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
            </div>
            
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="all">Tous les rôles</option>
              {roles.map(role => (
                <option key={role.value} value={role.value}>{role.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className={`rounded-lg ${secondaryTheme} border overflow-hidden`}>
          <table className="w-full">
            <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">Utilisateur</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Token</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Rôle</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Statut</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredUsers.map(([email, user]) => {
                const roleInfo = getRoleInfo(user.role);
                const statusInfo = getStatusInfo(user.status);
                
                return (
                  <tr key={email} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-medium">{user.firstName} {user.lastName}</div>
                        <div className="text-sm text-gray-500">{email}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                        {user.token}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <roleInfo.icon className="w-4 h-4 text-blue-500" />
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                          {roleInfo.label}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.status === 'active' ? 'bg-green-100 text-green-800' :
                        user.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                        user.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => startEditUser(email)}
                          className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                          title="Modifier"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteUser(email)}
                          className="p-1 text-red-600 hover:bg-red-100 rounded"
                          title="Supprimer"
                          disabled={email === currentUser?.email}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Gestion des utilisateurs - Formulaire
  const renderUsersForm = () => (
    <div className={`max-w-2xl mx-auto p-6 rounded-lg ${secondaryTheme} border`}>
      <h2 className="text-xl font-semibold mb-6">
        {userManagementView === 'create' ? 'Créer un utilisateur' : 'Modifier l\'utilisateur'}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Email *</label>
          <input
            type="email"
            value={userForm.email}
            onChange={(e) => setUserForm(prev => ({ ...prev, email: e.target.value }))}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
            placeholder="utilisateur@mssclick.planning"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Mot de passe</label>
          <input
            type="password"
            value={userForm.password}
            onChange={(e) => setUserForm(prev => ({ ...prev, password: e.target.value }))}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
            placeholder="Mot de passe"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Prénom *</label>
          <input
            type="text"
            value={userForm.firstName}
            onChange={(e) => setUserForm(prev => ({ ...prev, firstName: e.target.value }))}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
            placeholder="Prénom"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Nom *</label>
          <input
            type="text"
            value={userForm.lastName}
            onChange={(e) => setUserForm(prev => ({ ...prev, lastName: e.target.value }))}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
            placeholder="Nom"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Rôle *</label>
          <select
            value={userForm.role}
            onChange={(e) => setUserForm(prev => ({ ...prev, role: e.target.value }))}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            {roles.map(role => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Statut *</label>
          <select
            value={userForm.status}
            onChange={(e) => setUserForm(prev => ({ ...prev, status: e.target.value }))}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            {statuses.map(status => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-4 mt-8">
        <button
          onClick={userManagementView === 'create' ? createUser : updateUser}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
        >
          <Save className="w-4 h-4" />
          {userManagementView === 'create' ? 'Créer' : 'Sauvegarder'}
        </button>
        
        <button
          onClick={() => {
            setUserManagementView('list');
            setEditingUser(null);
            setUserForm({
              email: '',
              password: '',
              firstName: '',
              lastName: '',
              role: 'trainee',
              status: 'active'
            });
          }}
          className="flex items-center gap-2 px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <X className="w-4 h-4" />
          Annuler
        </button>
      </div>
    </div>
  );

  // Page de gestion de la base de données
  const renderDatabasePage = () => {
    if (!canManageDatabase()) {
      return (
        <div className="space-y-8">
          <div className="text-center">
            <div className="mx-auto w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6">
              <Shield className="w-12 h-12 text-red-500" />
            </div>
            <h1 className="text-4xl font-bold mb-4 text-red-600">Accès Refusé</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
              La gestion de la base de données est réservée aux administrateurs
            </p>
            <button
              onClick={() => setMainView('home')}
              className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <Database className="w-8 h-8" />
            Gestion de la Base de Données
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Interface d'administration - Version simplifiée
          </p>
        </div>

        <div className={`p-6 rounded-lg ${secondaryTheme} border`}>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Database className="w-5 h-5" />
            Statut de la Base de Données
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{Object.keys(users).length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Utilisateurs</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{Object.keys(scheduleData).length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Jours planifiés</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{Object.keys(peakData).length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Jours avec pics</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {lastSaveTime.toLocaleTimeString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Dernière sauvegarde</div>
            </div>
          </div>
          
          <div className="mt-4 flex justify-center">
            {renderSaveStatus()}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`p-6 rounded-lg ${secondaryTheme} border`}>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Download className="w-5 h-5 text-blue-500" />
              Sauvegarder les Données
            </h3>
            
            <div className="space-y-4">
              <button
                onClick={exportData}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Télécharger une sauvegarde complète
              </button>
              
              <button
                onClick={saveAllData}
                className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                Sauvegarde de sécurité
              </button>
            </div>
          </div>

          <div className={`p-6 rounded-lg border-2 border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20`}>
            <h3 className="text-lg font-semibold mb-4 text-red-600 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Zone Dangereuse
            </h3>
            
            <div className="space-y-4">
              <p className="text-sm text-red-600 dark:text-red-400">
                Actions irréversibles - Assurez-vous d'avoir une sauvegarde récente.
              </p>
              
              <button
                onClick={resetAllData}
                className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Réinitialiser toutes les données
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Composant de statut de sauvegarde
  const renderSaveStatus = () => (
    <div className="flex items-center gap-2 text-sm">
      {saveStatus === 'saving' && (
        <>
          <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          <span className="text-blue-600">Sauvegarde...</span>
        </>
      )}
      {saveStatus === 'saved' && (
        <>
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span className="text-green-600">
            Sauvé à {lastSaveTime.toLocaleTimeString()}
          </span>
        </>
      )}
    </div>
  );

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
      
      {/* Overlay pour créer un effet de profondeur */}
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      
      <div className="relative z-10 max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <Clock className="mx-auto h-12 w-12 text-blue-500" />
          <h2 className="mt-6 text-3xl font-bold text-white">Système de Modération</h2>
          <p className="mt-2 text-sm text-gray-300">
            Planning + Gestion des utilisateurs
          </p>
        </div>
        
        <div className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-white">Email</label>
              <input
                type="email"
                value={loginForm.email}
                onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleLogin();
                  }
                }}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-600 text-white' 
                    : 'bg-white/90 border-gray-300 text-gray-900 backdrop-blur-sm'
                }`}
                placeholder="Email"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-white">Mot de passe</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleLogin();
                  }
                }}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-600 text-white' 
                    : 'bg-white/90 border-gray-300 text-gray-900 backdrop-blur-sm'
                }`}
                placeholder="Mot de passe"
                required
              />
            </div>
          </div>

          {loginError && (
            <div className="text-red-400 text-sm text-center bg-red-900/50 p-2 rounded">
              {loginError}
            </div>
          )}

          <button
            onClick={() => handleLogin()}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Se connecter
          </button>
        </div>

        <div className="mt-6">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`w-full p-2 rounded-full transition-colors ${
              darkMode ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-gray-700 hover:bg-gray-800'
            } text-white`}
          >
            {darkMode ? <Sun className="w-5 h-5 mx-auto" /> : <Moon className="w-5 h-5 mx-auto" />}
          </button>
        </div>
      </div>
    </div>
  );

  // Page d'accueil
  const renderHomePage = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
          <Shield className="w-8 h-8 text-blue-500" />
          Système de Modération
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Bienvenue {currentUser?.firstName} {currentUser?.lastName} ({currentUser?.role})
        </p>
      </div>

      <div className={`grid grid-cols-1 gap-8 max-w-6xl mx-auto ${
        canManageDatabase() ? 'md:grid-cols-3' : canManageUsers() ? 'md:grid-cols-2' : 'md:grid-cols-1'
      }`}>
        <div 
          className={`p-8 rounded-lg ${secondaryTheme} border cursor-pointer hover:shadow-lg transition-all transform hover:scale-105`}
          onClick={() => setMainView('planning')}
        >
          <div className="text-center">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-blue-500" />
            <h2 className="text-2xl font-bold mb-4">Planning de Modération</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Gérez les créneaux de modération, visualisez les pics de joueurs et organisez votre équipe.
            </p>
          </div>
        </div>

        {canManageUsers() && (
          <div 
            className={`p-8 rounded-lg ${secondaryTheme} border cursor-pointer hover:shadow-lg transition-all transform hover:scale-105`}
            onClick={() => setMainView('users')}
          >
            <div className="text-center">
              <Users className="w-16 h-16 mx-auto mb-4 text-green-500" />
              <h2 className="text-2xl font-bold mb-4">Gestion des Utilisateurs</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Créez, modifiez et gérez les comptes de votre équipe de modération.
              </p>
            </div>
          </div>
        )}

        {canManageDatabase() && (
          <div 
            className={`p-8 rounded-lg ${secondaryTheme} border cursor-pointer hover:shadow-lg transition-all transform hover:scale-105`}
            onClick={() => setMainView('database')}
          >
            <div className="text-center">
              <Database className="w-16 h-16 mx-auto mb-4 text-orange-500" />
              <h2 className="text-2xl font-bold mb-4">Base de Données</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Sauvegardez, restaurez et gérez toutes vos données de modération.
              </p>
              <div className="mt-4 px-3 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                Accès Administrateur
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
        <div className={`p-4 rounded-lg ${secondaryTheme} border text-center`}>
          <div className="text-2xl font-bold text-blue-600">{Object.keys(users).length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Utilisateurs</div>
        </div>
        
        <div className={`p-4 rounded-lg ${secondaryTheme} border text-center`}>
          <div className="text-2xl font-bold text-green-600">
            {Object.values(users).filter(u => u.status === 'active').length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Utilisateurs Actifs</div>
        </div>
        
        <div className={`p-4 rounded-lg ${secondaryTheme} border text-center`}>
          <div className="text-2xl font-bold text-purple-600">{moderationHours.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Créneaux par Jour</div>
        </div>
        
        <div className={`p-4 rounded-lg ${secondaryTheme} border text-center`}>
          <div className="text-2xl font-bold text-orange-600">7</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Jours par Semaine</div>
        </div>
      </div>
    </div>
  );

  // Si pas connecté, afficher la page de connexion
  if (!currentUser) {
    return renderLoginPage();
  }

  // Interface principale
  return (
    <div className={`min-h-screen ${themeClasses} transition-all duration-300`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              {mainView === 'home' && <Home className="w-6 h-6" />}
              {mainView === 'planning' && <Calendar className="w-6 h-6" />}
              {mainView === 'users' && <Users className="w-6 h-6" />}
              {mainView === 'database' && <Database className="w-6 h-6" />}
              
              {mainView === 'home' && 'Accueil'}
              {mainView === 'planning' && 'Planning de Modération'}
              {mainView === 'users' && 'Gestion des Utilisateurs'}
              {mainView === 'database' && 'Base de Données'}
            </h1>
            
            <div className={`px-3 py-1 rounded-full text-sm ${
              currentUser.role === 'admin' ? 'bg-red-100 text-red-800' :
              currentUser.role === 'forma staff' ? 'bg-purple-100 text-purple-800' :
              currentUser.role === 'moderator' ? 'bg-blue-100 text-blue-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {currentUser.firstName} {currentUser.lastName} - {currentUser.role}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Navigation principale */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMainView('home')}
                className={`px-4 py-2 rounded font-medium transition-colors flex items-center gap-2 ${
                  mainView === 'home'
                    ? (darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white')
                    : (darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300')
                }`}
              >
                <Home className="w-4 h-4" />
                Accueil
              </button>
              
              <button
                onClick={() => setMainView('planning')}
                className={`px-4 py-2 rounded font-medium transition-colors flex items-center gap-2 ${
                  mainView === 'planning'
                    ? (darkMode ? 'bg-green-600 text-white' : 'bg-green-500 text-white')
                    : (darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300')
                }`}
              >
                <Calendar className="w-4 h-4" />
                Planning
              </button>
              
              {canManageUsers() && (
                <button
                  onClick={() => setMainView('users')}
                  className={`px-4 py-2 rounded font-medium transition-colors flex items-center gap-2 ${
                    mainView === 'users'
                      ? (darkMode ? 'bg-purple-600 text-white' : 'bg-purple-500 text-white')
                      : (darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300')
                  }`}
                >
                  <Users className="w-4 h-4" />
                  Utilisateurs
                </button>
              )}
              
              {canManageDatabase() && (
                <button
                  onClick={() => setMainView('database')}
                  className={`px-4 py-2 rounded font-medium transition-colors flex items-center gap-2 ${
                    mainView === 'database'
                      ? (darkMode ? 'bg-orange-600 text-white' : 'bg-orange-500 text-white')
                      : (darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300')
                  }`}
                >
                  <Database className="w-4 h-4" />
                  Base de Données
                </button>
              )}
            </div>

            {/* Navigation planning */}
            {mainView === 'planning' && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPlanningView('dashboard')}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    planningView === 'dashboard'
                      ? (darkMode ? 'bg-purple-600 text-white' : 'bg-purple-500 text-white')
                      : (darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300')
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setPlanningView('week')}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    planningView === 'week'
                      ? (darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white')
                      : (darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300')
                  }`}
                >
                  Semaine
                </button>
                <button
                  onClick={() => setPlanningView('month')}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    planningView === 'month'
                      ? (darkMode ? 'bg-green-600 text-white' : 'bg-green-500 text-white')
                      : (darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300')
                  }`}
                >
                  Mois
                </button>
              </div>
            )}

            {/* Navigation utilisateurs */}
            {mainView === 'users' && canManageUsers() && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setUserManagementView('list')}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    userManagementView === 'list'
                      ? (darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white')
                      : (darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300')
                  }`}
                >
                  Liste
                </button>
                <button
                  onClick={() => {
                    setUserManagementView('create');
                    setUserForm({
                      email: '',
                      password: '',
                      firstName: '',
                      lastName: '',
                      role: 'trainee',
                      status: 'active'
                    });
                    setEditingUser(null);
                  }}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors flex items-center gap-1 ${
                    userManagementView === 'create'
                      ? (darkMode ? 'bg-green-600 text-white' : 'bg-green-500 text-white')
                      : (darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300')
                  }`}
                >
                  <Plus className="w-3 h-3" />
                  Créer
                </button>
              </div>
            )}

            {/* Contrôles généraux */}
            {renderSaveStatus()}
            
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-full transition-colors ${
                darkMode ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-gray-700 hover:bg-gray-800'
              } text-white`}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition-colors flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Déconnexion
            </button>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="max-w-7xl mx-auto">
          {mainView === 'home' && renderHomePage()}
          
          {mainView === 'planning' && (
            <div>
              {planningView === 'dashboard' && renderPlanningDashboard()}
              {planningView === 'week' && renderPlanningWeek()}
              {planningView === 'month' && renderPlanningMonth()}
            </div>
          )}
          
          {mainView === 'users' && canManageUsers() && (
            <div>
              {userManagementView === 'list' && renderUsersList()}
              {(userManagementView === 'create' || userManagementView === 'edit') && renderUsersForm()}
            </div>
          )}
          
          {mainView === 'database' && renderDatabasePage()}
        </div>

        {/* Footer informatif */}
        <div className={`mt-8 p-4 rounded-lg ${secondaryTheme} border`}>
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            Document lié au staff MSS-Click fait par Mosley
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModerationSystemProfessional;
