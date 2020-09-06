import { combineReducers } from "redux"; // 리듀서가 여러개일대는 redux 의 내장함수인 combineReducers 를 사용하여 리듀서를 하나로 합치는 작업
import user from './user_reducer';

export default combineReducers({
    user,
    // 다른 리듀서 만들게되면 여기에 넣어줌.
});