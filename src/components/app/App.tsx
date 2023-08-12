import { Component } from "react";
import MovieSearch from "../movie-search/movie-search";
import Tabs from "../tabs/tabs";
import Paginations from "../pagination/pagination";
import MdbapiService from "../../services/service-api";
import MovieList from "../movie-list/movie-list";
import { Spin } from "antd";
import { debounce } from "lodash";
import { GenresProvider } from "../genres-context/genres-context";
import { Movie } from "../../interface/interface";
import { toast , ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./App.scss";
interface AppProps {}

interface AppState {
  movies: Movie[];
  isLoading: boolean;
  error: boolean;
  isOnline: boolean;
  currentPage: number;
  currentPageRated: number;
  searchQuery: string;
  totalResults: number;
  totalResultsRated: number;
  session: string;
  activeTab: string;
}

export default class App extends Component<AppProps, AppState> {
  mdbapiService = new MdbapiService();

  state: AppState = {
    movies: [],
    isLoading: false,
    error: false,
    isOnline: window.navigator.onLine,
    currentPage: 1,
    currentPageRated: 1,
    searchQuery: "return",
    totalResults: 0,
    session: "",
    activeTab: "search",
    totalResultsRated: 0,
  };

  componentDidMount() {
    const defaultQuery = "return";
    this.mdbapiService
        .getMovies(defaultQuery, 1)
        .then((response: { movies: Movie[]; total_results: number }) => {
          this.setState({
            movies: response.movies,
            totalResults: response.total_results,
            searchQuery: defaultQuery,
          });
        })
        .catch((error) => {
          toast.error(`Error fetching movies: ${error.message}`);
        });

    const storedSession = localStorage.getItem("guestSession");
    if (storedSession) {
      this.setState({ session: storedSession }, () => {
        this.fetchRatedMovies();
      });
    } else {
      this.mdbapiService
          .getGuestSession()
          .then((sessionData) => {
            this.setState({ session: sessionData.guest_session_id }, () => {
              localStorage.setItem("guestSession", sessionData.guest_session_id);
              this.fetchRatedMovies();
            });
          })
          .catch((error) => {
            toast.error(`Error creating guest session: ${error.message}`);
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
      this.setState({ isLoading: false });
      toast.error(`Error: ${(error as Error).message}`);
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
        error: false,
      });
    } catch (error) {
      this.setState({ isLoading: false });
      toast.error(`Error: ${(error as Error).message}`);
    }
  };

  handlePageChangeRated = async (page: number) => {
    try {
      this.setState({ isLoading: true, currentPageRated: page });
      const response = await this.mdbapiService.getRatedMovies(
          this.state.session,
          page,
      );
      this.setState({
        movies: response.movies,
        totalResultsRated: response.total_results,
        isLoading: false,
        error: false,
      });
    } catch (error) {
      this.setState({ isLoading: false });
      toast.error(`Error: ${(error as Error).message}`);
    }
  };

  handleRating = async (movieId: number, rating: number) => {
    try {
      await this.mdbapiService.rateMovie(movieId, this.state.session, rating);
      const updatedMovies = this.state.movies.map((movie) => {
        if (movie.id === movieId) {
          return { ...movie, rating };
        }
        return movie;
      });
      this.setState({ movies: updatedMovies });
    } catch (error) {
      toast.error(`Error: ${(error as Error).message}`);
    }
  };

  fetchRatedMovies() {
    this.mdbapiService
        .getRatedMovies(this.state.session)
        .then((response) => {
          const ratedMovies = response.movies;
          const updatedMovies = this.state.movies.map((movie) => {
            const ratingInfo = ratedMovies.find(
                (ratedMovie: Movie) => ratedMovie.id === movie.id,
            );
            return { ...movie, rating: ratingInfo ? ratingInfo.rating : null };
          });
          this.setState({ movies: updatedMovies });
        })
        .catch((error) => {
          toast.error(`Error: ${(error as Error).message}`);
        });
  }

  handleTabSearch = async (tab: string) => {
    if (tab === "search") {
      const { searchQuery } = this.state;
      this.setState({
        activeTab: tab,
        currentPage: 1,
        movies: [],
      });
      try {
        this.setState({ isLoading: true });
        const response = await this.mdbapiService.getMovies(searchQuery, 1);
        this.setState({
          movies: response.movies,
          isLoading: false,
          error: false,
        });
        this.fetchRatedMovies();
      } catch (error) {
        this.setState({ isLoading: false });
        toast.error(`Error: ${(error as Error).message}`);
      }
    } else if (tab === "rated") {
      this.setState({ activeTab: tab, currentPageRated: 1, isLoading: true });

      this.mdbapiService
          .getRatedMovies(this.state.session, 1)
          .then((response) => {
            this.setState({
              movies: response.movies,
              totalResultsRated: response.total_results,
              isLoading: false,
            });
          })
          .catch((error) => {
            this.setState({ isLoading: false });
            toast.error(`Error: ${(error as Error).message}`);
          });
    }
  };


  render() {
    const { isLoading, error, movies, isOnline, activeTab } = this.state;
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
            <ToastContainer />
            <header className="header">
              <Tabs activeTab={activeTab} onTabChange={this.handleTabSearch} />
            </header>
            <section className="main">
              {activeTab === "search" && (
                <MovieSearch handleSearch={this.handleSearch} />
              )}
              {spinElement}
              {noResultsMessage}
              <GenresProvider>
                <MovieList
                  movies={movies}
                  error={error}
                  handleRating={this.handleRating}
                />
              </GenresProvider>
            </section>
            <Paginations
              currentPage={
                activeTab === "search"
                  ? this.state.currentPage
                  : this.state.currentPageRated
              }
              handlePageChange={
                activeTab === "search"
                  ? this.handlePageChange
                  : this.handlePageChangeRated
              }
              totalResult={
                activeTab === "search"
                  ? this.state.totalResults
                  : this.state.totalResultsRated
              }
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
