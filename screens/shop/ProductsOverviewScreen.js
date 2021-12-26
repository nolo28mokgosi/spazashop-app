import React from 'react';
import {FlatList, StyleSheet, Button} from 'react-native';
import {useSelector } from 'react-redux';

import ProductItem from '../../components/ProductItem';


const ProductsOverviewScreen = () =>{

    const products = useSelector(state => state.products.availableProducts);
    return(
        <FlatList  data={products} keyExtractor={item => item.id} renderItem={itemdata =>
            <ProductItem 
                image={itemdata.item.image} 
                title= {itemdata.item.title}
                price= {itemdata.item.price}
                onViewDetail = {() => {
                    props.navigation.navigate('ProductDetail', { productId: itemdata.item.id, productTitle: itemdata.item.title})
                }}
                onAddToCart = {() => {}}
                />
        }/>
    );
};

const styles= StyleSheet.create({

});

ProductsOverviewScreen.navigationOptions = {
    headerTitle: 'All Products'
};
export default ProductsOverviewScreen;