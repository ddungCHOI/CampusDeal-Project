import axios from 'axios';
import {
    LOGIN_USER,
    REGISTER_USER,
    LOGOUT_USER,
    AUTH_USER,
    ADD_TO_CART_USER,
    GET_CART_ITEMS_USER,
    REMOVE_CART_ITEM_USER,
} from './types';

export function loginUser (dataTosubmit) {
    dataTosubmit.remember ? localStorage.setItem('id', dataTosubmit.id) : localStorage.clear('id');
    const request = axios.post('/api/users/login', dataTosubmit)
    .then(response => response.data);

    return {
        type: LOGIN_USER,
        payload: request
    };
}

export function registerUser (dataTosubmit) {
    
    const request = axios.post('/api/users/register', dataTosubmit)
    .then(response => response.data);

    return {
        type: REGISTER_USER,
        payload: request
    };
};

export function logout () {

    const request = axios.get('/api/users/logout')
        .then(response => response.data);

    return {
        type: LOGOUT_USER,
        payload: request
    };
};

export function auth () {

    const request = axios.get('/api/users/auth')
        .then(response => response.data);

    return {
        type: AUTH_USER,
        payload: request
    };
};

export function addToCart (_id) {
    const request = axios.get(`/api/users/addToCart?bookId=${_id}`)
        .then(response => response.data);

    return {
        type: ADD_TO_CART_USER,
        payload: request
    }
}

export function getCartItems(cartItems) {
    const request = axios.get(`/api/book/book_by_id?id=${cartItems}&type=array`) // type이 여러 개
        .then(response => {
        return response.data;
    });

    return {
        type: GET_CART_ITEMS_USER, 
        payload: request
    }
}

export function removeFromCartItem(id) {
    const request = axios.get(`/api/users/removeFromCart?_id=${id}`)
    .then(response => {
        return response.data;
    });

    return {
        type: REMOVE_CART_ITEM_USER,
        payload: request
    }
};