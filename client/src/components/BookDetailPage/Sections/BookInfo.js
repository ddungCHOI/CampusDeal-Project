import React, {useState, useEffect} from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Descriptions, message } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from 'redux/actions/user_action';
import LikeDislike from './LikeDislike';
import './BookInfo.css'

message.config({
  top: 100,
  duration: 5
});

const BookInfo = (props) => {

  const [Methods, setMethods] = useState("");
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);

  const method_ko = {
    "safe" : "안전거래",
    "post" : "택배",
    "meet" : "직거래",
    "etc" : "기타"
  }

  useEffect(() => {
    let method = [];
    props.detail.methods.forEach((item) => {
      method.push(method_ko[item])
    })
    setMethods(method.join(', '));
  }, []);

  const addToCartHandler = () => {
    dispatch(addToCart(props.detail._id))
    .then(response => {
      if(response.payload.success) {
        if(response.payload.duplicate) {
          message.success("이미 장바구니에 담겨있습니다.")
        } else {
          message.success("장바구니에 담겼습니다.")
        }
      } else {
        message.error("장바구니에 담기를 실패하였습니다.")
      }
    })
  }

  const buyHandler = () => {
    props.history.push(`/chat/${props.detail._id}`);
  }

    return (
        <div>
            <Descriptions title={<div>판매정보</div>} bordered>
                <Descriptions.Item label="판매자" span={2} className="seller">{props.detail.seller.name}</Descriptions.Item>
                <Descriptions.Item ><LikeDislike sellerId={props.detail.seller._id} userId={user.userData._id}/></Descriptions.Item>
                <Descriptions.Item label="대학교" span={3}>{props.detail.seller.campus}</Descriptions.Item>
                <Descriptions.Item label="분류">{props.detail.category}</Descriptions.Item>
                <Descriptions.Item label="지은이">{props.detail.writer}</Descriptions.Item>
                <Descriptions.Item label="출판사">{props.detail.publisher}</Descriptions.Item>
                <Descriptions.Item label="출판연도">{props.detail.publishDate.substr(0,10)}</Descriptions.Item>
                <Descriptions.Item label="도서상태">{props.detail.grade}</Descriptions.Item>
                <Descriptions.Item label="가격">{props.detail.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Descriptions.Item>
                <Descriptions.Item label="거래방식">{Methods}</Descriptions.Item>

            </Descriptions>
            <br />

            <div style={{ display:'flex', justifyContent:'center' }}>
            <Button size="large" shape="round" type="primary" style={{marginRight:'2rem'}} onClick={addToCartHandler}>
                    장바구니
            </Button>
            <Button size="large" shape="round" type="danger" onClick={buyHandler}>
                    구매하기
            </Button>
            </div>

        </div>
    );
}

export default withRouter(BookInfo);
