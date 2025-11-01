import React, { Component } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  Alert,
  Image 
} from "react-native";

const imagensMedicamentos = {
  'losartana': require('../../assets/imagens/Losartana.png'),
  'metformina': require('../../assets/imagens/Metformina.png'),
  'omeprazol': require('../../assets/imagens/omeprazol.png'),
  'amoxicilina': require('../../assets/imagens/amoxilina.png'),
  'ibuprofeno': require('../../assets/imagens/ibuprofeno.png'),
};

export default class ReceitasMedicasScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      abaSelecionada: "ativas",
      receitasAtivas: [
        {
          id: 1,
          medicamento: "Losartana 50mg",
          medico: "Dr. Carlos Silva",
          especialidade: "Cardiologia",
          dataEmissao: "15/10/2025",
          dataValidade: "15/01/2026",
          dosagem: "1 comprimido",
          frequencia: "1x ao dia (manhã)",
          duracao: "Uso contínuo",
          imagem: "losartana",
          instrucoes: "Tomar em jejum, 30 minutos antes do café"
        },
        {
          id: 2,
          medicamento: "Metformina 850mg",
          medico: "Dra. Ana Costa",
          especialidade: "Endocrinologia",
          dataEmissao: "10/10/2025",
          dataValidade: "10/01/2026",
          dosagem: "1 comprimido",
          frequencia: "2x ao dia (almoço e jantar)",
          duracao: "Uso contínuo",
          imagem: "metformina",
          instrucoes: "Tomar durante as refeições"
        },
        {
          id: 3,
          medicamento: "Omeprazol 20mg",
          medico: "Dr. Pedro Lima",
          especialidade: "Gastroenterologia",
          dataEmissao: "20/10/2025",
          dataValidade: "20/11/2025",
          dosagem: "1 cápsula",
          frequencia: "1x ao dia (manhã)",
          duracao: "30 dias",
          imagem: "omeprazol",
          instrucoes: "Tomar em jejum, 30 minutos antes do café"
        },
      ],
      receitasVencidas: [
        {
          id: 4,
          medicamento: "Amoxicilina 500mg",
          medico: "Dra. Maria Santos",
          especialidade: "Clínico Geral",
          dataEmissao: "01/09/2025",
          dataValidade: "08/09/2025",
          dosagem: "1 cápsula",
          frequencia: "3x ao dia (8h/8h)",
          duracao: "7 dias",
          imagem: "amoxicilina",
          instrucoes: "Tomar após as refeições"
        },
        {
          id: 5,
          medicamento: "Ibuprofeno 600mg",
          medico: "Dr. João Oliveira",
          especialidade: "Ortopedia",
          dataEmissao: "15/08/2025",
          dataValidade: "20/08/2025",
          dosagem: "1 comprimido",
          frequencia: "3x ao dia",
          duracao: "5 dias",
          imagem: "ibuprofeno",
          instrucoes: "Tomar com alimento para evitar irritação gástrica"
        },
      ],
    };
  }

  manipularRenovarReceita = (receita) => {
    Alert.alert(
      "Renovar Receita",
      `Deseja solicitar renovação da receita de ${receita.medicamento}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Solicitar",
          onPress: () => Alert.alert("Sucesso", "Solicitação enviada ao médico")
        }
      ]
    );
  };

  manipularVerReceita = (receita) => {
    Alert.alert(
      "Visualizar Receita",
      `Abrindo receita completa de ${receita.medicamento}`,
      [{ text: "OK" }]
    );
  };

  manipularCompartilharReceita = (receita) => {
    Alert.alert(
      "Compartilhar Receita",
      `Compartilhar receita de ${receita.medicamento}`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Compartilhar" }
      ]
    );
  };

  manipularConfigurarLembrete = (receita) => {
    Alert.alert(
      "Lembrete",
      `Configurar lembrete para ${receita.medicamento}?`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Configurar", onPress: () => Alert.alert("Sucesso", "Lembrete configurado!") }
      ]
    );
  };

  renderizarCardReceita = (receita, estaAtiva = true) => {
    const expiraEmBreve = estaAtiva && new Date(receita.dataValidade.split('/').reverse().join('-')) < new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);

    return (
      <View key={receita.id} style={styles.cardReceita}>
        {expiraEmBreve && (
          <View style={styles.bannerAviso}>
            <Text style={styles.textoAviso}>⚠️ Receita expira em breve</Text>
          </View>
        )}

        <View style={styles.cabecalhoReceita}>
          <View style={styles.containerTipoReceita}>
            <Image 
              source={imagensMedicamentos[receita.imagem]} 
              style={styles.imagemMedicamento}
              resizeMode="contain"
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.nomeMedicamento}>{receita.medicamento}</Text>
              <Text style={styles.nomeMedico}>{receita.medico}</Text>
              <Text style={styles.textoEspecialidade}>{receita.especialidade}</Text>
            </View>
          </View>
        </View>

        <View style={styles.detalhesReceita}>
          <View style={styles.secaoDosagem}>
            <Text style={styles.tituloSecao}>💊 Posologia</Text>
            <Text style={styles.textoDosagem}>{receita.dosagem} - {receita.frequencia}</Text>
            <Text style={styles.textoDuracao}>Duração: {receita.duracao}</Text>
          </View>

          <View style={styles.secaoInstrucoes}>
            <Text style={styles.tituloSecao}>📋 Instruções</Text>
            <Text style={styles.textoInstrucoes}>{receita.instrucoes}</Text>
          </View>

          <View style={styles.secaoDatas}>
            <View style={styles.itemData}>
              <Text style={styles.labelData}>Emitida em:</Text>
              <Text style={styles.valorData}>{receita.dataEmissao}</Text>
            </View>
            <View style={styles.itemData}>
              <Text style={styles.labelData}>Válida até:</Text>
              <Text style={[
                styles.valorData,
                expiraEmBreve && styles.dataExpirando
              ]}>
                {receita.dataValidade}
              </Text>
            </View>
          </View>
        </View>

        {estaAtiva && (
          <View style={styles.containerAcoes}>
            <TouchableOpacity 
              style={styles.botaoAcao}
              onPress={() => this.manipularVerReceita(receita)}
            >
              <Text style={styles.textoBotaoAcao}>👁️ Ver</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.botaoAcao}
              onPress={() => this.manipularConfigurarLembrete(receita)}
            >
              <Text style={styles.textoBotaoAcao}>⏰ Lembrete</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.botaoAcao}
              onPress={() => this.manipularCompartilharReceita(receita)}
            >
              <Text style={styles.textoBotaoAcao}>📤 Enviar</Text>
            </TouchableOpacity>
            
            {expiraEmBreve && (
              <TouchableOpacity 
                style={[styles.botaoAcao, styles.botaoRenovar]}
                onPress={() => this.manipularRenovarReceita(receita)}
              >
                <Text style={[styles.textoBotaoAcao, styles.textoBotaoRenovar]}>🔄 Renovar</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    );
  };

  render() {
    const { navigation } = this.props;
    const { abaSelecionada, receitasAtivas, receitasVencidas } = this.state;

    const listaAtual = abaSelecionada === "ativas" ? receitasAtivas : receitasVencidas;
    const estaVazio = listaAtual.length === 0;

    return (
      <View style={styles.container}>
        <View style={styles.cabecalho}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.botaoVoltar}>← Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.tituloCabecalho}>Receitas Médicas</Text>
        </View>

        <View style={styles.containerAbas}>
          <TouchableOpacity
            style={[
              styles.aba,
              abaSelecionada === "ativas" && styles.abaAtiva
            ]}
            onPress={() => this.setState({ abaSelecionada: "ativas" })}
          >
            <Text style={[
              styles.textoAba,
              abaSelecionada === "ativas" && styles.textoAbaAtiva
            ]}>
              Ativas
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.aba,
              abaSelecionada === "vencidas" && styles.abaAtiva
            ]}
            onPress={() => this.setState({ abaSelecionada: "vencidas" })}
          >
            <Text style={[
              styles.textoAba,
              abaSelecionada === "vencidas" && styles.textoAbaAtiva
            ]}>
              Vencidas
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.conteudo}
        >
          {estaVazio ? (
            <View style={styles.containerVazio}>
              <Text style={styles.iconeVazio}>📄</Text>
              <Text style={styles.tituloVazio}>Nenhuma receita</Text>
              <Text style={styles.textoVazio}>
                {abaSelecionada === "ativas" 
                  ? "Você não tem receitas ativas no momento"
                  : "Você não tem receitas vencidas"}
              </Text>
            </View>
          ) : (
            <>
              {listaAtual.map(receita => 
                this.renderizarCardReceita(receita, abaSelecionada === "ativas")
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
  cabecalho: {
    backgroundColor: "#2d6cdf",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  botaoVoltar: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 10,
  },
  tituloCabecalho: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  containerAbas: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 10,
    elevation: 2,
  },
  aba: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
  },
  abaAtiva: {
    borderBottomColor: "#2d6cdf",
  },
  textoAba: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  textoAbaAtiva: {
    color: "#2d6cdf",
    fontWeight: "bold",
  },
  scrollView: {
    flex: 1,
  },
  conteudo: {
    padding: 20,
    paddingBottom: 40,
  },
  cardReceita: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },
  bannerAviso: {
    backgroundColor: "#fff3cd",
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#ff9800",
  },
  textoAviso: {
    color: "#856404",
    fontSize: 14,
    fontWeight: "600",
  },
  cabecalhoReceita: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  containerTipoReceita: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  imagemMedicamento: {
    width: 60,
    height: 60,
    marginRight: 12,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
  },
  nomeMedicamento: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  nomeMedico: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  textoEspecialidade: {
    fontSize: 13,
    color: "#999",
  },
  detalhesReceita: {
    marginBottom: 12,
  },
  secaoDosagem: {
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  tituloSecao: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 6,
  },
  textoDosagem: {
    fontSize: 15,
    color: "#333",
    fontWeight: "600",
    marginBottom: 4,
  },
  textoDuracao: {
    fontSize: 14,
    color: "#666",
  },
  secaoInstrucoes: {
    backgroundColor: "#e8f1ff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  textoInstrucoes: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  secaoDatas: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 8,
  },
  itemData: {
    flex: 1,
  },
  labelData: {
    fontSize: 12,
    color: "#999",
    marginBottom: 2,
  },
  valorData: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
  },
  dataExpirando: {
    color: "#f57c00",
  },
  containerAcoes: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  botaoAcao: {
    flex: 1,
    backgroundColor: "#e8f1ff",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  textoBotaoAcao: {
    color: "#2d6cdf",
    fontSize: 13,
    fontWeight: "600",
  },
  botaoRenovar: {
    backgroundColor: "#e8f5e9",
  },
  textoBotaoRenovar: {
    color: "#4CAF50",
  },
  containerVazio: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  iconeVazio: {
    fontSize: 64,
    marginBottom: 16,
  },
  tituloVazio: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  textoVazio: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});