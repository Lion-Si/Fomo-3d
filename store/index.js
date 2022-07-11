import { legacy_createStore as createStore, applyMiddleware } from "redux";
import { reducer } from "./reducer";

// ①引包
import createSagaMiddleware from "redux-saga";
// ②拦截文件
import mySaga from "./saga/sagas.js";
// ③执行一下
const sagaMiddleware = createSagaMiddleware();
// ④放入中间件
const store = createStore(reducer, applyMiddleware(sagaMiddleware));
// ⑤运行拦截文件
sagaMiddleware.run(mySaga);

export default store
