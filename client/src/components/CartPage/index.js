import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getCartItems, removeFromCartItem } from 'redux/actions/user_action'
import UserCardBlock from './Sections/UserCardBlock';
import { Result, Empty, Typography } from 'antd';
import Axios from 'axios';

const CartPage = (props) => {

  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const [Total, setTotal] = useState(0);
  const [ShowTotal, setShowTotal] = useState(false);
  const [ShowSuccess, setShowSuccess] = useState(false);

  useEffect(() => {

    let cartItems = [];
    if (user.userData && user.userData.cart) {
      if (user.userData.cart.length > 0) {
        user.userData.cart.forEach(item => {
          cartItems.push(item.id)
        });
        dispatch(getCartItems(cartItems))
      }
    }

  }, [user.userData])

  useEffect(() => {
    if (user.cartDetail && user.cartDetail.length > 0) {
      calculateTotal(user.cartDetail)
    }
  }, [user.cartDetail]);

  const calculateTotal = (cartDetail) => {
    let total = 0;

    cartDetail.map(item => {
      total += parseInt(item.price, 10)
    });

    setTotal(total);
    setShowTotal(true);
  }

  const removeFromCart = (bookId) => {

    dispatch(removeFromCartItem(bookId))
      .then(() => {

        Axios.get('/api/users/userCartInfo')
          .then(response => {
            if (response.data.success) {
              if (response.data.cartDetail.length <= 0) {
                setShowTotal(false);
              } else {
                calculateTotal(response.data.cartDetail);
              }
            } else {
              alert('Failed to get cart info');
            }
          })
      })
  }

  return (
    <div style={{ width: '85%', margin: '3rem auto' }}>
      <Typography.Title level={2} style={{ marginBottom: '2rem' }}><span style={{ borderBottom: '3px solid black', paddingBottom: '8px', paddingRight: '2px', fontWeight: 'bold', fontSize: '28px' }}>장바구니</span></Typography.Title>

      {ShowTotal ?
        <div style={{ marginTop: '3rem' }}>
          <UserCardBlock books={user.cartDetail} removeItem={removeFromCart} />
          <h2 style={{ textAlign: 'right' }}>합계: {Total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} 원</h2>
        </div>
        :
        ShowSuccess ?
          <Result
            status="success"
            title="Successfully Purchased Items"
          />
          :
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <br />
            <Empty description={false} />
            <p style={{textAlign:'center'}}>No Items In the Cart</p>
          </div>
      }

    </div>

  );
}

export default CartPage;
