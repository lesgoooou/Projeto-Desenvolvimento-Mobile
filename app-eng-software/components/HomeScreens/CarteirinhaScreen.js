import React, { Component } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator, 
  Modal,
  TextInput,
  ScrollView
} from "react-native";
import firebase from '../../config/config';

export default class CarteirinhaScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      carteirinha: null,
      usuario: null,
      mostrarModalCadastro: false,
      categoria: '',
      numero: '',
      validade: '',
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

  validarFormulario = () => {
    const { categoria, numero, validade } = this.state;

    if (!categoria.trim()) {
      Alert.alert('Atenção', 'Por favor, informe a categoria do convênio');
      return false;
    }

    if (!numero.trim()) {
      Alert.alert('Atenção', 'Por favor, informe o número da carteirinha');
      return false;
    }

    if (!validade.trim()) {
      Alert.alert('Atenção', 'Por favor, informe a validade');
      return false;
    }

    const validadeRegex = /^(0[1-9]|1[0-2])\/\d{4}$/;
    if (!validadeRegex.test(validade)) {
      Alert.alert('Atenção', 'Formato da validade inválido. Use MM/AAAA (ex: 12/2028)');
      return false;
    }

    return true;
  }

  cadastrarCarteirinha = () => {
    if (!this.validarFormulario()) {
      return;
    }

    this.setState({ loading: true, mostrarModalCadastro: false });
    
    const user = firebase.auth().currentUser;
    const dataCriacao = new Date().toISOString();
    
    firebase.database()
      .ref(`/carteiras/${user.uid}`)
      .set({
        userId: user.uid,
        nome: this.state.usuario.nome,
        categoria: this.state.categoria.trim(),
        numero: this.state.numero.trim(),
        validade: this.state.validade.trim(),
        criadaEm: dataCriacao,
      })
      .then(() => {
        this.setState({
          categoria: '',
          numero: '',
          validade: '',
        });
        this.carregarDados();
      })
      .catch((error) => {
        Alert.alert('Erro', 'Não foi possível cadastrar a carteirinha');
        console.error('Erro ao cadastrar carteirinha:', error);
        this.setState({ loading: false });
      });
  }

  abrirModalCadastro = () => {
    this.setState({ mostrarModalCadastro: true });
  }

  fecharModal = () => {
    this.setState({ 
      mostrarModalCadastro: false,
      categoria: '',
      numero: '',
      validade: '',
    });
  }

  formatarValidade = (texto) => {
    let numeros = texto.replace(/[^0-9]/g, '');

    numeros = numeros.substring(0, 6);

    if (numeros.length > 2) {
      numeros = numeros.substring(0, 2) + '/' + numeros.substring(2);
    }
    
    this.setState({ validade: numeros });
  }

  renderModalCadastro = () => {
    return (
      <Modal
        visible={this.state.mostrarModalCadastro}
        transparent={true}
        animationType="slide"
        onRequestClose={this.fecharModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>Cadastrar Carteirinha</Text>
              <Text style={styles.modalSubtitle}>
                Informe os dados da sua carteirinha do convênio
              </Text>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Categoria/Convênio *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: Unimed, Amil, Bradesco Saúde"
                  placeholderTextColor="#999"
                  value={this.state.categoria}
                  onChangeText={(texto) => this.setState({ categoria: texto })}
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Número da Carteirinha *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: 1234 5678 9012 3456"
                  placeholderTextColor="#999"
                  value={this.state.numero}
                  onChangeText={(texto) => this.setState({ numero: texto })}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Validade *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="MM/AAAA (Ex: 12/2028)"
                  placeholderTextColor="#999"
                  value={this.state.validade}
                  onChangeText={this.formatarValidade}
                  keyboardType="numeric"
                  maxLength={7}
                />
              </View>

              <TouchableOpacity 
                style={styles.salvarButton}
                onPress={this.cadastrarCarteirinha}
              >
                <Text style={styles.salvarButtonText}>Salvar Carteirinha</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.cancelarButton} 
                onPress={this.fecharModal}
              >
                <Text style={styles.cancelarText}>Cancelar</Text>
              </TouchableOpacity>
            </ScrollView>
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
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Voltar</Text>
        </TouchableOpacity>

        {!carteirinha ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="card-outline" size={80} color="#1d15b3" />
            <Text style={styles.emptyText}>
              Você ainda não cadastrou sua carteirinha
            </Text>
            <Text style={styles.emptySubtext}>
              Cadastre os dados da carteirinha do seu convênio
            </Text>
            <TouchableOpacity 
              style={styles.createButton} 
              onPress={this.abrirModalCadastro}
            >
              <Text style={styles.createButtonText}>Cadastrar Carteirinha</Text>
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
              <Text style={styles.label}>Convênio:</Text>
              <Text style={styles.value}>{carteirinha.categoria}</Text>
            </View>

            <View style={styles.infoContainer}>
              <Text style={styles.label}>Número:</Text>
              <Text style={styles.value}>{carteirinha.numero}</Text>
            </View>

            <View style={styles.infoContainer}>
              <Text style={styles.label}>Validade:</Text>
              <Text style={styles.value}>{carteirinha.validade}</Text>
            </View>
          </View>
        )}
        
        {this.renderModalCadastro()}
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
    backgroundColor: "#1d15b3",
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
    paddingHorizontal: 40,
  },
  emptyText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    textAlign: "center",
  },
  emptySubtext: {
    color: "#ccc",
    fontSize: 14,
    marginBottom: 30,
    textAlign: "center",
  },
  createButton: {
    backgroundColor: "#1d15b3",
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
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    width: "90%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0d0d2b",
    textAlign: "center",
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: "#333",
  },
  salvarButton: {
    backgroundColor: "#1d15b3",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  salvarButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelarButton: {
    marginTop: 12,
    padding: 12,
    alignItems: "center",
  },
  cancelarText: {
    color: "#666",
    fontSize: 16,
  },
});
