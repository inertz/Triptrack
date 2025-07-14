import React, { useState, useMemo } from 'react';
import { View, ScrollView, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Text, useTheme, Searchbar, Chip } from 'react-native-paper';
import { useApp } from '../../context/AppContext';
import { MediaItem } from '../types/Trip';
import Modal from 'react-native-modal';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const imageSize = (width - 48) / 3; // 3 columns with padding

export default function MediaScreen() {
  const theme = useTheme();
  const { state } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrip, setSelectedTrip] = useState<string | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  const allMedia = useMemo(() => {
    const media: Array<{
      item: MediaItem;
      trip: any;
      activity: any;
    }> = [];

    state.trips.forEach(trip => {
      trip.days.forEach(day => {
        day.activities.forEach(activity => {
          activity.media.forEach(mediaItem => {
            media.push({
              item: mediaItem,
              trip,
              activity,
            });
          });
        });
      });
    });

    return media.sort((a, b) => b.item.timestamp - a.item.timestamp);
  }, [state.trips]);

  const filteredMedia = useMemo(() => {
    let filtered = allMedia;

    if (selectedTrip) {
      filtered = filtered.filter(m => m.trip.id === selectedTrip);
    }

    if (searchQuery) {
      filtered = filtered.filter(m =>
        m.trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.activity.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [allMedia, selectedTrip, searchQuery]);

  const tripOptions = useMemo(() => {
    return state.trips.filter(trip =>
      trip.days.some(day =>
        day.activities.some(activity => activity.media.length > 0)
      )
    );
  }, [state.trips]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      padding: 16,
    },
    searchbar: {
      marginBottom: 16,
    },
    filterContainer: {
      flexDirection: 'row',
      marginBottom: 16,
    },
    filterChip: {
      marginRight: 8,
    },
    mediaGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    mediaItem: {
      width: imageSize,
      height: imageSize,
      marginBottom: 8,
      borderRadius: 8,
      overflow: 'hidden',
    },
    mediaImage: {
      width: '100%',
      height: '100%',
    },
    videoOverlay: {
      position: 'absolute',
      top: 8,
      right: 8,
      backgroundColor: 'rgba(0,0,0,0.6)',
      borderRadius: 12,
      padding: 4,
    },
    emptyState: {
      textAlign: 'center',
      color: theme.colors.onSurfaceVariant,
      fontSize: 16,
      marginTop: 50,
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
    modalSubtitle: {
      fontSize: 14,
      color: theme.colors.onSurfaceVariant,
      marginBottom: 4,
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <Searchbar
          placeholder="Search media..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
        >
          <Chip
            style={styles.filterChip}
            selected={selectedTrip === null}
            onPress={() => setSelectedTrip(null)}
          >
            All Trips
          </Chip>
          {tripOptions.map(trip => (
            <Chip
              key={trip.id}
              style={styles.filterChip}
              selected={selectedTrip === trip.id}
              onPress={() => setSelectedTrip(trip.id)}
            >
              {trip.title}
            </Chip>
          ))}
        </ScrollView>

        {filteredMedia.length === 0 ? (
          <Text style={styles.emptyState}>
            {searchQuery || selectedTrip ? 'No media found' : 'No media yet'}
          </Text>
        ) : (
          <View style={styles.mediaGrid}>
            {filteredMedia.map(({ item, trip, activity }, index) => (
              <TouchableOpacity
                key={`${item.id}-${index}`}
                style={styles.mediaItem}
                onPress={() => setSelectedMedia(item)}
              >
                <Image source={{ uri: item.uri }} style={styles.mediaImage} />
                {item.type === 'video' && (
                  <View style={styles.videoOverlay}>
                    <MaterialIcons name="play-arrow" size={16} color="white" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      <Modal
        isVisible={selectedMedia !== null}
        onBackdropPress={() => setSelectedMedia(null)}
        onSwipeComplete={() => setSelectedMedia(null)}
        swipeDirection="down"
      >
        {selectedMedia && (
          <View style={styles.modalContent}>
            <Image source={{ uri: selectedMedia.uri }} style={styles.modalImage} />
            
            {(() => {
              const mediaContext = filteredMedia.find(m => m.item.id === selectedMedia.id);
              if (mediaContext) {
                return (
                  <>
                    <Text style={styles.modalTitle}>{mediaContext.activity.title}</Text>
                    <Text style={styles.modalSubtitle}>{mediaContext.trip.title}</Text>
                    <Text style={styles.modalSubtitle}>
                      {new Date(selectedMedia.timestamp).toLocaleDateString()}
                    </Text>
                  </>
                );
              }
              return null;
            })()}
          </View>
        )}
      </Modal>
    </View>
  );
}