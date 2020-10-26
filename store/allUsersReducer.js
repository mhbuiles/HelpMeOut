const LOAD = 'LOAD';

export function load( users ) {
  return {
    type : LOAD,
    payload : users,
  }
}

const initialState = {
  allUsers : [],
}

export function authReducer( prevState = initialState , action ) {
  switch (action.type) {
    case LOAD:
      return {
        ...prevState,
        allUsers : action.payload.allUsers,
      };
    default:
      return prevState;
  }
}
