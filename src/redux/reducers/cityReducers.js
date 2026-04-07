import * as consts from "../constants/cityConstants";

export const citiesReducer = (state = {}, action) => {
  switch (action.type) {
    case consts.GET_CITIES_REQUEST:
      return {
        ...state,
        loadingCities: true,
        errMsgCities: null,
        cities: [],
      };

    case consts.GET_CITIES_SUCCESS:
      return {
        ...state,
        loadingCities: false,
        cities: action.payload,
      };

    case consts.GET_CITIES_FAIL:
      return {
        ...state,
        loadingCities: false,
        errMsgCities: action.payload,
      };

    default:
      return state;
  }
};

export const placesReducer = (state = {}, action) => {
  switch (action.type) {
    case consts.GET_PLACES_REQUEST:
      return {
        ...state,
        loadingPlaces: true,
        errMsgPlaces: null,
        places: [],
      };

    case consts.GET_PLACES_SUCCESS:
      return {
        ...state,
        loadingPlaces: false,
        places: action.payload,
      };

    case consts.GET_PLACES_FAIL:
      return {
        ...state,
        loadingPlaces: false,
        errMsgPlaces: action.payload,
      };

    default:
      return state;
  }
};
