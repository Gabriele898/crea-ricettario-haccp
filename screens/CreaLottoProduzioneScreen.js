import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  TextInput,
  Picker,
  ScrollView,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://acanrjccdzyrarquivkb.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjYW5yamNjZHp5cmFycXVpdmtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYyNjc0NTQsImV4cCI6MjA1MTg0MzQ1NH0.ljZLA5asW_vsrdd7Kd2Zimkc5wnqhbAXu2EdQbMunhE";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const CreaLottoProduzioneScreen = ({ navigation }) => {
  const [semilavoratoId, setSemilavoratoId] = useState(null);
  const [dataProduzione, setDataProduzione] = useState(new Date());
  const [responsabile, setResponsabile] = useState(null);
  const [ingredienti, setIngredienti] = useState([]);
  const [responsabili, setResponsabili] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedIngredientIndex, setSelectedIngredientIndex] = useState(null);
  const [note, setNote] = useState("");
  const [semilavorati, setSemilavorati] = useState([]);

  // Formatta la data per il componente TextInput
  const dataProduzioneStringa = dataProduzione.toISOString().split("T")[0];

  useEffect(() => {
    // Carica la lista dei responsabili da Supabase
    const fetchResponsabili = async () => {
      try {
        const { data, error } = await supabase
          .from("responsabili")
          .select("id, nome");

        if (error) {
          console.error("Errore nel recupero dei responsabili:", error);
        } else {
          setResponsabili(data);
        }
      } catch (error) {
        console.error("Errore generico:", error);
      }
    };

    fetchResponsabili();

    // Carica la lista dei semilavorati
    const fetchSemilavorati = async () => {
      try {
        const { data, error } = await supabase
          .from("semilavorati")
          .select("id, nome, ingredienti");

        if (error) {
          console.error("Errore nel recupero dei semilavorati:", error);
        } else {
          setSemilavorati(data);
        }
      } catch (error) {
        console.error("Errore generico:", error);
      }
    };
    fetchSemilavorati();
  }, []);

  useEffect(() => {
    // Aggiorna gli ingredienti quando il semilavorato cambia
    const fetchIngredienti = async () => {
      if (semilavoratoId) {
        try {
          const { data, error } = await supabase
            .from("ingredienti")
            .select("*")
            .eq("semilavoratoid", semilavoratoId);

          if (error) {
            console.error("Errore nel recupero degli ingredienti:", error);
          } else {
            setIngredienti(
              data.map((ingrediente) => ({
                ...ingrediente,
                ddt: "",
                dataArrivo: "",
                quantita: 0,
              }))
            );
          }
        } catch (error) {
          console.error("Errore generico:", error);
        }
      }
    };
    fetchIngredienti();
  }, [semilavoratoId]);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const updatedIngredienti = [...ingredienti];
      updatedIngredienti[selectedIngredientIndex].dataArrivo =
        selectedDate.toISOString().split("T")[0];
      setIngredienti(updatedIngredienti);
    }
  };

  const showDatepicker = (index) => {
    setShowDatePicker(true);
    setSelectedIngredientIndex(index);
  };

  const handleSubmit = async () => {
    // Validazione dei dati
    if (!semilavoratoId || !responsabile) {
      Alert.alert("Errore", "Seleziona un semilavorato e un responsabile.");
      return;
    }

    if (
      ingredienti.some(
        (ingrediente) =>
          !ingrediente.ddt ||
          !ingrediente.dataArrivo ||
          ingrediente.quantita <= 0
      )
    ) {
      Alert.alert("Errore", "Completa tutti i campi per ogni ingrediente.");
      return;
    }

    try {
      // Crea un nuovo oggetto lotto con i dati raccolti
      const nuovoLotto = {
        semilavoratoid: semilavoratoId, // Corretto semilavoratoId in semilavoratoid
        dataproduzione: dataProduzione.toISOString(), // Corretto dataProduzione in dataproduzione
        responsabile: responsabile,
        ingredienti: ingredienti,
        note: note,
      };

      // Esegui la query a Supabase per inserire il nuovo lotto nel database
      const { error } = await supabase
        .from("lottiproduzione")
        .insert([nuovoLotto]);

      if (error) {
        console.error("Errore durante la creazione del lotto:", error);
        Alert.alert(
          "Errore",
          "Si è verificato un errore durante la creazione del lotto."
        );
      } else {
        Alert.alert("Successo", "Lotto creato con successo!", [
          {
            text: "OK",
            onPress: () =>
              navigation.navigate("DettagliLottoScreen", { lotto: nuovoLotto }),
          },
        ]);
      }
    } catch (error) {
      console.error("Errore generico:", error);
      Alert.alert("Errore", "Si è verificato un errore.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Picker per il semilavorato */}
      <Picker
        style={styles.picker}
        selectedValue={semilavoratoId}
        onValueChange={(itemValue) => setSemilavoratoId(itemValue)}
      >
        <Picker.Item label="Seleziona un semilavorato" value={null} />
        {semilavorati.map((semilavorato) => (
          <Picker.Item
            key={semilavorato.id}
            label={semilavorato.nome}
            value={semilavorato.id}
          />
        ))}
      </Picker>

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
        {responsabili.map((resp) => (
          <Picker.Item key={resp.id} label={resp.nome} value={resp.id} />
        ))}
      </Picker>

      <ScrollView>
        {ingredienti.map((ingrediente, index) => (
          <View key={ingrediente.id} style={styles.ingredienteContainer}>
            <Text style={styles.ingredienteNome}>{ingrediente.nome}</Text>
            <TextInput
              style={styles.input}
              placeholder="DDT"
              value={ingrediente.ddt}
              onChangeText={(text) => {
                const updatedIngredienti = [...ingredienti];
                updatedIngredienti[index].ddt = text;
                setIngredienti(updatedIngredienti);
              }}
            />

            <View style={styles.calendarioContainer}>
              <TouchableOpacity onPress={() => showDatepicker(index)}>
                <Text>📅</Text>
              </TouchableOpacity>
              {ingrediente.dataArrivo ? (
                <Text>{ingrediente.dataArrivo}</Text>
              ) : (
                <Text>Seleziona data</Text>
              )}
            </View>

            {showDatePicker && (
              <DateTimePicker
                value={new Date(
                  ingredienti[selectedIngredientIndex].dataArrivo || Date.now()
                )}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}

            <TextInput
              style={styles.input}
              placeholder="Quantità"
              keyboardType="numeric"
              value={ingrediente.quantita.toString()}
              onChangeText={(text) => {
                const updatedIngredienti = [...ingredienti];
                updatedIngredienti[index].quantita = parseInt(text, 10) || 0;
                setIngredienti(updatedIngredienti);
              }}
            />

            <TextInput
              style={styles.input}
              placeholder="Note"
              value={ingrediente.note}
              onChangeText={(text) => {
                const updatedIngredienti = [...ingredienti];
                updatedIngredienti[index].note = text;
                setIngredienti(updatedIngredienti);
              }}
            />
          </View>
        ))}
      </ScrollView>

      <TextInput
        style={styles.input}
        placeholder="Note"
        value={note}
        onChangeText={setNote}
      />

      <Button title="Crea Lotto" onPress={handleSubmit} />
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