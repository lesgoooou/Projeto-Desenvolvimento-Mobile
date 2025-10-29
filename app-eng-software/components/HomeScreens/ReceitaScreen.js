import React, { Component } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  Alert 
} from "react-native";

export default class ReceitasMedicasScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: "ativas",
      activeRecipes: [
        {
          id: 1,
          medication: "Losartana 50mg",
          doctor: "Dr. Carlos Silva",
          specialty: "Cardiologia",
          date: "15/10/2025",
          expiryDate: "15/01/2026",
          dosage: "1 comprimido",
          frequency: "1x ao dia (manhã)",
          duration: "Uso contínuo",
          icon: "💊",
          instructions: "Tomar em jejum, 30 minutos antes do café"
        },
        {
          id: 2,
          medication: "Metformina 850mg",
          doctor: "Dra. Ana Costa",
          specialty: "Endocrinologia",
          date: "10/10/2025",
          expiryDate: "10/01/2026",
          dosage: "1 comprimido",
          frequency: "2x ao dia (almoço e jantar)",
          duration: "Uso contínuo",
          icon: "💉",
          instructions: "Tomar durante as refeições"
        },
        {
          id: 3,
          medication: "Omeprazol 20mg",
          doctor: "Dr. Pedro Lima",
          specialty: "Gastroenterologia",
          date: "20/10/2025",
          expiryDate: "20/11/2025",
          dosage: "1 cápsula",
          frequency: "1x ao dia (manhã)",
          duration: "30 dias",
          icon: "💊",
          instructions: "Tomar em jejum, 30 minutos antes do café"
        },
      ],
      expiredRecipes: [
        {
          id: 4,
          medication: "Amoxicilina 500mg",
          doctor: "Dra. Maria Santos",
          specialty: "Clínico Geral",
          date: "01/09/2025",
          expiryDate: "08/09/2025",
          dosage: "1 cápsula",
          frequency: "3x ao dia (8h/8h)",
          duration: "7 dias",
          icon: "💊",
          instructions: "Tomar após as refeições"
        },
        {
          id: 5,
          medication: "Ibuprofeno 600mg",
          doctor: "Dr. João Oliveira",
          specialty: "Ortopedia",
          date: "15/08/2025",
          expiryDate: "20/08/2025",
          dosage: "1 comprimido",
          frequency: "3x ao dia",
          duration: "5 dias",
          icon: "💊",
          instructions: "Tomar com alimento para evitar irritação gástrica"
        },
      ],
    };
  }

  handleRenewRecipe = (recipe) => {
    Alert.alert(
      "Renovar Receita",
      `Deseja solicitar renovação da receita de ${recipe.medication}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Solicitar",
          onPress: () => Alert.alert("Sucesso", "Solicitação enviada ao médico")
        }
      ]
    );
  };

  handleViewRecipe = (recipe) => {
    Alert.alert(
      "Visualizar Receita",
      `Abrindo receita completa de ${recipe.medication}`,
      [{ text: "OK" }]
    );
  };

  handleShareRecipe = (recipe) => {
    Alert.alert(
      "Compartilhar Receita",
      `Compartilhar receita de ${recipe.medication}`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Compartilhar" }
      ]
    );
  };

  handleSetReminder = (recipe) => {
    Alert.alert(
      "Lembrete",
      `Configurar lembrete para ${recipe.medication}?`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Configurar", onPress: () => Alert.alert("Sucesso", "Lembrete configurado!") }
      ]
    );
  };

  renderRecipeCard = (recipe, isActive = true) => {
    const isExpiringSoon = isActive && new Date(recipe.expiryDate.split('/').reverse().join('-')) < new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);

    return (
      <View key={recipe.id} style={styles.recipeCard}>
        {isExpiringSoon && (
          <View style={styles.warningBanner}>
            <Text style={styles.warningText}>⚠️ Receita expira em breve</Text>
          </View>
        )}

        <View style={styles.recipeHeader}>
          <View style={styles.recipeTypeContainer}>
            <Text style={styles.recipeIcon}>{recipe.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.medicationName}>{recipe.medication}</Text>
              <Text style={styles.doctorName}>{recipe.doctor}</Text>
              <Text style={styles.specialtyText}>{recipe.specialty}</Text>
            </View>
          </View>
        </View>

        <View style={styles.recipeDetails}>
          <View style={styles.dosageSection}>
            <Text style={styles.sectionTitle}>💊 Posologia</Text>
            <Text style={styles.dosageText}>{recipe.dosage} - {recipe.frequency}</Text>
            <Text style={styles.durationText}>Duração: {recipe.duration}</Text>
          </View>

          <View style={styles.instructionsSection}>
            <Text style={styles.sectionTitle}>📋 Instruções</Text>
            <Text style={styles.instructionsText}>{recipe.instructions}</Text>
          </View>

          <View style={styles.datesSection}>
            <View style={styles.dateItem}>
              <Text style={styles.dateLabel}>Emitida em:</Text>
              <Text style={styles.dateValue}>{recipe.date}</Text>
            </View>
            <View style={styles.dateItem}>
              <Text style={styles.dateLabel}>Válida até:</Text>
              <Text style={[
                styles.dateValue,
                isExpiringSoon && styles.expiringDate
              ]}>
                {recipe.expiryDate}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => this.handleViewRecipe(recipe)}
          >
            <Text style={styles.actionButtonText}>👁️ Ver</Text>
          </TouchableOpacity>
          
          {isActive && (
            <>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => this.handleSetReminder(recipe)}
              >
                <Text style={styles.actionButtonText}>⏰ Lembrete</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => this.handleShareRecipe(recipe)}
              >
                <Text style={styles.actionButtonText}>📤 Enviar</Text>
              </TouchableOpacity>
            </>
          )}
          
          {(isExpiringSoon || !isActive) && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.renewButton]}
              onPress={() => this.handleRenewRecipe(recipe)}
            >
              <Text style={[styles.actionButtonText, styles.renewButtonText]}>🔄 Renovar</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  render() {
    const { navigation } = this.props;
    const { selectedTab, activeRecipes, expiredRecipes } = this.state;

    const currentList = selectedTab === "ativas" ? activeRecipes : expiredRecipes;
    const isEmpty = currentList.length === 0;

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Receitas Médicas</Text>
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              selectedTab === "ativas" && styles.tabActive
            ]}
            onPress={() => this.setState({ selectedTab: "ativas" })}
          >
            <Text style={[
              styles.tabText,
              selectedTab === "ativas" && styles.tabTextActive
            ]}>
              Ativas
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              selectedTab === "vencidas" && styles.tabActive
            ]}
            onPress={() => this.setState({ selectedTab: "vencidas" })}
          >
            <Text style={[
              styles.tabText,
              selectedTab === "vencidas" && styles.tabTextActive
            ]}>
              Vencidas
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.content}
        >
          {isEmpty ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📄</Text>
              <Text style={styles.emptyTitle}>Nenhuma receita</Text>
              <Text style={styles.emptyText}>
                {selectedTab === "ativas" 
                  ? "Você não tem receitas ativas no momento"
                  : "Você não tem receitas vencidas"}
              </Text>
            </View>
          ) : (
            <>
              {currentList.map(recipe => 
                this.renderRecipeCard(recipe, selectedTab === "ativas")
              )}
            </>
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
    paddingBottom: 40,
  },
  recipeCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },
  warningBanner: {
    backgroundColor: "#fff3cd",
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#ff9800",
  },
  warningText: {
    color: "#856404",
    fontSize: 14,
    fontWeight: "600",
  },
  recipeHeader: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  recipeTypeContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  recipeIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  medicationName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  doctorName: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  specialtyText: {
    fontSize: 13,
    color: "#999",
  },
  recipeDetails: {
    marginBottom: 12,
  },
  dosageSection: {
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 6,
  },
  dosageText: {
    fontSize: 15,
    color: "#333",
    fontWeight: "600",
    marginBottom: 4,
  },
  durationText: {
    fontSize: 14,
    color: "#666",
  },
  instructionsSection: {
    backgroundColor: "#e8f1ff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  instructionsText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  datesSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 8,
  },
  dateItem: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 12,
    color: "#999",
    marginBottom: 2,
  },
  dateValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
  },
  expiringDate: {
    color: "#f57c00",
  },
  actionsContainer: {
    flexDirection: "row",
    gap: 8,
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
    fontSize: 13,
    fontWeight: "600",
  },
  renewButton: {
    backgroundColor: "#e8f5e9",
  },
  renewButtonText: {
    color: "#4CAF50",
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
  },
});