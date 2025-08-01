
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from "@expo-google-fonts/poppins";

import Inicio from './Componentes/Inicio';
import Login from './Componentes/Login';
import Registro from './Componentes/Registro';
import ListaMusica from './Componentes/ListaMusica';
import PlaylistDetail from './Componentes/PlaylistDetail';

const Stack = createStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Inicio">
        <Stack.Screen name="Inicio">
          {props => <Inicio {...props} fontsLoaded={fontsLoaded} />}
        </Stack.Screen> 
        <Stack.Screen name="Registro" component={Registro} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="ListaMusica" component={ListaMusica} />
        <Stack.Screen name="PlaylistDetail" component={PlaylistDetail} />

      </Stack.Navigator>
      <StatusBar style="light" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
