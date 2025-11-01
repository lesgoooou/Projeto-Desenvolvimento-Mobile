
import React, { Component } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import InicioScreen from "./components/InicioScreen";
import LoginScreen from "./components/LoginScreen";
import CadastroScreen from "./components/CadastroScreen";
import HomeScreen from "./components/HomeScreen";
import AgendarScreen from "./components/HomeScreens/AgendarScreen";
import MeusAgendamentosScreen from "./components/HomeScreens/MeusAgendamentosScreen";
import CarteirinhaScreen from "./components/HomeScreens/CarteirinhaScreen";
import SuporteScreen from "./components/HomeScreens/SuporteScreen";
import ReceitaScreen from "./components/HomeScreens/ReceitaScreen";
import HistoricoMedicoScreen from "./components/HomeScreens/HistoricoMedicoScreen";
import ResultadoExameScreen from "./components/HomeScreens/ResultadoExameScreen";
import './config/config';

const Stack = createStackNavigator();

export default class App extends Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Inicio" component={InicioScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Cadastro" component={CadastroScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Agendar" component={AgendarScreen} />
          <Stack.Screen name="MeusAgendamentos" component={MeusAgendamentosScreen} />
          <Stack.Screen name="Carteirinha" component={CarteirinhaScreen} />
          <Stack.Screen name="Suporte" component={SuporteScreen} />
          <Stack.Screen name="Receitas" component={ReceitaScreen} />
          <Stack.Screen name="HistMedico" component={HistoricoMedicoScreen} />
          <Stack.Screen name="Resultados" component={ResultadoExameScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}