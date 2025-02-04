import { keys } from './movie-modal.actions';
import { createReducer } from '../../common/redux.helpers';

// Placeholder reducer for our movie modal
const movieModalReducer = createReducer({ isOpen: false, movieId: undefined,movie : []}, {
  [keys.OPEN_MOVIE_MODAL]: (state, action) => ({
    isOpen: true,
    movieId: action.movieId,
    movie: action.movie
  }),
  [keys.CLOSE_MOVIE_MODAL]: (state, action) => ({
    // Persist the movieId (and any other state tree objects)
    ...state,
    isOpen: false
  })
});

export default movieModalReducer;