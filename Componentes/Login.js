
 import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
 import React, { useState } from 'react';
 import Retoceso from './Retroceso';
 import axios from 'axios';
 import * as SecureStore from 'expo-secure-store';
 import { SERVER_URL } from '../config/config';
 
 const Login = ({ navigation }) => {
   const [email, setEmail]       = useState('');
   const [password, setPassword] = useState('');
   const [loading, setLoading]   = useState(false);
 
   const handleLogin = async () => {
     if (!email || !password) {
       return Alert.alert('Error', 'Debes completar ambos campos');
     }
 
     setLoading(true);
     try {
 
       const resp = await axios.post(
         `${SERVER_URL}/users/login`,
         { email, password }
       );
 
       if (resp.data.success) {
         
         await SecureStore.setItemAsync('userToken', resp.data.token);
 
         Alert.alert(
           '✔️ Sesión iniciada',
           `Bienvenido ${resp.data.user.username || resp.data.user.email}`
         );
         
         navigation.replace('ListaMusica'); //Navegación a la siguiente ventana
       } else {
         Alert.alert('Error', resp.data.message || 'Credenciales inválidas');
       }
     } catch (err) {
       console.error('Login fallido:', err.response?.data || err.message);
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
       <Retoceso currentScreenName="Login" navigation={navigation} />
 
       <View style={styles.topSectionL}>
         <Image source={require('../assets/logoA.png')} style={styles.logoL} />
         <Text style={styles.titleL}>BLUEWAVE</Text>
       </View>
 
       <Text style={styles.title}>Iniciar Sesión</Text>
 
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
 
       <TouchableOpacity
         style={styles.button}
         onPress={handleLogin}
         disabled={loading}
       >
         {loading
           ? <ActivityIndicator color="#fff" />
           : <Text style={styles.buttonText}>Ingresar</Text>
         }
       </TouchableOpacity>
 
       <TouchableOpacity onPress={() => navigation.replace('Registro')}>
         <Text style={styles.registerText}>
           ¿No tienes cuenta? Regístrate
         </Text>
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
    fontFamily: "InterBold",
  },
   logoL: {
    width: 180,
    height: 180,
    marginBottom: 20,
    resizeMode: "contain",
    marginRight: 15,
  },
   titleL: {
    fontSize: 40,
    fontFamily: "PoppinsBold",
    color: "#fff",
    textAlign: "left",
    right: 10,
    fontWeight: 'bold'

  },
   topSectionL: {
    flexDirection: "row",
    backgroundColor: "#0047ab",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    top: -150,
  },

  input: {
    margin: 0,
    width: '80%',
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#4f75be',
    borderRadius: 15,
    backgroundColor: "white",
    
  },
  button: {
    backgroundColor: "#4f75be",
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

  registerText: {
    color: '#666666',
    marginTop: 20,
    fontFamily: "Inter",
   
  },
});

export default Login;