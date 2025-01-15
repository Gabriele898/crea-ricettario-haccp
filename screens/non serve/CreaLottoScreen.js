import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TextInput, ScrollView, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { createClient } from '@supabase/supabase-js';
import { Picker } from '@react-native-picker/picker';

const supabaseUrl = 'https://acanrjccdzyrarquivkb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjYW5yamNjZHp5cmFycXVpdmtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYyNjc0NTQsImV4cCI6MjA1MTg0MzQ1NH0.ljZLA5asW_vsrdd7Kd2Zimkc5wnqhbAXu2EdQbMunhE';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const CreaLottoScreen = ({ route, navigation }) => {
  const { semilavorato } = route.params;
  const [dataProduzione, setDataProduzione] = useState(new Date());
  const [responsabile, setResponsabile] = useState(null);
  const [ingredienti, setIngredienti] = useState([]);
  const [responsabili, setResponsabili] = useState([]);
  const [fornitori, setFornitori] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedIngredientIndex, setSelectedIngredientIndex] = useState(null);

  // Formatta la data per il componente TextInput
  const dataProduzioneStringa = dataProduzione.toISOString().split('T')[0];

  useEffect(() => {
    // Carica la lista dei responsabili e dei fornitori da Supabase
    const fetchResponsabili = async () => {
      // ... (codice per caricare i responsabili) ...
    };

    const fetchFornitori = async () => {
      // ... (codice per caricare i fornitori) ...
    };

    fetchResponsabili();
    fetchFornitori();

    // Imposta gli ingredienti iniziali 
    setIngredienti(semilavorato.ingredienti.map(ingrediente => ({
      ...ingrediente,
      ddt: '',
      dataArrivo: '',
      fornitoreId: null,
      note: '',
      quantita: 0,
    })));
  }, []);

  // ... (Funzioni handleDateChange e showDatepicker) ...

  const handleSubmit = async () => {
    // Validazione dei dati
    if (!responsabile) {
      Alert.alert('Errore', 'Seleziona un responsabile.');
      return;
    }

    if (ingredienti.some(ingrediente => !ingrediente.ddt || !ingrediente.dataArrivo || !ingrediente.fornitoreId || ingrediente.quantita <= 0)) {
      Alert.alert('Errore', 'Completa tutti i campi per ogni ingrediente.');
      return;
    }

    try {
      // Crea un nuovo oggetto lotto con i dati raccolti
      const nuovoLotto = {
        semilavoratoId: semilavorato.id,
        dataProduzione: dataProduzione.toISOString(),
        responsabile: responsabile,
        ingredienti: ingredienti,
      };

      // Esegui la query a Supabase per inserire il nuovo lotto nel database
      const { error } = await supabase
        .from('lottiProduzione')
        .insert([nuovoLotto]);

      if (error) {
        console.error('Errore durante la creazione del lotto:', error);
        Alert.alert('Errore', 'Si è verificato un errore durante la creazione del lotto.');
      } else {
        Alert.alert('Successo', 'Lotto creato con successo!', [
          { text: 'OK', onPress: () => navigation.navigate('DettagliLottoScreen', { lotto: nuovoLotto }) },
        ]);
      }
    } catch (error) {
      console.error('Errore generico:', error);
      Alert.alert('Errore', 'Si è verificato un errore.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crea Lotto per {semilavorato.nome}</Text>

      <TextInput
        style={styles.input}
        placeholder="Data di produzione"
        value={dataProduzioneStringa}
        onChangeText={(text) => setDataProduzione(new Date(text))} 
      />

      <Picker
        style={styles.picker}
        selectedValue={responsabile}
        onValueChange={(itemValue) => setResponsabile(itemValue)}
      >
        <Picker.Item label="Seleziona un responsabile" value={null} />
        {responsabili.map(resp => (
          <Picker.Item key={resp.id} label={resp.nome} value={resp.id} />
        ))}
      </Picker>

      {/* ... campi per gli ingredienti (DDT, data di arrivo, quantità, note) ... */}

      <Button title="Crea Lotto" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
  }
});

export default CreaLottoScreen;