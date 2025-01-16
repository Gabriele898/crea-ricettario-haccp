import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Ionicons from "react-native-vector-icons/Ionicons";

// Importa le tue schermate
import HomeScreen from "./screens/HomeScreen";
import CategorieScreen from "./screens/CategorieScreen";
import CreaSemilavoratoScreen from "./screens/CreaSemilavoratoScreen";
import ListaCompletaSemilavoratiScreen from "./screens/ListaCompletaSemilavoratiScreen";
import CreaLottoProduzioneScreen from "./screens/CreaLottoProduzioneScreen";
import DettagliSemilavoratoScreen from "./screens/DettagliSemilavoratoScreen";
import DettagliLottoScreen from "./screens/DettagliLottoScreen";
import CategoriaScreen from "./screens/CategoriaScreen";
import LottoProduzioneDetailsScreen from './screens/LottoProduzioneDetailsScreen'; // Importa l

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Home") {
              iconName = focused ? "home" : "home-outline";
            } else if (route.name === "Categorie") {
              iconName = focused ? "list" : "list-outline";
            } else if (route.name === "Crea") {
              iconName = focused ? "add-circle" : "add-circle-outline";
            } else if (route.name === "Lotti") {
              iconName = focused ? "cube" : "cube-outline";
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "tomato",
          tabBarInactiveTintColor: "gray",
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomeStackScreen}
          // Aggiungiamo options per rimuovere il titolo dalla tab bar
          options={{ headerShown: false, title: "" }} 
        />
        <Tab.Screen
          name="Categorie"
          component={CategorieScreen}
          options={{ headerShown: false, title: "" }}
        />
        <Tab.Screen
          name="Crea"
          component={CreaSemilavoratoScreen}
          options={{ headerShown: false, title: "" }}
        />
        <Tab.Screen
          name="Lotti"
          component={ListaCompletaSemilavoratiScreen}
          options={{ headerShown: false, title: "" }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const HomeStackScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ title: "Home" }}
      />
      <Stack.Screen
        name="LottoProduzioneDetailsScreen"
        component={LottoProduzioneDetailsScreen}
        options={{ title: "Dettagli Lotto" }}
      />
      <Stack.Screen
        name="CategoriaScreen"
        component={CategoriaScreen}
        options={{ title: "Categoria" }}
      />
      {/* Aggiungi altre schermate raggiungibili da HomeScreen se necessario */}
    </Stack.Navigator>
  );
};

export default App;