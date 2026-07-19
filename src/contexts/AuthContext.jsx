import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId) => {
    try {
      const storedProfiles = JSON.parse(localStorage.getItem('profiles') || '{}');
      const userProfile = storedProfiles[userId];
      if (userProfile) {
        setProfile(userProfile);
      }
    } catch (e) {
      console.error('Error fetching profile:', e);
    }
  }, []);

  useEffect(() => {
    try {
      // Auto-create a demo user if database is empty
      const users = JSON.parse(localStorage.getItem('users') || '{}');
      if (Object.keys(users).length === 0) {
        const demoId = 'demo_user_1';
        users[demoId] = { id: demoId, email: 'demo', password: 'demo' };
        localStorage.setItem('users', JSON.stringify(users));
        
        const profiles = JSON.parse(localStorage.getItem('profiles') || '{}');
        profiles[demoId] = { id: demoId, name: 'Demo Student', created_at: new Date().toISOString() };
        localStorage.setItem('profiles', JSON.stringify(profiles));
      }

      const storedSession = localStorage.getItem('session');
      if (storedSession) {
        const sessionUser = JSON.parse(storedSession);
        setUser(sessionUser);
        fetchProfile(sessionUser.id);
      }
    } catch (e) {
      console.error('Error restoring session:', e);
    } finally {
      setLoading(false);
    }
  }, [fetchProfile]);

  const signUp = useCallback(async (email, password, name) => {
    // Generate a simple unique ID for local usage
    const userId = 'user_' + Date.now().toString() + Math.random().toString(36).substr(2, 9);
    
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (Object.values(users).some(u => u.email === email)) {
      throw new Error('Already registered: An account with this username already exists.');
    }

    const newUser = { id: userId, email, password };
    users[userId] = newUser;
    localStorage.setItem('users', JSON.stringify(users));

    const newProfile = { id: userId, name: name || email.split('@')[0], created_at: new Date().toISOString() };
    const profiles = JSON.parse(localStorage.getItem('profiles') || '{}');
    profiles[userId] = newProfile;
    localStorage.setItem('profiles', JSON.stringify(profiles));

    localStorage.setItem('session', JSON.stringify({ id: userId, email }));
    setUser({ id: userId, email });
    setProfile(newProfile);

    return { user: { id: userId, email } };
  }, []);

  const signIn = useCallback(async (email, password) => {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const existingUser = Object.values(users).find(u => u.email === email && u.password === password);
    
    if (!existingUser) {
      throw new Error('Invalid credentials');
    }

    localStorage.setItem('session', JSON.stringify({ id: existingUser.id, email: existingUser.email }));
    setUser({ id: existingUser.id, email: existingUser.email });
    await fetchProfile(existingUser.id);

    return { user: { id: existingUser.id, email: existingUser.email } };
  }, [fetchProfile]);

  const signOut = useCallback(async () => {
    localStorage.removeItem('session');
    setUser(null);
    setProfile(null);
  }, []);

  const updateProfile = useCallback(async (updates) => {
    if (!user) return;

    const profiles = JSON.parse(localStorage.getItem('profiles') || '{}');
    const updatedProfile = { 
      ...profiles[user.id], 
      ...updates, 
      updated_at: new Date().toISOString() 
    };
    profiles[user.id] = updatedProfile;
    localStorage.setItem('profiles', JSON.stringify(profiles));
    
    setProfile(updatedProfile);
    return updatedProfile;
  }, [user]);

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
