import {
  UPLOAD_PRODUCT,
  SEARCH_PRODUCT,
  PRODUCT_DETAIL,
  LOAD_PRODUCT,
} from "../_actions/_types";

export default function productReducer(state = {}, action) {
  switch (action.type) {
    case LOAD_PRODUCT:
      return { ...state, load: action.payload };
    case UPLOAD_PRODUCT:
      return { ...state, upload: action.payload };
    case SEARCH_PRODUCT:
      return { ...state, search: action.payload };
    case PRODUCT_DETAIL:
      return { ...state, detail: action.payload };
    default:
      return state;
  }
}
