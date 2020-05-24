// export * from './built-in';
// export { default as types } from './types';

import onSuccess from './built-in/success';
import onLoading from './built-in/loading';
import onFailure from './built-in/failure';
import types from './types';



export default {
  types,
  onSuccess,
  onLoading,
  onFailure
}