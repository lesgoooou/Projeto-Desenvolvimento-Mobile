import React, { Component } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  Alert 
} from "react-native";

export default class AgendarScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedType: null,
      selectedSpecialty: null,
      selectedDoctor: null,
      selectedDate: null,
      selectedTime: null,
    };
  }

  // Dados de exemplo
  specialties = [
    { id: 1, name: "Cardiologia", icon: "❤️" },
    { id: 2, name: "Dermatologia", icon: "🔬" },
    { id: 3, name: "Ortopedia", icon: "🦴" },
    { id: 4, name: "Pediatria", icon: "👶" },
    { id: 5, name: "Oftalmologia", icon: "👁️" },
    { id: 6, name: "Neurologia", icon: "🧠" },
  ];

  exams = [
    { id: 1, name: "Hemograma Completo", icon: "💉" },
    { id: 2, name: "Raio-X", icon: "📷" },
    { id: 3, name: "Ultrassom", icon: "📡" },
    { id: 4, name: "Ressonância", icon: "🔍" },
    { id: 5, name: "Tomografia", icon: "🖼️" },
    { id: 6, name: "Eletrocardiograma", icon: "📊" },
  ];

  doctors = [
    { id: 1, name: "Dr. Carlos Silva" },
    { id: 2, name: "Dra. Maria Santos" },
    { id: 3, name: "Dr. João Oliveira" },
  ];

  dates = [
    { id: 1, display: "Seg, 20/10", value: "2025-10-20" },
    { id: 2, display: "Ter, 21/10", value: "2025-10-21" },
    { id: 3, display: "Qua, 22/10", value: "2025-10-22" },
    { id: 4, display: "Qui, 23/10", value: "2025-10-23" },
    { id: 5, display: "Sex, 24/10", value: "2025-10-24" },
  ];

  times = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"
  ];

  handleConfirm = () => {
    const { selectedType, selectedSpecialty, selectedDoctor, selectedDate, selectedTime } = this.state;
    
    if (!selectedType || !selectedSpecialty || !selectedDoctor || !selectedDate || !selectedTime) {
      Alert.alert("Atenção", "Por favor, preencha todos os campos");
      return;
    }

    Alert.alert(
      "Agendamento Confirmado! ✅",
      `Seu agendamento foi realizado com sucesso!\n\nDetalhes:\nTipo: ${selectedType}\nData: ${selectedDate}\nHorário: ${selectedTime}`,
      [
        {
          text: "OK",
          onPress: () => this.props.navigation.goBack()
        }
      ]
    );
  };

  renderTypeSelector() {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tipo de Agendamento</Text>
        <View style={styles.typeContainer}>
          <TouchableOpacity
            style={[
              styles.typeCard,
              this.state.selectedType === "Consulta" && styles.typeCardSelected
            ]}
            onPress={() => this.setState({ selectedType: "Consulta", selectedSpecialty: null })}
          >
            <Text style={styles.typeIcon}>👨‍⚕️</Text>
            <Text style={styles.typeText}>Consulta</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.typeCard,
              this.state.selectedType === "Exame" && styles.typeCardSelected
            ]}
            onPress={() => this.setState({ selectedType: "Exame", selectedSpecialty: null })}
          >
            <Text style={styles.typeIcon}>🔬</Text>
            <Text style={styles.typeText}>Exame</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  renderSpecialtySelector() {
    if (!this.state.selectedType) return null;

    const items = this.state.selectedType === "Consulta" ? this.specialties : this.exams;
    const title = this.state.selectedType === "Consulta" ? "Especialidade" : "Tipo de Exame";

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.optionsGrid}>
          {items.map(item => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.optionCard,
                this.state.selectedSpecialty === item.name && styles.optionCardSelected
              ]}
              onPress={() => this.setState({ selectedSpecialty: item.name })}
            >
              <Text style={styles.optionIcon}>{item.icon}</Text>
              <Text style={styles.optionText}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }

  renderDoctorSelector() {
    if (!this.state.selectedSpecialty) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profissional</Text>
        {this.doctors.map(doctor => (
          <TouchableOpacity
            key={doctor.id}
            style={[
              styles.listItem,
              this.state.selectedDoctor === doctor.name && styles.listItemSelected
            ]}
            onPress={() => this.setState({ selectedDoctor: doctor.name })}
          >
            <View style={styles.doctorInfo}>
              <Text style={styles.doctorIcon}>👨‍⚕️</Text>
              <Text style={styles.listItemText}>{doctor.name}</Text>
            </View>
            {this.state.selectedDoctor === doctor.name && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    );
  }

  renderDateSelector() {
    if (!this.state.selectedDoctor) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.dateContainer}>
            {this.dates.map(date => (
              <TouchableOpacity
                key={date.id}
                style={[
                  styles.dateCard,
                  this.state.selectedDate === date.display && styles.dateCardSelected
                ]}
                onPress={() => this.setState({ selectedDate: date.display })}
              >
                <Text style={[
                  styles.dateText,
                  this.state.selectedDate === date.display && styles.dateTextSelected
                ]}>
                  {date.display}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }

  renderTimeSelector() {
    if (!this.state.selectedDate) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Horário</Text>
        <View style={styles.timeGrid}>
          {this.times.map((time, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.timeCard,
                this.state.selectedTime === time && styles.timeCardSelected
              ]}
              onPress={() => this.setState({ selectedTime: time })}
            >
              <Text style={[
                styles.timeText,
                this.state.selectedTime === time && styles.timeTextSelected
              ]}>
                {time}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }

  render() {
    const { navigation } = this.props;
    const canConfirm = this.state.selectedType && this.state.selectedSpecialty && 
                       this.state.selectedDoctor && this.state.selectedDate && 
                       this.state.selectedTime;

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Agendar</Text>
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.content}
        >
          {this.renderTypeSelector()}
          {this.renderSpecialtySelector()}
          {this.renderDoctorSelector()}
          {this.renderDateSelector()}
          {this.renderTimeSelector()}

          {canConfirm && (
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={this.handleConfirm}
            >
              <Text style={styles.confirmButtonText}>Confirmar Agendamento</Text>
            </TouchableOpacity>
          )}
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
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  typeContainer: {
    flexDirection: "row",
    gap: 12,
  },
  typeCard: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
    elevation: 2,
  },
  typeCardSelected: {
    borderColor: "#2d6cdf",
    backgroundColor: "#e8f1ff",
  },
  typeIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  typeText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  optionCard: {
    width: "48%",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
    elevation: 2,
  },
  optionCardSelected: {
    borderColor: "#2d6cdf",
    backgroundColor: "#e8f1ff",
  },
  optionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  optionText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    textAlign: "center",
  },
  listItem: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 2,
    borderColor: "#fff",
    elevation: 2,
  },
  listItemSelected: {
    borderColor: "#2d6cdf",
    backgroundColor: "#e8f1ff",
  },
  doctorInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  doctorIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  listItemText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  checkmark: {
    fontSize: 24,
    color: "#2d6cdf",
    fontWeight: "bold",
  },
  dateContainer: {
    flexDirection: "row",
    gap: 10,
  },
  dateCard: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#fff",
    elevation: 2,
  },
  dateCardSelected: {
    borderColor: "#2d6cdf",
    backgroundColor: "#2d6cdf",
  },
  dateText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  dateTextSelected: {
    color: "#fff",
  },
  timeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  timeCard: {
    width: "30%",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
    elevation: 2,
  },
  timeCardSelected: {
    borderColor: "#2d6cdf",
    backgroundColor: "#2d6cdf",
  },
  timeText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  timeTextSelected: {
    color: "#fff",
  },
  confirmButton: {
    backgroundColor: "#2d6cdf",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    elevation: 3,
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});