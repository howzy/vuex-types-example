export default function onFailure({ selector = (payload, state) => payload.error }) {
  return function (state, payload) {
    state[`${payload.target}Loading`] = false;
    state[`${payload.target}Error`] = (payload.selector || selector)(payload, state);
  }
}