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
      this.setState({ session: storedSession });
    } else {
      this.mdbapiService
          .getGuestSession()
          .then((sessionData) => {
            this.setState({ session: sessionData.guest_session_id });
            localStorage.setItem('guestSession', sessionData.guest_session_id);
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
      console.log(`Response: ${JSON.stringify(response, null, 2)}`);
      this.setState({
        movies: response.movies,
        totalResults: response.total_results,
        isLoading: false,
        error: false,
      });
      console.log(`TR2: ${response.total_results}`)
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
              <MovieList movies={this.state.movies} error={this.state.error} />
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
