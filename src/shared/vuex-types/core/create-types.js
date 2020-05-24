// import Immutable from 'seamless-immutable';
const sep = '/';
function stringArrayToObject(actionsArray, namespace) {
  if (actionsArray.some(actionName => !actionName || typeof actionName !== 'string')) {
    throw new Error('Action or mutation names must be an array of strings.')
  }
  return actionsArray.reduce((memo, actionName) => {
    memo[actionName] = namespace ? `${namespace}${sep}${actionName}` : actionName;
    return memo;
  }, {});
}
export default function createTypes(actionsArray, namespace) {
  return stringArrayToObject(actionsArray, namespace);
}