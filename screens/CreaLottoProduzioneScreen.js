import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  FlatList,
  Text,
} from "react-native";
import { createClient } from "@supabase/supabase-js";
import { Calendar } from "react-native-calendars";
import { Picker } from "@react-native-picker/picker";

const supabaseUrl = 'https://acanrjccdzyrarquivkb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjYW5yamNjZHp5cmFycXVpdmtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYyNjc0NTQsImV4cCI6MjA1MTg0MzQ1NH0.ljZLA5asW_vsrdd7Kd2Zimkc5wnqhbAXu2EdQbMunhE';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const CreaLottoProduzioneScreen = ({ route, navigation }) => {
  const { semilavoratoId } = route.params;
  const [dataProduzione, setDataProduzione] = useState(
    `${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${new Date().getDate().toString().padStart(2, '0')}`
  );
  const [responsabile, setResponsabile] = useState('');
  const [responsabili, setResponsabili] = useState([]);
  const [ingredienti, setIngredienti] = useState([]);
  const [ingredientiLotto, setIngredientiLotto] = useState([]);
  const [errors, setErrors] = useState({});
  const [note, setNote] = useState('');
  const [mostraCalendario, setMostraCalendario] = useState(false);

  const flatListRef = useRef(null);

  useEffect(() => {
    const fetchResponsabili = async () => {
      const { data, error } = await supabase
        .from('responsabili')
        .select('id, nome');

      if (error) {
        console.error('Errore durante il recupero dei responsabili:', error);
      } else {
        setResponsabili(data);
      }
    };

    const fetchIngredienti = async () => {
      const { data, error } = await supabase
        .from('ingredienti')
        .select('*')
        .eq('semilavoratoid', semilavoratoId);

      if (error) {
        console.error('Errore durante il recupero degli ingredienti:', error);
      } else {
        setIngredienti(data);
        setIngredientiLotto(data.map(ingrediente => ({
          ...ingrediente,
          quantita: 0,
          ddt: '',
          dataArrivo: ''
        })));
      }
    };

    fetchResponsabili();
    fetchIngredienti();
  }, []);


  const handleRimuoviIngrediente = (ingrediente) => {
    setIngredientiLotto(
      ingredientiLotto.filter((item) => item.id !== ingrediente.id),
    );
  };

  const handleQuantitaChange = (index, value) => {
    const updatedIngredienti = [...ingredientiLotto];
    updatedIngredienti[index].quantita = value;
    setIngredientiLotto(updatedIngredienti);
  };

  const handleDdtChange = (index, value) => {
    const updatedIngredienti = [...ingredientiLotto];
    updatedIngredienti[index].ddt = value;
    setIngredientiLotto(updatedIngredienti);
  };

  const handleDataArrivoChange = (index, value) => {
    const updatedIngredienti = [...ingredientiLotto];
    updatedIngredienti[index].dataArrivo = value;
    setIngredientiLotto(updatedIngredienti);
  };

  const handleSubmit = async () => {
    const newErrors = {};

    if (!dataProduzione) {
      newErrors.dataProduzione = 'Compilare il campo data di produzione';
    }
    // ... (aggiungi validazione per altri campi) ...

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const { error } = await supabase
        .from('lottiproduzione')
        .insert({
          semilavoratoid: semilavoratoId,
          dataproduzione: dataProduzione,
          responsabile: responsabile,
          ingredienti: { ingredienti: ingredientiLotto },
        });

      if (error) {
        console.error('Errore durante la creazione del lotto di produzione:', error);
      } else {
        navigation.goBack();
      }
    } catch (error) {
      console.error('Errore durante la creazione del lotto di produzione:', error);
    }
  };

  const handleDayPress = (day) => {
    setDataProduzione(day.dateString);
    setMostraCalendario(false);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Data produzione (YYYY-MM-DD)"
        value={dataProduzione}
        onFocus={() => setMostraCalendario(true)}
      />
      {mostraCalendario && (
        <Calendar
          onDayPress={handleDayPress}
          markedDates={{
            [dataProduzione]: { selected: true, selectedColor: "blue" },
          }}
        />
      )}
      <Picker
        style={styles.input}
        selectedValue={responsabile}
        onValueChange={(itemValue) => setResponsabile(itemValue)}
      >
        <Picker.Item label="Seleziona responsabile" value="" />
        {responsabili.map((r) => (
          <Picker.Item key={r.id} label={r.nome} value={r.id} />
        ))}
      </Picker>
      <Text style={styles.title}>Ingredienti:</Text>
      <FlatList
        ref={flatListRef}
        data={ingredientiLotto}
        renderItem={({ item, index }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>{item.nome}</Text>
            <TextInput
              style={styles.input}
              placeholder="Quantità"
              value={item.quantita.toString()}
              onChangeText={(value) => handleQuantitaChange(index, value)}
              keyboardType="numeric"
              onFocus={() => {
                flatListRef.current.scrollToIndex({ animated: true, index }); // Scorri alla posizione dell'input focalizzato
              }}
            />
            <TextInput
              style={styles.input}
              placeholder="DDT"
              value={item.ddt}
              onChangeText={(value) => handleDdtChange(index, value)}
              onFocus={() => {
                flatListRef.current.scrollToIndex({ animated: true, index }); // Scorri alla posizione dell'input focalizzato
              }}
            />
            <TextInput
              style={styles.input}
              placeholder="Data arrivo (YYYY-MM-DD)"
              value={item.dataArrivo}
              onChangeText={(value) => handleDataArrivoChange(index, value)}
              onFocus={() => {
                flatListRef.current.scrollToIndex({ animated: true, index }); // Scorri alla posizione dell'input focalizzato
              }}
            />
            <Button title="Rimuovi" onPress={() => handleRimuoviIngrediente(item)} />
          </View>
        )}
        keyExtractor={item => item.id.toString()}
      />
      <TextInput
        style={styles.input}
        placeholder="Note"
        value={note}
        onChangeText={setNote}
        multiline
      />
      <Button title="Crea" onPress={handleSubmit} />
    </View>
  );
};

// ... (codice degli stili) ...
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