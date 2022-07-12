import { call, put, takeEvery, takeLatest } from "redux-saga/effects";

// worker Saga: will be fired on USER_FETCH_REQUESTED actions
function* showSaga(action) {
  // console.log(action.data);
}

/*
  Starts fetchUser on each dispatched `USER_FETCH_REQUESTED` action.
  Allows concurrent fetches of user.
*/
function* mySaga() {
  yield takeEvery("SET_CONNECT_STATUS", showSaga);
  yield takeEvery("SET_USER_ADDRESS", showSaga);
  yield takeEvery("SET_INVITE_CODE", showSaga);
  yield takeEvery("SET_ROUND_TIME", showSaga);
  yield takeEvery("SET_USER_INFO", showSaga);
  yield takeEvery("SET_GAME_INFO", showSaga);
}

export default mySaga;
