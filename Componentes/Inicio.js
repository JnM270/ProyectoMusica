 import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import Retoceso from "./Retroceso"; 

const Inicio = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Gestiona el retroceso entre pantallas */}
      <Retoceso currentScreenName="Inicio" navigation={navigation} />

      <View style={styles.topSection}>
        <Image source={require("../assets/logoA.png")} style={styles.logo} />
        <Text style={styles.title}>BLUEWAVE</Text>
      </View>

      <View style={styles.bottomSection}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Registro")}>
          <Text style={styles.buttonText}>Registrarse</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Login")}>
          <Text style={styles.buttonText}>Iniciar sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A23"
  },
  topSection: {
    flex: 1,
    backgroundColor: "#0047ab", 
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    
     
    
  },
  logo: {
    width: 450,
    height: 450,
    marginBottom: 20,
     resizeMode: "contain",
    marginRight: 15,

  },
  bottomSection: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
   
  },
  title: {
    fontSize: 60,
    fontFamily: "PoppinsBold",
    color: "#fff",
    textAlign: "left",
    top: -100,
    fontWeight: 'bold',
     
  },
  button: {
    backgroundColor: "#4f75be",
    paddingVertical: 16,
    paddingHorizontal: 50,
    borderRadius: 30,
    minWidth: 220,
    margin: 2,
    marginTop: 0,
    top: -55
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontFamily: "PoppinsBold",
    fontWeight: 'bold',
  },
});

export default Inicio;
