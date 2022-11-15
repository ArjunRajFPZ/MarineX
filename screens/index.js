import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
} from "react-native";

const { height, width } = Dimensions.get("window");
export default function Home({navigation}) {
  return (
        <>
            <View style={styles.container}>
                <ImageBackground source={require('../assets/bg.jpg')} style={{ flex: 1, position: "absolute", height, width }}/>
                    <Image
                    style={styles.image}
                    source={require('../assets/logo.png')} />

                    <TouchableOpacity style={styles.loginBtn} onPress={() => navigation.navigate("Login")}>
                    <Text style={styles.loginText} >LOGIN</Text>
                    </TouchableOpacity>

                    <View>
                      <Text style={{marginLeft:"auto", marginRight: "auto", fontSize:14}}>OR</Text>
                    </View>

                    <TouchableOpacity style={styles.loginBtn} onPress={() => navigation.navigate("Register")}>
                    <Text style={styles.loginText}>CREATE ACOOUNT</Text>
                    </TouchableOpacity>
            </View>
            </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent:"center",
  },


  image: {
    height: "30%",
    width:200,
    marginLeft: "auto",
    marginRight: "auto",
  },

  loginBtn: {
    width: "80%",
    height: 45,
    borderRadius: 25,
    marginBottom:10,
    marginTop:10,    
    fontWeight: "bold",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#137fc7",
    marginLeft: "auto",
    marginRight: "auto",
  },
});