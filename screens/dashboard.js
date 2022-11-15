import React,{useState,useEffect} from 'react';
import {
  View,
  SafeAreaView,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,TextInput, TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import COLORS from '../const/color';
const width = Dimensions.get('window').width / 2 - 30;
import { getDatabase, ref, get,query,onValue,orderByChild,equalTo} from "firebase/database";
const ProductDB = 'products/'
import Spinner from 'react-native-loading-spinner-overlay';

const Dashboard = ({navigation}) => {
  const [originalcatergoryIndex, setOriginalCatergoryIndex] = useState(0);
  const [searchdata, setSearchData] = useState('');
  const [productData, setproductData] = useState([]);
  const [productDataDup, setproductDataDup] = useState([]);
  const [visible, setvisible] = useState(false);
  const categories = ['ALL', 'AQUARIUM', 'MARINE', 'FRESH WATER'];

  useEffect(()=>{
   var result = productData.map((item)=>{
      const searchvalue = item.productname.toLowerCase().includes(searchdata)
      if(searchvalue){
        return item;
      }
    })
    console.log(result)
    if(result.length && result[0]?.productname){
      setproductDataDup(result)
    }else{
      setproductDataDup([])
    }
  },[searchdata])

  useEffect(()=>{

    setvisible(true);
    if(originalcatergoryIndex == 0){
      GetProductDataFromDB();
    }else{
      let type = originalcatergoryIndex == 1 ? 'aquarium' :
                 originalcatergoryIndex == 2 ? 'marine' : 'freshwater';
      getProductBasedOnCategory(type)
    }
    
  },[originalcatergoryIndex])

  const GetProductDataFromDB=()=>{
    const db = getDatabase();
    const starCountRef = ref(db, ProductDB);
    onValue(starCountRef, (snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
              let newArray = [];
              Object.keys(data).map((key) => {
                data[key].id  = key;
                newArray.push(data[key])
              })
            setvisible(false);
            setproductData(newArray);
            setproductDataDup(newArray);
        } else {
            setvisible(false);
            setproductData([]);
            setproductDataDup([]);
        }   
    })
  }

  const getProductBasedOnCategory=(type)=>{
    const db = getDatabase();
    const starCountRef = ref(db, ProductDB);
    const dbRef = query(starCountRef, orderByChild('producttype'),equalTo(type));
    get(dbRef).then(snapshot => {
      if (snapshot.exists()) {
        const val = snapshot.val();
        let newArray = [];
        Object.keys(val).map((key) => {
          val[key].id  = key;
          newArray.push(val[key])
        })
        setvisible(false);
        setproductData(newArray);
        setproductDataDup(newArray);
      }else{
        setvisible(false);
        setproductData([]);
        setproductDataDup([]);
      }
    });
  }
  const CategoryList = () => {
    return (
      <View style={style.categoryContainer}>
        {categories.map((item, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.8}
            onPress={() => setOriginalCatergoryIndex(index)}>
            <Text
              style={[
                style.categoryText,
                originalcatergoryIndex === index && style.categoryTextSelected,
              ]}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const Card = ({item}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.navigate('Product Details', item)}
        >
        <View style={style.card}>
          <View
            style={{
              height: 100,
              alignItems: 'center',
            }}>
            <Image
              source={{uri:item.productimage}}
              style={{flex: 1, resizeMode: 'contain',width:"100%"}}
            />
          </View>

          <Text style={{fontWeight: 'bold', fontSize: 17, marginTop: 10}}>
            {item.productname}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 5,
            }}>
            <Text style={{fontSize: 19, fontWeight: 'bold'}}>
            ₹{item.productamount}
            </Text>
            <View
              style={{
                height: 25,
                width: 25,
                backgroundColor: COLORS.green,
                borderRadius: 5,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
             <Icon name="remove-red-eye" size={18} style={{color:"#fff"}}/>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <SafeAreaView
      style={{flex: 1, paddingHorizontal: 20, backgroundColor: COLORS.white}}>
        <Spinner
          visible={visible}
          color={COLORS.white}
          size="large"
          textContent="Please Wait..."
          textStyle={{color:"#FFF"}}
        />
      <View style={style.header}>
        <View>
          <Text style={{fontSize: 25, fontWeight: 'bold'}}>Welcome to</Text>
          <Text style={{fontSize: 38, color: COLORS.green, fontWeight: 'bold'}}>
            MarineX
          </Text>
        </View>
        <Icon name="shopping-cart" size={28} onPress={() => navigation.navigate('Root', {
            screen: 'Cart',
            params: {
              screen: 'Cart Page'
            },
          })}/>
      </View>
      <View style={{marginTop: 30, flexDirection: 'row'}}>
        <View style={style.searchContainer}>
          <Icon name="search" size={25} style={{marginLeft: 20}} />
          <TextInput 
              value={searchdata}
              onChangeText={setSearchData}
              placeholder="Search" 
              style={style.input} />
        </View>
        {/* <View style={style.sortBtn}>
          <Icon name="sort" size={30} color={COLORS.white} />
        </View> */}
      </View>
      <CategoryList />
      {productDataDup && productDataDup.length ? <FlatList
        columnWrapperStyle={{justifyContent: 'space-between'}}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          marginTop: 10,
          paddingBottom: 50,
        }}
        numColumns={2}
        data={productDataDup}
        renderItem={({item}) => {
          return <Card item={item} />;
        }}
      /> : 
      <View style={style.noData}>
        <Text style={{color:"#808080",fontSize:16}}>No Data to Show</Text>
      </View>
      }
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  categoryContainer: {
    flexDirection: 'row',
    marginTop: 30,
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  categoryText: {fontSize: 16, color: 'grey', fontWeight: 'bold'},
  categoryTextSelected: {
    color: COLORS.green,
    paddingBottom: 5,
    borderBottomWidth: 2,
    borderColor: COLORS.green,
  },
  card: {
    height: 200,
    backgroundColor: COLORS.light,
    width,
    marginHorizontal: 2,
    borderRadius: 10,
    marginBottom: 20,
    padding: 15,
  },
  header: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  searchContainer: {
    height: 50,
    backgroundColor: COLORS.light,
    borderRadius: 10,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    color: COLORS.dark,
  },
  sortBtn: {
    marginLeft: 10,
    height: 50,
    width: 50,
    borderRadius: 10,
    backgroundColor: COLORS.green,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noData:{
    flex:1,
    justifyContent: 'center',
    alignItems:'center'
  }
});
export default Dashboard;
