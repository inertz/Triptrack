import React, { useState, useMemo } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, FAB, useTheme, Button } from 'react-native-paper';
import { useLocalSearchParams } from 'expo-router';
import { useApp } from '../../context/AppContext';
import { TripDayCard } from '../../components/TripDayCard';
import { format, parseISO, addDays, differenceInDays } from 'date-fns';

export default function TripDetailScreen() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state, actions } = useApp();
  const [loading, setLoading] = useState(false);

  const trip = useMemo(() => {
    return state.trips.find(t => t.id === id);
  }, [state.trips, id]);

  const handleAddDay = async () => {
    if (!trip) return;

    setLoading(true);
    try {
      const startDate = parseISO(trip.startDate);
      const endDate = parseISO(trip.endDate);
      const totalDays = differenceInDays(endDate, startDate) + 1;
      
      const newDays = [];
      for (let i = 0; i < totalDays; i++) {
        const dayDate = format(addDays(startDate, i), 'yyyy-MM-dd');
        const existingDay = trip.days.find(d => d.date === dayDate);
        
        if (!existingDay) {
          newDays.push({
            id: `${trip.id}-day-${i}`,
            date: dayDate,
            activities: [],
          });
        }
      }

      if (newDays.length > 0) {
        const updatedTrip = {
          ...trip,
          days: [...trip.days, ...newDays].sort((a, b) => a.date.localeCompare(b.date)),
          updatedAt: Date.now(),
        };

        await actions.saveTrip(updatedTrip);
      }
    } catch (error) {
      console.error('Error adding days:', error);
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      padding: 16,
    },
    header: {
      marginBottom: 24,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.onSurface,
      marginBottom: 8,
    },
    destination: {
      fontSize: 16,
      color: theme.colors.onSurfaceVariant,
      marginBottom: 4,
    },
    dateRange: {
      fontSize: 14,
      color: theme.colors.primary,
    },
    emptyState: {
      textAlign: 'center',
      color: theme.colors.onSurfaceVariant,
      fontSize: 16,
      marginTop: 50,
      marginBottom: 20,
    },
    addDaysButton: {
      marginHorizontal: 16,
      marginBottom: 20,
    },
    fab: {
      position: 'absolute',
      margin: 16,
      right: 0,
      bottom: 0,
    },
  });

  if (!trip) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Trip not found</Text>
      </View>
    );
  }

  const startDate = parseISO(trip.startDate);
  const endDate = parseISO(trip.endDate);
  const duration = differenceInDays(endDate, startDate) + 1;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{trip.title}</Text>
          <Text style={styles.destination}>📍 {trip.destination}</Text>
          <Text style={styles.dateRange}>
            {format(startDate, 'MMM d')} - {format(endDate, 'MMM d, yyyy')} • {duration} day{duration > 1 ? 's' : ''}
          </Text>
        </View>

        {trip.days.length === 0 ? (
          <>
            <Text style={styles.emptyState}>
              No days added yet. Add days to start planning your activities!
            </Text>
            <Button
              mode="contained"
              onPress={handleAddDay}
              loading={loading}
              style={styles.addDaysButton}
            >
              Add Days to Trip
            </Button>
          </>
        ) : (
          <>
            {trip.days
              .sort((a, b) => a.date.localeCompare(b.date))
              .map(day => (
                <TripDayCard key={day.id} day={day} trip={trip} />
              ))
            }
            
            {trip.days.length < duration && (
              <Button
                mode="outlined"
                onPress={handleAddDay}
                loading={loading}
                style={styles.addDaysButton}
              >
                Add Missing Days
              </Button>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}