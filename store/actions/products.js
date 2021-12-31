import Product from "../../models/product";

export const DELETE_PRODUCT = "DELETE_PRODUCT";
export const CREATE_PRODUCT = "CREATE_PRODUCT";
export const UPDATE_PRODUCT = "UPDATE_PRODUCT";
export const SET_PRODUCSTS = "SET_PRODUCTS";

export const fetchProducts = () =>{
    return async (dispatch, getState) => {
        try{
            const userId = getState().auth.userId;
            //Async code can be executed here
            const response = await fetch('https://react-lab-cc76f-default-rtdb.europe-west1.firebasedatabase.app/products.json');

            if(!response.ok){
                throw new Error('something went wrong');
            }

            const resData = await response.json();
            const loadedProducts = [];

            for(const key in resData){
                loadedProducts.push(
                    new Product(
                        key,
                        resData[key].ownerId,
                        resData[key].title,
                        resData[key].imageUrl,
                        resData[key].description,
                        resData[key].price
                        ));
            }
            dispatch({ 
                type: SET_PRODUCSTS, 
                products: loadedProducts, 
                userProducts: loadedProducts.filter(prod => prod.ownerId == userId)
            })
        }
        catch(err)
        {
            throw err
        }
    };
};

export const deleteProduct = productId =>{
    return async (dispatch, getState) => {
        const userId = getState().auth.userId;
       const response=  await fetch(`https://react-lab-cc76f-default-rtdb.europe-west1.firebasedatabase.app/products/${productId}.json?auth=${token}`,{
            method: 'DELETE'
        });

        if(response.ok){
            throw new Error('Something went wrong');
        }
        
        dispatch({ type: DELETE_PRODUCT, pid: productId });
    }
};

export const createProduct = (title, description, imageUrl,price) =>{
    return async (dispatch,getState) => {
        //Async code can be executed here
        const token = getState().auth.token;
        const userId = getState().auth.userId;

        const response = await fetch(`https://react-lab-cc76f-default-rtdb.europe-west1.firebasedatabase.app/products.json?auth=${token}`,{
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title,
                description,
                imageUrl,
                price,
                ownerId: userId
            })
        });


        if(!response.ok){
            throw new Error('Something went wrong');
        }

        const resData = await response.json();

        //Below will be executed once above is done
        dispatch({ type: CREATE_PRODUCT,
            productData:{
                id: resData.name,
                title,   //same as title : title
                description,
                imageUrl,
                price,
                ownerId: userId
            } 
        });
    };
};

export const updateProduct = (id,title, description, imageUrl) =>{
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        const response = await fetch(`https://react-lab-cc76f-default-rtdb.europe-west1.firebasedatabase.app/products/${id}.json?auth=${token}`,{
            method: 'PATCH',
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title,
                description,
                imageUrl
            })
        });

        if(response.ok){
            throw new Error('Something went wrong');
        }

        dispatch({ type: UPDATE_PRODUCT,
            pid : id,
            productData:{
                title,
                description,
                imageUrl
                
            } });
    };

    
};