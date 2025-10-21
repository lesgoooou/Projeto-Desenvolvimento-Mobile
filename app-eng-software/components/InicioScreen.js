import React, { Component } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default class StartScreen extends Component {
  render() {
    const { navigation } = this.props;
    
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Clínica Bem-Estar</Text>
          <Text style={styles.subtitle}>Bem-vindo ao nosso sistema!</Text>

          <TouchableOpacity
            style={styles.buttonPrimary}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.buttonText}>Já tenho uma conta</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttonSecondary}
            onPress={() => navigation.navigate("Cadastro")}
          >
            <Text style={styles.buttonSecondaryText}>Primeiro acesso</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f8",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 16,
    width: "85%",
    alignItems: "center",
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2d6cdf",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: "#333",
    marginBottom: 24,
  },
  buttonPrimary: {
    width: "100%",
    height: 48,
    backgroundColor: "#2d6cdf",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonSecondary: {
    width: "100%",
    height: 48,
    borderColor: "#2d6cdf",
    borderWidth: 2,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonSecondaryText: {
    color: "#2d6cdf",
    fontSize: 18,
    fontWeight: "bold",
  },
});