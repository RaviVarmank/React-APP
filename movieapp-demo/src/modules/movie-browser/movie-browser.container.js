import React from 'react';
import {connect} from 'react-redux';
import {Container, Row} from 'react-bootstrap';
import {AppBar, TextField, RaisedButton} from 'material-ui';
import * as movieActions from './movie-browser.actions';
import * as movieHelpers from './movie-browser.helpers';
import MovieList from './movie-list/movie-list.component';
import * as scrollHelpers from '../common/scroll.helpers';
import MovieModal from './movie-modal/movie-modal.container';
import App from '../../App';

class MovieBrowser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      currentMovies: [],
      query: '',
      data: [],
      searchString:[],
      queryYear: 'All',
      queryGenre: 'All'      
    };
    // Binds the handleScroll to this class (MovieBrowser)
    // which provides access to MovieBrowser's props
    // Note: You don't have to do this if you call a method
    // directly from a lifecycle method
    //this.handleScroll = this.handleScroll.bind(this);
  }

  handleInputChange = (event) => {
      this.setState({
          query: event.target.value
      },()=>{
    this.filterArray();
    })
  }

  getData = () => {
    fetch(`https://g5jezgqoe1.execute-api.us-east-1.amazonaws.com/stg`)
    .then(response => response.json())
    .then(responseData => {
        // console.log(responseData)
        this.setState({
            data:responseData,
            searchString:responseData
        })
    })
}


filterArray = () => {
  let searchString = this.state.query;
  let responseData = this.state.data;
  let queryYear = this.state.queryYear;
  let queryGenre = this.state.queryGenre;

  if(searchString.length > 0){
      // console.log(responseData[i].name);      
      responseData = responseData.filter(responseData => responseData.name.toLowerCase().includes(searchString));
      //.filter(searchString);
      this.setState({
        searchString:responseData
    })
  }
  if(queryYear.length > 0 && queryYear !== "All"){
      responseData = responseData.filter(responseData => parseInt(responseData.productionYear) === parseInt(queryYear));
      //.filter(searchString);
      this.setState({
        searchString:responseData
    })
  }
  if(queryGenre.length > 0 && queryGenre !== "All"){
    responseData = responseData.filter(responseData => responseData.genre === (queryGenre));
    //.filter(searchString);
    this.setState({
      searchString:responseData
  })
}
}

componentWillMount() {
  this.getData();
}
  componentDidMount() {
    //window.onscroll = this.handleScroll;
    this.props.getTopMovies(this.state.currentPage);
  }

  componentWillUnmount() {
    //window.removeEventListener('scroll', this.handleScroll);
  }

  /*handleScroll() {
    const {topMovies} = this.props;
    if (!topMovies.isLoading) {
      let percentageScrolled = scrollHelpers.getPercentageScrolledDown(window);
      if (percentageScrolled > .8) {
        const nextPage = this.state.currentPage + 1;
        this.props.getTopMovies(nextPage);
        this.setState({currentPage: nextPage});
      }
    }
  }*/

  onYearChange = (event) => {
    if(event.target.value !== "All"){
    this.setState({
        queryYear: event.target.value
    },()=>{
  this.filterArray();    
  })
  }else
  {
    this.getData();
  }
}

onGenreChange = (event) => {
  if(event.target.value !== "All"){
  this.setState({
      queryGenre: event.target.value
  },()=>{
this.filterArray();    
})
}
else
  {
    this.getData();
  }
}


  render() {
    const {topMovies} = this.props;
    //const movies = movieHelpers.getMoviesList(topMovies.response);
    
    function getUnique(arr, index) {
      const unique = arr
           .map(e => e[index])
    
           // store the keys of the unique objects
           .map((e, i, final) => final.indexOf(e) === i && i)
    
           // eliminate the dead keys & store unique objects
          .filter(e => arr[e]).map(e => arr[e]);      
     
       return unique;
    }

    const uniqueNamesgenre = getUnique(this.state.data,'genre');
    const uniqueNamesYear = getUnique(this.state.data,'productionYear');
    uniqueNamesgenre.sort((a,b) => {return a.genre > b.genre ? 1 : a.genre < b.genre ? -1 : 0;});
    uniqueNamesYear.sort((a,b) => {return b.productionYear - a.productionYear;});
    return (
      <div>
        <AppBar title='Movie Browser' />
        <Container>
          <Row >            
            <div className="activeSearch">
            Search Movie Name:
              <input class="form-control" type="text" placeholder="Search" aria-label="Search" onChange={this.handleInputChange} />
            </div>  &nbsp; 
            <div className="activeSearch">
              Year:
              <select class="form-control"
                defaultValue={this.state.queryYear}
                onChange={this.onYearChange}>
                <option value="All" >All</option>
                {uniqueNamesYear.map((y, i) =>
                  <option key={i} value={y.productionYear}>{y.productionYear}</option>
                )}
              </select>
            </div>&nbsp;
            <div className="activeSearch">
            Genre:
            <select class="form-control"
              defaultValue={this.state.queryGenre}
              onChange={this.onGenreChange}>
              <option value="All" >All</option>
              {uniqueNamesgenre.map((g, i) =>
                <option key={i} value={g.genre}>{g.genre}</option>
              )}
            </select>
          </div>    
          </Row>  
          <Row>&nbsp;</Row>        
          <Row>
            <MovieList movies={this.state.searchString} isLoading={topMovies.isLoading} />
          </Row>
        </Container>
        <MovieModal />
      </div>
    );
  }
}

export default connect(
  // Map nodes in our state to a properties of our component
  (state) => ({
    topMovies: state.movieBrowser.topMovies
  }),
  // Map action creators to properties of our component
  { ...movieActions }
)(MovieBrowser);