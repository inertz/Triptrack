import { Stack } from 'expo-router';
import { PaperProvider, MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { useColorScheme } from 'react-native';
import { AppProvider } from '../context/AppContext';

const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#007AFF',
    secondary: '#34C759',
    tertiary: '#FF9500',
    error: '#FF3B30',
  },
};

const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#007AFF',
    secondary: '#34C759',
    tertiary: '#FF9500',
    error: '#FF3B30',
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

  return (
    <AppProvider>
      <PaperProvider theme={theme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen 
            name="trip/[id]" 
            options={{ 
              title: 'Trip Details',
              headerBackTitle: 'Back'
            }} 
          />
        </Stack>
      </PaperProvider>
    </AppProvider>
  );
}