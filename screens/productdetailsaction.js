import React from 'react';
import {View, SafeAreaView,ScrollView,Alert, Image, Text, StyleSheet} from 'react-native';
import { getDatabase, ref,remove } from "firebase/database";
import Icon from 'react-native-vector-icons/MaterialIcons';
import COLORS from '../const/color';

const ProductDB = 'products/';

const ProductDetailsAction = ({navigation, route}) => {
  const item = route.params;

  const DeleteAlert = () =>
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
          remove(ref(db, `${ProductDB}${item.id}`));
          alert("Deleted Successfully");
          navigation.navigate('Root', {
            screen: 'MenuRoot',
            params: {
              screen: 'List Products'
            },
          })
        } }
      ]
    );

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.white,
      }}>
        <ScrollView>
      <View style={style.header}>
        <Icon name="arrow-back" size={28} onPress={() => navigation.goBack()} />
        <View style={{flex:1,justifyContent:"flex-end",flexDirection:"row"}}>
        <Icon name="edit" size={28} style={{color:"blue",marginRight:5}} onPress={()=>{
          navigation.navigate('Root', {
            screen: 'MenuRoot',
            params: {
              screen: 'Add Products',
              params:item
            },
          })
        }}/>
        <Icon name="delete" size={28} style={{color:"red"}} onPress={DeleteAlert}/>
        </View>
        
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
        <Text style={{fontSize: 19, fontWeight: '500'}}>Quantity: {item.productquantity}</Text>
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
    //justifyContent: 'space-between',
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

export default ProductDetailsAction;
