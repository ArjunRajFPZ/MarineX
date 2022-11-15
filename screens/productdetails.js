import React ,{useEffect}from 'react';
import {View, SafeAreaView,ScrollView, Image, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import COLORS from '../const/color';
import { getDatabase, ref, get,update,push,child} from "firebase/database";
const CartDB = 'cart/';
import AsyncStorage from '@react-native-async-storage/async-storage';


const ProductDetails = ({navigation, route}) => {
  const item = route.params;
  
  const [UserID, setUserID] = React.useState('');
  const [Quantity, setQuantity] = React.useState(1);
 
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

  const ChangeQuantity =(type)=>{
    if(type == 'add'){
      if( Quantity < item.productquantity){
        setQuantity(Quantity+1);
      }else{
        alert("Maximum Quantity Reached")
      }
        
    }else{
        if(Quantity > 1){
            setQuantity(Quantity-1);
        }else{
          alert("Minimum Quantity 1")
        }
    }
  }

  const AddtoCart=()=>{
    const db = getDatabase();
    const dbref = ref(db);
 
    get(child(dbref, CartDB+`${UserID}/${item.id}`)).then(snapshot =>{
    if(snapshot.exists()){
       let data = snapshot.val();
       let newArray = [];
       let UID;
        Object.keys(data).map((key) => {
          UID = key
          newArray.push(data[key])
        })
       
        let newObj = newArray[0];
        console.log(newObj)
        let Calx =Number(newObj.cartqty) + Number(Quantity)
        if(Calx > Number(item.productquantity)){
          console.log("Great")
          if(Calx == Number(item.productquantity)){
            console.log("Equal")
            newObj.cartqty = Calx;
            update(ref(db, `${CartDB}${UserID}/${item.id}/${UID}`), newObj);
          }else{
            alert("Maximum quantity Added");
          }
        }else{
          console.log("Update")
          newObj.cartqty = Calx;
          update(ref(db, `${CartDB}${UserID}/${item.id}/${UID}`), newObj);
          alert("Product Added to the cart");
        }
    }else{
      item['cartqty'] = Quantity;
      push(ref(db, CartDB+`${UserID}/${item.id}`), item);
      alert("Added to cart")
    }});
    

  }


  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.white,
      }}>
        <ScrollView>
      <View style={style.header}>
        <Icon name="arrow-back" size={28} onPress={() => navigation.goBack()} />
        <Icon name="shopping-cart" size={28} onPress={() => navigation.navigate('Root', {
            screen: 'Cart',
            params: {
              screen: 'Cart Page'
            },
          })}/>
      </View>
      <View style={style.imageContainer}> 
        <Image source={{uri:item.productimage}} style={{resizeMode: 'contain', flex: 1,width:"100%"}} />
      </View>
      <View style={style.detailsContainer}>
        <View
          style={{
            marginLeft: 20,
            flexDirection: 'row',
            alignItems: 'flex-end',
          }}>
          {/* <View style={style.line} />
          <Text style={{fontSize: 18, fontWeight: 'bold'}}>Best choice</Text> */}
        </View>
        <View
          style={{
            marginLeft: 20,
            marginTop: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text style={{fontSize: 22, fontWeight: 'bold'}}>{item.productname}</Text>
          <View style={style.priceTag}>
            <Text
              style={{
                marginLeft: 15,
                color: COLORS.white,
                fontWeight: 'bold',
                fontSize: 16,
              }}>
              ₹{item.productamount}
            </Text>
          </View>
        </View>
        <View style={{paddingHorizontal: 20, marginTop: 10}}>
          <Text style={{fontSize: 18, fontWeight: '500'}}>Details</Text>
          <Text
            style={{
              color: 'grey',
              fontSize: 16,
              lineHeight: 22,
              marginTop: 10,
            }}>
            {item.productdetails}
          </Text>
          <View
            style={{
              marginTop: 20,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
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
                {Quantity}
              </Text>
              <View style={style.borderBtn}>
                <Text style={style.borderBtnText} onPress={()=>ChangeQuantity('add')}>+</Text>
              </View>
            </View>

            <View style={style.buyBtn}>
              <Text
                style={{color: COLORS.white, fontSize: 18, fontWeight: 'bold'}} onPress={AddtoCart}>
                Add to Cart
              </Text>
            </View>
          </View>
        </View>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imageContainer: {
    flex: 0.45,
    marginTop: 20,
    height:300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsContainer: {
    flex: 0.55,
    backgroundColor: COLORS.light,
    marginHorizontal: 7,
    marginBottom: 7,
    borderRadius: 20,
    marginTop: 30,
    paddingTop: 30,
  },
  line: {
    width: 25,
    height: 2,
    backgroundColor: COLORS.dark,
    marginBottom: 5,
    marginRight: 3,
  },
  borderBtn: {
    borderColor: 'grey',
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 40,
  },
  borderBtnText: {fontWeight: 'bold', fontSize: 28},
  buyBtn: {
    width: 130,
    height: 50,
    backgroundColor: COLORS.green,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
  },
  priceTag: {
    backgroundColor: COLORS.green,
    width: 80,
    height: 40,
    justifyContent: 'center',
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
  },
});

export default ProductDetails;
