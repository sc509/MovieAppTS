import "./App.scss";
import { Component } from "react";
import MovieSearch from "../movie-search/movie-search";
import Tabs from "../tabs/tabs";
import Pagination from "../pagination/pagination";
import { getMovies } from "../../services/service-api";
import MovieList from "../movie-list/movie-list";

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
};

export default class App extends Component<AppProps, AppState> {
    state: AppState = {
        movies: [],
    };

    componentDidMount() {
        getMovies().then((movies) => {
            this.setState({ movies });
        });
    };

    render() {
        return (
            <section className="movieapp">
                <header className="header">
                    <Tabs />
                </header>
                <section className="main">
                    <MovieSearch />
                    <MovieList movies={this.state.movies} />
                </section>
                <Pagination />
            </section>
        );
    }
}