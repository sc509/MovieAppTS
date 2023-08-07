import "./App.scss";
import { Component } from "react";
import MovieSearch from "../movie-search/movie-search";
import Tabs from "../tabs/tabs";
import Paginations from "../pagination/pagination";
import MdbapiService from "../../services/service-api";
import MovieList from "../movie-list/movie-list";
import { Spin } from "antd";
import { debounce } from "lodash";



export interface Movie {
  id: number;
  overview: string;
  release_date: number;
  title: string;
  poster_path: string;
  rating? : number;
}

interface AppProps {}

interface AppState {
  movies: Movie[];
  isLoading: boolean;
  error: boolean;
  isOnline: boolean;
  currentPage: number;
  searchQuery: string;
  totalResults: number;
  session:string;
}

export default class App extends Component<AppProps, AppState> {
  mdbapiService = new MdbapiService();

  state: AppState = {
    movies: [],
    isLoading: false,
    error: false,
    isOnline: window.navigator.onLine,
    currentPage: 1,
    searchQuery: "return",
    totalResults: 0,
    session:'',
  };

  componentDidMount() {
    const defaultQuery = "return";
    this.mdbapiService
        .getMovies(defaultQuery, 1)
        .then((response: { movies: Movie[], total_results: number }) => {
          this.setState({
            movies: response.movies,
            totalResults: response.total_results,
            searchQuery: defaultQuery
          });
        });

    const storedSession = localStorage.getItem('guestSession');
    if (storedSession) {
      this.setState({ session: storedSession }, () => {
        this.fetchRatedMovies();
      });
    } else {
      this.mdbapiService
          .getGuestSession()
          .then((sessionData) => {
            this.setState({ session: sessionData.guest_session_id }, () => {
              localStorage.setItem('guestSession', sessionData.guest_session_id);
              this.fetchRatedMovies();
            });
          })
          .catch((error) => {
            console.error(`Error creating guest session: ${error}`);
          });
    }

    window.addEventListener("online", this.updateOnlineStatus);
    window.addEventListener("offline", this.updateOnlineStatus);
  }

  componentWillUnmount() {
    window.removeEventListener("online", this.updateOnlineStatus);
    window.removeEventListener("offline", this.updateOnlineStatus);
  }

  updateOnlineStatus = () => {
    this.setState({ isOnline: window.navigator.onLine });
  };

  handleSearch = debounce(async (text: string, page: number = 1) => {
    try {
      this.setState({ isLoading: true, searchQuery: text, currentPage: 1 });
      const response = await this.mdbapiService.getMovies(text, page);
      this.setState({
        movies: response.movies,
        totalResults: response.total_results,
        isLoading: false,
        error: false,
      });

      const { session } = this.state;
      await this.mdbapiService.getRatedMovies(session);
      this.fetchRatedMovies();
    } catch (error) {
      this.setState({ error: true, isLoading: false });
    }
  }, 1500);

  handlePageChange = async (page: number) => {
    const { searchQuery } = this.state;
    const defaultQuery = "return";
    const query = searchQuery || defaultQuery;
    this.setState({ currentPage: page });

    try {
      this.setState({ isLoading: true });
      const response = await this.mdbapiService.getMovies(query, page);
      this.setState({
        movies: response.movies,
        totalResults: response.total_results,
        isLoading: false,
        error: false
      });
    } catch (error) {
      this.setState({ error: true, isLoading: false });
    }
  };

  handleRating = async (movieId: number, rating: number) => {
    try {
      await this.mdbapiService.rateMovie(movieId, this.state.session, rating);
      const updatedMovies = this.state.movies.map(movie => {
        if (movie.id === movieId) {
          return { ...movie, rating };
        }
        return movie;
      });
      this.setState({ movies: updatedMovies });
    } catch (error) {
      console.error(`Error rating movie: ${error}`);
    }
  };

  fetchRatedMovies() {
    this.mdbapiService
        .getRatedMovies(this.state.session)
        .then((ratedMovies) => {
          const updatedMovies = this.state.movies.map(movie => {
            const ratingInfo = ratedMovies.find((ratedMovie: Movie) => ratedMovie.id === movie.id);
            return { ...movie, rating: ratingInfo ? ratingInfo.rating : null };
          });
          this.setState({ movies: updatedMovies });
        })
        .catch((error) => {
          console.error(`Error fetching rated movies: ${error}`);
        });
  }

  render() {
    const { isLoading, error, movies, isOnline,  } = this.state;
    const spinElement = isLoading ? (
      <div className="spinner-container">
        <Spin size="large" />
      </div>
    ) : null;
    const noResultsMessage =
      !isLoading && !error && movies.length === 0 ? (
        <div className="no-results-message">Ничего не найдено</div>
      ) : null;
    return (
      <div>
        {isOnline ? (
          <section className="movieapp">
            <header className="header">
              <Tabs />
            </header>
            <section className="main">
              <MovieSearch handleSearch={this.handleSearch} />
              {spinElement}
              {noResultsMessage}
              <MovieList movies={this.state.movies} error={this.state.error} handleRating={this.handleRating} />
            </section>
            <Paginations
              currentPage={this.state.currentPage}
              handlePageChange={this.handlePageChange}
              totalResult={this.state.totalResults}
            />
          </section>
        ) : (
          <div>
            <h1 className="error-message">
              Сайт доступен только обладателям интернета
            </h1>
          </div>
        )}
      </div>
    );
  }
}
