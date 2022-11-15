import React ,{useState}from 'react';
import { Text,SafeAreaView, View, Pressable, StyleSheet, Dimensions} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import COLORS from '../const/color';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getDatabase,child,update, ref,remove, get,push,} from "firebase/database";
const OrderDB = 'orders/'
const CartDB = 'cart/';

function Checkout({route,navigation}) {
    
    const { cartData, cartTotal, UserID } = route.params;
    const [visible, setvisible] = useState(false);


    const checkoutAction =() =>{
        setvisible(true);
        const database = getDatabase();
        const NewOrder = cartData.map((item)=>{
            item.userid = UserID;
            item.orderstatus = 'new'
            push(ref(database, OrderDB), item);
            remove(ref(database, `${CartDB}${UserID}`));
        })
        alert("Order Received");
        setvisible(false);
        navigation.navigate('Root', {
            screen: 'Profile',
            params: {
              screen: 'Profile Page'
            },
          })
    }

    return (
        <>
        <SafeAreaView
            style={{ flex:1, paddingHorizontal: 20, backgroundColor: COLORS.white}}>
         <View style={styles.header}>
            <Icon name="arrow-back" size={28} onPress={() => navigation.goBack()} />
            <Text style={{fontSize: 20, color: COLORS.green, fontWeight: 'bold'}}>
                 Checkout Items
            </Text>
        </View>
            <View style={{marginTop:"70%"}}>
            <Spinner
                visible={visible}
                color={COLORS.white}
                textContent="Please Wait..."
                textStyle={{color:"#FFF"}}
                size="large"
            />
            <Text style={{justifyContent:"center",marginLeft:"auto",marginRight:"auto", fontSize:20,fontWeight:"500"}}>Total Items: {cartData.length}</Text>
                <Text style={{justifyContent:"center",marginLeft:"auto",marginRight:"auto", fontSize:20,fontWeight:"500"}}>Total Amount: ₹{cartTotal}</Text>
                <Pressable style={styles.buttonStyle} onPress={checkoutAction}>
                    <Text style={{color:"#fff",fontSize:18,fontWeight:"500",marginLeft:"auto",marginRight:"auto"}}>PROCEED TO PAYMENT</Text>
                </Pressable>
            </View>
            </SafeAreaView>
        </>
    );
}

export default Checkout;
const styles = StyleSheet.create({
    header: {
        paddingHorizontal: 20,
        marginTop: 40,
        flexDirection: 'row',
        alignItems:"center"
      },
    buttonStyle : {
        marginTop:20,
        marginBottom:200,
        backgroundColor: '#00B761',
        width:"80%",
        height: 50,
        borderRadius: 10,
        justifyContent:"center",
        marginLeft:"auto",
        marginRight:"auto",
      },
})