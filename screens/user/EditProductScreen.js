import React, { useCallback, useEffect, useState, useReducer } from 'react';
import { Text, View, TextInput, ScrollView, Button, StyleSheet, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons'

import HeaderButton from '../../components/UI/HeaderButton';
import * as productsActions from '../../store/actions/products';

const REDUCER_UPDATE = 'UPDATE'
const formReducer = (state, action) => {
    if(action.type === REDUCER_UPDATE){

    }
}

const EditProductScreen = props =>{

    const prodId = props.navigation.getParam('productId');
    const editedProduct = useSelector(state => state.products.userProducts.find(prod => prod.id === prodId));

    const dispatch = useDispatch();
    useReducer(formReducer,
        { inputValues: {
            title: editedProduct? editedProduct.title : '',
            imageUrl: editedProduct? editedProduct.imageUrl : '',
            description: editedProduct? editedProduct.description : '',
            price: ''
        }, 
        inputValidities: {
            title: editedProduct? true : false,
            imageUrl: editedProduct? true : false,
            description: editedProduct? true : false,
            price: editedProduct? true : false,
        }, 
        formIsValid : editedProduct? true : false,
    });

    const [title,setTitle] = useState(editedProduct? editedProduct.title : '');
    const [titleIsValid, setTitleIsValid] = useState(false);
    const [imageUrl,setImageUrl] = useState(editedProduct? editedProduct.imageUrl : '');
    const [price,setPrice] = useState('');
    const [description,setDescription] = useState(editedProduct? editedProduct.description : '');

 
    const submitHandler = useCallback(() =>{
        if(!titleIsValid){
            Alert.alert('Wrong Input', 'Check errors',[{text: 'Okay'}])
            return;
        }
        if(editedProduct)
        {
            dispatch(productsActions.updateProduct(prodId,title,description,imageUrl))
        }
        else
        {
            dispatch(productsActions.createProduct(title,description,imageUrl,+price))
        }
        props.navigation.goBack();
    },[dispatch, prodId,title,description,imageUrl,price]);

    useEffect(() => {
        props.navigation.setParams({'submit': submitHandler})
    },[submitHandler]);


    const titleChangeHandler = text => {
        if(text.trim().length === 0){
            setTitleIsValid(false)
        }
        else{
            setTitleIsValid(true)
        }
        setTitle(text);
    }

    return(
        <ScrollView>
            <View style={styles.form}>
                <View style={styles.formControl}>
                    <Text styles={styles.label}>Title</Text>
                    <TextInput 
                        style={styles.input}
                        value={title} 
                        onChangeText={titleChangeHandler}
                        keyboardType='default'
                        autoCapitalize='sentences'
                        autoCorrect
                        returnKeyType='next'
                        />
                        {titleIsValid && <Text>Please enter valid title</Text>}
                </View>
                <View style={styles.formControl}>
                    <Text styles={styles.label}>Image</Text>
                    <TextInput 
                        style={styles.input}
                        value={imageUrl} 
                        onChangeText={text => setImageUrl(text)}
                        />
                </View>
                {editedProduct? null :
                <View style={styles.formControl}>
                    <Text styles={styles.label}>Price</Text>
                    <TextInput 
                        style={styles.input}
                        value={price} 
                        onChangeText={text => setPrice(text)}
                        keyboardType='decimal-pad'
                        />
                </View>
                 }
                <View style={styles.formControl}>
                    <Text styles={styles.label}>Description</Text>
                    <TextInput 
                        style={styles.input}
                        value={description} 
                        onChangeText={text => setDescription(text)}
                        />
                </View>
        </View>
        </ScrollView>
    )
};

EditProductScreen.navigationOptions = navData =>{
    const submitFn = navData.navigation.getParam('submit')
    return{
        headerTitle: navData.navigation.getParam('productId')? 'Edit Product' : 'Add Product',
        headerRight: () => <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item 
            title='Add' 
            iconName={Platform.OS === 'android? '? 'md-checkmark' : 'ios-checkmark'} 
            onPress={submitFn}/>
    </HeaderButtons>,
    }
}

const styles = StyleSheet.create({
    form:{
        margin: 20
    },
    formControl:{
        width: '100%'
    },
    label:{
        marginVertical: 8
    },
    input: {
        paddingHorizontal: 2,
        paddingVertical: 5,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1
    }
})
export default EditProductScreen;