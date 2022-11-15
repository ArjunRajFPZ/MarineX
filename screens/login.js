import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import COLORS from '../const/color';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  Dimensions,
  TextInput,
  Button,
  TouchableOpacity,
} from "react-native";
const { height, width } = Dimensions.get("window");
import { getDatabase, ref, get,query,onValue,orderByChild,equalTo} from "firebase/database";
const UserDB = 'users'
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login({navigation}) {
  
  const [UserID, setUserID] = useState('');
  const [Username, setUsername] = useState('');
  const [Userpassword, setpassword] = useState('');
  const [visible, setvisible] = useState(false);

  useEffect(()=>{
    getUserLocalData()
  },[])

  const getUserLocalData = async()=>{
    try {
      let id = await AsyncStorage.getItem('userid');
      setUserID(id)
      if(id !== null) {
        navigation.navigate('Root');
        // value previously stored
      }
    } catch(e) {
      // error reading value
    }
  }

  const LoginCheck =()=>{
    if(Username != '' && Userpassword !=''){
      setvisible(true);
      const db = getDatabase();
    const starCountRef = ref(db, UserDB);
    const dbRef = query(starCountRef, orderByChild('email'),equalTo(Username));
    get(dbRef).then(async snapshot => {
      console.log(snapshot.val())
      if (snapshot.exists()) {
        const val = snapshot.val();
        let newArray = [];
        Object.keys(val).map((key) => {
          val[key].id  = key;
          newArray.push(val[key])
        })
        setvisible(false);
        if(newArray[0].password == Userpassword){
          await AsyncStorage.setItem('userid', newArray[0].id);
          await AsyncStorage.setItem('usertype', newArray[0].type);
          navigation.navigate('Root');
        }else{
          alert("You have entered a wrong password");
        }
        //
      }else{
        setvisible(false);
        alert("User not registered");
      }
    });
    }else{
      alert("Please enter your username and password");
    }

  }

  return (
        <View style={styles.container}>
          <Spinner
          visible={visible}
          color={COLORS.white}
          size="large"
          textContent="Please Wait..."
          textStyle={{color:"#FFF"}}
        />
            <Image
                style={styles.image}
                source={require('../assets/logo.png')} />
            <StatusBar style="auto" />
            <View style={styles.inputView}>
                <TextInput
                    style={styles.TextInput}
                    value={Username}
                    onChangeText={setUsername}
                    keyboardType="email-address"
                    placeholder="Enter your Email/Username"
                    placeholderTextColor="#003f5c"
                />
            </View>

            <View style={styles.inputView}>
                <TextInput
                    style={styles.TextInput}
                    value={Userpassword}
                    secureTextEntry={true}
                    onChangeText={setpassword}
                    placeholder="Enter your Password"
                    placeholderTextColor="#003f5c"
                />
            </View>

            <TouchableOpacity onPress={() => navigation.navigate("UserRegistration")}>
                <Text style={styles.create_button}>Not a Member? Sign Up !</Text>
            </TouchableOpacity>

            {/* <TouchableOpacity>
                <Text style={styles.forgot_button}>Forgot Password?</Text>
            </TouchableOpacity> */}

            <Pressable style={styles.uploadbtn} onPress={LoginCheck}>
                    <Text style={{color:"#fff",fontSize:18,fontWeight:"500"}}>LOGIN</Text>
                </Pressable>
        </View>
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

  inputView: {
    width: "80%",
    height: 45,
    borderRadius: 25,
    marginBottom:5,
    marginTop:5,    
    fontWeight: "bold",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#137fc7",
    marginLeft: "auto",
    marginRight: "auto",
  },

  TextInput:{
    width,
    flex: 1,
    padding: 10,
    marginLeft: "auto",
    marginRight: "auto",
  },

  forgot_button: {
    fontSize: 14,
    marginLeft: "auto",
    marginRight: "auto",
  },

  create_button: {
    marginTop:10,
    height: 30,
    color: "#2690d9",
    fontSize:14,
    marginLeft: "auto",
    marginRight: "auto",
  },

 uploadbtn:{
        marginTop:8,
        backgroundColor: COLORS.green,
        width:"80%",
        height: 45,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#137fc7",
        justifyContent: 'center',
        alignItems:'center',
        marginLeft:"auto",
        marginRight:"auto",
      },
});