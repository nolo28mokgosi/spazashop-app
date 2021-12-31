import React, {useEffect, useState} from 'react';
import { View, FlatList, Text, Platform, ActivityIndicator, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons'

import OrderItem from '../../components/shop/OrderItem';
import HeaderButton from '../../components/UI/HeaderButton';
import * as ordersActions from '../../store/actions/orders';

const OrdersScreen = props => {
    const [isLoading, setIsLooading] = useState(false);
    const orders = useSelector(state => state.orders.orders);
    const dispatch = useDispatch();

    useEffect(() => {
        setIsLooading(true);
        dispatch(ordersActions.fetchOrders()).then(() => {
            setIsLooading(false)
        });
        // .catch();
    },[]);


    if(isLoading)
    {
        return( 
            <View style={styles.centered}>
                <ActivityIndicator size='large' color={Colors.Primary} />
            </View>
        );
    };

    if(!isLoading && orders.length === 0) 
    {
        return( 
            <View style={styles.centered}>
                <Text>No data, please load</Text>
            </View>
        );
    };
    return(
        <FlatList
            data={orders}
            keyExtractor={item => item.id}
            renderItem = {itemData => 
            <OrderItem 
                amount={itemData.item.totalAmount}
                date={itemData.item.readableDate}
                items={itemData.item.items}
            />}
        />
    );
};

OrdersScreen.navigationOptions = navData => {
    return{
    headerTitle: 'Your Orders!',
    headerLeft : () => <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item 
            title='Menu' 
            iconName={Platform.OS === 'android? '? 'md-menu' : 'ios-menu'} 
            onPress={() => {
                navData.navigation.toggleDrawer();
            }}/>
    </HeaderButtons>
    }
};

const styles= StyleSheet.create({
    centered:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'

    }
});



export default OrdersScreen;