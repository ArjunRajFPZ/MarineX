import React, { useState,useEffect } from "react";
import { CreateProductData,UploadImage} from "../services/addproduct.service";
import {View, SafeAreaView,Dimensions,ScrollView, Image, TextInput, StyleSheet,Button,Pressable, Text} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Spinner from 'react-native-loading-spinner-overlay';
import COLORS from '../const/color';

const width = Dimensions.get('window').width - 50 ;
import { SelectList } from 'react-native-dropdown-select-list';
import * as DocumentPicker from "expo-document-picker";
import {  ref as sRef, getStorage, uploadBytesResumable } from "firebase/storage";
import { getDatabase,child,update, ref, get,push,} from "firebase/database";
const ProductDB = 'products/'
import AsyncStorage from '@react-native-async-storage/async-storage';

function AddProducts({route,navigation}) {

    const editData = route.params;
    const [sellerID, setsellerID] = useState('')
    const [ImgUrl, setImgUrl] = useState(null)
    const [imgUploaded, setimgUploaded] = useState(null);
    const [ProductID, setProductID] = useState('');
    const [ProductName, setProductName] = useState('')
    const [ProductType, setProductType] = useState('')
    const [ProductDetails, setProductDetails] = useState('')
    const [ProductAmount, setProductAmount] = useState('')
    const [ProductQuantity, setProductQuantity] = useState('')
   // const [selected, setSelected] = React.useState("");
    const [visible, setvisible] = useState(false);
    const [DefaultTypeSelected, setDefaultTypeSelected] = useState()
  
  const data = [
      {key:'freshwater', value:'Fresh Water'},
      {key:'marine', value:'Marine'},
      {key:'aquarium', value:'Aquarium'}
  ]

  useEffect(()=>{
    getUserLocalData()
  },[])

  const getUserLocalData = async()=>{
    try {
        const seller_id = await AsyncStorage.getItem('userid');
        setsellerID(seller_id);
      if(seller_id == null) {
        navigation.navigate('Login');
        // value previously stored
      }
    } catch(e) {
      // error reading value
    }
  }

  useEffect(()=>{
    if(editData && editData.id){
        setProductID(editData.id);
        setProductName(editData.productname);
        setProductType(editData.producttype);
        const Defaultdata = data.filter((item,index)=>{
           return item.key == editData.producttype
        });
        setDefaultTypeSelected(Defaultdata[0]);

        setProductDetails(editData.productdetails);
        setProductAmount(editData.productamount);
        setProductQuantity(editData.productquantity);
        setImgUrl(editData.productimage);
    }
  },[editData])


  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({type: "image/*"});
    setImgUrl(result.uri);
    setimgUploaded(result);
  };

    const addUpdateFn = () =>{
        if(ProductName && ProductName.length > 0){
            if(ProductAmount && ProductAmount.length > 0){
                if(ProductQuantity && ProductQuantity.length > 0){
                    if(ImgUrl && ImgUrl.length > 0){
                      setvisible(true);
                      if(imgUploaded) imgupload();
                      else SubmitProductDataToDB(ImgUrl);
                    }else{
                      alert("Upload Product image");
                  return;
                  }
                }else{
                    alert("Enter Product Quantity");
                return;
                }
            }else{
                alert("Enter Product Amount");
                return; 
            }
        }else{
            alert("Enter Product Name");
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
            const storageRef = sRef(Storagedb, `products/${filename}`);
            const response = await fetch(imgUploaded.uri)
            const blob = await response.blob();
            
            const uploadTask = uploadBytesResumable(storageRef, blob);

            uploadTask.on("state_changed",null,(error) => {
                console.log(error);
            },
            async () => {
                const getDownLoadURL = await UploadImage(uploadTask.snapshot.ref).then((res)=>{

                    SubmitProductDataToDB(res);
                })
                
            }
            );
      }

    const SubmitProductDataToDB=(file)=>{

        let Data ={
            sellerid : sellerID,
            producttype : ProductType,
            productname : ProductName,
            productdetails : ProductDetails,
            productamount : ProductAmount,
            productquantity : ProductQuantity,
            productimage    : file ? file :""
        }

        if(ProductID){
            const db = getDatabase();
            const dbref = ref(db);

            get(child(dbref, ProductDB+`${ProductID}`)).then(snapshot =>{
            if(snapshot.exists()){
            update(ref(db, `${ProductDB}${ProductID}`), Data);
            setvisible(false);
                alert("Product Updated");
                navigation.navigate('Root', {
                    screen: 'MenuRoot',
                    params: {
                      screen: 'List Products'
                    },
                  })
            }
            else{
                setvisible(false);
                alert("Product Not Found. please contact Administrator")
            }
            })
        }else{
            var ProductData =  CreateProductData(Data).then((res) => {
                setvisible(false);
                alert("Product Added");
                navigation.navigate('Root', {
                    screen: 'MenuRoot',
                    params: {
                      screen: 'Menu'
                    },
                  })
                })
        }
        
    }

    return (
        <SafeAreaView
            style={{ flex:1, paddingHorizontal: 20, backgroundColor: COLORS.white}}>
                <View style={styles.header}>
                    <Icon name="arrow-back" size={28} onPress={() => navigation.goBack()} />
                    <Text style={{fontSize: 20, color: COLORS.green, fontWeight: 'bold'}}>
                         { ProductID ? 'Edit Product':'Add Products'}
                    </Text>
                </View>
            <View style={styles.container}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 300 }} showsHorizontalScrollIndicator={false}> 
            <Spinner
                visible={visible}
                color={COLORS.white}
                textContent="Please Wait..."
                textStyle={{color:"#FFF"}}
                size="large"
            />
                {ImgUrl && <Image
                style={styles.image}
                source={{uri:ImgUrl}}
                />
            }
                <View>
                <Pressable style={styles.uploadprobtn} onPress={pickDocument}>
                <Text style={{color:"#fff",fontSize:16,fontWeight:"500"}}>UPLOAD PRODUCT IMAGE</Text>
                 </Pressable>
            
                <View style={styles.inputView}>
                <TextInput
                    style={styles.TextInput}
                    value={ProductName}
                    onChangeText={setProductName}
                    placeholder="Enter Product Name"
                    placeholderTextColor="#003f5c"
                />
                </View>
                <SelectList 
                    setSelected={(val) => setProductType(val)}
                    defaultOption={DefaultTypeSelected} 
                    data={data} 
                    save="key"
                    placeholder='Select Type'
                    boxStyles={{borderRadius:25,borderColor:"#137fc7",width:width,marginLeft: "auto",marginRight: "auto"}} 
                />

                <View style={styles.addressView}>
                <TextInput
                    style={styles.TextInput}
                    value={ProductDetails}
                    onChangeText={setProductDetails}
                    placeholder="Enter Product details"
                    placeholderTextColor="#003f5c"
                />
            </View>
                <View style={styles.inputView}>
                <TextInput
                    style={styles.TextInput}
                    value={ProductAmount}
                    onChangeText={setProductAmount}
                    placeholder="Enter Amount"
                    keyboardType="number-pad"
                    placeholderTextColor="#003f5c"
                />
                </View>
                
                <View style={styles.inputView}>
                <TextInput
                    style={styles.TextInput}
                    value={ProductQuantity}
                    onChangeText={setProductQuantity}
                    placeholder="Enter Quantity"
                    keyboardType="number-pad"
                    placeholderTextColor="#003f5c"
                />
                </View>
               
                <Pressable style={styles.uploadbtn} onPress={addUpdateFn}>
                    <Text style={{color:"#fff",fontSize:18,fontWeight:"500"}}>{ProductID ? 'UPDATE': 'SUBMIT'}</Text>
                </Pressable>                
                </View>
            </ScrollView>
            </View>
        </SafeAreaView>
    );
};

export default AddProducts;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent:"center",
        marginTop:50,
      },
    header: {
        paddingHorizontal: 20,
        marginTop: 40,
        flexDirection: 'row',
        alignItems:"center"
      },

      addressView: {
        width: "97%",
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

      image: {
        marginTop:20,
        marginBottom:20,
        height: "30%",
        width:200,
        marginLeft: "auto",
        marginRight: "auto",
      },
      inputView: {
        width,
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
      },
      uploadbtn:{
        marginTop:10,
        backgroundColor: COLORS.green,
        width,
        height: 50,
        borderRadius: 10,
        flex:1,
        borderWidth: 1,
        borderColor: "#137fc7",
        justifyContent: 'center',
        alignItems:'center',
        marginLeft: "auto",
        marginRight: "auto",
      },

      uploadprobtn:{
        marginTop:10,
        backgroundColor: COLORS.green,
        width,
        height: 50,
        borderRadius: 10,
        flex:1,
        borderWidth: 1,
        borderColor: "#137fc7",
        justifyContent: 'center',
        alignItems:'center',
        marginLeft: "auto",
        marginRight: "auto",
      },
})