import PRODUCTS from "../../data/dummy-data";
import Product from "../../models/product";
import { CREATE_PRODUCT, DELETE_PRODUCT, SET_PRODUCSTS, updateProduct, UPDATE_PRODUCT } from "../actions/products";

const initialState = {
    availableProducts: [],// PRODUCTS,
    userProducts: [] //PRODUCTS.filter(prod => prod.ownerId === 'u1')
};

export default (state = initialState, action) =>{

    switch(action.type){
        case SET_PRODUCSTS:
            return{
                ...state,
                availableProducts: action.products,
                userProducts: action.userProducts
            }
        case DELETE_PRODUCT:
            return {
                ...state,
                userProducts: state.userProducts.filter(product => product.id !== action.pid),
                availableProducts: state.availableProducts.filter(product => product.id !== action.pid)
            }
        case CREATE_PRODUCT:
            const newProduct = new Product(
                action.productData.id,
                action.productData.ownerId,
                action.productData.title,
                action.productData.imageUrl,
                action.productData.description,
                action.productData.price); 
            return{
                ...state, //copy existing state
                availableProducts: state.availableProducts.concat(newProduct),
                userProducts: state.userProducts.concat(newProduct),
            }

        case UPDATE_PRODUCT:
            const productIndex = state.userProducts.findIndex(prod => prod.id === action.pid)
            const updatedProduct = new Product(
                action.pid,
                state.userProducts[productIndex].ownerId,
                action.productData.title,
                action.productData.imageUrl,
                action.productData.description,
                state.userProducts[productIndex].price); 

            const updatedProducts = [...state.userProducts];
            updatedProducts[productIndex] = updateProduct;

            const availableProductIndex = state.userProducts.findIndex(prod => prod.id === action.pid)
            const updatedAvailableProducts = [...state.availableProducts];
            updatedAvailableProducts[availableProductIndex] = updateProduct;


            return{ 
                ...state,
                userProducts: updatedProducts,
                availableProducts: updatedAvailableProducts
            }
    }
    return state;
}