import React, { Component } from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Alert, ActivityIndicator, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import firebase from 'firebase';

class CarteirinhaScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      carteirinha: null,
      usuario: null,
      mostrarModalCategoria: false,
    };
  }

  componentDidMount() {
    this.carregarDados();
  }

  carregarDados = async () => {
    try {
      const user = firebase.auth().currentUser;
      if (!user) {
        Alert.alert('Erro', 'Usuário não autenticado');
        this.props.navigation.goBack();
        return;
      }

      const userSnapshot = await firebase.database()
        .ref(`/users/${user.uid}`)
        .once('value');
      
      this.setState({ usuario: userSnapshot.val() });

      const carteirinhaSnapshot = await firebase.database()
        .ref(`/carteiras/${user.uid}`)
        .once('value');
      
      if (carteirinhaSnapshot.exists()) {
        this.setState({ carteirinha: carteirinhaSnapshot.val() });
      }
      
      this.setState({ loading: false });
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados');
      this.setState({ loading: false });
    }
  }

  gerarNumeroCarteirinha = () => {
    const parte1 = Math.floor(1000 + Math.random() * 9000);
    const parte2 = Math.floor(1000 + Math.random() * 9000);
    const parte3 = Math.floor(1000 + Math.random() * 9000);
    return `${parte1} ${parte2} ${parte3}`;
  }
  
  calcularDataValidade = () => {
    const dataAtual = new Date();
    const dataValidade = new Date(dataAtual.setFullYear(dataAtual.getFullYear() + 5));
    const mes = String(dataValidade.getMonth() + 1).padStart(2, '0');
    const ano = dataValidade.getFullYear();
    return `${mes}/${ano}`;
  }

  criarCarteirinha = (categoria) => {
    this.setState({ loading: true, mostrarModalCategoria: false });
    
    const user = firebase.auth().currentUser;
    const numeroCarteirinha = this.gerarNumeroCarteirinha();
    const dataValidade = this.calcularDataValidade();
    const dataCriacao = new Date().toISOString();
    
    firebase.database()
      .ref(`/carteiras/${user.uid}`)
      .set({
        userId: user.uid,
        nome: this.state.usuario.nome,
        numero: numeroCarteirinha,
        categoria: categoria,
        dataValidade: dataValidade,
        criadaEm: dataCriacao,
      })
      .then(() => {
        Alert.alert('Sucesso', 'Carteirinha criada com sucesso!');
        this.carregarDados();
      })
      .catch((error) => {
        Alert.alert('Erro', 'Não foi possível criar a carteirinha');
        console.error('Erro ao criar carteirinha:', error);
        this.setState({ loading: false });
      });
  }

  abrirModalCategoria = () => {
    this.setState({ mostrarModalCategoria: true });
  }

  fecharModal = () => {
    this.setState({ mostrarModalCategoria: false });
  }

  selecionarCategoria = (categoria) => {
    this.criarCarteirinha(categoria);
  }

  renderModalCategoria = () => {
    const categorias = [
      { id: 1, nome: 'Bem Estar Basic' },
      { id: 2, nome: 'Bem Estar Plus' },
      { id: 3, nome: 'Bem Estar Premium' },
    ];

    return (
      <Modal
        visible={this.state.mostrarModalCategoria}
        transparent={true}
        animationType="slide"
        onRequestClose={this.fecharModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Escolha sua Categoria</Text>

            {categorias.map((categoria) => (
              <TouchableOpacity
                key={categoria.id}
                style={styles.categoriaButton}
                onPress={() => this.selecionarCategoria(categoria.nome)}
              >
                <Text style={styles.categoriaText}>{categoria.nome}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity 
              style={styles.cancelarButton} 
              onPress={this.fecharModal}
            >
              <Text style={styles.cancelarText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  render() {
    const { navigation } = this.props;
    const { loading, carteirinha } = this.state;
    const { width } = Dimensions.get("window");
    const cardWidth = width * 0.95;
    const cardHeight = 200;

    if (loading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#b10f2e" />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={28} color="#fff" />
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>

        {!carteirinha ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="card-outline" size={80} color="#b10f2e" />
            <Text style={styles.emptyText}>
              Você ainda não possui uma carteirinha
            </Text>
            <TouchableOpacity 
              style={styles.createButton} 
              onPress={this.abrirModalCategoria}
            >
              <Text style={styles.createButtonText}>Criar Carteirinha</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={[styles.card, { width: cardWidth, height: cardHeight }]}>
            <Text style={styles.title}>Carteirinha Digital</Text>

            <View style={styles.infoContainer}>
              <Text style={styles.label}>Nome:</Text>
              <Text style={styles.value}>{carteirinha.nome}</Text>
            </View>

            <View style={styles.infoContainer}>
              <Text style={styles.label}>Número:</Text>
              <Text style={styles.value}>{carteirinha.numero}</Text>
            </View>

            <View style={styles.infoContainer}>
              <Text style={styles.label}>Categoria:</Text>
              <Text style={styles.value}>{carteirinha.categoria}</Text>
            </View>

            <View style={styles.infoContainer}>
              <Text style={styles.label}>Validade:</Text>
              <Text style={styles.value}>{carteirinha.dataValidade}</Text>
            </View>
          </View>
        )}
        
        {this.renderModalCategoria()}
      </View>
    );
  }
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
    zIndex: 10,
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
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    color: "#fff",
    fontSize: 18,
    marginTop: 20,
    marginBottom: 30,
    textAlign: "center",
    paddingHorizontal: 40,
  },
  createButton: {
    backgroundColor: "#b10f2e",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  createButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    width: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0d0d2b",
    textAlign: "center",
    marginBottom: 20,
  },
  categoriaButton: {
    backgroundColor: "#b10f2e",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  categoriaText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  cancelarButton: {
    marginTop: 10,
    padding: 15,
  },
  cancelarText: {
    color: "#666",
    fontSize: 16,
    textAlign: "center",
  },
});

export default CarteirinhaScreen;