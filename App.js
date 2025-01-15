import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importa le tue schermate
import HomeScreen from './screens/HomeScreen';
import CategorieScreen from './screens/CategorieScreen';
import CategoriaScreen from './screens/CategoriaScreen';
import CreaSemilavoratoScreen from './screens/CreaSemilavoratoScreen';
import ListaCompletaSemilavoratiScreen from './screens/ListaCompletaSemilavoratiScreen';
import CreaLottoProduzioneScreen from './screens/CreaLottoProduzioneScreen';
import DettagliSemilavoratoScreen from './screens/DettagliSemilavoratoScreen';
import DettagliLottoScreen from './screens/DettagliLottoScreen';
import LottoProduzioneDetailsScreen from './screens/LottoProduzioneDetailsScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HomeScreen">
        <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ title: 'Home' }} />
        <Stack.Screen name="CategorieScreen" component={CategorieScreen} options={{ title: 'Categorie' }} />
        <Stack.Screen name="CategoriaScreen" component={CategoriaScreen} options={{ title: 'Categoria' }} />
        <Stack.Screen name="CreaSemilavoratoScreen" component={CreaSemilavoratoScreen} options={{ title: 'Crea Semilavorato' }} />
        <Stack.Screen name="ListaCompletaSemilavoratiScreen" component={ListaCompletaSemilavoratiScreen} options={{ title: 'Lista Semilavorati' }} />
        <Stack.Screen name="CreaLottoProduzioneScreen" component={CreaLottoProduzioneScreen} options={{ title: 'Crea Lotto Produzione' }} />
        <Stack.Screen name="DettagliSemilavoratoScreen" component={DettagliSemilavoratoScreen} options={{ title: 'Dettagli Semilavorato' }} />
        <Stack.Screen name="DettagliLottoScreen" component={DettagliLottoScreen} options={{ title: 'Dettagli Lotto' }} />
        <Stack.Screen name="LottoProduzioneDetailsScreen" component={LottoProduzioneDetailsScreen} options={{ title: 'Dettagli Lotto Produzione' }} 
/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;