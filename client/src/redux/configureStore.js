// 나의 스토어를 설정/구성 (여러 리듀서를 한번에 모아서 관리)
import { createStore, applyMiddleware } from 'redux';
// 루트 리듀서 불러오기
import rootReducer from 'redux/reducers';
// redux-thunk 불러오기
import reduxThunk from "redux-thunk";
// redux-promise 불러오기
import promiseMiddleware from 'redux-promise';
// 리덕스 개발자도구 적용
import { composeWithDevTools } from "redux-devtools-extension";

const env = process.env.NODE_ENV;

const middlewares = [reduxThunk, promiseMiddleware];

let store;

if (env === "development") {
  store = initialState =>
    createStore(rootReducer, composeWithDevTools(applyMiddleware(...middlewares)));
} else {
  store = initialState => createStore(rootReducer, applyMiddleware(...middlewares));
}

export default store();