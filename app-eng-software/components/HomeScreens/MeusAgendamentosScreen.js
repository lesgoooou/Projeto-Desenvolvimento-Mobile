import React, { Component } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  Alert 
} from "react-native";

export default class MeusAgendamentosScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: "proximos",
      appointments: [
        {
          id: 1,
          type: "Consulta",
          specialty: "Cardiologia",
          doctor: "Dr. Carlos Silva",
          date: "20/10/2025",
          time: "09:00",
          status: "confirmado",
          icon: "❤️"
        },
        {
          id: 2,
          type: "Exame",
          specialty: "Hemograma Completo",
          doctor: "Lab Central",
          date: "22/10/2025",
          time: "08:00",
          status: "confirmado",
          icon: "💉"
        },
        {
          id: 3,
          type: "Consulta",
          specialty: "Dermatologia",
          doctor: "Dra. Maria Santos",
          date: "25/10/2025",
          time: "14:30",
          status: "confirmado",
          icon: "🔬"
        },
      ],
      history: [
        {
          id: 4,
          type: "Consulta",
          specialty: "Oftalmologia",
          doctor: "Dr. João Oliveira",
          date: "10/10/2025",
          time: "10:00",
          status: "realizado",
          icon: "👁️"
        },
        {
          id: 5,
          type: "Exame",
          specialty: "Raio-X",
          doctor: "Lab Central",
          date: "05/10/2025",
          time: "15:00",
          status: "realizado",
          icon: "📷"
        },
        {
          id: 6,
          type: "Consulta",
          specialty: "Pediatria",
          doctor: "Dra. Ana Costa",
          date: "28/09/2025",
          time: "11:00",
          status: "cancelado",
          icon: "👶"
        },
      ],
    };
  }

  handleCancelAppointment = (appointment) => {
    Alert.alert(
      "Cancelar Agendamento",
      `Deseja realmente cancelar ${appointment.type.toLowerCase()} de ${appointment.specialty}?`,
      [
        {
          text: "Não",
          style: "cancel"
        },
        {
          text: "Sim, Cancelar",
          style: "destructive",
          onPress: () => {
            Alert.alert("Cancelado", "Seu agendamento foi cancelado com sucesso");
            this.setState({
              appointments: this.state.appointments.filter(a => a.id !== appointment.id)
            });
          }
        }
      ]
    );
  };

  renderAppointmentCard = (appointment, showActions = true) => {
    const statusColors = {
      confirmado: "#4CAF50",
      realizado: "#2196F3",
      cancelado: "#f44336"
    };

    const statusLabels = {
      confirmado: "Confirmado",
      realizado: "Realizado",
      cancelado: "Cancelado"
    };

    return (
      <View key={appointment.id} style={styles.appointmentCard}>
        <View style={styles.appointmentHeader}>
          <View style={styles.appointmentTypeContainer}>
            <Text style={styles.appointmentIcon}>{appointment.icon}</Text>
            <View>
              <Text style={styles.appointmentType}>{appointment.type}</Text>
              <Text style={styles.appointmentSpecialty}>{appointment.specialty}</Text>
            </View>
          </View>
          <View style={[
            styles.statusBadge, 
            { backgroundColor: statusColors[appointment.status] }
          ]}>
            <Text style={styles.statusText}>{statusLabels[appointment.status]}</Text>
          </View>
        </View>

        <View style={styles.appointmentDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>👨‍⚕️</Text>
            <Text style={styles.detailText}>{appointment.doctor}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>📅</Text>
            <Text style={styles.detailText}>{appointment.date}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>🕐</Text>
            <Text style={styles.detailText}>{appointment.time}</Text>
          </View>
        </View>

        {showActions && appointment.status === "confirmado" && (
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => Alert.alert("Remarcar", "Função em desenvolvimento")}
            >
              <Text style={styles.actionButtonText}>📅 Remarcar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.cancelButton]}
              onPress={() => this.handleCancelAppointment(appointment)}
            >
              <Text style={[styles.actionButtonText, styles.cancelButtonText]}>❌ Cancelar</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  render() {
    const { navigation } = this.props;
    const { selectedTab, appointments, history } = this.state;

    const currentList = selectedTab === "proximos" ? appointments : history;
    const isEmpty = currentList.length === 0;

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
                  style={styles.AgendarButton}
                  onPress={() => navigation.navigate("Agendar")}
                >
                  <Text style={styles.AgendarButtonText}>Agendar Consulta/Exame</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <>
              {currentList.map(appointment => 
                this.renderAppointmentCard(appointment, selectedTab === "proximos")
              )}
            </>
          )}
        </ScrollView>
        
        {!isEmpty && selectedTab === "proximos" && (
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
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#e8f1ff",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  actionButtonText: {
    color: "#2d6cdf",
    fontSize: 14,
    fontWeight: "600",
  },
  cancelButton: {
    backgroundColor: "#ffebee",
  },
  cancelButtonText: {
    color: "#f44336",
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
  AgendarButton: {
    backgroundColor: "#2d6cdf",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 8,
  },
  AgendarButtonText: {
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  floatingButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});