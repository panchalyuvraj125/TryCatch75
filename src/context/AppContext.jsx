import { createContext, useContext, useState, useCallback } from 'react';
import { getData, setData } from '../utils/storage';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [globalState, setGlobalState] = useState(() => getData());

  const activeSemesterId = globalState.activeSemesterId || 'default';
  
  const state = {
    ...(globalState.semesters?.[activeSemesterId] || {}),
    theme: globalState.theme,
  };

  const update = useCallback((updater) => {
    setGlobalState((prevGlobal) => {
      const activeId = prevGlobal.activeSemesterId || 'default';
      const activeSem = prevGlobal.semesters?.[activeId] || {};
      
      const nextSem = typeof updater === 'function' ? updater(activeSem) : { ...activeSem, ...updater };
      
      const nextGlobal = {
        ...prevGlobal,
        semesters: {
          ...prevGlobal.semesters,
          [activeId]: nextSem
        }
      };
      
      setData(nextGlobal);
      return nextGlobal;
    });
  }, []);

  const updateGlobal = useCallback((updater) => {
    setGlobalState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      setData(next);
      return next;
    });
  }, []);

  const refreshData = useCallback(() => {
    setGlobalState(getData());
  }, []);

  return (
    <AppContext.Provider value={{ state, globalState, update, updateGlobal, refreshData }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
