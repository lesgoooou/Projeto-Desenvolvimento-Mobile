import React, { Component } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import firebase from "firebase";

export default class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      usuario: "",
      senha: ""
    };
  }

  ler() {
    this.props.navigation.navigate("Home");
    // const email = this.state.usuario.toLowerCase();
    // const password = this.state.senha;

    // firebase.auth()
    //   .signInWithEmailAndPassword(email, password)
    //   .then(() => {
    //     Alert.alert("Logado!!!", "Login realizado com sucesso!");
    //     this.props.navigation.navigate("Home", { email: this.state.usuario });
    //   })
    //   .catch(error => {
    //     const errorCode = error.code;
    //     if (errorCode === "auth/invalid-email") {
    //       console.log("Formato do email invalido");
    //       Alert.alert("Formato do email invalido");
    //     } else {
    //       console.log("Erro Desconhecido");
    //       Alert.alert("Ocorreu um erro");
    //     }
    //   });
  }

  render() {
    const { navigation } = this.props;
    
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Clínica Bem-Estar</Text>
          <Text style={styles.subtitle}>Acesso ao Sistema</Text>

          <TextInput 
            style={styles.input} 
            placeholder="Usuário"
            placeholderTextColor="#302a2a"
            value={this.state.usuario}
            onChangeText={(text) => this.setState({ usuario: text })}
          />
          <TextInput 
            style={styles.input} 
            placeholder="Senha" 
            placeholderTextColor="#302a2a"
            secureTextEntry 
            value={this.state.senha}
            onChangeText={(text) => this.setState({ senha: text })}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={() => this.ler()}
          >
            <Text style={styles.buttonText}>Entrar</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Cadastro")}>
            <Text style={styles.link}>Primeiro acesso? Cadastre-se</Text>
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
    fontSize: 22,
    fontWeight: "bold",
    color: "#2d6cdf",
    textAlign: "center",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#333",
    marginBottom: 20,
    fontWeight: "600",
  },
  input: {
    width: "100%",
    height: 48,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: "#fafafa",
  },
  button: {
    width: "100%",
    height: 48,
    backgroundColor: "#2d6cdf",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  link: {
    color: "#2d6cdf",
    fontSize: 16,
    fontWeight: "600",
  },
});