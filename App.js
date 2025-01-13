import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/HomeScreen';
import SemilavoratoDetailsScreen from './screens/SemilavoratoDetailsScreen';
import LottoProduzioneDetailsScreen from './screens/LottoProduzioneDetailsScreen';
import CreaLottoProduzioneScreen from './screens/CreaLottoProduzioneScreen';
import CreaSemilavoratoScreen from './screens/CreaSemilavoratoScreen';
import IngredientiScreen from './screens/IngredientiScreen';
import ModificaSemilavoratoScreen from './screens/ModificaSemilavoratoScreen';
import CategoriaScreen from './screens/CategoriaScreen'; 

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="SemilavoratoDetails" component={SemilavoratoDetailsScreen} />
        <Stack.Screen name="LottoProduzioneDetails" component={LottoProduzioneDetailsScreen} />
        <Stack.Screen name="CreaLottoProduzione" component={CreaLottoProduzioneScreen} />
        <Stack.Screen name="CreaSemilavorato" component={CreaSemilavoratoScreen} />
        <Stack.Screen name="Ingredienti" component={IngredientiScreen} />
        <Stack.Screen name="ModificaSemilavorato" component={ModificaSemilavoratoScreen} />
        <Stack.Screen name="Categoria" component={CategoriaScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;