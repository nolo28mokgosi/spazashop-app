import React from 'react';
import {View, Text, StyleSheet, Image, Button, ScrollView} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import Colors from '../../constants/Colors';
import * as cartActions from '../../store/actions/cart';


const ProductDetailScreen = props =>{
    const productId = props.navigation.getParam('productId')
    const selectedProduct = useSelector(state => state.products.availableProducts.find(prod => prod.id === productId));
    const dispatch = useDispatch();

    return(
        <ScrollView>
            <Image style={styles.image} source={{uri: selectedProduct.imageUrl}}/>
            <View style={styles.actions}>
            <Button color={Colors.Primary} title='Add to Cart' onPress={() =>{
                dispatch(cartActions.addToCart(selectedProduct));
            }} />
            </View>
            <Text style={styles.price}>${selectedProduct.price.toFixed(2)}</Text>
            <Text style={styles.description}>{selectedProduct.description}</Text>
        </ScrollView>
    )
};

const styles = StyleSheet.create({
    image: {
        width: '100%',
        height: 300
    },
    price:{
        fontSize: 20,
        color: '#888',
        textAlign: 'center',
        marginVertical: 20
    },
    description: {
        fontSize: 14,
        textAlign: 'center',
        marginHorizontal: 20
    },
    actions:{
        marginVertical: 10,
        alignItems: 'center'
    }

});

ProductDetailScreen.navigationOptions = navData =>{
    headerTitle = navData.navigation.getParam('productTitle')
};
export default ProductDetailScreen;