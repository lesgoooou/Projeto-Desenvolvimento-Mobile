import React, { Component } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  Alert 
} from "react-native";

export default class ResultadosExamesScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      exams: [
        {
          id: 1,
          name: "Hemograma Completo",
          date: "22/10/2025",
          lab: "Lab Central",
          status: "disponivel"
        },
        {
          id: 2,
          name: "Glicemia",
          date: "18/10/2025",
          lab: "Lab Central",
          status: "processando"
        },
        {
          id: 3,
          name: "Colesterol",
          date: "05/10/2025",
          lab: "Lab Saúde",
          status: "disponivel"
        },
      ],
    };
  }

  handleViewResult = (exam) => {
    Alert.alert("Visualizar", `Abrindo resultado: ${exam.name}`);
  };

  renderExamCard = (exam) => {
    const isAvailable = exam.status === "disponivel";

    return (
      <View key={exam.id} style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.examName}>{exam.name}</Text>
          {isAvailable ? (
            <View style={styles.availableBadge}>
              <Text style={styles.badgeText}>Disponível</Text>
            </View>
          ) : (
            <View style={styles.processingBadge}>
              <Text style={styles.badgeText}>Processando</Text>
            </View>
          )}
        </View>

        <Text style={styles.labText}>🏥 {exam.lab}</Text>
        <Text style={styles.dateText}>📅 {exam.date}</Text>

        {isAvailable && (
          <TouchableOpacity 
            style={styles.viewButton}
            onPress={() => this.handleViewResult(exam)}
          >
            <Text style={styles.viewButtonText}>Ver Resultado</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  render() {
    const { navigation } = this.props;
    const { exams } = this.state;

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
            {exams.map(exam => this.renderExamCard(exam))}
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
  processingBadge: {
    backgroundColor: "#FF9800",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
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
});