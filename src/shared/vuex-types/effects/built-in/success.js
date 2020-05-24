import { merge } from "@/shared/util";
export default function onSuccess({ mergeStrategy, selector = (payload, state) => payload.data }) {
  return function (state, payload) {
    let prevState = merge({}, state[payload.target]),
      nextState = (payload.selector || selector)(payload, state);
    state[`${payload.target}Loading`] = false;
    state[`${payload.target}Error`] = null;
    //current state
    state[payload.target] = mergeStrategy(prevState, nextState);

  }
}


// const payload = {
//   error: '',//错误信息
//   data: '',//有效数据
//   selector: '',//数据过滤
// }