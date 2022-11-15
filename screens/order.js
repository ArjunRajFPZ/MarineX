import React,{useState,useEffect} from 'react';
import {
  View,
  SafeAreaView,
  Text,
  Button,
  StyleSheet,
  FlatList,
  Image,Pressable,
  Dimensions,TextInput, TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import COLORS from '../const/color';
const width = Dimensions.get('window').width - 50 ;
import { getDatabase, ref, get,query,onValue,orderByChild,equalTo} from "firebase/database";
const OrderDB = 'orders/'
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage';


function Order({navigation}) {
  
  const [UserID, setUserID] = useState('');
  const [visible, setvisible] = useState(false);
  const [OrderData, setOrderData] = useState([]);

  useEffect(()=>{
    getUserLocalData()
  },[])

  const getUserLocalData = async()=>{
    try {
      let id = await AsyncStorage.getItem('userid');
      setUserID(id);
      if(id == null) {
        navigation.navigate('Login');
        // value previously stored
      }
    } catch(e) {
      // error reading value
    }
  }

  useEffect(()=>{
    if(UserID) {
      setvisible(true);
      GetOrderDetails();
    }
  },[UserID])

  const GetOrderDetails=()=>{
    const db = getDatabase();
    const starCountRef = ref(db, OrderDB);
    onValue(starCountRef, (snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
              let newArray = [];
              Object.keys(data).map((key) => {
                data[key].id  = key;
                if(data[key].userid == UserID) newArray.push(data[key])
              })
            setvisible(false);
           setOrderData(newArray);
        } else {
            setvisible(false);
            setOrderData([]);
        }   
    })
  }
    const Card = ({item}) => {
        return (
          <TouchableOpacity
            activeOpacity={0.8}
           // onPress={() => navigation.navigate('Product Details', item)}
            >
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
                    <Text style={{fontWeight: 'bold', fontSize: 17}}>
                    {item.productname}
                    </Text>
                    <Text style={{fontWeight: 'bold', fontSize: 17}}>
                    {item.cartqty}
                    </Text>
                    <Text style={{fontSize: 19, fontWeight: 'bold'}}>
                    ₹{item.cartqty * item.productamount}
                  </Text>
                  </View>
                
              </View>
    
              

              <View style={{}}>
                    <Text style={{color: item.orderstatus == 'new'? 'green':
                     item.orderstatus == 'delivered'? 'blue': 'red',
                     textTransform: 'uppercase'}}>{item.orderstatus}</Text>
              </View>

            </View>
          </TouchableOpacity>
        );
      };

    return (
        <SafeAreaView style={{flex: 1, paddingHorizontal: 20, backgroundColor: COLORS.white,marginTop:10}}>
          <Spinner
                visible={visible}
                color={COLORS.white}
                textContent="Please Wait..."
                textStyle={{color:"#FFF"}}
                size="large"
            />
        <View style={style.header}>
            <Icon name="arrow-back" size={28} onPress={() => navigation.goBack()} />
            <Text style={{fontSize: 20, color: COLORS.green, fontWeight: 'bold'}}>
            Order
            </Text>
        </View>
        {OrderData && OrderData.length ? <FlatList
        //columnWrapperStyle={{justifyContent: 'space-between'}}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          marginTop: 20,
          paddingBottom: 50,
        }}
        // numColumns={2}
        data={OrderData}
        renderItem={({item}) => {
          return <Card item={item} />;
        }}
      />:
      
      <View style={style.noData}>
        <Text style={{color:"#808080",fontSize:16}}>No orders to show</Text>
      </View>
      }
        </SafeAreaView>
    );
}

export default Order;

const style = StyleSheet.create({
    header: {
        paddingHorizontal: 20,
        marginTop: 40,
        flexDirection: 'row',
        alignItems:"center"
      },
      card: {
        height: 110,
        backgroundColor: COLORS.light,
        width,
        marginHorizontal: 2,
        borderRadius: 10,
        marginBottom: 20,
        padding: 15,
      },
      borderBtn: {
        marginTop:5,
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