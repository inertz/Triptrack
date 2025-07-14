import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { FAB, Text, Searchbar, useTheme } from 'react-native-paper';
import { useApp } from '../../context/AppContext';
import { TripCard } from '../../components/TripCard';
import { CreateTripModal } from '../../components/CreateTripModal';

export default function TripsScreen() {
  const theme = useTheme();
  const { state } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredTrips = state.trips.filter(trip =>
    trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trip.destination.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 100,
    },
    emptyText: {
      textAlign: 'center',
      color: theme.colors.onSurfaceVariant,
      fontSize: 16,
      marginBottom: 8,
    },
    emptySubtext: {
      textAlign: 'center',
      color: theme.colors.onSurfaceVariant,
      fontSize: 14,
    },
    fab: {
      position: 'absolute',
      margin: 16,
      right: 0,
      bottom: 0,
    },
  });

  if (state.loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Loading trips...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <Searchbar
          placeholder="Search trips..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />

        {filteredTrips.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              {searchQuery ? 'No trips found' : 'No trips yet'}
            </Text>
            <Text style={styles.emptySubtext}>
              {searchQuery 
                ? 'Try adjusting your search terms'
                : 'Tap the + button to create your first trip'
              }
            </Text>
          </View>
        ) : (
          filteredTrips.map(trip => (
            <TripCard key={trip.id} trip={trip} />
          ))
        )}
      </ScrollView>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => setShowCreateModal(true)}
      />

      <CreateTripModal
        visible={showCreateModal}
        onDismiss={() => setShowCreateModal(false)}
      />
    </View>
  );
}