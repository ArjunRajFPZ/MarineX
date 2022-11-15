import React, { useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import Login from './screens/login';
import UserRegistration from './screens/userregistration';
import Dashboard from './screens/dashboard';
import Profile from './screens/profile';
import Account from './screens/account';
import Order from './screens/order';
import Cart from './screens/cart';
import MenuPage from './screens/menupage';
import AddProducts from './screens/addproducts';
import ListProducts from './screens/listproducts';
import OrderRequest from './screens/orderrequest';
import OrderReqDetails from './screens/orderreqdetails';
import ProductDetails from './screens/productdetails';
import Checkout from './screens/checkout';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ProductDetailsAction from './screens/productdetailsaction';
import { BackHandler } from 'react-native';

const firebaseConfig = {
  // put your firebase connection code here
};
const app = initializeApp(firebaseConfig);

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function DashboardTabScreen() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false,tabBarActiveTintColor:'#00B761' }}>
      <Tab.Screen name="Dashboard" component={DashboardScreen} 
      options={{
        tabBarLabel: 'Dashboard',
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="home" color={color} size={size} />
        ),
      }}
      />
      <Tab.Screen name="Profile" component={ProfileTabScreen} 
      options={{
        tabBarLabel: 'Profile',
        tabBarIcon: ({ color, size }) => (
          <FontAwesome  name="user" color={color} size={size} />
        ),
      }}
      />
      <Tab.Screen name="Cart" component={CartTabScreen} 
      options={{
        tabBarLabel: 'Cart',
        //tabBarBadge:3,
        tabBarIcon: ({ color, size }) => (
          <FontAwesome name="shopping-cart" color={color} size={size} />
        ),
      }}
       />
      <Tab.Screen name="MenuRoot" component={MenuTabScreen} 
      options={{
        tabBarLabel: 'Menu',
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="menu" color={color} size={size} />
        ),
      }}
       />
    </Tab.Navigator>
  );
}

const DashboardStack = createNativeStackNavigator();
function DashboardScreen() {
  return (
    <DashboardStack.Navigator screenOptions={{ headerShown: false }}>
      <DashboardStack.Screen name="Dashboard Page" component={Dashboard} />
      <DashboardStack.Screen name="Product Details" component={ProductDetails} />
      <DashboardStack.Screen name="Profile" component={Profile} />
    </DashboardStack.Navigator>
  );
}

const ProfileStack = createNativeStackNavigator();
function ProfileTabScreen() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="Profile Page" component={Profile} />
      <ProfileStack.Screen name="Order" component={Order} />
      <ProfileStack.Screen name="Account" component={Account} />
    </ProfileStack.Navigator>
  );
}

const CartStack = createNativeStackNavigator();
function CartTabScreen() {
  return (
    <CartStack.Navigator screenOptions={{ headerShown: false }}>
      <CartStack.Screen name="Cart Page" component={Cart} 
      options={{
        tabBarBadge:3
      }}
      />
      <CartStack.Screen name="Checkout" component={Checkout} />
    </CartStack.Navigator>
  );
}

const MenuStack = createNativeStackNavigator();
function MenuTabScreen() {
  return (
    <MenuStack.Navigator screenOptions={{ headerShown: false }}>
      <MenuStack.Screen name="Menu" component={MenuPage} />
      <MenuStack.Screen name="Add Products" component={AddProducts} />
      <MenuStack.Screen name="List Products" component={ListProducts} />
      <MenuStack.Screen name="Product Details Action" component={ProductDetailsAction} />
      <MenuStack.Screen name="Order Request" component={OrderRequest} />
      <MenuStack.Screen name="Order Request Details" component={OrderReqDetails} />
    </MenuStack.Navigator>
  );
}

export default function App() {
  
  return (
    <NavigationContainer>
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login"  options={{ headerShown: false }} component={Login} />
      <Stack.Screen name="UserRegistration" options={{ headerShown: false }} component={UserRegistration} />
      <Stack.Screen name="Root"  options={{ headerShown: false }} component={DashboardTabScreen} />
    </Stack.Navigator>
  </NavigationContainer>
  )
}
