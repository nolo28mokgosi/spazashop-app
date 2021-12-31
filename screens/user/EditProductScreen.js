import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { Text, View, TextInput, ScrollView, Button, StyleSheet, Alert , KeyboardAvoidingView, ActivityIndicator} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons'

import HeaderButton from '../../components/UI/HeaderButton';
import * as productsActions from '../../store/actions/products';
import Input from '../../components/UI/Input';
import Colors from '../../constants/Colors';

const FORM_INPUT_UPDATE = 'UPDATE'
const formReducer = (state, action) => {
    if(action.type === FORM_INPUT_UPDATE){
        const updatedValues = {
            ...state.inputValues,
            [action.input] : action.value
        };

        const updatedValidities = {
            ...state.inputValidities,
            [action.input] : action.isValid
        }

        let updatedFormIsValid = true;
        for(const key in updatedValidities)
        {
            updatedFormIsValid = updatedFormIsValid && updatedValidities[key]; // False overrides true
        }

        return {
            formIsValid: updatedFormIsValid,
            inputValues : updatedValues,
            inputValidities: updatedValidities
        }
    }

    return state;
}

const EditProductScreen = props =>{
    const [isLoading, setIsLooading] = useState(false);
    const [error, setError] = useState()
    const prodId = props.navigation.getParam('productId');
    const editedProduct = useSelector(state => state.products.userProducts.find(prod => prod.id === prodId));

    const dispatch = useDispatch();

    const [formState, dispatchFormState] = useReducer(formReducer,
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

    useEffect(() => {
        if(error){
            Alert.alert('Error occured', error, [{text: 'OK'}])
        }
    },[error]);

    const submitHandler = useCallback(async () =>{
        if(!formState.formIsValid){
            Alert.alert('Wrong Input', 'Check errors',[{text: 'OK'}]);
            
        }

        setIsLooading(true);
        setError(null);
        try{
            if(editedProduct)
            {
                await dispatch(productsActions.updateProduct(
                    prodId,
                    formState.inputValues.title,
                    formState.inputValues.description,
                    formState.inputValues.imageUrl))
            }
            else
            {
                await dispatch(productsActions.createProduct(
                    formState.inputValues.title,
                    formState.inputValues.description,
                    formState.inputValues.imageUrl,
                    +formState.inputValues.price))
            }

            props.navigation.goBack();
        }
        catch(err)
        {
            setError(err.message);
        }
        isLoading(false)
        props.navigation.goBack();
    },[dispatch, prodId,formState]);

    useEffect(() => {
        props.navigation.setParams({'submit': submitHandler})
    },[submitHandler]);


    const inputChangeHandler = useCallback((inputIdentifier,inputValue, inputValidity) => {
    
        dispatchFormState({
            type: FORM_INPUT_UPDATE, 
            value : inputValue,
            isValid: inputValidity,
            input: inputIdentifier
        });
    },[dispatchFormState]);

    if(isLoading)
    {
        return( 
            <View style={styles.centered}>
                <ActivityIndicator size='large' color={Colors.Primary} />
            </View>
        );
    };

    return(
        <KeyboardAvoidingView style={{flex: 1}} behavior='padding' keyboardVerticalOffset={100}>
        <ScrollView>
            <View style={styles.form}>
                <Input 
                    id='title'
                    label='Title'
                    errorText='Please enter valid title'
                    keyboardType='default'
                    autoCapitalize='sentences'
                    autoCorrect
                    returnKeyType='next'
                    onInputChange = {inputChangeHandler}
                    initialValue = {editedProduct? editedProduct.title : ''}
                    initiallyValid = {!!editedProduct}
                    required
                />
                 <Input 
                 id='imageUrl'
                    label='ImageUrl'
                    errorText='Please enter valid imageUrl'
                    keyboardType='default'
                    returnKeyType='next'
                    onInputChange = {inputChangeHandler}
                    initialValue = {editedProduct? editedProduct.imageUrl : ''}
                    initiallyValid = {!!editedProduct}
                    required
                />

                {editedProduct? null :
                 <Input 
                 id='price'
                    label='Price'
                    errorText='Please enter valid price'
                    keyboardType='decimal-pad'
                    returnKeyType='next'
                    onInputChange = {inputChangeHandler}
                    required
                    min={0.1}
                />
                 }
                 <Input 
                     id='description'
                    label='Description'
                    errorText='Please enter valid description'
                    keyboardType='default'
                    autoCapitalize='sentences'
                    autoCorrect
                    multiline
                    numberOfLines={3} //only for android
                    onInputChange = {inputChangeHandler}
                    initialValue = {editedProduct? editedProduct.description : ''}
                    initiallyValid = {!!editedProduct}
                    required
                />
        </View>
        </ScrollView>
        </KeyboardAvoidingView>
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
    centered:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'

    }
})
export default EditProductScreen;