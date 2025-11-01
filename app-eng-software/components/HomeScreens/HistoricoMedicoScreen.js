import React, { Component } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  Alert 
} from "react-native";

export default class HistoricoMedicoScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          id: 1,
          type: "Consulta",
          specialty: "Cardiologia",
          doctor: "Dr. Carlos Silva",
          date: "10/10/2025",
          notes: "Pressão arterial controlada"
        },
        {
          id: 2,
          type: "Exame",
          specialty: "Hemograma",
          doctor: "Lab Central",
          date: "05/10/2025",
          notes: "Resultados normais"
        },
        {
          id: 3,
          type: "Consulta",
          specialty: "Oftalmologia",
          doctor: "Dr. João Oliveira",
          date: "28/09/2025",
          notes: "Prescrição de óculos atualizada"
        },
      ],
    };
  }

  handleViewDetails = (item) => {
    Alert.alert("Detalhes", `Visualizando: ${item.specialty}`);
  };

  renderHistoryCard = (item) => {
    return (
      <View key={item.id} style={styles.card}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.typeText}>{item.type}</Text>
            <Text style={styles.specialtyText}>{item.specialty}</Text>
          </View>
          <Text style={styles.dateText}>{item.date}</Text>
        </View>

        <Text style={styles.doctorText}>👨‍⚕️ {item.doctor}</Text>
        <Text style={styles.notesText}>{item.notes}</Text>

        <TouchableOpacity 
          style={styles.detailsButton}
          onPress={() => this.handleViewDetails(item)}
        >
          <Text style={styles.detailsButtonText}>Ver Detalhes</Text>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    const { navigation } = this.props;
    const { history } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Histórico Médico</Text>
        </View>

        <ScrollView style={styles.scrollView}>
          <View style={styles.content}>
            {history.map(item => this.renderHistoryCard(item))}
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
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  typeText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  specialtyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  dateText: {
    fontSize: 14,
    color: "#666",
  },
  doctorText: {
    fontSize: 15,
    color: "#333",
    marginBottom: 8,
  },
  notesText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  detailsButton: {
    backgroundColor: "#e8f1ff",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  detailsButtonText: {
    color: "#2d6cdf",
    fontSize: 15,
    fontWeight: "600",
  },
});