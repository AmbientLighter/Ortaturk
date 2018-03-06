import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import { reducer as modal } from "redux-modal";

export default combineReducers({
  form: formReducer,
  modal
});
