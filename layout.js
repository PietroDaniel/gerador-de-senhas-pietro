import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import History from "./src/screens/history/History";
import Home from "./src/screens/home/Home";

const Stack = createNativeStackNavigator();

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={Home}
            options={{
              headerTitle: "Gerador de Senhas",
            }}
          />
          <Stack.Screen
            name="History"
            component={History}
            options={{
              headerTitle: "Histórico de senhas",
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
} 