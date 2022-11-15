import React ,{useEffect,useState}from 'react';
import { Pressable, StyleSheet, View, Text} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function MenuPage({navigation}) {
  const [UserType, setUserType] = useState('');
  useEffect(()=>{
    getUserLocalData()
  },[])

  const getUserLocalData = async()=>{
    try {
      let type = await AsyncStorage.getItem('usertype');
      setUserType(type);
    } catch(e) {
      // error reading value
    }
  }
    return (
        <>
        <View style={{ marginTop: "55%" }}>
        { UserType !=='user' && 
        <>
        <Pressable
          style={styles.addproductbtn}
          onPress={() => navigation.navigate('Root', {
            screen: 'MenuRoot',
            params: {
              screen: 'Add Products'
            },
          })}>
            <Text style={{ color: "#fff", fontSize: 18, fontWeight: "500", marginLeft: "auto", marginRight: "auto" }}>ADD PRODUCTS</Text>
        </Pressable>

        <Pressable
        style={styles.listproductbtn}
          onPress={() => navigation.navigate('Root', {
            screen: 'MenuRoot',
            params: {
              screen: 'List Products'
            },
          })} >
            <Text style={{ color: "#fff", fontSize: 18, fontWeight: "500", marginLeft: "auto", marginRight: "auto" }}>LIST PRODUCTS</Text>
      </Pressable>

      <Pressable
      style={styles.orderreqbtn}
        onPress={() => navigation.navigate('Root', {
          screen: 'MenuRoot',
          params: {
            screen: 'Order Request'
          },
        })}>
          <Text style={{ color: "#fff", fontSize: 18, fontWeight: "500", marginLeft: "auto", marginRight: "auto" }}>ORDER REQUEST</Text>
        </Pressable>
        </>
}
          <Pressable
          style={styles.logoutbtn}
                onPress={async() => {
                  await AsyncStorage.removeItem('userid');
                  alert("Logged Out");
                  navigation.navigate('Login');
                }}
               >
                <Text style={{ color: "#fff", fontSize: 18, fontWeight: "500", marginLeft: "auto", marginRight: "auto" }}>LOG OUT</Text>
        </Pressable>
        </View>
        </>
    );
}

export default MenuPage;
const styles = StyleSheet.create({
  addproductbtn : {
    marginBottom:10,
    backgroundColor: '#00B761',
    width:"50%",
    height: 50,
    borderRadius: 10,
    justifyContent:"center",
    marginLeft:"auto",
    marginRight:"auto",
  },
  
  listproductbtn : {
    marginBottom:10,
    backgroundColor: '#00B761',
    width:"50%",
    height: 50,
    borderRadius: 10,
    justifyContent:"center",
    marginLeft:"auto",
    marginRight:"auto",
  },

  orderreqbtn : {
    marginBottom:10,
    backgroundColor: '#00B761',
    width:"50%",
    height: 50,
    borderRadius: 10,
    justifyContent:"center",
    marginLeft:"auto",
    marginRight:"auto",
  },

  logoutbtn : {
    marginBottom:200,
    backgroundColor: '#00B761',
    width:"50%",
    height: 50,
    borderRadius: 10,
    justifyContent:"center",
    marginLeft:"auto",
    marginRight:"auto",
  },
})