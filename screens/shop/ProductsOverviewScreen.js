import React, {useEffect, useState, useCallback } from 'react';
import {View, FlatList, Text, StyleSheet, Button, ActivityIndicator } from 'react-native';
import {useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons'

import ProductItem from '../../components/ProductItem';
import * as cartActions from '../../store/actions/cart';
import * as productsActions from '../../store/actions/products';
import HeaderButton from '../../components/UI/HeaderButton';
import Colors from '../../constants/Colors';

const ProductsOverviewScreen = props =>{
    const [isLoading, setIsLoading] = useState(false);
    const [isRefereshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState('');
    const products = useSelector(state => state.products.availableProducts);
    const dispatch = useDispatch();

    const loadProducts = useCallback(async () =>{
        setError(null);
        setIsRefreshing(true);
        try{
        await dispatch(productsActions.fetchProducts()).then();
        }
        catch(err)
        {
            setError(err.message);
        }
        setIsRefreshing(false);
    },[dispatch, setIsLoading, setError]);

    //Below listener allows to refresh when data changes in the DB
    useEffect(() => {
        const willFocusSub = props.navigation.addListener('willFocus', loadProducts);
        return () =>{
            willFocusSub.remove();
        }
    },[loadProducts]);

    useEffect(() => {
        setIsLoading(true);
        loadProducts().then(() =>{
            setIsLoading(false);
        });

    },[dispatch,loadProducts]);

    const selectHandler =(id,title) =>{
        props.navigation.navigate('ProductDetail', { productId: id, productTitle: title})
    };

    if(error)
    {
        return( 
            <View style={styles.centered}>
                <Text>Error Occured</Text>
                <Button title='Try Again' onPress={loadProducts} />
            </View>
        );
    }

    if(isLoading)
    {
        return( 
            <View style={styles.centered}>
                <ActivityIndicator size='large' color={Colors.Primary} />
            </View>
        );
    };

    if(!isLoading && products.length === 0) 
    {
        return( 
            <View style={styles.centered}>
                <Text>No data, please load</Text>
            </View>
        );
    };

    return(
        <FlatList 
            onRefresh={loadProducts}
            refreshing={isRefereshing}
            data={products} 
            keyExtractor={item => item.id} 
            renderItem={itemdata =>
            <ProductItem 
                image={itemdata.item.imageUrl} 
                title= {itemdata.item.title}
                price= {itemdata.item.price}
                onSelect = {() => {
                    selectHandler(itemdata.item.id, itemdata.item.title)
                }}
                >
                    <Button 
                        color={Colors.Primary} 
                        title="View Details" 
                        onPress={() => {
                            selectHandler(itemdata.item.id, itemdata.item.title)
                        }} />
                    <Button 
                        color={Colors.Primary} 
                            title="To Cart" 
                        onPress={() => {
                            dispatch(cartActions.addToCart(itemdata.item));
                        }} />
                </ProductItem>
        }/>
    );
};

const styles= StyleSheet.create({
    centered:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'

    }
});

ProductsOverviewScreen.navigationOptions = navdata => {
    return{
    headerTitle: "All Products",
    headerLeft : () => <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item 
            title='Menu' 
            iconName={Platform.OS === 'android? '? 'md-menu' : 'ios-menu'} 
            onPress={() => {
                navdata.navigation.toggleDrawer();
            }}/>
    </HeaderButtons>
    ,
    headerRight: () => <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item 
            title='Cart' 
            iconName={Platform.OS === 'android? '? 'md-cart' : 'ios-cart'} 
            onPress={() => {
                navdata.navigation.navigate('Cart');
            }}/>
    </HeaderButtons>
    }
};



export default ProductsOverviewScreen;