const LOGIN = 'LOGIN';
const LOGOUT = 'LOGOUT';

export function login( user ) {
  return {
    type : LOGIN,
    payload : user,
  }
}

export function logout() {
  return {
    type : LOGOUT,
  }
}

const initialState = {
  authenticated : false,
  name : '',
  lastName : '',
  username : '',
  email : '',
  profilepic : '',
}

export function authReducer( prevState = initialState , action ) {
  switch (action.type) {
    case LOGIN:
      return {
        ...prevState,
        authenticated : true,
        name : action.payload.name,
        lastName : action.payload.lastName,
        username : action.payload.username,
        email : action.payload.email,
        profilepic : action.payload.profilepic,
      };
    case LOGOUT:
      return {
        authenticated : false
      };
    default:
      return prevState;
  }
}
