export default function onLoading({ selector = (payload, state) => true }) {
  return function (state, payload) {
    state[`${payload.target}Loading`] = (payload.selector || selector)(payload, state);
  }
}