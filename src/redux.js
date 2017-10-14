import { Platform } from 'react-native';
import head from 'lodash/head';
import slice from 'lodash/slice';

// How many images to pre fetch
const PREFETCH_IMAGES = 5;

// API URL
const API = Platform.OS === 'android'
  ? 'http://10.0.3.2:3000' // Localhost ip address when running on Android (Genymotion)
  : 'http://localhost:3000';

// initial state
export const initialState = {
  image: null,
  next: [],
};

// Reducer
export const reducer = (state = initialState, action) => {
  switch (action.type) {
    // Handle API response with data object that looks like { gif: 'data:image/gif;base64,...' }
    case 'IMAGE_LOADED':
      return {
        ...state,
        // update current image if it's empty
        image: state.image || action.data,
        next: [
          action.data,              // put image an the beginning of next array
          ...state.next,            // put the existing images after
        ]
      };
    // Change current image with the next one
    case 'CHANGE_IMAGE':
      // Do nothing if next array is empty.
      // Just keep the current image till the new one is fetched.
      if (!state.next.length) {
        return state;
      }
      return {
        ...state,                   // keep the existing state,
        image: head(state.next),    // get fist item from next array
        next: [
          ...slice(state.next, 1),  // drop first item from next array
        ],
      };
    // Handle API request errors
    case 'ERROR':
      return state;                 // do nothing
    default:
      return state;
  }
};
