import React, {useEffect,useState} from 'react';
import {
  View,
  SafeAreaView,
  Text,
  Button,
  StyleSheet,
  FlatList,
  Image,Pressable,
  Dimensions,TextInput, TouchableOpacity,Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import COLORS from '../const/color';
import { getDatabase, ref,update, get,query,remove,onValue,orderByChild,equalTo} from "firebase/database";
const width = Dimensions.get('window').width - 50 ;
const CartDB = 'cart/';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Spinner from 'react-native-loading-spinner-overlay';

function Cart({navigation}) {
  const [UserID, setUserID] = useState('');
  const [visible, setvisible] = useState(false);
  const [cartData, setCartData] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);

  useEffect(()=>{
    getUserLocalData()
  },[])

  const getUserLocalData = async()=>{
    try {
      let id = await AsyncStorage.getItem('userid');
      setUserID(id);
      setvisible(true);
      GetCartDetails(id);
      if(id == null) {
        navigation.navigate('Login');
        // value previously stored
      }
    } catch(e) {
      // error reading value
    }
  }

  const GetCartDetails = (id) =>{
    const db = getDatabase();
    const starCountRef = ref(db, `${CartDB}${id}`);
    onValue(starCountRef, (snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
              let newArray = [];
              Object.keys(data).map((item) => {
               Object.keys(data[item]).map((key) => {
                data[item][key].parentID = item;
                data[item][key].id = key;
                newArray.push(data[item][key])
               })
              })
            setvisible(false);
            setCartData(newArray);
            getTotalAmount(newArray);
        } else {
            setvisible(false);
            setCartData([]);
            setCartTotal(0)
        }   
    })
  }
  
  const getTotalAmount = (items) =>{
    if(items && items.length){
      const totalAmount = items.map(item => (item.productamount * item.cartqty )).reduce((prev, next) => Number(prev) + Number(next));
      setCartTotal(totalAmount);
    } 
 }
 
    const Card = ({item}) => {
      //console.log(item)
       const [cartQuantity, setcartQuantity] = useState(item.cartqty);
       const [cartAmount, setcartAmount] = useState(item.cartqty * item.productamount);
       

       const ChangeQuantity =(type)=>{
        const db = getDatabase();
        if(type == 'add'){
          if( cartQuantity < item.productquantity){
            setcartQuantity(Number(cartQuantity)+1);
            setcartAmount((Number(cartQuantity)+1) * item.productamount)
            item.cartqty = Number(cartQuantity) + 1;
            let parentID = item.parentID;
            delete item.parentID;
            update(ref(db, `${CartDB}${UserID}/${parentID}/${item.id}`), item);
          }else{
            alert("Maximum Quantity Reached")
          }
            
        }else{
            if(cartQuantity > 1){
              setcartQuantity(Number(cartQuantity)-1);
              setcartAmount((Number(cartQuantity)-1) * item.productamount)
              item.cartqty = Number(cartQuantity) - 1;
              let parentID = item.parentID;
              delete item.parentID;
              update(ref(db, `${CartDB}${UserID}/${parentID}/${item.id}`), item);
            }else{
              alert("Minimum Quantity 1")
            }
        }
      }

      const DeleteCartItem = () =>{
        Alert.alert(
          "Delete Confirmation",
          "Are you sure you want to delete this item?",
          [
            {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel"
            },
            { text: "OK", onPress: () =>{
              const db = getDatabase();
              remove(ref(db, `${CartDB}${UserID}/${item.parentID}`));
            } }
          ]
        );
        
      }
        return (
          // <TouchableOpacity
          //   activeOpacity={0.8}
          //  // onPress={() => navigation.navigate('Product Details', item)}
          //   >
            <View style={style.card}>
              <View
                style={{
                  height: 75,
                  flexDirection:"row"
                  //alignItems: 'left',
                }}>
                     <View>
                        <Image
                        source={{uri:item.productimage}}
                        style={{flex: 1,width:100}}
                        />
                     </View>
                     <View style={{marginLeft:10}}>
                     <Text style={{fontWeight: 'bold', fontSize: 17, marginTop: 10}}>
                        {item.productname}
                    </Text>
                    <Text style={{fontSize: 19, fontWeight: 'bold'}}>
                ₹{cartAmount}
                </Text>
                     </View>
              </View>
               <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <View style={style.borderBtn}>
                <Text style={style.borderBtnText} onPress={()=>ChangeQuantity('sub')}>-</Text>
              </View>
              <Text
                style={{
                  fontSize: 20,
                  marginHorizontal: 10,
                  fontWeight: 'bold',
                }}>
                {cartQuantity}
              </Text>
              <View style={style.borderBtn}>
                <Text style={style.borderBtnText} onPress={()=>ChangeQuantity('add')}>+</Text>
              </View>
              <View style={style.deletebtn}>
                <Text style={style.deleteBtnText} onPress={DeleteCartItem}>Delete</Text>
              </View>
            </View>

            </View>
          // </TouchableOpacity>
        );
      };

    return (
        <SafeAreaView style={{flex: 1, paddingHorizontal: 20, backgroundColor: COLORS.white}}>
           <Spinner
          visible={visible}
          color={COLORS.white}
          size="large"
          textContent="Please Wait..."
          textStyle={{color:"#FFF"}}
        />
        <View style={style.header}>
            <Icon name="arrow-back" size={28} onPress={() => navigation.goBack()} />
            <Text style={{fontSize: 20, color: COLORS.green, fontWeight: 'bold'}}>
            Cart
            </Text>
        </View>
        {cartData && cartData.length ?
        <FlatList
        //columnWrapperStyle={{justifyContent: 'space-between'}}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          marginTop: 10,
          paddingBottom: 50,
        }}
        // numColumns={2}
        data={cartData}
        renderItem={({item}) => {
          return <Card item={item} />;
        }}
      />
      : 
      <View style={style.noData}>
        <Text style={{color:"#808080",fontSize:16}}>No items added to cart</Text>
      </View>
}
     {cartData && cartData.length ? <Pressable style={style.buttonStyle} 
                  onPress={() =>
                  navigation.navigate('Root', {
                      screen: 'Cart',
                      params: {
                        screen: 'Checkout',
                        params:{
                          cartData:cartData,
                          cartTotal:cartTotal,
                          UserID:UserID
                        }
                      },
                    })}>
      <Text style={{color:"#fff",fontSize:15,marginLeft:10}}>Total: ₹{cartTotal}</Text>
      <Text style={{color:"#fff",fontSize:20,fontWeight:"500",marginRight:10}}>Checkout </Text>
    </Pressable> : null }
        </SafeAreaView>
    );
}

export default Cart;

const style = StyleSheet.create({
    header: {
        paddingHorizontal: 20,
        marginTop: 40,
        flexDirection: 'row',
        alignItems:"center"
      },
      card: {
        height: 150,
        backgroundColor: COLORS.light,
        width,
        marginHorizontal: 2,
        borderRadius: 10,
        marginBottom: 20,
        padding: 15,
      },
      borderBtn: {
        marginTop:10,
        borderColor: 'grey',
        borderWidth: 1,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        width: 40,
        height: 35,
      },
      borderBtnText: {fontWeight: 'bold', fontSize: 20},
      deletebtn:{
        marginLeft:20,
        marginTop:5,
        backgroundColor:"#F1F1F1",
        borderColor: 'grey',
        borderWidth: 1,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        width: 100,
        height: 35,
      },
      deleteBtnText: { fontSize: 15},
      buttonStyle : {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#00B761',
        width,
        height: 50,
        borderRadius: 10,
        flex:1,
        //justifyContent: 'center',
        alignItems:'center',
        position: 'absolute',
        bottom: 0,
        right: 25
      },
      noData:{
        flex:1,
        justifyContent: 'center',
        alignItems:'center'
      }
    })