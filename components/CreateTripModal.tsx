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
import { Trip } from '../types/Trip';
import { format } from 'date-fns';

interface CreateTripModalProps {
  visible: boolean;
  onDismiss: () => void;
}

export function CreateTripModal({ visible, onDismiss }: CreateTripModalProps) {
  const theme = useTheme();
  const { actions } = useApp();
  const [title, setTitle] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!title.trim() || !destination.trim()) {
      return;
    }

    setLoading(true);
    
    try {
      const newTrip: Trip = {
        id: Date.now().toString(),
        title: title.trim(),
        destination: destination.trim(),
        startDate,
        endDate,
        days: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await actions.saveTrip(newTrip);
      
      // Reset form
      setTitle('');
      setDestination('');
      setStartDate(format(new Date(), 'yyyy-MM-dd'));
      setEndDate(format(new Date(), 'yyyy-MM-dd'));
      
      onDismiss();
    } catch (error) {
      console.error('Error creating trip:', error);
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
        <Text style={styles.title}>Create New Trip</Text>
        
        <TextInput
          label="Trip Title"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
          mode="outlined"
          placeholder="e.g., Summer Vacation 2024"
        />
        
        <TextInput
          label="Destination"
          value={destination}
          onChangeText={setDestination}
          style={styles.input}
          mode="outlined"
          placeholder="e.g., Paris, France"
        />
        
        <TextInput
          label="Start Date"
          value={startDate}
          onChangeText={setStartDate}
          style={styles.input}
          mode="outlined"
          placeholder="YYYY-MM-DD"
        />
        
        <TextInput
          label="End Date"
          value={endDate}
          onChangeText={setEndDate}
          style={styles.input}
          mode="outlined"
          placeholder="YYYY-MM-DD"
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
            disabled={!title.trim() || !destination.trim() || loading}
          >
            Create Trip
          </Button>
        </div>
      </Modal>
    </Portal>
  );
}