/**
 * App.js - Punto de entrada de la aplicación móvil Su Todero D1
 */

import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import HomeScreen from './src/screens/HomeScreen';
import CameraScreen from './src/screens/CameraScreen';
import ProjectsScreen from './src/screens/ProjectsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';

import { AuthProvider, useAuth } from './src/context/AuthContext';
import { initializeFirebase } from './src/services/firebase.service';
import colors from './src/theme/colors';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const LoadingView = ({ message = 'Iniciando Su Todero D1...' }) => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color={colors.primary} />
    <Text style={styles.loadingText}>{message}</Text>
  </View>
);

const AppTabs = () => (
  <SafeAreaView style={styles.container}>
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: 'rgba(255,255,255,0.4)',
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.black,
        },
        headerTitleStyle: {
          fontWeight: 'bold',
          color: colors.textLight,
        },
        tabBarStyle: {
          backgroundColor: colors.black,
          borderTopColor: colors.borderGold,
        },
        tabBarLabelStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Inicio"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24, color }}>🏠</Text>,
        }}
      />
      <Tab.Screen
        name="Cámara"
        component={CameraScreen}
        options={{
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24, color }}>📷</Text>,
        }}
      />
      <Tab.Screen
        name="Proyectos"
        component={ProjectsScreen}
        options={{
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24, color }}>📁</Text>,
        }}
      />
      <Tab.Screen
        name="Ajustes"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24, color }}>⚙️</Text>,
        }}
      />
    </Tab.Navigator>
  </SafeAreaView>
);

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

const RootNavigator = () => {
  const { user, initializing } = useAuth();

  if (initializing) {
    return <LoadingView message="Sincronizando tu sesión..." />;
  }

  return user ? <AppTabs /> : <AuthStack />;
};

function App() {
  const [bootstrapping, setBootstrapping] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        await initializeFirebase();
      } catch (error) {
        console.error('Error inicializando Firebase:', error);
      } finally {
        setBootstrapping(false);
      }
    };

    bootstrap();
  }, []);

  if (bootstrapping) {
    return <LoadingView />;
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <AuthProvider>
        <NavigationContainer>
          <StatusBar barStyle="light-content" />
          <RootNavigator />
        </NavigationContainer>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.black,
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
  },
});

export default App;
