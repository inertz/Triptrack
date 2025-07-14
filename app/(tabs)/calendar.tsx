import React, { useState, useMemo } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Card, useTheme, Chip } from 'react-native-paper';
import { Calendar } from 'react-native-calendars';
import { useApp } from '../../context/AppContext';
import { format, parseISO } from 'date-fns';

export default function CalendarScreen() {
  const theme = useTheme();
  const { state } = useApp();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const markedDates = useMemo(() => {
    const marked: any = {};
    
    state.trips.forEach(trip => {
      trip.days.forEach(day => {
        marked[day.date] = {
          marked: true,
          dotColor: theme.colors.primary,
        };
      });
    });

    // Highlight selected date
    if (marked[selectedDate]) {
      marked[selectedDate] = {
        ...marked[selectedDate],
        selected: true,
        selectedColor: theme.colors.primary,
      };
    } else {
      marked[selectedDate] = {
        selected: true,
        selectedColor: theme.colors.primary,
      };
    }

    return marked;
  }, [state.trips, selectedDate, theme.colors.primary]);

  const activitiesForDate = useMemo(() => {
    const activities: Array<{
      activity: any;
      trip: any;
    }> = [];

    state.trips.forEach(trip => {
      const day = trip.days.find(d => d.date === selectedDate);
      if (day) {
        day.activities.forEach(activity => {
          activities.push({ activity, trip });
        });
      }
    });

    return activities.sort((a, b) => a.activity.time.localeCompare(b.activity.time));
  }, [state.trips, selectedDate]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    calendar: {
      marginBottom: 16,
    },
    content: {
      padding: 16,
    },
    dateHeader: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 16,
      color: theme.colors.onSurface,
    },
    activityCard: {
      marginBottom: 12,
    },
    activityHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    activityTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.onSurface,
    },
    activityTime: {
      fontSize: 14,
      color: theme.colors.primary,
      fontWeight: '500',
    },
    activityLocation: {
      fontSize: 14,
      color: theme.colors.onSurfaceVariant,
      marginBottom: 4,
    },
    activityDescription: {
      fontSize: 14,
      color: theme.colors.onSurfaceVariant,
      marginBottom: 8,
    },
    tripChip: {
      alignSelf: 'flex-start',
    },
    emptyState: {
      textAlign: 'center',
      color: theme.colors.onSurfaceVariant,
      fontSize: 16,
      marginTop: 32,
    },
  });

  return (
    <View style={styles.container}>
      <Calendar
        style={styles.calendar}
        current={selectedDate}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={markedDates}
        theme={{
          backgroundColor: theme.colors.surface,
          calendarBackground: theme.colors.surface,
          textSectionTitleColor: theme.colors.onSurface,
          selectedDayBackgroundColor: theme.colors.primary,
          selectedDayTextColor: theme.colors.onPrimary,
          todayTextColor: theme.colors.primary,
          dayTextColor: theme.colors.onSurface,
          textDisabledColor: theme.colors.onSurfaceVariant,
          dotColor: theme.colors.primary,
          selectedDotColor: theme.colors.onPrimary,
          arrowColor: theme.colors.primary,
          monthTextColor: theme.colors.onSurface,
          indicatorColor: theme.colors.primary,
        }}
      />

      <ScrollView style={styles.content}>
        <Text style={styles.dateHeader}>
          {format(parseISO(selectedDate), 'EEEE, MMMM d, yyyy')}
        </Text>

        {activitiesForDate.length === 0 ? (
          <Text style={styles.emptyState}>
            No activities scheduled for this date
          </Text>
        ) : (
          activitiesForDate.map(({ activity, trip }, index) => (
            <Card key={`${activity.id}-${index}`} style={styles.activityCard}>
              <Card.Content>
                <View style={styles.activityHeader}>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  <Text style={styles.activityTime}>{activity.time}</Text>
                </View>
                
                {activity.location && (
                  <Text style={styles.activityLocation}>📍 {activity.location}</Text>
                )}
                
                {activity.description && (
                  <Text style={styles.activityDescription}>{activity.description}</Text>
                )}
                
                <Chip 
                  style={styles.tripChip}
                  compact
                  mode="outlined"
                >
                  {trip.title}
                </Chip>
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>
    </View>
  );
}