import AsyncStorage from '@react-native-async-storage/async-storage';
import { Trip, AppSettings } from '../types/Trip';

const TRIPS_KEY = '@triptrack_trips';
const SETTINGS_KEY = '@triptrack_settings';

export class StorageService {
  static async getTrips(): Promise<Trip[]> {
    try {
      const tripsJson = await AsyncStorage.getItem(TRIPS_KEY);
      return tripsJson ? JSON.parse(tripsJson) : [];
    } catch (error) {
      console.error('Error loading trips:', error);
      return [];
    }
  }

  static async saveTrips(trips: Trip[]): Promise<void> {
    try {
      await AsyncStorage.setItem(TRIPS_KEY, JSON.stringify(trips));
    } catch (error) {
      console.error('Error saving trips:', error);
      throw error;
    }
  }

  static async saveTrip(trip: Trip): Promise<void> {
    try {
      const trips = await this.getTrips();
      const existingIndex = trips.findIndex(t => t.id === trip.id);
      
      if (existingIndex >= 0) {
        trips[existingIndex] = { ...trip, updatedAt: Date.now() };
      } else {
        trips.push(trip);
      }
      
      await this.saveTrips(trips);
    } catch (error) {
      console.error('Error saving trip:', error);
      throw error;
    }
  }

  static async deleteTrip(tripId: string): Promise<void> {
    try {
      const trips = await this.getTrips();
      const filteredTrips = trips.filter(t => t.id !== tripId);
      await this.saveTrips(filteredTrips);
    } catch (error) {
      console.error('Error deleting trip:', error);
      throw error;
    }
  }

  static async getSettings(): Promise<AppSettings> {
    try {
      const settingsJson = await AsyncStorage.getItem(SETTINGS_KEY);
      return settingsJson ? JSON.parse(settingsJson) : {
        theme: 'system',
        notifications: true,
        defaultReminderTime: 30
      };
    } catch (error) {
      console.error('Error loading settings:', error);
      return {
        theme: 'system',
        notifications: true,
        defaultReminderTime: 30
      };
    }
  }

  static async saveSettings(settings: AppSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
      throw error;
    }
  }

  static async exportTrips(): Promise<string> {
    try {
      const trips = await this.getTrips();
      return JSON.stringify(trips, null, 2);
    } catch (error) {
      console.error('Error exporting trips:', error);
      throw error;
    }
  }
}