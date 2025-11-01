import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import firebase from '../../config/config';

export default class ConsultaOnlineScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      consultas: [],
      loading: true,
      horaAtual: new Date(),
    };
    this.intervalo = null;
  }

  componentDidMount() {
    this.carregarConsultas();
    
    this.intervalo = setInterval(() => {
      this.setState({ horaAtual: new Date() });
    }, 60000);
  }

  componentWillUnmount() {
    if (this.intervalo) {
      clearInterval(this.intervalo);
    }
  }

  carregarConsultas = async () => {
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

      const consultasFuturas = [];

      agendadosSnapshot.forEach((child) => {
        const agendamento = {
          id: child.key,
          ...child.val()
        };

        if (agendamento.tipo === "Consulta") {
          const dataConsulta = new Date(`${agendamento.data}T${agendamento.horario}:00`);

          if (dataConsulta > agora) {
            consultasFuturas.push({
              ...agendamento,
              dataHoraCompleta: dataConsulta,
            });
          }
        }
      });

      consultasFuturas.sort((a, b) => a.dataHoraCompleta - b.dataHoraCompleta);

      this.setState({
        consultas: consultasFuturas,
        loading: false,
      });

    } catch (error) {
      console.error('Erro ao carregar consultas:', error);
      Alert.alert('Erro', 'Não foi possível carregar as consultas');
      this.setState({ loading: false });
    }
  }

  formatarData = (dataISO) => {
    // "2025-10-31" -> "31/10/2025"
    const [ano, mes, dia] = dataISO.split('-');
    return `${dia}/${mes}/${ano}`;
  }

  formatarDiaSemana = (dataISO) => {
    const diasSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const data = new Date(dataISO);
    return diasSemana[data.getDay()];
  }

  podeEntrar = (dataHoraConsulta) => {
    const agora = this.state.horaAtual;
    const diferencaMinutos = (dataHoraConsulta - agora) / 1000 / 60; // Converte para minutos

    return diferencaMinutos <= 15 && diferencaMinutos > -60; 
  }

  getTempoRestante = (dataHoraConsulta) => {
    const agora = this.state.horaAtual;
    const diferencaMs = dataHoraConsulta - agora;
    const diferencaMinutos = Math.floor(diferencaMs / 1000 / 60);
    const diferencaHoras = Math.floor(diferencaMinutos / 60);
    const diferencaDias = Math.floor(diferencaHoras / 24);

    if (diferencaDias > 0) {
      return `Faltam ${diferencaDias} dia${diferencaDias > 1 ? 's' : ''}`;
    } else if (diferencaHoras > 0) {
      return `Faltam ${diferencaHoras} hora${diferencaHoras > 1 ? 's' : ''}`;
    } else if (diferencaMinutos > 0) {
      return `Faltam ${diferencaMinutos} minuto${diferencaMinutos > 1 ? 's' : ''}`;
    } else if (diferencaMinutos >= -60) {
      return "Disponível agora";
    } else {
      return "Consulta encerrada";
    }
  }

  handleEntrar = (consulta) => {
    Alert.alert(
      "Entrar na Consulta",
      `Iniciando consulta de ${consulta.especialidade} com ${consulta.profissional}`,
      [{ text: "OK" }]
    );
  }

  renderConsultaCard = (consulta) => {
    const podeEntrar = this.podeEntrar(consulta.dataHoraCompleta);
    const tempoRestante = this.getTempoRestante(consulta.dataHoraCompleta);

    return (
      <View key={consulta.id} style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.especialidadeContainer}>
            <Text style={styles.especialidadeIcon}>👨‍⚕️</Text>
            <Text style={styles.especialidadeText}>{consulta.especialidade}</Text>
          </View>
          {podeEntrar && (
            <View style={styles.liveBadge}>
              <Text style={styles.liveBadgeText}>● DISPONÍVEL</Text>
            </View>
          )}
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.profissionalText}>{consulta.profissional}</Text>
          
          <View style={styles.dataHoraContainer}>
            <View style={styles.dataHoraBox}>
              <Text style={styles.dataHoraLabel}>Data</Text>
              <Text style={styles.dataHoraValue}>📅 {this.formatarDiaSemana(consulta.data)}</Text>
              <Text style={styles.dataHoraValue}>{this.formatarData(consulta.data)}</Text>
            </View>
            
            <View style={styles.separador} />
            
            <View style={styles.dataHoraBox}>
              <Text style={styles.dataHoraLabel}>Horário</Text>
              <Text style={styles.horarioGrande}>🕐 {consulta.horario}</Text>
            </View>
          </View>

          <View style={styles.tempoContainer}>
            <Text style={styles.tempoText}>{tempoRestante}</Text>
          </View>
        </View>

        {podeEntrar ? (
          <TouchableOpacity
            style={styles.entrarButton}
            onPress={() => this.handleEntrar(consulta)}
          >
            <Text style={styles.entrarButtonText}>🎥 Entrar na Consulta</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.aguardarContainer}>
            <Text style={styles.aguardarText}>
              A sala abrirá 15 minutos antes da consulta
            </Text>
          </View>
        )}
      </View>
    );
  }

  render() {
    const { navigation } = this.props;
    const { consultas, loading } = this.state;

    if (loading) {
      return (
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Consulta Online</Text>
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
          <Text style={styles.headerTitle}>Consulta Online</Text>
        </View>

        <ScrollView style={styles.scrollView}>
          <View style={styles.content}>
            {consultas.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>🎥</Text>
                <Text style={styles.emptyTitle}>Nenhuma consulta online agendada</Text>
                <Text style={styles.emptyText}>
                  Agende uma consulta para realizar atendimento online
                </Text>
                <TouchableOpacity
                  style={styles.agendarButton}
                  onPress={() => navigation.navigate('Agendar')}
                >
                  <Text style={styles.agendarButtonText}>Agendar Consulta</Text>
                </TouchableOpacity>
              </View>
            ) : (
              consultas.map(consulta => this.renderConsultaCard(consulta))
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
    backgroundColor: '#f0f4f8',
  },
  header: {
    backgroundColor: '#2d6cdf',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  especialidadeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  especialidadeIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  especialidadeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  liveBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  liveBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  infoContainer: {
    marginBottom: 16,
  },
  profissionalText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  dataHoraContainer: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  dataHoraBox: {
    flex: 1,
    alignItems: 'center',
  },
  separador: {
    width: 1,
    backgroundColor: '#ddd',
    marginHorizontal: 16,
  },
  dataHoraLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
    fontWeight: '600',
  },
  dataHoraValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  horarioGrande: {
    fontSize: 24,
    color: '#2d6cdf',
    fontWeight: 'bold',
  },
  tempoContainer: {
    backgroundColor: '#e8f1ff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  tempoText: {
    fontSize: 14,
    color: '#2d6cdf',
    fontWeight: '600',
  },
  entrarButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  entrarButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  aguardarContainer: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  aguardarText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 40,
  },
  agendarButton: {
    backgroundColor: '#2d6cdf',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 8,
  },
  agendarButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});