import  React,{ useReducer, useCallback, useState , useEffect} from 'react';
import { View, ScrollView, KeyboardAvoidingView, StyleSheet, Button, ActivityIndicator, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch } from 'react-redux';

import Input from '../../components/UI/Input';
import Card from '../../components/UI/Card';
import Colors from '../../constants/Colors';
import * as authActions from '../../store/actions/auth';


//Can be moved to diff component
const FORM_INPUT_UPDATE = 'UPDATE'


const formReducer = (state, action) => {
    if(action.type === FORM_INPUT_UPDATE){
        const updatedValues = {
            ...state.inputValues,
            [action.input] : action.value
        };

        const updatedValidities = {
            ...state.inputValidities,
            [action.input] : action.isValid
        }

        let updatedFormIsValid = true;
        for(const key in updatedValidities)
        {
            updatedFormIsValid = updatedFormIsValid && updatedValidities[key]; // False overrides true
        }

        return {
            formIsValid: updatedFormIsValid,
            inputValues : updatedValues,
            inputValidities: updatedValidities
        }
    }

    return state;
}

const AuthScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [isSignup, setIsSignUp] = useState(false)
    const dispatch = useDispatch();

    //Form related
    const [formState, dispatchFormState] = useReducer(formReducer,
        { inputValues: {
           input: '',
           password: ''
        }, 
        inputValidities: {
            email: false,
            password: false
        }, 
        formIsValid : false,
    });

    //form related
    const inputChangeHandler = useCallback((inputIdentifier,inputValue, inputValidity) => {
    
        dispatchFormState({
            type: FORM_INPUT_UPDATE, 
            value : inputValue,
            isValid: inputValidity,
            input: inputIdentifier
        });
    },[dispatchFormState]);


    useEffect(() => {
        if(error)
        {
            Alert.alert('Error occured',error,[{ text: 'OK'}])
        }
    },[error])

    const AuthHandler = async () => {
        let action;
        if(isSignup){
            action = authActions.signUp(
                formState.inputValues.email, 
                formState.inputValues.password);
        }
        else
        {
           action = authActions.login(
                formState.inputValues.email, 
                formState.inputValues.password);
        }
        setError(null)
        setIsLoading(true);
        try{
            await dispatch(action);
            props.navigation.navigate('Shop');

        }catch(err)
        {
            setError(err.message)
            setIsLoading(false);
        }
        
    };

    return(
        <KeyboardAvoidingView
            behavior='padding'
            keyboardVerticalOffset={50}
            style={styles.screen}>
             <LinearGradient style={styles.gradient} colors={['#ffedff','#ffe3ff']}>
                <Card style={styles.authContainer}>
                    <ScrollView>
                        <Input 
                            id="email"
                            label="Email"
                            keyboardType="email-address"
                            required
                            email
                            autoCapitalize="none"
                            errorText="Please enter valid email address"
                            onInputChange={inputChangeHandler}
                            initialValue=""
                        />
                        <Input 
                            id="password"
                            label="Password"
                            keyboardType="default"
                            secureTextEntry
                            required
                            minLength={5}
                            autoCapitalize="none"
                            errorText="Please enter valid password"
                            onInputChange={inputChangeHandler}
                            initialValue=""
                        />
                        <View style={styles.buttonContainer}>
                            {isLoading? 
                                <ActivityIndicator size='small' color={Colors.Primary} /> :
                            <Button title={isSignup? "Sign Up" : "Login"} color={Colors.Primary} onPress={AuthHandler} />
                            }
                        </View>
                        <View style={styles.buttonContainer}>
                            <Button 
                                title={`Switch to ${isSignup? "Log in" : "Sign Up"}`} 
                                color={Colors.accent} 
                                onPress={() => {
                                    setIsSignUp(prevState => !prevState);
                                }} />
                        </View>
                    </ScrollView>
                </Card>
        </LinearGradient>
        </KeyboardAvoidingView>
    );
};

AuthScreen.navigationOptions = {
    headerTitle: "Authenticate"
}

const styles = StyleSheet.create({
    screen:{
        flex: 1
    },
    authContainer:
    {
        width: '80%',
        maxWidth: 400,
        maxHeight: 400,
        padding: 20
    },
    gradient:
    {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonContainer: {
        marginTop: 10
    }
});

export default AuthScreen;