/*
  # Création des tables pour le système de modération

  1. Nouvelles Tables
    - `users` - Stockage des utilisateurs avec leurs rôles et informations
    - `schedule_slots` - Stockage des créneaux de planning assignés
    - `peak_players` - Stockage des pics de joueurs par heure
    - `settings` - Paramètres globaux de l'application

  2. Sécurité
    - Enable RLS sur toutes les tables
    - Politiques pour permettre l'accès aux utilisateurs authentifiés
*/

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password text NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  role text NOT NULL DEFAULT 'trainee',
  status text NOT NULL DEFAULT 'active',
  token text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_login timestamptz
);

-- Table des créneaux de planning
CREATE TABLE IF NOT EXISTS schedule_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date_key text NOT NULL,
  slot_key text NOT NULL,
  assigned boolean DEFAULT true,
  assigned_by text NOT NULL,
  assigned_at timestamptz DEFAULT now(),
  role text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(date_key, slot_key)
);

-- Table des pics de joueurs
CREATE TABLE IF NOT EXISTS peak_players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date_key text NOT NULL,
  hour text NOT NULL,
  players integer DEFAULT 0,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(date_key, hour)
);

-- Table des paramètres
CREATE TABLE IF NOT EXISTS settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text NOT NULL,
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE peak_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Politiques RLS (accès public pour cette application)
CREATE POLICY "Allow all operations on users"
  ON users
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on schedule_slots"
  ON schedule_slots
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on peak_players"
  ON peak_players
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on settings"
  ON settings
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Insertion de l'utilisateur administrateur par défaut
INSERT INTO users (email, password, first_name, last_name, role, status, token, created_at, last_login)
VALUES (
  'mosley.admin@mssclick.planning',
  'New12345678',
  'Mosley',
  'Admin',
  'admin',
  'active',
  'adm_001',
  '2024-01-01T00:00:00Z',
  now()
) ON CONFLICT (email) DO NOTHING;

-- Insertion des paramètres par défaut
INSERT INTO settings (key, value) VALUES 
  ('week_start', 'monday'),
  ('app_version', '1.0'),
  ('last_backup', now()::text)
ON CONFLICT (key) DO NOTHING;