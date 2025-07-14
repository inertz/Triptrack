import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text, Chip, useTheme } from 'react-native-paper';
import { router } from 'expo-router';
import { Trip } from '../types/Trip';
import { format, parseISO, differenceInDays } from 'date-fns';

interface TripCardProps {
  trip: Trip;
}

export function TripCard({ trip }: TripCardProps) {
  const theme = useTheme();

  const startDate = parseISO(trip.startDate);
  const endDate = parseISO(trip.endDate);
  const duration = differenceInDays(endDate, startDate) + 1;
  
  const totalActivities = trip.days.reduce((acc, day) => acc + day.activities.length, 0);
  const completedActivities = trip.days.reduce(
    (acc, day) => acc + day.activities.filter(activity => activity.completed).length,
    0
  );

  const styles = StyleSheet.create({
    card: {
      marginBottom: 16,
      elevation: 2,
    },
    content: {
      padding: 16,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 8,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.onSurface,
      flex: 1,
    },
    destination: {
      fontSize: 14,
      color: theme.colors.onSurfaceVariant,
      marginBottom: 12,
    },
    dateRange: {
      fontSize: 14,
      color: theme.colors.primary,
      marginBottom: 8,
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    statsText: {
      fontSize: 12,
      color: theme.colors.onSurfaceVariant,
    },
    progressChip: {
      backgroundColor: theme.colors.primaryContainer,
    },
  });

  const handlePress = () => {
    router.push(`/trip/${trip.id}`);
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <Card style={styles.card}>
        <Card.Content style={styles.content}>
          <div style={styles.header}>
            <Text style={styles.title}>{trip.title}</Text>
          </div>
          
          <Text style={styles.destination}>📍 {trip.destination}</Text>
          
          <Text style={styles.dateRange}>
            {format(startDate, 'MMM d')} - {format(endDate, 'MMM d, yyyy')} • {duration} day{duration > 1 ? 's' : ''}
          </Text>
          
          <div style={styles.statsContainer}>
            <Text style={styles.statsText}>
              {totalActivities} activit{totalActivities !== 1 ? 'ies' : 'y'}
            </Text>
            
            {totalActivities > 0 && (
              <Chip 
                style={styles.progressChip}
                compact
                mode="flat"
              >
                {completedActivities}/{totalActivities} completed
              </Chip>
            )}
          </div>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
}