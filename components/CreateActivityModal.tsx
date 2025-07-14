import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { 
  Modal, 
  Portal, 
  Text, 
  TextInput, 
  Button, 
  useTheme 
} from 'react-native-paper';
import { useApp } from '../context/AppContext';
import { Trip, TripDay, Activity } from '../types/Trip';

interface CreateActivityModalProps {
  visible: boolean;
  onDismiss: () => void;
  trip: Trip;
  day: TripDay;
}

export function CreateActivityModal({ visible, onDismiss, trip, day }: CreateActivityModalProps) {
  const theme = useTheme();
  const { actions } = useApp();
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('09:00');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!title.trim()) {
      return;
    }

    setLoading(true);
    
    try {
      const newActivity: Activity = {
        id: Date.now().toString(),
        title: title.trim(),
        time,
        location: location.trim(),
        description: description.trim(),
        media: [],
        reminder: { enabled: false },
        completed: false,
      };

      const updatedDay = {
        ...day,
        activities: [...day.activities, newActivity],
      };

      const updatedTrip = {
        ...trip,
        days: trip.days.map(d => 
          d.id === day.id ? updatedDay : d
        ),
        updatedAt: Date.now(),
      };

      await actions.saveTrip(updatedTrip);
      
      // Reset form
      setTitle('');
      setTime('09:00');
      setLocation('');
      setDescription('');
      
      onDismiss();
    } catch (error) {
      console.error('Error creating activity:', error);
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    modal: {
      backgroundColor: theme.colors.surface,
      margin: 20,
      borderRadius: 12,
      padding: 20,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
      color: theme.colors.onSurface,
    },
    input: {
      marginBottom: 16,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20,
    },
    button: {
      flex: 1,
      marginHorizontal: 8,
    },
  });

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.modal}>
        <Text style={styles.title}>Add Activity</Text>
        
        <TextInput
          label="Activity Title"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
          mode="outlined"
          placeholder="e.g., Visit Eiffel Tower"
        />
        
        <TextInput
          label="Time"
          value={time}
          onChangeText={setTime}
          style={styles.input}
          mode="outlined"
          placeholder="HH:MM"
        />
        
        <TextInput
          label="Location (Optional)"
          value={location}
          onChangeText={setLocation}
          style={styles.input}
          mode="outlined"
          placeholder="e.g., Champ de Mars, Paris"
        />
        
        <TextInput
          label="Description (Optional)"
          value={description}
          onChangeText={setDescription}
          style={styles.input}
          mode="outlined"
          multiline
          numberOfLines={3}
          placeholder="Add notes about this activity..."
        />
        
        <div style={styles.buttonContainer}>
          <Button 
            mode="outlined" 
            onPress={onDismiss}
            style={styles.button}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            mode="contained" 
            onPress={handleCreate}
            style={styles.button}
            loading={loading}
            disabled={!title.trim() || loading}
          >
            Add Activity
          </Button>
        </div>
      </Modal>
    </Portal>
  );
}