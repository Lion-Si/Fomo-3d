// store初始化仓库数据(类似dva的命名空间)
const initState = {
  isConnect: false,
  user_address: "",
  invite_code: "",
  round_time: "",
  gameInfo: {
    current_winner: "",
    round: 0,
    total_pot: 0,
    key: 0,
    bnb: 0,
  },
  userInfo: {
    referral_return: 0,
    total_return: 0,
    claimed_return: 0,
    key: "",
  },
};
// reducer纯函数，用于操作中央仓库的数据
export const reducer = (state = initState, action) => {
  const { type, data } = action;
  // console.log("redux", action);
  switch (type) {
    case "SET_CONNECT_STATUS":
      // 在不改变原有的state基础上，返回一个新的state
      return {
        ...state,
        isConnect: data,
      };
    case "SET_USER_ADDRESS":
      // 在不改变原有的state基础上，返回一个新的state
      return {
        ...state,
        user_address: data,
      };
    case "SET_INVITE_CODE":
      return {
        ...state,
        invite_code: data,
      };
    case "SET_ROUND_TIME":
      return {
        ...state,
        round_time: data,
      };
    case "SET_GAME_INFO":
      return {
        ...state,
        gameInfo: data,
      };
    case "SET_USER_INFO":
      return {
        ...state,
        userInfo: data,
      };
    default:
      return initState;
  }
};
