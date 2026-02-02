/**
 * App.js - Punto de entrada de la aplicación móvil Su Todero D1
 */

import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Importar pantallas (las crearemos después)
import HomeScreen from './src/screens/HomeScreen';
import CameraScreen from './src/screens/CameraScreen';
import ProjectsScreen from './src/screens/ProjectsScreen';
import SettingsScreen from './src/screens/SettingsScreen';

// Firebase
import { initializeFirebase } from './src/services/firebase.service';

const Tab = createBottomTabNavigator();

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [firebaseReady, setFirebaseReady] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      try {
        // Inicializar Firebase
        await initializeFirebase();
        setFirebaseReady(true);
      } catch (error) {
        console.error('Error inicializando Firebase:', error);
        // Continuar sin Firebase (modo offline)
        setFirebaseReady(false);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Iniciando Su Todero D1...</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <NavigationContainer>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={styles.container}>
          <Tab.Navigator
            screenOptions={{
              tabBarActiveTintColor: '#007AFF',
              tabBarInactiveTintColor: '#8E8E93',
              headerShown: true,
              headerStyle: {
                backgroundColor: '#F2F2F7',
              },
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}>
            <Tab.Screen
              name="Inicio"
              component={HomeScreen}
              options={{
                tabBarIcon: ({ color }) => (
                  <Text style={{ fontSize: 24, color }}>🏠</Text>
                ),
              }}
            />
            <Tab.Screen
              name="Cámara"
              component={CameraScreen}
              options={{
                tabBarIcon: ({ color }) => (
                  <Text style={{ fontSize: 24, color }}>📷</Text>
                ),
              }}
            />
            <Tab.Screen
              name="Proyectos"
              component={ProjectsScreen}
              options={{
                tabBarIcon: ({ color }) => (
                  <Text style={{ fontSize: 24, color }}>📁</Text>
                ),
                tabBarBadge: 3,
              }}
            />
            <Tab.Screen
              name="Ajustes"
              component={SettingsScreen}
              options={{
                tabBarIcon: ({ color }) => (
                  <Text style={{ fontSize: 24, color }}>⚙️</Text>
                ),
              }}
            />
          </Tab.Navigator>
        </SafeAreaView>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#8E8E93',
  },
});

export default App;
