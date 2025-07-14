import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Trip, AppSettings } from '../types/Trip';
import { StorageService } from '../services/StorageService';

interface AppState {
  trips: Trip[];
  settings: AppSettings;
  loading: boolean;
  error: string | null;
}

type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_TRIPS'; payload: Trip[] }
  | { type: 'ADD_TRIP'; payload: Trip }
  | { type: 'UPDATE_TRIP'; payload: Trip }
  | { type: 'DELETE_TRIP'; payload: string }
  | { type: 'SET_SETTINGS'; payload: AppSettings };

const initialState: AppState = {
  trips: [],
  settings: {
    theme: 'system',
    notifications: true,
    defaultReminderTime: 30,
  },
  loading: true,
  error: null,
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  actions: {
    loadTrips: () => Promise<void>;
    saveTrip: (trip: Trip) => Promise<void>;
    deleteTrip: (tripId: string) => Promise<void>;
    updateSettings: (settings: AppSettings) => Promise<void>;
  };
} | null>(null);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_TRIPS':
      return { ...state, trips: action.payload };
    case 'ADD_TRIP':
      return { ...state, trips: [...state.trips, action.payload] };
    case 'UPDATE_TRIP':
      return {
        ...state,
        trips: state.trips.map(trip =>
          trip.id === action.payload.id ? action.payload : trip
        ),
      };
    case 'DELETE_TRIP':
      return {
        ...state,
        trips: state.trips.filter(trip => trip.id !== action.payload),
      };
    case 'SET_SETTINGS':
      return { ...state, settings: action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const actions = {
    loadTrips: async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const trips = await StorageService.getTrips();
        const settings = await StorageService.getSettings();
        dispatch({ type: 'SET_TRIPS', payload: trips });
        dispatch({ type: 'SET_SETTINGS', payload: settings });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load trips' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },

    saveTrip: async (trip: Trip) => {
      try {
        await StorageService.saveTrip(trip);
        const existingTrip = state.trips.find(t => t.id === trip.id);
        if (existingTrip) {
          dispatch({ type: 'UPDATE_TRIP', payload: trip });
        } else {
          dispatch({ type: 'ADD_TRIP', payload: trip });
        }
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to save trip' });
      }
    },

    deleteTrip: async (tripId: string) => {
      try {
        await StorageService.deleteTrip(tripId);
        dispatch({ type: 'DELETE_TRIP', payload: tripId });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to delete trip' });
      }
    },

    updateSettings: async (settings: AppSettings) => {
      try {
        await StorageService.saveSettings(settings);
        dispatch({ type: 'SET_SETTINGS', payload: settings });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to update settings' });
      }
    },
  };

  useEffect(() => {
    actions.loadTrips();
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch, actions }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}