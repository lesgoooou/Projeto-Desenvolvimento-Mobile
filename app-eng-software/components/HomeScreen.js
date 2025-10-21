import React, { Component } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";

export default class HomeScreen extends Component {
  renderMenuItem(icon, title, subtitle, onPress) {
    return (
      <TouchableOpacity style={styles.menuItem} onPress={onPress}>
        <View style={styles.menuIconContainer}>
          <Text style={styles.menuIcon}>{icon}</Text>
        </View>
        <View style={styles.menuTextContainer}>
          <Text style={styles.menuTitle}>{title}</Text>
          <Text style={styles.menuSubtitle}>{subtitle}</Text>
        </View>
        <Text style={styles.menuArrow}>›</Text>
      </TouchableOpacity>
    );
  }

  render() {
    const { navigation } = this.props;
    
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Olá, paciente! 👋</Text>
          <Text style={styles.headerSubtitle}>Como podemos te ajudar hoje?</Text>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {/* Seção Principal */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Agendamentos</Text>
              
              {this.renderMenuItem(
                "📅",
                "Agendar Consulta/Exame",
                "Escolha data e horário disponível",
                () => navigation.navigate("Agendar")
              )}
              
              {this.renderMenuItem(
                "📋",
                "Meus Agendamentos",
                "Ver consultas e exames marcados",
                () => navigation.navigate("MeusAgendamentos")
              )}
            </View>

            {/* Seção Resultados */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Resultados e Histórico</Text>
              
              {this.renderMenuItem(
                "🔬",
                "Resultados de Exames",
                "Acesse seus laudos e resultados",
                () => navigation.navigate("Resultados")
              )}
              
              {this.renderMenuItem(
                "📝",
                "Histórico Médico",
                "Consultas e procedimentos anteriores",
                () => navigation.navigate("HistMedico")
              )}
              
              {this.renderMenuItem(
                "💊",
                "Receitas Médicas",
                "Visualizar receitas ativas",
                () => navigation.navigate("Receitas")
              )}
            </View>

            {/* Seção Outros */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Outros Serviços</Text>
              
              {this.renderMenuItem(
                "🏥",
                "Carteirinha Digital",
                "Sua carteirinha do convênio",
                () => navigation.navigate("Carteirinha")
              )}
              
              {this.renderMenuItem(
                "📍",
                "Localização da Clínica",
                "Endereço e como chegar",
                () => navigation.navigate("Localizacao")
              )}
              
              {this.renderMenuItem(
                "💬",
                "Contato e Suporte",
                "Fale conosco",
                () => navigation.navigate("Suporte")
              )}
            </View>

            {/* Botão de Sair */}
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={() => navigation.navigate("Inicio")}
            >
              <Text style={styles.logoutButtonText}>Sair da Conta</Text>
            </TouchableOpacity>
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
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#e0ebff",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
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
    marginLeft: 4,
  },
  menuItem: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  menuIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#e8f1ff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  menuIcon: {
    fontSize: 24,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 13,
    color: "#666",
  },
  menuArrow: {
    fontSize: 30,
    color: "#ccc",
    marginLeft: 8,
  },
  logoutButton: {
    backgroundColor: "#fff",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  logoutButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
});