import React,{ useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Button} from 'react-native';
import { Ionicons } from '@expo/vector-icons'
import CartItem from './CartItem';
import Colors from '../../constants/Colors';
import Card from '../UI/Card';

const OrderItem = props =>{
    const [showDetails, setShowDetails] = useState(false);

    return (
    <Card style={styles.orderItem}>
        <View style={styles.summary}>
            <Text style={styles.totalAmount}>${props.amount.toFixed(2)}</Text>
            <Text style={styles.date}>{props.date}</Text>
        </View>
        <Button color={Colors.Primary} title={showDetails? 'Hide Details' : 'Show Details'} onPress={() =>{
            setShowDetails(prevState => !prevState) //Toggling the value
        }}/>
        {
            showDetails && <View style={styles.detailItems}>
                {props.items.map(cartItem => 
                    <CartItem 
                    key={cartItem.productId}
                    quantity={cartItem.quantity}
                    amount={cartItem.amount}
                    title={cartItem.productTitle}
                    />)
                }
            </View>
        }
    </Card>
    )
};

const styles= StyleSheet.create({
    orderItem:{
        margin: 20,
        padding: 10,
        alignItems: 'center'
    },
    summary:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 15
    },
    totalAmount:{
        fontSize:16
    },
    date:{
        fontSize: 16,
        color: '#888'
    },
    detailItems:{
        width: '100%'
    }
});

export default OrderItem;
