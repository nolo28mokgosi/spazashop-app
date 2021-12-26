import { createAppContainer } from 'react-navigation';
import { Platform } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';

import ProductsOverviewScreen from '../screens/shop/ProductsOverviewScreen';
import ProductDetailScreen from '../screens/shop/ProductDetailScreen';
import Colors from "../constants/Colors";

const ProductsNavigator = createStackNavigator({
        ProductsOverView : ProductsOverviewScreen,
        ProductDetail: ProductDetailScreen

}, {
    defaultNavigationOptions:{
        headerStyle: {
            backgroundColor: Platform.OS === 'android'? Colors.Primary : ''
        },
        headerTintColor: Platform.OS === 'android'? 'white' : Colors.Primary
    }
});

export default createAppContainer(ProductsNavigator);