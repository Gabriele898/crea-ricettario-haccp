import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://acanrjccdzyrarquivkb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjYW5yamNjZHp5cmFycXVpdmtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYyNjc0NTQsImV4cCI6MjA1MTg0MzQ1NH0.ljZLA5asW_vsrdd7Kd2Zimkc5wnqhbAXu2EdQbMunhE';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const IngredientiScreen = ({ navigation }) => {
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

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.itemText}>{item.nome}</Text>
      <Button 
        title="Dettagli" 
        onPress={() => navigation.navigate('IngredienteDetails', { id: item.id })} 
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={ingredienti}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
      <Button 
        title="Crea Ingrediente" 
        onPress={() => navigation.navigate('CreaIngrediente')} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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

export default IngredientiScreen;
