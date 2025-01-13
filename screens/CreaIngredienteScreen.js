import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://acanrjccdzyrarquivkb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjYW5yamNjZHp5cmFycXVpdmtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYyNjc0NTQsImV4cCI6MjA1MTg0MzQ1NH0.ljZLA5asW_vsrdd7Kd2Zimkc5wnqhbAXu2EdQbMunhE';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const CreaIngredienteScreen = ({ navigation }) => {
  const [nome, setNome] = useState('');
  const [fornitore, setFornitore] = useState('');
  const [unitaMisura, setUnitaMisura] = useState('');

  const handleSubmit = async () => {
    const { error } = await supabase
      .from('ingredienti')
      .insert({ nome, fornitore, unitaMisura });

    if (error) {
      console.error('Errore durante la creazione dell\'ingrediente:', error);
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.input}
        placeholder="Fornitore"
        value={fornitore}
        onChangeText={setFornitore}
      />
      <TextInput
        style={styles.input}
        placeholder="Unità di misura"
        value={unitaMisura}
        onChangeText={setUnitaMisura}
      />
      <Button title="Crea" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
  },
});

export default CreaIngredienteScreen;