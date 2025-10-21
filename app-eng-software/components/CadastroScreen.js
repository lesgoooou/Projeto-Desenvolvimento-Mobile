import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import firebase from '../config/config';

export default class CadastroScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nome: '',
      user: '',
      password: '',
    };
  }

  gravar() {
    const email = this.state.user.toLowerCase();
    const password = this.state.password;
    const nome = this.state.nome;

    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        return userCredential.user.updateProfile({
          displayName: nome,
        });
      })
      .then(() => {
        Alert.alert('Sucesso', 'Usuário cadastrado com sucesso!');
        this.props.navigation.navigate('Home');
      })
      .catch((error) => {
        const errorCode = error.code;
        if (errorCode == 'auth/email-already-in-use') {
          console.log('Esse email já está em uso');
          Alert.alert('Erro', 'Esse email já está em uso');
        } else if (errorCode == 'auth/weak-password') {
          console.log('Senha fraca');
          Alert.alert('Erro', 'Senha fraca, digite outra senha');
        } else if (errorCode == 'auth/invalid-email') {
          console.log('Formato do email invalido');
          Alert.alert('Erro', 'Formato do email invalido');
        } else {
          console.log('Erro Desconhecido');
          Alert.alert('Erro', 'Ocorreu um erro' + +error);
        }
      });
  }

  render() {
    const { navigation } = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Cadastro</Text>
          <Text style={styles.subtitle}>Crie sua conta</Text>

          <TextInput
            style={styles.input}
            placeholder="Nome completo"
            placeholderTextColor="#302a2a"
            value={this.state.nome}
            onChangeText={(text) => this.setState({ nome: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#302a2a"
            value={this.state.user}
            onChangeText={(text) => this.setState({ user: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Senha"
            placeholderTextColor="#302a2a"
            secureTextEntry
            value={this.state.password}
            onChangeText={(text) => this.setState({ password: text })}
          />

          <TouchableOpacity style={styles.button} onPress={() => this.gravar()}>
            <Text style={styles.buttonText}>Cadastrar</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.link}>Já tenho uma conta</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    width: '85%',
    alignItems: 'center',
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2d6cdf',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    fontWeight: '600',
  },
  input: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  button: {
    width: '100%',
    height: 48,
    backgroundColor: '#2d6cdf',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  link: {
    color: '#2d6cdf',
    fontSize: 16,
    fontWeight: '600',
  },
});
