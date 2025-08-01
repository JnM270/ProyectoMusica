import React, { useState } from 'react';
import { StyleSheet,Text,View,TextInput,TouchableOpacity,Image,Alert,ActivityIndicator} from 'react-native';
import Retoceso from './Retroceso';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { SERVER_URL } from '../config/config'; 

const Registro = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [loading, setLoading]   = useState(false);

  const handleRegister = async () => {
    // Validaciones
    if ( !email || !password || !confirmPwd) {
      return Alert.alert('Error', 'Todos los campos son obligatorios');
    }
    if (password !== confirmPwd) {
      return Alert.alert('Error', 'Las contraseñas no coinciden');
    }

    setLoading(true);
    try {
      //URL del config
      const resp = await axios.post(
        `${SERVER_URL}/users/register`,
        { username, email, password }
      );

      if (resp.data.success) {
       
        if (resp.data.token) {
          await SecureStore.setItemAsync('userToken', resp.data.token);
        
          navigation.replace('ListaMusica');
        } else {
         
          Alert.alert('Usuario registrado correctamente');
          navigation.replace('Login');
        }
      } else {
        Alert.alert('Error', resp.data.message || 'No se pudo registrar');
      }
    } catch (err) {
      console.error('Registro fallido:', err.response?.data || err.message);
      Alert.alert(
        'Error',
        err.response?.data?.message ||
        'Ocurrió un error al conectar con el servidor'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Retoceso currentScreenName="Registro" navigation={navigation} />

      <View style={styles.topSectionR}>
        <Image source={require('../assets/logoA.png')} style={styles.logoR} />
        <Text style={styles.titleR}>BLUEWAVE</Text>
      </View>

      <Text style={styles.title}>Registrarse</Text>

     <TextInput style={styles.input} placeholder="Usuario" value={username} onChangeText={setUsername} autoCapitalize="none" />

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TextInput
        style={styles.input}
        placeholder="Confirmar contraseña"
        secureTextEntry
        value={confirmPwd}
        onChangeText={setConfirmPwd}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.buttonText}>Crear cuenta</Text>
        }
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.replace('Login')}>
        <Text style={styles.loginText}>¿Ya tienes cuenta? Inicia sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    marginBottom: 20,
    color: "#0047ab",
    
    
  },
  logoR: {
    width: 200,
    height: 200,
    marginBottom: 20,
    resizeMode: "contain",
    marginRight: 15,
  },
  titleR: {
    fontSize: 40,
    fontFamily: "PoppinsBold",
    color: "#fff",
    textAlign: "left",
    right: 10,
     fontWeight: 'bold',

  },
  topSectionR: {
    flexDirection: "row",
    backgroundColor: "#0047ab",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    top: -92,
   
  },
  input: {
    margin: 0,
    width: '80%',
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#0047ab',
    borderRadius: 15,
    backgroundColor: "white",
    
   
  },
  button: {
    backgroundColor: '#4f75be',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginTop: 10
    
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: "InterBold",
      fontWeight: 'bold'
   
  },
   loginText: {
    marginTop: 20,
    color: "#666666",
     fontFamily: "InterRegular",

  },
});

export default Registro;