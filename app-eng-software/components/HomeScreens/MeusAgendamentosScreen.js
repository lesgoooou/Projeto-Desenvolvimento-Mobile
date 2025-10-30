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

export default class MeusAgendamentosScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: "proximos",
      agendamentos: [],
      historico: [],
      loading: true,
    };
  }

  componentDidMount() {
    this.carregarAgendamentos();
  }

  carregarAgendamentos = async () => {
  try {
    const user = firebase.auth().currentUser;
    if (!user) {
      Alert.alert('Erro', 'Usuário não autenticado');
      return;
    }

    const agora = new Date();

    const agendadosSnapshot = await firebase.database()
      .ref('/agendados')
      .orderByChild('userId')
      .equalTo(user.uid)
      .once('value');

    const agendamentosFuturos = [];
    const agendamentosPassados = [];

    agendadosSnapshot.forEach((child) => {
      const agendamento = {
        id: child.key,
        ...child.val()
      };

      const dataAgendamento = new Date(`${agendamento.data}T${agendamento.horario}:00`);

      if (dataAgendamento > agora) {
        agendamentosFuturos.push(agendamento);
      } else {
        agendamentosPassados.push(agendamento);
      }
    });

    const historicoSnapshot = await firebase.database()
      .ref('/historico')
      .orderByChild('userId')
      .equalTo(user.uid)
      .once('value');

    const historicoCompleto = [];
    historicoSnapshot.forEach((child) => {
      historicoCompleto.push({
        id: child.key,
        ...child.val()
      });
    });

    this.setState({
      agendamentos: agendamentosFuturos,
      historico: [...agendamentosPassados, ...historicoCompleto],
      loading: false,
    });

  } catch (error) {
    console.error('Erro ao carregar agendamentos:', error);
    Alert.alert('Erro', 'Não foi possível carregar os agendamentos');
    this.setState({ loading: false });
  }
  }

  handleMarcarComoFeito = (agendamento, foiFeito) => {
    const textoAcao = foiFeito ? "realizado" : "não realizado";
    
    Alert.alert(
      "Confirmar",
      `Confirma que o agendamento foi ${textoAcao}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar",
          onPress: () => this.moverParaHistorico(agendamento, foiFeito)
        }
      ]
    );
  }

  moverParaHistorico = async (agendamento, foiFeito) => {
    try {
      const user = firebase.auth().currentUser;

      await firebase.database()
        .ref('/historico')
        .push({
          userId: user.uid,
          tipo: agendamento.tipo,
          especialidade: agendamento.especialidade,
          profissional: agendamento.profissional,
          data: agendamento.data,
          horario: agendamento.horario,
          criadoEm: agendamento.criadoEm,
          feito: foiFeito,
          movido_em: new Date().toISOString(),
        });

      // Remove de Agendados
      await firebase.database()
        .ref(`/agendados/${agendamento.id}`)
        .remove();

      Alert.alert('Sucesso', 'Agendamento movido para o histórico');
      this.carregarAgendamentos();

    } catch (error) {
      console.error('Erro ao mover para histórico:', error);
      Alert.alert('Erro', 'Não foi possível atualizar o agendamento');
    }
  }

  handleCancelar = (agendamento) => {
    Alert.alert(
      "Cancelar Agendamento",
      `Deseja realmente cancelar este agendamento?`,
      [
        { text: "Não", style: "cancel" },
        {
          text: "Sim, Cancelar",
          style: "destructive",
          onPress: () => this.cancelarAgendamento(agendamento)
        }
      ]
    );
  }

  cancelarAgendamento = async (agendamento) => {
    try {
      await firebase.database()
        .ref(`/agendados/${agendamento.id}`)
        .remove();

      Alert.alert('Cancelado', 'Agendamento cancelado com sucesso');
      this.carregarAgendamentos();

    } catch (error) {
      console.error('Erro ao cancelar:', error);
      Alert.alert('Erro', 'Não foi possível cancelar o agendamento');
    }
  }

  formatarData = (dataISO) => {
    const [ano, mes, dia] = dataISO.split('-');
    return `${dia}/${mes}/${ano}`;
  }

  getIcone = (especialidade) => {
    const icones = {
      'Cardiologia': '❤️',
      'Dermatologia': '🔬',
      'Ortopedia': '🦴',
      'Pediatria': '👶',
      'Oftalmologia': '👁️',
      'Neurologia': '🧠',
      'Hemograma Completo': '💉',
      'Raio-X': '📷',
      'Ultrassom': '📡',
      'Ressonância': '🔍',
      'Tomografia': '🖼️',
      'Eletrocardiograma': '📊',
    };
    return icones[especialidade] || '📋';
  }

  renderAgendamentoCard = (agendamento, isPendente = false) => {
    return (
      <View key={agendamento.id} style={styles.appointmentCard}>
        <View style={styles.appointmentHeader}>
          <View style={styles.appointmentTypeContainer}>
            <Text style={styles.appointmentIcon}>
              {this.getIcone(agendamento.especialidade)}
            </Text>
            <View>
              <Text style={styles.appointmentType}>{agendamento.tipo}</Text>
              <Text style={styles.appointmentSpecialty}>{agendamento.especialidade}</Text>
            </View>
          </View>
          {!isPendente && agendamento.feito !== undefined && (
            <View style={[
              styles.statusBadge, 
              { backgroundColor: agendamento.feito ? "#4CAF50" : "#f44336" }
            ]}>
              <Text style={styles.statusText}>
                {agendamento.feito ? "Realizado" : "Não Realizado"}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.appointmentDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>👨‍⚕️</Text>
            <Text style={styles.detailText}>{agendamento.profissional}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>📅</Text>
            <Text style={styles.detailText}>{this.formatarData(agendamento.data)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>🕐</Text>
            <Text style={styles.detailText}>{agendamento.horario}</Text>
          </View>
        </View>

        // Botões apenas para agendamentos passados que ainda não foram marcados
        {isPendente && (
          <View style={styles.actionsContainer}>
            <Text style={styles.questionText}>Exame foi feito?</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.yesButton]}
                onPress={() => this.handleMarcarComoFeito(agendamento, true)}
              >
                <Text style={styles.yesButtonText}>✓ Sim</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionButton, styles.noButton]}
                onPress={() => this.handleMarcarComoFeito(agendamento, false)}
              >
                <Text style={styles.noButtonText}>✗ Não</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        // Botão de cancelar proximos agendamentos
        {!isPendente && this.state.selectedTab === "proximos" && (
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={() => this.handleCancelar(agendamento)}
          >
            <Text style={styles.cancelButtonText}>❌ Cancelar Agendamento</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  render() {
    const { navigation } = this.props;
    const { selectedTab, agendamentos, historico, loading } = this.state;

    if (loading) {
      return (
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Meus Agendamentos</Text>
          </View>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2d6cdf" />
          </View>
        </View>
      );
    }

    const historicoCompleto = historico.filter(a => a.feito !== undefined);
    const historicoPendente = historico.filter(a => a.feito === undefined);

    const currentList = selectedTab === "proximos" ? agendamentos : historicoCompleto;
    const isEmpty = currentList.length === 0 && historicoPendente.length === 0;

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Meus Agendamentos</Text>
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              selectedTab === "proximos" && styles.tabActive
            ]}
            onPress={() => this.setState({ selectedTab: "proximos" })}
          >
            <Text style={[
              styles.tabText,
              selectedTab === "proximos" && styles.tabTextActive
            ]}>
              Próximos
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              selectedTab === "historico" && styles.tabActive
            ]}
            onPress={() => this.setState({ selectedTab: "historico" })}
          >
            <Text style={[
              styles.tabText,
              selectedTab === "historico" && styles.tabTextActive
            ]}>
              Histórico
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.content}
        >
          {selectedTab === "historico" && historicoPendente.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Aguardando Confirmação</Text>
              {historicoPendente.map(agendamento => 
                this.renderAgendamentoCard(agendamento, true)
              )}
            </>
          )}

          {isEmpty ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📋</Text>
              <Text style={styles.emptyTitle}>Nenhum agendamento</Text>
              <Text style={styles.emptyText}>
                {selectedTab === "proximos" 
                  ? "Você não tem agendamentos futuros"
                  : "Você não tem histórico de agendamentos"}
              </Text>
              {selectedTab === "proximos" && (
                <TouchableOpacity
                  style={styles.agendarButton}
                  onPress={() => navigation.navigate("Agendar")}
                >
                  <Text style={styles.agendarButtonText}>Agendar Consulta/Exame</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <>
              {selectedTab === "historico" && historicoCompleto.length > 0 && (
                <Text style={styles.sectionTitle}>Histórico Completo</Text>
              )}
              {currentList.map(agendamento => 
                this.renderAgendamentoCard(agendamento, false)
              )}
            </>
          )}
        </ScrollView>
        
        {selectedTab === "proximos" && (
          <TouchableOpacity
            style={styles.floatingButton}
            onPress={() => navigation.navigate("Agendar")}
          >
            <Text style={styles.floatingButtonText}>+ Novo Agendamento</Text>
          </TouchableOpacity>
        )}
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
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 10,
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
  },
  tabActive: {
    borderBottomColor: "#2d6cdf",
  },
  tabText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  tabTextActive: {
    color: "#2d6cdf",
    fontWeight: "bold",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
    marginTop: 8,
  },
  appointmentCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },
  appointmentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  appointmentTypeContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  appointmentIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  appointmentType: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  appointmentSpecialty: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  appointmentDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailIcon: {
    fontSize: 16,
    marginRight: 8,
    width: 24,
  },
  detailText: {
    fontSize: 15,
    color: "#333",
  },
  actionsContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  questionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
  },
  actionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  yesButton: {
    backgroundColor: "#4CAF50",
  },
  yesButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  noButton: {
    backgroundColor: "#f44336",
  },
  noButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#ffebee",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  cancelButtonText: {
    color: "#f44336",
    fontSize: 14,
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
    marginBottom: 24,
  },
  agendarButton: {
    backgroundColor: "#2d6cdf",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 8,
  },
  agendarButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  floatingButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#2d6cdf",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    elevation: 5,
  },
  floatingButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});