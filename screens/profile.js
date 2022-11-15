import React, { useState } from "react";
import { Text, View, Pressable, StyleSheet } from "react-native";

function Profile({navigation}) {
    return (
        <>
        <View style={{marginTop:"70%"}}>

        <Pressable onPress={() => navigation.navigate("Order")} style={styles.orderbtn}>
            <Text style={{color:"#fff",fontSize:18,fontWeight:"500",marginLeft:"auto",marginRight:"auto"}}>YOUR ORDER</Text>
        </Pressable>

        <Pressable onPress={() => navigation.navigate("Account")} style={styles.accountbtn}>
            <Text style={{color:"#fff",fontSize:18,fontWeight:"500",marginLeft:"auto",marginRight:"auto"}}>YOUR ACCOUNT</Text>
        </Pressable>
        
        </View>
            </>
    
    );
}

export default Profile;

const styles = StyleSheet.create({
    orderbtn : {
        marginBottom:20,
        backgroundColor: '#00B761',
        width:"50%",
        height: 50,
        borderRadius: 10,
        justifyContent:"center",
        marginLeft:"auto",
        marginRight:"auto",
      },
      accountbtn : {
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