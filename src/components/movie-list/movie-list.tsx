import { Component } from "react";
import "./movie-list.scss";
import MovieListItem from "../movie-list-item/movie-list-item";
import { Movie } from "../app/App";

interface MovieListProps {
  movies: Movie[];
}

interface State {}

export default class MovieList extends Component<MovieListProps, State> {
  render() {
    const { movies } = this.props;
    return (
      <div>
        <div className="movie-list">
          {movies.map((movie) => (
            <MovieListItem key={movie.id} movie={movie} />
          ))}{" "}
        </div>
      </div>
    );
  }
}
