import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Button, useTheme } from 'react-native-paper';
import { Trip, TripDay } from '../types/Trip';
import { ActivityCard } from './ActivityCard';
import { CreateActivityModal } from './CreateActivityModal';
import { format, parseISO } from 'date-fns';

interface TripDayCardProps {
  day: TripDay;
  trip: Trip;
}

export function TripDayCard({ day, trip }: TripDayCardProps) {
  const theme = useTheme();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const styles = StyleSheet.create({
    card: {
      marginBottom: 16,
      elevation: 1,
    },
    header: {
      backgroundColor: theme.colors.primaryContainer,
      padding: 16,
    },
    dateText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.onPrimaryContainer,
    },
    dayText: {
      fontSize: 14,
      color: theme.colors.onPrimaryContainer,
      opacity: 0.8,
    },
    content: {
      padding: 16,
    },
    emptyState: {
      textAlign: 'center',
      color: theme.colors.onSurfaceVariant,
      fontSize: 14,
      marginBottom: 16,
    },
    addButton: {
      marginTop: 8,
    },
    activitiesContainer: {
      gap: 12,
    },
  });

  const dayDate = parseISO(day.date);

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.dateText}>
          {format(dayDate, 'MMMM d, yyyy')}
        </Text>
        <Text style={styles.dayText}>
          {format(dayDate, 'EEEE')}
        </Text>
      </View>
      
      <Card.Content style={styles.content}>
        {day.activities.length === 0 ? (
          <Text style={styles.emptyState}>
            No activities planned for this day
          </Text>
        ) : (
          <View style={styles.activitiesContainer}>
            {day.activities
              .sort((a, b) => a.time.localeCompare(b.time))
              .map(activity => (
                <ActivityCard 
                  key={activity.id} 
                  activity={activity} 
                  trip={trip}
                  day={day}
                />
              ))
            }
          </View>
        )}
        
        <Button
          mode="outlined"
          onPress={() => setShowCreateModal(true)}
          style={styles.addButton}
          icon="plus"
        >
          Add Activity
        </Button>
      </Card.Content>

      <CreateActivityModal
        visible={showCreateModal}
        onDismiss={() => setShowCreateModal(false)}
        trip={trip}
        day={day}
      />
    </Card>
  );
}