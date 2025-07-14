import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { 
  Text, 
  Switch, 
  List, 
  Divider, 
  Button, 
  useTheme,
  RadioButton,
  Dialog,
  Portal
} from 'react-native-paper';
import { useApp } from '../../context/AppContext';
import { StorageService } from '../../services/StorageService';
import * as Sharing from 'expo-sharing';

export default function SettingsScreen() {
  const theme = useTheme();
  const { state, actions } = useApp();
  const [showThemeDialog, setShowThemeDialog] = useState(false);

  const handleExportData = async () => {
    try {
      const data = await StorageService.exportTrips();
      const fileName = `triptrack-backup-${new Date().toISOString().split('T')[0]}.json`;
      
      // Create a temporary file and share it
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;
      await FileSystem.writeAsStringAsync(fileUri, data);
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert('Export Complete', 'Data exported successfully');
      }
    } catch (error) {
      Alert.alert('Export Failed', 'Failed to export data');
    }
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your trips and cannot be undone. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: async () => {
            try {
              await StorageService.saveTrips([]);
              await actions.loadTrips();
              Alert.alert('Success', 'All data has been cleared');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear data');
            }
          },
        },
      ]
    );
  };

  const updateTheme = (newTheme: 'light' | 'dark' | 'system') => {
    actions.updateSettings({
      ...state.settings,
      theme: newTheme,
    });
    setShowThemeDialog(false);
  };

  const updateNotifications = (enabled: boolean) => {
    actions.updateSettings({
      ...state.settings,
      notifications: enabled,
    });
  };

  const updateReminderTime = (minutes: number) => {
    actions.updateSettings({
      ...state.settings,
      defaultReminderTime: minutes,
    });
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    section: {
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.primary,
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    listItem: {
      backgroundColor: theme.colors.surface,
    },
    dangerButton: {
      marginHorizontal: 16,
      marginTop: 16,
    },
    dialogContent: {
      backgroundColor: theme.colors.surface,
    },
    radioItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8,
    },
    radioLabel: {
      marginLeft: 8,
      color: theme.colors.onSurface,
    },
  });

  const getThemeLabel = () => {
    switch (state.settings.theme) {
      case 'light': return 'Light';
      case 'dark': return 'Dark';
      case 'system': return 'System';
      default: return 'System';
    }
  };

  const getReminderLabel = () => {
    const minutes = state.settings.defaultReminderTime;
    if (minutes < 60) {
      return `${minutes} minutes`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      if (remainingMinutes === 0) {
        return `${hours} hour${hours > 1 ? 's' : ''}`;
      } else {
        return `${hours}h ${remainingMinutes}m`;
      }
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <List.Item
            title="Theme"
            description={getThemeLabel()}
            left={(props) => <List.Icon {...props} icon="palette" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => setShowThemeDialog(true)}
            style={styles.listItem}
          />
        </View>

        <Divider />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <List.Item
            title="Enable Notifications"
            description="Receive reminders for activities"
            left={(props) => <List.Icon {...props} icon="bell" />}
            right={() => (
              <Switch
                value={state.settings.notifications}
                onValueChange={updateNotifications}
              />
            )}
            style={styles.listItem}
          />
          <List.Item
            title="Default Reminder Time"
            description={`Remind me ${getReminderLabel()} before activities`}
            left={(props) => <List.Icon {...props} icon="clock" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {
              // You could implement a time picker here
              Alert.alert('Reminder Time', 'Time picker coming soon!');
            }}
            style={styles.listItem}
          />
        </View>

        <Divider />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data</Text>
          <List.Item
            title="Export Data"
            description="Save your trips to a file"
            left={(props) => <List.Icon {...props} icon="export" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={handleExportData}
            style={styles.listItem}
          />
          <List.Item
            title="Trip Statistics"
            description={`${state.trips.length} trips, ${state.trips.reduce((acc, trip) => acc + trip.days.length, 0)} days`}
            left={(props) => <List.Icon {...props} icon="chart-line" />}
            style={styles.listItem}
          />
        </View>

        <Button
          mode="outlined"
          onPress={handleClearData}
          style={styles.dangerButton}
          textColor={theme.colors.error}
        >
          Clear All Data
        </Button>
      </ScrollView>

      <Portal>
        <Dialog visible={showThemeDialog} onDismiss={() => setShowThemeDialog(false)}>
          <Dialog.Title>Choose Theme</Dialog.Title>
          <Dialog.Content style={styles.dialogContent}>
            {(['system', 'light', 'dark'] as const).map((themeOption) => (
              <TouchableOpacity
                key={themeOption}
                style={styles.radioItem}
                onPress={() => updateTheme(themeOption)}
              >
                <RadioButton
                  value={themeOption}
                  status={state.settings.theme === themeOption ? 'checked' : 'unchecked'}
                  onPress={() => updateTheme(themeOption)}
                />
                <Text style={styles.radioLabel}>
                  {themeOption.charAt(0).toUpperCase() + themeOption.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </Dialog.Content>
        </Dialog>
      </Portal>
    </View>
  );
}