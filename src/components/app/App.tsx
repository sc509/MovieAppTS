import "./App.scss";
import { Component } from "react";
import MovieSearch from "../movie-search/movie-search";
import Tabs from "../tabs/tabs";
import Pagination from "../pagination/pagination";
import { getMovies } from "../../services/service-api";
import MovieList from "../movie-list/movie-list";
import { Spin } from "antd";

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
}

export default class App extends Component<AppProps, AppState> {
  state: AppState = {
    movies: [],
    isLoading: false,
    error: false,
    isOnline: window.navigator.onLine,
  };

  componentDidMount() {
    getMovies().then((movies) => {
      this.setState({ movies });
    });

    window.addEventListener("online", this.updateOnlineStatus);
    window.addEventListener("offline", this.updateOnlineStatus);
  };

  componentWillUnmount() {
    window.removeEventListener('online', this.updateOnlineStatus);
    window.removeEventListener('offline', this.updateOnlineStatus);
  }

  updateOnlineStatus = () => {
    this.setState({ isOnline: window.navigator.onLine });
  };

  render() {
    const { isLoading, error, movies, isOnline } = this.state;
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
              <MovieSearch />
              {spinElement}
              {noResultsMessage}
              <MovieList movies={this.state.movies} error={this.state.error} />
            </section>
            <Pagination />
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
