import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from "react-native";

export default class ContatoSuporteScreen extends Component {
  render() {
    const { navigation } = this.props;

    const mostrarTelefone = () => {
      Alert.alert("Telefone de Suporte", "📞 (11) 99999-9999");
    };

    const mostrarEmail = () => {
      Alert.alert("E-mail de Suporte", "✉️ biel.rosa.oliveira@gmail.com");
    };

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Contato e Suporte</Text>
        </View>

        <View style={styles.content}>
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/3050/3050525.png",
            }}
            style={styles.icon}
          />

          <Text style={styles.title}>Precisa de ajuda?</Text>
          <Text style={styles.text}>
            Entre em contato com nossa equipe de suporte. Estamos disponíveis para ajudar
            com dúvidas ou problemas no aplicativo.
          </Text>

          <TouchableOpacity style={styles.button} onPress={mostrarTelefone}>
            <Text style={styles.buttonText}>📞 Ligar para o Suporte</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={mostrarEmail}>
            <Text style={styles.buttonText}>✉️ Enviar E-mail</Text>
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
  },
  header: {
    backgroundColor: "#2d6cdf",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  icon: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#2d6cdf",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginVertical: 8,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
