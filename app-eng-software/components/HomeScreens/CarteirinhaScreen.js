import React from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // ícones do Expo (inclui o ícone de seta)
import { useNavigation } from "@react-navigation/native";

export default function CarteirinhaScreen() {
  const navigation = useNavigation();
  const { width } = Dimensions.get("window");
  const cardWidth = width * 0.95;
  const cardHeight = 200;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="#fff" />
        <Text style={styles.backText}>Voltar</Text>
      </TouchableOpacity>

      <View style={[styles.card, { width: cardWidth, height: cardHeight }]}>
        <Text style={styles.title}>Carteirinha Digital</Text>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Nome:</Text>
          <Text style={styles.value}>Gabriel Oliveira</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Número:</Text>
          <Text style={styles.value}>1234 5678 9012</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Validade:</Text>
          <Text style={styles.value}>12/2026</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d0d2b",
    alignItems: "center",
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  backText: {
    color: "#fff",
    marginLeft: 5,
    fontSize: 16,
  },
  card: {
    backgroundColor: "#b10f2e",
    borderRadius: 20,
    padding: 20,
    justifyContent: "space-around",
    transform: [{ rotate: "90deg" }],
    elevation: 5,
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  value: {
    color: "#fff",
    fontSize: 16,
  },
});
