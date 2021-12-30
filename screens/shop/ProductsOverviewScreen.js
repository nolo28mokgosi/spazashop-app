import React from 'react';
import {FlatList, StyleSheet, Button} from 'react-native';
import {useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons'

import ProductItem from '../../components/ProductItem';
import * as cartActions from '../../store/actions/cart';
import HeaderButton from '../../components/UI/HeaderButton';
import Colors from '../../constants/Colors';

const ProductsOverviewScreen = props =>{

    const products = useSelector(state => state.products.availableProducts);
    const dispatch = useDispatch();

    const selectHandler =(id,title) =>{
        props.navigation.navigate('ProductDetail', { productId: id, productTitle: title})
    };

    return(
        <FlatList  data={products} keyExtractor={item => item.id} renderItem={itemdata =>
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