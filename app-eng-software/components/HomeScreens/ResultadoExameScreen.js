import React, { Component } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  Alert,
  ActivityIndicator
} from "react-native";
import firebase from '../../config/config';

export default class ResultadosExamesScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      exames: [],
      loading: true,
    };
  }

  componentDidMount() {
    this.carregarExames();
  }

  carregarExames = async () => {
    try {
      const user = firebase.auth().currentUser;
      if (!user) {
        Alert.alert('Erro', 'Usuário não autenticado');
        return;
      }

      // Busca no histórico apenas os que foram FEITOS
      const historicoSnapshot = await firebase.database()
        .ref('/historico')
        .orderByChild('userId')
        .equalTo(user.uid)
        .once('value');

      const examesFeitos = [];

      historicoSnapshot.forEach((child) => {
        const item = child.val();
        
        if (item.feito === true) {
          examesFeitos.push({
            id: child.key,
            name: item.especialidade,
            tipo: item.tipo,
            date: this.formatarData(item.data),
            lab: item.profissional,
          });
        }
      });

      this.setState({
        exames: examesFeitos,
        loading: false,
      });

    } catch (error) {
      console.error('Erro ao carregar exames:', error);
      Alert.alert('Erro', 'Não foi possível carregar os exames');
      this.setState({ loading: false });
    }
  }

  formatarData = (dataISO) => {
    // Converte "2025-10-31" para "31/10/2025"
    const [ano, mes, dia] = dataISO.split('-');
    return `${dia}/${mes}/${ano}`;
  }

  handleViewResult = (exam) => {
    Alert.alert(
      "Visualizar Resultado",
      `${exam.tipo}: ${exam.name}\nData: ${exam.date}\nProfissional: ${exam.lab}`,
      [{ text: "OK" }]
    );
  };

  renderExamCard = (exam) => {
    return (
      <View key={exam.id} style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.examName}>{exam.name}</Text>
          <View style={styles.availableBadge}>
            <Text style={styles.badgeText}>Disponível</Text>
          </View>
        </View>

        <Text style={styles.typeText}>📋 {exam.tipo}</Text>
        <Text style={styles.labText}>👨‍⚕️ {exam.lab}</Text>
        <Text style={styles.dateText}>📅 {exam.date}</Text>

        <TouchableOpacity 
          style={styles.viewButton}
          onPress={() => this.handleViewResult(exam)}
        >
          <Text style={styles.viewButtonText}>Ver Resultado</Text>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    const { navigation } = this.props;
    const { exames, loading } = this.state;

    if (loading) {
      return (
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Resultados de Exames</Text>
          </View>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2d6cdf" />
            <Text style={styles.loadingText}>Carregando...</Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Resultados de Exames</Text>
        </View>

        <ScrollView style={styles.scrollView}>
          <View style={styles.content}>
            {exames.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>📋</Text>
                <Text style={styles.emptyTitle}>Nenhum resultado disponível</Text>
                <Text style={styles.emptyText}>
                  Os resultados aparecerão aqui quando você marcar seus exames/consultas como realizados
                </Text>
              </View>
            ) : (
              exames.map(exam => this.renderExamCard(exam))
            )}
          </View>
        </ScrollView>
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
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  examName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  availableBadge: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  typeText: {
    fontSize: 15,
    color: "#666",
    marginBottom: 6,
  },
  labText: {
    fontSize: 15,
    color: "#666",
    marginBottom: 6,
  },
  dateText: {
    fontSize: 15,
    color: "#666",
    marginBottom: 12,
  },
  viewButton: {
    backgroundColor: "#2d6cdf",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  viewButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 40,
  },
});