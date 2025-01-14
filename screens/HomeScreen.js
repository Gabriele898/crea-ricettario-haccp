import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { createClient } from '@supabase/supabase-js';
import BottomMenu from './components/BottomMenu';

const supabaseUrl = 'https://acanrjccdzyrarquivkb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjYW5yamNjZHp5cmFycXVpdmtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYyNjc0NTQsImV4cCI6MjA1MTg0MzQ1NH0.ljZLA5asW_vsrdd7Kd2Zimkc5wnqhbAXu2EdQbMunhE';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const categorie = [
  'Entre',
  'Antipasti Freddi',
  'Antipasti caldi',
  'Primi piatti',
  'Secondi piatti',
  'Dessert'
];

const HomeScreen = ({ navigation }) => {
  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <LinearGradient
        colors={['#00FFFF', '#1E90FF']}
        style={styles.gradient}
      >
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate('CategoriaScreen', { nome: item })}
        >
          <Text style={styles.itemText}>{item}</Text> 
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={categorie}
        renderItem={renderItem}
        keyExtractor={item => item}
        numColumns={2} 
      />
      {/* Aggiungi il BottomMenu */}
      <BottomMenu /> 
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  item: {
    margin: 10,
    width: '45%', 
    height: 150, 
    borderRadius: 10, 
    overflow: 'hidden', 
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: { // Aggiungi stile per il pulsante
    padding: 20, 
    alignItems: 'center',
  },
  itemText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default HomeScreen;