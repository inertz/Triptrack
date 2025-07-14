import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Card, Text, IconButton, Chip, useTheme } from 'react-native-paper';
import { Activity, Trip, TripDay, MediaItem } from '../types/Trip';
import { useApp } from '../context/AppContext';
import { MediaService } from '../services/MediaService';
import { NotificationService } from '../services/NotificationService';
import Modal from 'react-native-modal';
import { MaterialIcons } from '@expo/vector-icons';

interface ActivityCardProps {
  activity: Activity;
  trip: Trip;
  day: TripDay;
}

export function ActivityCard({ activity, trip, day }: ActivityCardProps) {
  const theme = useTheme();
  const { actions } = useApp();
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  const handleToggleComplete = async () => {
    const updatedActivity = {
      ...activity,
      completed: !activity.completed,
    };

    const updatedDay = {
      ...day,
      activities: day.activities.map(a => 
        a.id === activity.id ? updatedActivity : a
      ),
    };

    const updatedTrip = {
      ...trip,
      days: trip.days.map(d => 
        d.id === day.id ? updatedDay : d
      ),
      updatedAt: Date.now(),
    };

    await actions.saveTrip(updatedTrip);
  };

  const handleAddMedia = async (source: 'camera' | 'gallery') => {
    try {
      let mediaItem: MediaItem | null = null;
      
      if (source === 'camera') {
        mediaItem = await MediaService.pickImageFromCamera();
      } else {
        mediaItem = await MediaService.pickImageFromGallery();
      }

      if (mediaItem) {
        const updatedActivity = {
          ...activity,
          media: [...activity.media, mediaItem],
        };

        const updatedDay = {
          ...day,
          activities: day.activities.map(a => 
            a.id === activity.id ? updatedActivity : a
          ),
        };

        const updatedTrip = {
          ...trip,
          days: trip.days.map(d => 
            d.id === day.id ? updatedDay : d
          ),
          updatedAt: Date.now(),
        };

        await actions.saveTrip(updatedTrip);
      }
    } catch (error) {
      console.error('Error adding media:', error);
    }
  };

  const handleToggleReminder = async () => {
    try {
      if (activity.reminder?.enabled) {
        // Cancel existing reminder
        if (activity.reminder.notificationId) {
          await NotificationService.cancelNotification(activity.reminder.notificationId);
        }
        
        const updatedActivity = {
          ...activity,
          reminder: { enabled: false },
        };

        const updatedDay = {
          ...day,
          activities: day.activities.map(a => 
            a.id === activity.id ? updatedActivity : a
          ),
        };

        const updatedTrip = {
          ...trip,
          days: trip.days.map(d => 
            d.id === day.id ? updatedDay : d
          ),
          updatedAt: Date.now(),
        };

        await actions.saveTrip(updatedTrip);
      } else {
        // Schedule new reminder
        const notificationId = await NotificationService.scheduleActivityReminder(
          activity.title,
          activity.time,
          day.date,
          30 // 30 minutes before
        );

        if (notificationId) {
          const updatedActivity = {
            ...activity,
            reminder: { 
              enabled: true, 
              notificationId 
            },
          };

          const updatedDay = {
            ...day,
            activities: day.activities.map(a => 
              a.id === activity.id ? updatedActivity : a
            ),
          };

          const updatedTrip = {
            ...trip,
            days: trip.days.map(d => 
              d.id === day.id ? updatedDay : d
            ),
            updatedAt: Date.now(),
          };

          await actions.saveTrip(updatedTrip);
        }
      }
    } catch (error) {
      console.error('Error toggling reminder:', error);
    }
  };

  const styles = StyleSheet.create({
    card: {
      marginBottom: 8,
      elevation: 1,
    },
    content: {
      padding: 12,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 8,
    },
    titleContainer: {
      flex: 1,
      marginRight: 8,
    },
    title: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.onSurface,
    },
    time: {
      fontSize: 14,
      color: theme.colors.primary,
      fontWeight: '500',
    },
    location: {
      fontSize: 14,
      color: theme.colors.onSurfaceVariant,
      marginBottom: 4,
    },
    description: {
      fontSize: 14,
      color: theme.colors.onSurfaceVariant,
      marginBottom: 8,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    mediaContainer: {
      flexDirection: 'row',
      marginTop: 8,
    },
    mediaThumbnail: {
      width: 40,
      height: 40,
      borderRadius: 4,
      marginRight: 8,
    },
    videoOverlay: {
      position: 'absolute',
      top: 2,
      right: 10,
      backgroundColor: 'rgba(0,0,0,0.6)',
      borderRadius: 8,
      padding: 2,
    },
    actionButtons: {
      flexDirection: 'row',
    },
    completedCard: {
      opacity: 0.7,
    },
    completedChip: {
      backgroundColor: theme.colors.secondaryContainer,
    },
    modalContent: {
      backgroundColor: theme.colors.surface,
      margin: 20,
      borderRadius: 12,
      padding: 16,
    },
    modalImage: {
      width: '100%',
      height: 300,
      borderRadius: 8,
      marginBottom: 16,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 8,
      color: theme.colors.onSurface,
    },
  });

  return (
    <>
      <Card style={[styles.card, activity.completed && styles.completedCard]}>
        <Card.Content style={styles.content}>
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{activity.title}</Text>
              <Text style={styles.time}>{activity.time}</Text>
            </View>
            
            <View style={styles.actionButtons}>
              <IconButton
                icon={activity.reminder?.enabled ? 'bell' : 'bell-outline'}
                size={20}
                onPress={handleToggleReminder}
                iconColor={activity.reminder?.enabled ? theme.colors.primary : theme.colors.onSurfaceVariant}
              />
              <IconButton
                icon="camera"
                size={20}
                onPress={() => handleAddMedia('camera')}
              />
              <IconButton
                icon={activity.completed ? 'check-circle' : 'check-circle-outline'}
                size={20}
                onPress={handleToggleComplete}
                iconColor={activity.completed ? theme.colors.secondary : theme.colors.onSurfaceVariant}
              />
            </View>
          </View>
          
          {activity.location && (
            <Text style={styles.location}>📍 {activity.location}</Text>
          )}
          
          {activity.description && (
            <Text style={styles.description}>{activity.description}</Text>
          )}

          {activity.media.length > 0 && (
            <View style={styles.mediaContainer}>
              {activity.media.slice(0, 5).map((media, index) => (
                <TouchableOpacity
                  key={media.id}
                  onPress={() => setSelectedMedia(media)}
                >
                  <Image source={{ uri: media.uri }} style={styles.mediaThumbnail} />
                  {media.type === 'video' && (
                    <View style={styles.videoOverlay}>
                      <MaterialIcons name="play-arrow" size={12} color="white" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
              {activity.media.length > 5 && (
                <View style={[styles.mediaThumbnail, { backgroundColor: theme.colors.surfaceVariant, justifyContent: 'center', alignItems: 'center' }]}>
                  <Text style={{ color: theme.colors.onSurfaceVariant, fontSize: 12 }}>
                    +{activity.media.length - 5}
                  </Text>
                </View>
              )}
            </View>
          )}

          <View style={styles.footer}>
            <View>
              {activity.completed && (
                <Chip 
                  style={styles.completedChip}
                  compact
                  mode="flat"
                >
                  Completed
                </Chip>
              )}
            </View>
          </View>
        </Card.Content>
      </Card>

      <Modal
        isVisible={selectedMedia !== null}
        onBackdropPress={() => setSelectedMedia(null)}
        onSwipeComplete={() => setSelectedMedia(null)}
        swipeDirection="down"
      >
        {selectedMedia && (
          <View style={styles.modalContent}>
            <Image source={{ uri: selectedMedia.uri }} style={styles.modalImage} />
            <Text style={styles.modalTitle}>{activity.title}</Text>
            <Text style={{ color: theme.colors.onSurfaceVariant }}>
              {new Date(selectedMedia.timestamp).toLocaleDateString()}
            </Text>
          </View>
        )}
      </Modal>
    </>
  );
}