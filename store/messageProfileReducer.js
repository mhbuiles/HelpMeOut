const MESSAGEPROFILE = 'MESSAGEPROFILE';

export function messageProfile( bool ) {
  return {
    type : MESSAGEPROFILE,
    payload : bool,
  }
}

const initialState = {
  bool : '',
}

export function messageProfileReducer( prevState = initialState , action ) {
  switch (action.type) {
    case MESSAGEPROFILE:
      return {
        ...prevState,
        bool : action.payload,
      };
    default:
      return prevState;
  }
}
