import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const BottomMenu = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.menu}>
      <TouchableOpacity onPress={() => navigation.popToTop()}> 
  <Icon name="home" size={24} color="black" />
  <Text style={styles.menuItemText}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('CreaSemilavoratoScreen')}>
        <Icon name="add-circle-outline" size={24} color="black" />
        <Text>Crea</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('ListaCompletaSemilavoratiScreen')}>
        <Icon name="list" size={24} color="black" />
        <Text>Lista</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('CategorieScreen')}>
        <Icon name="grid" size={24} color="black" />
        <Text>Categorie</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({

  menuItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10, // Aggiungi padding verticale per migliorare l'aspetto
  },

  menuItemText: {
    fontSize: 12, // Riduci la dimensione del testo per adattarlo meglio
    marginTop: 5, // Aggiungi un margine superiore per separare il testo dall'icona
  },

  menu: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
});

export default BottomMenu;