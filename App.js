import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TextInput, FlatList } from 'react-native';
import * as SQLite from'expo-sqlite';

export default function App() {
  const [product, setProduct] = useState('');
  const [amount, setAmount] = useState('');
  const [products, setProducts] = useState([]);
  const db = SQLite.openDatabase('shoppingList.db');

  useEffect(() => {  
    db.transaction(tx => {    
      tx.executeSql('create table if not exists product (id integer primary key not null, amount text, product text);'); 
    }, null, updateList);}, []);

  const updateList = () => {
    db.transaction(tx => { 
        tx.executeSql('select * from product;', [],
          (_, { rows }) => setProducts(rows._array));   
        }, null, null);}
  
  const saveProduct = () => {  
    db.transaction(tx => {    
      tx.executeSql('insert into product (amount, product) values (?, ?);',  
        [amount, product]);    
      }, null, updateList)
  }

  const deleteProduct = (id) => {  
    db.transaction(tx => {
      tx.executeSql('delete from product where id = ?;', [id]);
    }, null, updateList) }

  return (
    <View style={styles.container}>
      <View style={styles.inputs}>
        <TextInput style={styles.input} onChangeText={product => setProduct(product)} value={product} placeholder="Product" />
        <TextInput style={styles.input} onChangeText={amount => setAmount(amount)} value={amount} placeholder="Amount"/>
      </View>
      <View style={{flexDirection: 'row'}}>
        <Button onPress={saveProduct} title="Save" />
      </View>
      <Text style={{fontWeight: "bold", marginTop: 15}}>SHOPPING LIST</Text>
      <FlatList  
        keyExtractor={item => item.id.toString()}   
        renderItem={({item}) =>
          <View flexDirection='row'>
            <Text>{item.product}, {item.amount} </Text>
            <Text style={{color: '#0000ff'}} onPress={() => deleteProduct(item.id)}>bought</Text>
          </View>}        
        data={products} 
      /> 
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  input: {
    marginTop: 10,
    marginBottom: 5,
    width: 200,
    borderColor: 'gray',
    borderWidth: 1 
  },
  inputs: {
    marginTop:50
  }
});