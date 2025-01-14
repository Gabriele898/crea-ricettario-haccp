import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, FlatList, Text, } from 'react-native';
import { createClient } from '@supabase/supabase-js';
import { Picker } from '@react-native-picker/picker';

const supabaseUrl = 'https://acanrjccdzyrarquivkb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjYW5yamNjZHp5cmFycXVpdmtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYyNjc0NTQsImV4cCI6MjA1MTg0MzQ1NH0.ljZLA5asW_vsrdd7Kd2Zimkc5wnqhbAXu2EdQbMunhE';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const CreaSemilavoratoScreen = ({ navigation }) => {
  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState('');
  const [ingredientiSelezionati, setIngredientiSelezionati] = useState([]);
  const [ingredienti, setIngredienti] = useState([]);

  useEffect(() => {
    const fetchIngredienti = async () => {
      const { data, error } = await supabase
        .from('ingredienti')
        .select('*');

      if (error) {
        console.error('Errore durante il recupero degli ingredienti:', error);
      } else {
        setIngredienti(data);
      }
    };

    fetchIngredienti();
  }, []);

  const handleAggiungiIngrediente = (ingrediente) => {
    setIngredientiSelezionati([...ingredientiSelezionati, ingrediente]);
  };

  const handleRimuoviIngrediente = (ingrediente) => {
    setIngredientiSelezionati(ingredientiSelezionati.filter(item => item.id !== ingrediente.id));
  };

  const handleSubmit = async () => {
    // Validazione (aggiunta)
    if (!nome || !categoria || ingredientiSelezionati.length === 0) {
      alert('Per favore, compila tutti i campi.'); 
      return;
    }

    try {
      const { error } = await supabase
        .from('semilavorati')
        .insert({ nome, categoria, ingredienti: ingredientiSelezionati.map(i => i.id) });

      if (error) {
        console.error('Errore durante la creazione del semilavorato:', error);
        // Gestisci l'errore, ad esempio mostrando un messaggio all'utente
      } else {
        // Reindirizza l'utente alla schermata appropriata dopo la creazione
        navigation.navigate('ListaCompletaSemilavoratiScreen'); 
      }
    } catch (error) {
      console.error('Errore generico:', error);
      // Gestisci l'errore, ad esempio mostrando un messaggio all'utente
    }
  };

  return (
    <View style={styles.container}>
      {/* ... (input per nome) ... */}

      {/* Picker per la categoria */}
      <Picker
        style={styles.picker} 
        selectedValue={categoria}
        onValueChange={(itemValue) => setCategoria(itemValue)}
      >
        <Picker.Item label="Seleziona una categoria" value="" />
        <Picker.Item label="Entre" value="Entre" />
        <Picker.Item label="Antipasti Freddi" value="Antipasti Freddi" />
        <Picker.Item label="Antipasti Caldi" value="Antipasti Caldi" />
        {/* ... altre categorie ... */}
      </Picker>

      {/* ... (FlatList per ingredienti selezionati e da aggiungere) ... */}
      <Button title="Crea" onPress={handleSubmit} />
    </View>
  );
};


  // ... (stili esistenti) ...

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  picker: {  // Stile per il Picker
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemText: {
    fontSize: 16,
  },
});

export default CreaSemilavoratoScreen;
