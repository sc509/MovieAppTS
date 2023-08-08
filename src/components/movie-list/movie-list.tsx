import { Component } from "react";
import "./movie-list.scss";
import MovieListItem from "../movie-list-item/movie-list-item";
import { Movie } from "../app/App";
import ErrorIndication from "../error-indication/error-indication";
import { GenresConsumer } from "../genres-context/genres-context";

interface MovieListProps {
    movies: Movie[];
    error: boolean;
    handleRating: (movieId: number, rating: number) => void;
}


interface State {}

export default class MovieList extends Component<MovieListProps, State> {
    render() {
        const { movies, error } = this.props;
        const errorMessage = error ? <ErrorIndication /> : null;
        return (
            <GenresConsumer>
                {(context) => (
                    <div>
                        {errorMessage}
                        <div className="movie-list">
                            {movies.map((movie) => (
                                <MovieListItem
                                    key={movie.id}
                                    movie={movie}
                                    onRate={this.props.handleRating}
                                    genres={context ? context.genres : {}}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </GenresConsumer>
        );
    }
}