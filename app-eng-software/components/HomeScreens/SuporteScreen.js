import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, Linking } from "react-native";

export default class ContatoSuporteScreen extends Component {
  telefone = "11989259944";

  fazerLigacao = () => {
    const numeroFormatado = `tel:${this.telefone}`;

    Linking.canOpenURL(numeroFormatado)
      .then((supported) => {
        if (supported) {
          Linking.openURL(numeroFormatado);
        } else {
          Alert.alert("Erro", "Seu dispositivo não suporta ligações");
        }
      })
      .catch((error) => {
        console.error("Erro ao abrir discador:", error);
        Alert.alert("Erro", "Não foi possível fazer a ligação");
      });
  }
  abrirWhatsApp = async () => {
  const numeroLimpo = this.telefone.replace(/[^0-9]/g, '');
  const mensagem = "Olá, preciso de suporte!";
  
  const whatsappURLiOS = `whatsapp://send?phone=${numeroLimpo}&text=${encodeURIComponent(mensagem)}`;
  const whatsappURLAndroid = `whatsapp://send?phone=${numeroLimpo}&text=${encodeURIComponent(mensagem)}`;
  const whatsappURLWeb = `https://wa.me/${numeroLimpo}?text=${encodeURIComponent(mensagem)}`;
  
  try {
    const iOSSupported = await Linking.canOpenURL(whatsappURLiOS);
    if (iOSSupported) {
      await Linking.openURL(whatsappURLiOS);
      return;
    }
    
    const androidSupported = await Linking.canOpenURL(whatsappURLAndroid);
    if (androidSupported) {
      await Linking.openURL(whatsappURLAndroid);
      return;
    }

    await Linking.openURL(whatsappURLWeb);
    
  } catch (error) {
    console.error("Erro ao abrir WhatsApp:", error);
    Alert.alert("Erro", "Não foi possível abrir o WhatsApp");
  }
  }

  render() {
    const { navigation } = this.props;

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

          <TouchableOpacity style={styles.button} onPress={this.fazerLigacao}>
            <Text style={styles.buttonText}>📞 Ligar para o Suporte</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={this.abrirWhatsApp}>
            <Text style={styles.buttonText}>📱 Falar via WhatsApp</Text>
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
