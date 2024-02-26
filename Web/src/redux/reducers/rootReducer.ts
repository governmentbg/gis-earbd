import { baseNodesCopy } from "ReactTemplate/Base/reducers/rootReducer";
import { combineReducers } from 'redux';
// import registers from "./registers";

// const rootReducer = combineReducers({ ...baseNodesCopy, registers: registers })
const rootReducer = combineReducers({ ...baseNodesCopy })

export default rootReducer;