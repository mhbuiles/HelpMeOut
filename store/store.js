import { createStore , combineReducers } from 'redux';
import { authReducer } from './authReducer';
import { messageProfileReducer } from './messageProfileReducer';

const rootReducer = combineReducers({ authReducer , messageProfileReducer });

export const store = createStore( rootReducer );
