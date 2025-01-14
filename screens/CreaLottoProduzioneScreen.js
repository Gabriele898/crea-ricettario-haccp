import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TextInput, Picker, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://acanrjccdzyrarquivkb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjYW5yamNjZHp5cmFycXVpdmtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYyNjc0NTQsImV4cCI6MjA1MTg0MzQ1NH0.ljZLA5asW_vsrdd7Kd2Zimkc5wnqhbAXu2EdQbMunhE';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const CreaLottoScreen = ({ route, navigation }) => {
  const { semilavorato } = route.params;
  const [dataProduzione, setDataProduzione] = useState(new Date());
  const [responsabile, setResponsabile] = useState(null);
  const [ingredienti, setIngredienti] = useState([]);
  const [responsabili, setResponsabili] = useState([]);
  const [fornitori, setFornitori] = useState([]); // Aggiunto stato per i fornitori
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedIngredientIndex, setSelectedIngredientIndex] = useState(null);

  // Formatta la data per il componente TextInput
  const dataProduzioneStringa = dataProduzione.toISOString().split('T')[0];

  useEffect(() => {
    // Carica la lista dei responsabili da Supabase
    const fetchResponsabili = async () => {
      // ... (codice per caricare i responsabili) ...
    };

    // Carica la lista dei fornitori da Supabase
    const fetchFornitori = async () => {
      try {
        const { data, error } = await supabase
          .from('fornitori') // Nome della tabella dei fornitori
          .select('id, nome');

        if (error) {
          console.error('Errore nel recupero dei fornitori:', error);
        } else {
          setFornitori(data);
        }
      } catch (error) {
        console.error('Errore generico:', error);
      }
    };

    fetchResponsabili();
    fetchFornitori(); // Chiama la funzione per caricare i fornitori

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
        // Mostra un messaggio di errore all'utente
      } else {
        // Mostra un messaggio di successo all'utente
        // Reindirizza l'utente alla schermata di dettagli del lotto appena creato
        navigation.navigate('DettagliLottoScreen', { lotto: nuovoLotto });
      }
    } catch (error) {
      console.error('Errore generico:', error);
      // Mostra un messaggio di errore all'utente
    }
  };


  return (
    <View style={styles.container}>
      {/* ... (Titolo, input per data di produzione, picker per responsabile) ... */}

      <ScrollView>
        {ingredienti.map((ingrediente, index) => (
          <View key={ingrediente.id} style={styles.ingredienteContainer}>
            {/* ... (Nome ingrediente, input per DDT, calendario per data di arrivo) ... */}

            {/* Picker per il fornitore */}
            <Picker
              style={styles.picker}
              selectedValue={ingrediente.fornitoreId}
              onValueChange={(itemValue) => {
                const updatedIngredienti = [...ingredienti];
                updatedIngredienti[index].fornitoreId = itemValue;
                setIngredienti(updatedIngredienti);
              }}
            >
              <Picker.Item label="Seleziona un fornitore" value={null} />
              {fornitori.map(fornitore => (
                <Picker.Item key={fornitore.id} label={fornitore.nome} value={fornitore.id} />
              ))}
            </Picker>

            {/* ... (Input per quantità e note) ... */}
          </View>
        ))}
      </ScrollView>

      <Button title="Crea Lotto" onPress={handleSubmit} />
    </View>
  );
};

// ... (Stili) ...

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  itemText: {
    fontSize: 16,
  },
});

export default CreaLottoProduzioneScreen;