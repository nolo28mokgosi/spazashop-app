import AsyncStorage from '@react-native-async-storage/async-storage';

// export const SIGN_UP = 'SIGNUP';
// export const LOGIN = 'LOGIN';
export const AUTHENTICATE = "AUTHENTICATE";
export const LOGOUT = "LOGOUT";

let timer;

const clearLogoutTimer =() =>{
    if(timer)
        clearTimeout(timer);
};

//AUTO LOGOUT
export const setLogoutTimer = expirationTime =>{
    return dispatch =>{
        timer = setTimeout(() =>{
            dispatch(logout());
        },expirationTime / 1000);
    };   
};

export const logout = () =>{
    clearTimeout();
    AsyncStorage.removeItem('userData'); //return promise, can go redux-thunk
    return { type: LOGOUT };
}

export const authenticate = (userId, token, expiryTime) =>{
    return dispatch => {
        dispatch(setLogoutTimer(expiryTime));
        dispatch({ type: AUTHENTICATE, userId: userId, token : token });
    }
    return 
}

export const login = (email,password) => {
    return async dispatch => {
        const response = await fetch(
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIRncPzxhv5gcsAJLpo3qU3v4',
            {
                method: 'POST',
                headers:{
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    returnSecureToken : true
                })
            }
        );

        if(!response.ok)
        {
            let message = 'Something went wrong';

            const errorResData = await response.json();
            const errorId = errorResData.error.message;

            if(errorId === 'EMAIL_NOT_FOUND'){
                message = 'Email not found';
            } else if(errorId === 'INVALID_PASSWORD'){
                message = 'Password is wrong';
            }
            throw new Error(message);
        }

        const resData = await response.json();
        //dispatch({ type: LOGIN, token: resData.idToken, userId: resData.localId})
        dispatch(authenticate(resData.localId,resData.token, parseInt(resData.expiresIn) * 1000));
        const expirationDate = new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000);
        saveDataToStorage(resData.idToken, resData.localId, expirationDate)
    };
}

export const signUp = (email,password) => {
    return async dispatch => {
        const response = await fetch(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDkTJcPv5gcsAJLpo3qU3v4',
            {
                method: 'POST',
                headers:{
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    returnSecureToken : true
                })
            }
        );

        if(!response.ok)
        {
            let message = 'Something went wrong';

            const errorResData = await response.json();
            const errorId = errorResData.error.message;

            if(errorId === 'EMAIL_EXISTS'){
                message = 'Email exists';
            } 
            //Cater fo
            throw new Error(message);
        }

        const resData = await response.json();

       // dispatch({ type: SIGN_UP, token: resData.idToken, userId: resData.localId});
       dispatch(authenticate(resData.localId,resData.token,  parseInt(resData.expiresIn) * 1000));
        const expirationDate = new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000);
        saveDataToStorage(resData.idToken, resData.localId, expirationDate);
    };
};

const saveDataToStorage = (token,userId, expirationDate) =>{
    AsyncStorage.setItem('userData', JSON.stringify({
        token: token,
        userId: userId,
        expiryDate: expirationDate.toISOString()
    }))
}