@@ .. @@
 import React, { useState, useEffect } from 'react';
+import { supabase, dbOperations } from '../lib/supabase';
 import { 
   ChevronLeft, 
@@ .. @@
   const [currentUser, setCurrentUser] = useState(null);
   const [darkMode, setDarkMode] = useState(false);
+  const [isLoading, setIsLoading] = useState(true);
+  const [syncStatus, setSyncStatus] = useState('synced');
   
-  // Utilisateur administrateur par défaut
-  const initialUsers = {
-    'mosley.admin@mssclick.planning': { 
-      password: 'New12345678', 
-      role: 'admin', 
-      token: 'adm_001',
-      firstName: 'Mosley',
-      lastName: 'Admin',
-      createdAt: '2024-01-01T00:00:00Z',
-      lastLogin: new Date().toISOString(),
-      status: 'active'
-    }
-  };
-
-  const [users, setUsers] = useState(initialUsers);
+  const [users, setUsers] = useState({});
   
   // États du planning
@@ .. @@
   const [loginError, setLoginError] = useState('');

-  // États de sauvegarde
-  const [saveStatus, setSaveStatus] = useState('saved');
-  const [lastSaveTime, setLastSaveTime] = useState(new Date());
+  // Chargement initial des données
+  useEffect(() => {
+    loadAllData();
+  }, []);
+
+  const loadAllData = async () => {
+    try {
+      setIsLoading(true);
+      setSyncStatus('syncing');
+      
+      // Charger toutes les données en parallèle
+      const [usersData, scheduleData, peakData, settingsData] = await Promise.all([
+        dbOperations.getUsers(),
+        dbOperations.getScheduleData(),
+        dbOperations.getPeakData(),
+        dbOperations.getSettings()
+      ]);
+      
+      setUsers(usersData);
+      setScheduleData(scheduleData);
+      setPeakData(peakData);
+      
+      // Appliquer les paramètres
+      if (settingsData.week_start) {
+        setWeekStart(settingsData.week_start);
+      }
+      
+      setSyncStatus('synced');
+    } catch (error) {
+      console.error('Erreur lors du chargement des données:', error);
+      setSyncStatus('error');
+      alert('Erreur lors du chargement des données. Vérifiez votre connexion.');
+    } finally {
+      setIsLoading(false);
+    }
+  };

   // Configuration
@@ .. @@
   const statuses = [
     { value: 'active', label: 'Actif', color: 'green' },
     { value: 'inactive', label: 'Inactif', color: 'gray' },
     { value: 'pending', label: 'En attente', color: 'yellow' },
     { value: 'suspended', label: 'Suspendu', color: 'red' }
   ];

-  // Sauvegarde automatique simulée
-  useEffect(() => {
-    const saveTimer = setTimeout(() => {
-      setSaveStatus('saved');
-      setLastSaveTime(new Date());
-    }, 1000);
-    
-    return () => clearTimeout(saveTimer);
-  }, [users, scheduleData, peakData]);
-
   // Vérification des permissions
@@ .. @@
   const exportData = () => {
     const allData = {
       users,
       scheduleData,
       peakData,
       currentUser,
       darkMode,
       settings: { weekStart },
       metadata: {
         version: '1.0',
-        lastSave: new Date().toISOString(),
+        exportDate: new Date().toISOString(),
         totalUsers: Object.keys(users).length,
         exportType: 'manual'
       }
@@ .. @@
     alert('Données exportées avec succès !');
   };

-  const importData = (event) => {
+  const importData = async (event) => {
     const file = event.target.files[0];
     if (!file) return;

     const reader = new FileReader();
-    reader.onload = (e) => {
+    reader.onload = async (e) => {
       try {
-        setSaveStatus('saving');
+        setSyncStatus('syncing');
         const data = JSON.parse(e.target.result);
         
         if (data.users && data.metadata) {
-          setUsers(data.users || {});
-          setScheduleData(data.scheduleData || {});
-          setPeakData(data.peakData || {});
+          // Importer les utilisateurs
+          for (const [email, userData] of Object.entries(data.users)) {
+            try {
+              await dbOperations.createUser(userData);
+            } catch (error) {
+              // Si l'utilisateur existe déjà, le mettre à jour
+              await dbOperations.updateUser(email, userData);
+            }
+          }
+          
+          // Recharger toutes les données
+          await loadAllData();
           
-          if (data.settings) {
-            setWeekStart(data.settings.weekStart || 'monday');
+          if (data.settings?.weekStart) {
+            await dbOperations.updateSetting('week_start', data.settings.weekStart);
           }
           
           if (data.darkMode !== undefined) {
             setDarkMode(data.darkMode);
           }
           
-          setSaveStatus('saved');
-          setLastSaveTime(new Date());
-          alert(`Données chargées avec succès !\n\n${Object.keys(data.users).length} utilisateurs importés\nDonnées du planning restaurées\nSauvegarde du ${new Date(data.metadata.lastSave).toLocaleString()}`);
+          setSyncStatus('synced');
+          alert(`Données importées avec succès !\n\n${Object.keys(data.users).length} utilisateurs importés\nDonnées du planning restaurées`);
         } else {
           throw new Error('Format de fichier invalide');
         }
       } catch (error) {
         console.error('Erreur lors du chargement:', error);
-        setSaveStatus('error');
+        setSyncStatus('error');
         alert('Erreur lors du chargement du fichier.\nVérifiez que c\'est bien un fichier de sauvegarde valide.');
       }
     };
@@ .. @@
     event.target.value = '';
   };

-  const resetAllData = () => {
+  const resetAllData = async () => {
     if (confirm('ATTENTION !\n\nCette action va supprimer TOUTES les données :\n• Tous les utilisateurs (sauf les comptes par défaut)\n• Tout le planning\n• Tous les pics de joueurs\n\nÊtes-vous sûr de vouloir continuer ?')) {
       if (confirm('DERNIÈRE CONFIRMATION\n\nCette action est IRRÉVERSIBLE !\n\nConfirmez-vous la suppression complète ?')) {
-        setUsers(initialUsers);
-        setScheduleData({});
-        setPeakData({});
-        setCurrentUser(null);
-        setMainView('home');
-        alert('Toutes les données ont été réinitialisées.');
+        try {
+          setSyncStatus('syncing');
+          
+          // Supprimer toutes les données de la base
+          await supabase.from('schedule_slots').delete().neq('id', '00000000-0000-0000-0000-000000000000');
+          await supabase.from('peak_players').delete().neq('id', '00000000-0000-0000-0000-000000000000');
+          await supabase.from('users').delete().neq('email', 'mosley.admin@mssclick.planning');
+          
+          // Recharger les données
+          await loadAllData();
+          
+          setCurrentUser(null);
+          setMainView('home');
+          setSyncStatus('synced');
+          alert('Toutes les données ont été réinitialisées.');
+        } catch (error) {
+          console.error('Erreur lors de la réinitialisation:', error);
+          setSyncStatus('error');
+          alert('Erreur lors de la réinitialisation des données.');
+        }
       }
     }
   };
@@ .. @@
     const user = users[email];
     
     if (user && user.password === password) {
+      // Mettre à jour la dernière connexion
+      try {
+        await dbOperations.updateUser(email, {
+          ...user,
+          last_login: new Date().toISOString()
+        });
+      } catch (error) {
+        console.error('Erreur lors de la mise à jour de la dernière connexion:', error);
+      }
+      
       const userData = {
         email,
         role: user.role,
-        firstName: user.firstName,
-        lastName: user.lastName,
+        firstName: user.first_name,
+        lastName: user.last_name,
         token: user.token,
         loginTime: new Date().toISOString()
       };
@@ .. @@
     return `${prefix}_${nextNumber.toString().padStart(3, '0')}`;
   };

-  const createUser = () => {
+  const createUser = async () => {
     if (!userForm.email || !userForm.password || !userForm.firstName || !userForm.lastName) {
       alert('Tous les champs obligatoires doivent être remplis');
       return;
     }

     if (users[userForm.email]) {
       alert('Cet email existe déjà');
       return;
     }

+    try {
+      setSyncStatus('syncing');
+      
       const newUser = {
-        ...userForm,
+        email: userForm.email,
+        password: userForm.password,
+        first_name: userForm.firstName,
+        last_name: userForm.lastName,
+        role: userForm.role,
+        status: userForm.status,
         token: generateToken(userForm.role),
-        createdAt: new Date().toISOString(),
-        lastLogin: null
+        created_at: new Date().toISOString(),
+        last_login: null
       };

-      setUsers(prev => ({
-        ...prev,
-        [userForm.email]: newUser
-      }));
+      await dbOperations.createUser(newUser);
+      
+      // Recharger les utilisateurs
+      const updatedUsers = await dbOperations.getUsers();
+      setUsers(updatedUsers);

       setUserForm({
         email: '',
         password: '',
         firstName: '',
         lastName: '',
         role: 'trainee',
         status: 'active'
       });

       setUserManagementView('list');
+      setSyncStatus('synced');
       alert('Utilisateur créé avec succès !');
+    } catch (error) {
+      console.error('Erreur lors de la création de l\'utilisateur:', error);
+      setSyncStatus('error');
+      alert('Erreur lors de la création de l\'utilisateur.');
+    }
   };

-  const updateUser = () => {
+  const updateUser = async () => {
     if (!editingUser || !userForm.email || !userForm.firstName || !userForm.lastName) {
       alert('Tous les champs obligatoires doivent être remplis');
       return;
     }

-    const updatedUsers = { ...users };
-    
-    if (editingUser !== userForm.email && users[editingUser]) {
-      delete updatedUsers[editingUser];
-    }
+    try {
+      setSyncStatus('syncing');
+      
+      const oldUser = users[editingUser];
+      const newToken = oldUser && oldUser.role === userForm.role 
+        ? oldUser.token 
+        : generateToken(userForm.role);

-    const oldUser = users[editingUser];
-    const newToken = oldUser && oldUser.role === userForm.role 
-      ? oldUser.token 
-      : generateToken(userForm.role);
+      const updatedUserData = {
+        email: userForm.email,
+        password: userForm.password || oldUser.password,
+        first_name: userForm.firstName,
+        last_name: userForm.lastName,
+        role: userForm.role,
+        status: userForm.status,
+        token: newToken,
+        updated_at: new Date().toISOString()
+      };

-    updatedUsers[userForm.email] = {
-      ...oldUser,
-      ...userForm,
-      password: userForm.password || oldUser.password,
-      token: newToken,
-      updatedAt: new Date().toISOString()
-    };
+      // Si l'email a changé, supprimer l'ancien et créer le nouveau
+      if (editingUser !== userForm.email) {
+        await dbOperations.deleteUser(editingUser);
+        await dbOperations.createUser(updatedUserData);
+      } else {
+        await dbOperations.updateUser(editingUser, updatedUserData);
+      }
+      
+      // Recharger les utilisateurs
+      const updatedUsers = await dbOperations.getUsers();
+      setUsers(updatedUsers);

-    setUsers(updatedUsers);
-    setEditingUser(null);
-    setUserManagementView('list');
-    setUserForm({
-      email: '',
-      password: '',
-      firstName: '',
-      lastName: '',
-      role: 'trainee',
-      status: 'active'
-    });
+      setEditingUser(null);
+      setUserManagementView('list');
+      setUserForm({
+        email: '',
+        password: '',
+        firstName: '',
+        lastName: '',
+        role: 'trainee',
+        status: 'active'
+      });

-    alert('Utilisateur mis à jour avec succès !');
+      setSyncStatus('synced');
+      alert('Utilisateur mis à jour avec succès !');
+    } catch (error) {
+      console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
+      setSyncStatus('error');
+      alert('Erreur lors de la mise à jour de l\'utilisateur.');
+    }
   };

-  const deleteUser = (email) => {
+  const deleteUser = async (email) => {
     if (email === currentUser?.email) {
       alert('Vous ne pouvez pas supprimer votre propre compte');
       return;
     }

     if (confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur ${email} ?`)) {
-      const updatedUsers = { ...users };
-      delete updatedUsers[email];
-      setUsers(updatedUsers);
-      alert('Utilisateur supprimé avec succès !');
+      try {
+        setSyncStatus('syncing');
+        
+        await dbOperations.deleteUser(email);
+        
+        // Recharger les utilisateurs
+        const updatedUsers = await dbOperations.getUsers();
+        setUsers(updatedUsers);
+        
+        setSyncStatus('synced');
+        alert('Utilisateur supprimé avec succès !');
+      } catch (error) {
+        console.error('Erreur lors de la suppression de l\'utilisateur:', error);
+        setSyncStatus('error');
+        alert('Erreur lors de la suppression de l\'utilisateur.');
+      }
     }
   };

   const startEditUser = (email) => {
     const user = users[email];
     setUserForm({
       email,
       password: user.password,
-      firstName: user.firstName,
-      lastName: user.lastName,
+      firstName: user.first_name,
+      lastName: user.last_name,
       role: user.role,
       status: user.status
     });
@@ .. @@
     return date.toDateString() === today.toDateString();
   };

-  const updatePeakPlayers = (date, hour, players) => {
+  const updatePeakPlayers = async (date, hour, players) => {
     const dateKey = formatDateKey(date);
-    setPeakData(prev => ({
-      ...prev,
-      [dateKey]: {
-        ...prev[dateKey],
-        [hour]: parseInt(players) || 0
-      }
-    }));
+    const playerCount = parseInt(players) || 0;
+    
+    try {
+      setSyncStatus('syncing');
+      
+      await dbOperations.updatePeakPlayers(dateKey, hour, playerCount);
+      
+      // Mettre à jour l'état local
+      setPeakData(prev => ({
+        ...prev,
+        [dateKey]: {
+          ...prev[dateKey],
+          [hour]: playerCount
+        }
+      }));
+      
+      setSyncStatus('synced');
+    } catch (error) {
+      console.error('Erreur lors de la mise à jour des pics:', error);
+      setSyncStatus('error');
+    }
   };

   const getPeakPlayers = (date, hour) => {
@@ .. @@
     return peakData[dateKey]?.[hour] || 0;
   };

-  const toggleModeratorSlot = (date, hour) => {
+  const toggleModeratorSlot = async (date, hour) => {
     if (!canModifySchedule()) {
       alert('Vous n\'avez pas les permissions pour modifier le planning');
       return;
     }

+    try {
+      setSyncStatus('syncing');
+      
       const dateKey = formatDateKey(date);
       const daySlots = scheduleData[dateKey] || {};
       const userSlotKey = `${hour}-${currentUser.token}`;
       
       const assignedMods = Object.keys(daySlots).filter(key => 
         key.startsWith(hour) && daySlots[key]?.assigned
       );
       const currentModCount = assignedMods.length;
       const isUserAssigned = daySlots[userSlotKey]?.assigned;
       
       if (isUserAssigned) {
-        setScheduleData(prev => ({
-          ...prev,
-          [dateKey]: {
-            ...prev[dateKey],
-            [userSlotKey]: null
-          }
-        }));
+        // Supprimer l'assignation
+        await dbOperations.updateScheduleSlot(dateKey, userSlotKey, null);
+        
+        setScheduleData(prev => ({
+          ...prev,
+          [dateKey]: {
+            ...prev[dateKey],
+            [userSlotKey]: null
+          }
+        }));
+        
+        setSyncStatus('synced');
         return;
       }
       
       if (currentModCount >= 3) {
+        setSyncStatus('synced');
         alert('Créneau complet ! Maximum 3 modérateurs par créneau.');
         return;
       }
       
-      setScheduleData(prev => ({
-        ...prev,
-        [dateKey]: {
-          ...prev[dateKey],
-          [userSlotKey]: {
-            assigned: true,
-            assignedBy: currentUser.email,
-            assignedAt: new Date().toISOString(),
-            role: currentUser.role
-          }
+      const slotData = {
+        assigned: true,
+        assignedBy: currentUser.email,
+        assignedAt: new Date().toISOString(),
+        role: currentUser.role
+      };
+      
+      // Sauvegarder en base
+      await dbOperations.updateScheduleSlot(dateKey, userSlotKey, slotData);
+      
+      // Mettre à jour l'état local
+      setScheduleData(prev => ({
+        ...prev,
+        [dateKey]: {
+          ...prev[dateKey],
+          [userSlotKey]: slotData
         }
       }));
+      
+      setSyncStatus('synced');
+    } catch (error) {
+      console.error('Erreur lors de la mise à jour du planning:', error);
+      setSyncStatus('error');
+      alert('Erreur lors de la mise à jour du planning.');
+    }
   };

   const navigatePlanningDate = (direction) => {
@@ .. @@
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

-  // Composant de statut de sauvegarde
-  const renderSaveStatus = () => (
+  // Composant de statut de synchronisation
+  const renderSyncStatus = () => (
     <div className="flex items-center gap-2 text-sm">
-      {saveStatus === 'saving' && (
+      {syncStatus === 'syncing' && (
         <>
           <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
-          <span className="text-blue-600">Sauvegarde...</span>
+          <span className="text-blue-600">Synchronisation...</span>
         </>
       )}
-      {saveStatus === 'saved' && (
+      {syncStatus === 'synced' && (
         <>
           <CheckCircle className="w-4 h-4 text-green-500" />
-          <span className="text-green-600">
-            Sauvé à {lastSaveTime.toLocaleTimeString()}
-          </span>
+          <span className="text-green-600">Synchronisé</span>
+        </>
+      )}
+      {syncStatus === 'error' && (
+        <>
+          <AlertCircle className="w-4 h-4 text-red-500" />
+          <span className="text-red-600">Erreur de sync</span>
         </>
       )}
     </div>
   );

+  // Affichage de chargement
+  if (isLoading) {
+    return (
+      <div className="min-h-screen flex items-center justify-center bg-gray-100">
+        <div className="text-center">
+          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
+          <p className="text-lg text-gray-600">Chargement des données...</p>
+        </div>
+      </div>
+    );
+  }
+
   // Page de connexion
   const renderLoginPage = () => (
@@ .. @@
         <div className="mt-8 flex justify-center gap-4">
           <button
             onClick={handleLogout}
             className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition-colors flex items-center gap-2"
           >
             <LogOut className="w-4 h-4" />
             Déconnexion
           </button>
           
           <button
             onClick={() => setDarkMode(!darkMode)}
             className={`p-2 rounded-full transition-colors ${
               darkMode ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-gray-700 hover:bg-gray-800'
             } text-white`}
           >
             {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
           </button>
+          
+          <div className="flex items-center">
+            {renderSyncStatus()}
+          </div>
         </div>
         
         <div className={`mt-8 p-4 rounded-lg ${secondaryTheme} border`}>
           <div className="text-center text-sm text-gray-600 dark:text-gray-400">
             Document lié au staff MSS-Click fait par Mosley
           </div>
         </div>
       </div>
     </div>
   );
 }