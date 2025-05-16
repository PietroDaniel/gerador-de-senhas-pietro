import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import History from "./src/screens/history/History";
import Home from "./src/screens/home/Home";
import Signin from "./src/screens/login/Signin";
import Signup from "./src/screens/signup/Signup";
import { useAuth } from "./src/context/authContext";

const Stack = createNativeStackNavigator();

export default function Layout() {
  const { authState } = useAuth();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator>
          {authState.authenticated ? (
            // Rotas autenticadas
            <>
              <Stack.Screen
                name="Home"
                component={Home}
                options={{
                  headerTitle: "Home",
                }}
              />
              <Stack.Screen
                name="History"
                component={History}
                options={{
                  headerTitle: "Histórico de senhas",
                }}
              />
            </>
          ) : (
            // Rotas não autenticadas
            <>
              <Stack.Screen
                name="Signin"
                component={Signin}
                options={{
                  headerTitle: "Signin",
                }}
              />
              <Stack.Screen
                name="Signup"
                component={Signup}
                options={{
                  headerTitle: "Signup",
                }}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
} 