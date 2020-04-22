// WARNING: Don't check your actual API key into GitHub
const MOVIE_DB_API_KEY = '4267e526aca94ba93e69cee8a8f3ee50';
const MOVIE_DB_BASE_URL = 'https://g5jezgqoe1.execute-api.us-east-1.amazonaws.com/stg';
//const MOVIE_DB_BASE_URL = 'https://api.themoviedb.org/3';

const createMovieDbUrl = (relativeUrl, queryParams) => {  
  let baseUrl = `${MOVIE_DB_BASE_URL}`;
  /*let baseUrl = `${MOVIE_DB_BASE_URL}${relativeUrl}?api_key=${MOVIE_DB_API_KEY}&language=en-US`;
  if (queryParams) {
    Object.keys(queryParams)
      .forEach(paramName => baseUrl += `&${paramName}=${queryParams[paramName]}`);
  }*/
  return baseUrl;
}

export const getTopMovies = async ({page}) => {
  const fullUrl = createMovieDbUrl('/movie/top_rated', {
    page
  });
  return fetch(fullUrl);
}

/*export const getTopMovies = async ({page}) => {
    const fullUrl = createMovieDbUrl('', {
      
    });
    return fetch(fullUrl);
  }*/

export const searchMovies = async ({ page, query}) => {
  const fullUrl = createMovieDbUrl('/search/movie', {
    page,
    query
  });
  return fetch(fullUrl);
}

export const getMovieDetails = async ({movieId}) => {
  const fullUrl = createMovieDbUrl(`/movie/${movieId}`);
  return fetch(fullUrl);
}