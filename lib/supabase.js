import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Fonctions utilitaires pour la base de données
export const dbOperations = {
  // Utilisateurs
  async getUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
    
    if (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error)
      return {}
    }
    
    // Convertir en format objet avec email comme clé
    const usersObj = {}
    data.forEach(user => {
      usersObj[user.email] = user
    })
    
    return usersObj
  },

  async createUser(userData) {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
    
    if (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error)
      throw error
    }
    
    return data[0]
  },

  async updateUser(email, userData) {
    const { data, error } = await supabase
      .from('users')
      .update(userData)
      .eq('email', email)
      .select()
    
    if (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', error)
      throw error
    }
    
    return data[0]
  },

  async deleteUser(email) {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('email', email)
    
    if (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', error)
      throw error
    }
  },

  // Planning
  async getScheduleData() {
    const { data, error } = await supabase
      .from('schedule_slots')
      .select('*')
    
    if (error) {
      console.error('Erreur lors de la récupération du planning:', error)
      return {}
    }
    
    // Convertir en format objet
    const scheduleObj = {}
    data.forEach(slot => {
      if (!scheduleObj[slot.date_key]) {
        scheduleObj[slot.date_key] = {}
      }
      scheduleObj[slot.date_key][slot.slot_key] = {
        assigned: slot.assigned,
        assignedBy: slot.assigned_by,
        assignedAt: slot.assigned_at,
        role: slot.role
      }
    })
    
    return scheduleObj
  },

  async updateScheduleSlot(dateKey, slotKey, slotData) {
    if (!slotData) {
      // Supprimer le slot
      const { error } = await supabase
        .from('schedule_slots')
        .delete()
        .eq('date_key', dateKey)
        .eq('slot_key', slotKey)
      
      if (error) {
        console.error('Erreur lors de la suppression du slot:', error)
        throw error
      }
      return
    }

    // Upsert (insert ou update)
    const { error } = await supabase
      .from('schedule_slots')
      .upsert({
        date_key: dateKey,
        slot_key: slotKey,
        assigned: slotData.assigned,
        assigned_by: slotData.assignedBy,
        assigned_at: slotData.assignedAt,
        role: slotData.role
      })
    
    if (error) {
      console.error('Erreur lors de la mise à jour du slot:', error)
      throw error
    }
  },

  // Pics de joueurs
  async getPeakData() {
    const { data, error } = await supabase
      .from('peak_players')
      .select('*')
    
    if (error) {
      console.error('Erreur lors de la récupération des pics:', error)
      return {}
    }
    
    // Convertir en format objet
    const peakObj = {}
    data.forEach(peak => {
      if (!peakObj[peak.date_key]) {
        peakObj[peak.date_key] = {}
      }
      peakObj[peak.date_key][peak.hour] = peak.players
    })
    
    return peakObj
  },

  async updatePeakPlayers(dateKey, hour, players) {
    const { error } = await supabase
      .from('peak_players')
      .upsert({
        date_key: dateKey,
        hour: hour,
        players: players
      })
    
    if (error) {
      console.error('Erreur lors de la mise à jour des pics:', error)
      throw error
    }
  },

  // Paramètres globaux
  async getSettings() {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
    
    if (error) {
      console.error('Erreur lors de la récupération des paramètres:', error)
      return {}
    }
    
    const settingsObj = {}
    data.forEach(setting => {
      settingsObj[setting.key] = setting.value
    })
    
    return settingsObj
  },

  async updateSetting(key, value) {
    const { error } = await supabase
      .from('settings')
      .upsert({
        key: key,
        value: value
      })
    
    if (error) {
      console.error('Erreur lors de la mise à jour du paramètre:', error)
      throw error
    }
  }
}