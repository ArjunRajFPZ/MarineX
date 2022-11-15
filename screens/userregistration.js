import React, { useState } from "react";
import { CreateUserData, UploadImage } from "../services/user.service";
import COLORS from '../const/color';
import { SelectList } from 'react-native-dropdown-select-list';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  Dimensions,
  TextInput,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import {  ref as sRef, getStorage, uploadBytesResumable } from "firebase/storage";
import Spinner from 'react-native-loading-spinner-overlay';
const { height, width } = Dimensions.get("window");



export default function UserRegistration({navigation}) {

    const [ImgUrl, setImgUrl] = useState(null)
    const [imgUploaded, setimgUploaded] = useState(null);
    const [UserName, setUserName] = useState('')
    const [UserContact, setUserContact] = useState('')
    const [UserEmail, setUserEmail] = useState('')
    const [UserAddress, setUserAddress] = useState('')
    const [UserPassword, setUserPassword] = useState('')
    const [UserConfPassword, setUserConfPassword] = useState('')
    const [UserType, setUserType] = useState("");
    const [visible, setvisible] = useState(false);

    const data = [
    {key:'user', value:'User'},
    {key:'aquarium', value:'Aquarium'},
    {key:'seller', value:'Seller'},
    {key:'farmer', value:'Farmer'}
]
    const pickDocument = async () => {
        let result = await DocumentPicker.getDocumentAsync({type: "image/*"});
        setImgUrl(result.uri);
        setimgUploaded(result);
      };

    const submitFn = () =>{
        if(UserEmail && UserEmail.length > 0){
            if(UserPassword && UserPassword.length > 0){
                if(UserConfPassword && UserConfPassword.length > 0){
                    if(UserPassword == UserConfPassword){
                        setvisible(true);
                        if(imgUploaded) imgupload();
                        else SubmitUserDataToDB('');

                    }else{
                        alert("Password Missmatch");
                        return;
                    }
                }else{
                    alert("PLease Enter Confirm Password");
                    return;
                }
            }else{
                alert("PLease Enter Password");
                return;
            }
        }else{
            alert("PLease Enter Email");
            return;
        }
    }
    
    const imgupload = async () =>{
        //e.preventDefault()
        //console.log(imgUploaded)
        const file = imgUploaded.name.split('/').pop();
        const filename= `${file.substr(0,file.lastIndexOf('.'))}${Math.floor(Math.random() * 10000)}.${file.substr(file.lastIndexOf('.')+1,file.length)}`
    
        if (!imgUploaded) return;
            const Storagedb = getStorage();
            const storageRef = sRef(Storagedb, `users/${filename}`);
            const response = await fetch(imgUploaded.uri)
            const blob = await response.blob();
            
            const uploadTask = uploadBytesResumable(storageRef, blob);

            uploadTask.on("state_changed",null,(error) => {
                console.log(error);
            },
            async () => {
                const getDownLoadURL = await UploadImage(uploadTask.snapshot.ref).then((res)=>{

                    SubmitUserDataToDB(res);
                })
                
            }
            );
      }  


    const SubmitUserDataToDB = async (file) =>{
        let Data ={
            type : UserType,
            name : UserName,
            contact : UserContact,
            email : UserEmail,
            address : UserAddress,
            password : UserPassword,
            ImgURL : file ? file :""
        }
        var UserData = await CreateUserData(Data).then((res) => {
            if(res && res._queryParams){
                setvisible(false);
                alert("User created");
                navigation.navigate("Login")
            }else{
                alert("Email Already exists");
            }
        })
    }


  return (
    <SafeAreaView style={{flex: 1}}>
        <View style={styles.container}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 300 }} showsHorizontalScrollIndicator={false}> 
        <Spinner
          visible={visible}
          color={COLORS.white}
          size="large"
          textContent="Please Wait..."
          textStyle={{color:"#FFF"}}
        />
            {ImgUrl && <Image
                style={styles.image}
                source={{uri:ImgUrl}}
                />
            }
            
            <Pressable style={styles.uploadbtn} onPress={pickDocument}>
                <Text style={{color:"#fff",fontSize:16,fontWeight:"500"}}>UPLOAD IMAGE</Text>
            </Pressable>

            <SelectList 
                setSelected={(val) => setUserType(val)} 
                data={data} 
                save="key"
                placeholder='Select User Type'
                boxStyles={{borderRadius:25,borderColor:"#137fc7",marginTop:5,width:"80%",marginLeft: "auto",
                marginRight: "auto"}} 
            />

            <View style={styles.inputView}>
                <TextInput
                    style={styles.TextInput}
                    value={UserName}
                    onChangeText={setUserName}
                    placeholder="Enter your Name"
                    placeholderTextColor="#003f5c"
                />
            </View>
            

            <View style={styles.inputView}>
                <TextInput
                    style={styles.TextInput}
                    value={UserContact}
                    onChangeText={setUserContact}
                    keyboardType="phone-pad"
                    placeholder="Enter Contact"
                    placeholderTextColor="#003f5c"
                />
            </View>

            <View style={styles.inputView}>
                <TextInput
                    style={styles.TextInput}
                    value={UserEmail}
                    onChangeText={setUserEmail}
                    keyboardType="email-address"
                    placeholder="Enter your Email"
                    placeholderTextColor="#003f5c"
                />
            </View>

            <View style={styles.addressView}>
                <TextInput
                    style={styles.TextInput}
                    value={UserAddress}
                    onChangeText={setUserAddress}
                    placeholder="Enter your Address"
                    placeholderTextColor="#003f5c"
                    numberOfLines={10}
                    multiline={true}
                />
            </View>

            <View style={styles.inputView}>
                <TextInput
                    style={styles.TextInput}
                    value={UserPassword}
                    onChangeText={setUserPassword}
                    placeholder="Enter your Password"
                    placeholderTextColor="#003f5c"
                />
            </View>

            <View style={styles.inputView}>
                <TextInput
                    style={styles.TextInput}
                    value={UserConfPassword}
                    onChangeText={setUserConfPassword}
                    placeholder="Enter your Confirm Password"
                    placeholderTextColor="#003f5c"
                />
            </View>

            <TouchableOpacity style={styles.loginBtn} onPress={submitFn}>
                <Text style={{color:"#fff",fontSize:16,fontWeight:"500"}}>CREATE ACCOUNT</Text>
            </TouchableOpacity>
        </ScrollView>
        </View>
        </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent:"center",
        marginTop:50,
      },

    image: {
        marginTop:20,
        marginBottom:20,
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
    //alignItems: "center",
    //justifyContent: "center",
    borderWidth: 1,
    borderColor: "#137fc7",
    marginLeft: "auto",
    marginRight: "auto",
  },

  addressView: {
    width: "80%",
    height: 90,
    borderRadius: 25,
    marginBottom:5,
    marginTop:5,    
    //alignItems: "center",
    //justifyContent: "center",
    borderWidth: 1,
    borderColor: "#137fc7",
    marginLeft: "auto",
    marginRight: "auto",
  },

  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
  },

  loginBtn: {
    width: "80%",
    height: 50,
    borderRadius: 10,
    marginBottom:10,
    marginTop:10,    
    fontWeight: "bold",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#137fc7",
    backgroundColor:COLORS.green,
    marginLeft: "auto",
    marginRight: "auto",
  },
  uploadbtn:{
    //marginTop:50,
    borderWidth: 1,
    borderColor: "#137fc7",
    backgroundColor: COLORS.green,
    width:"80%",
    height: 50,
    borderRadius: 10,
    //flex:1,
    justifyContent: 'center',
    alignItems:'center',
    marginLeft: "auto",
    marginRight: "auto",
  },
});