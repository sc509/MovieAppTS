import React, { Component } from "react";
import "./movie-list-item.scss";
import { Movie } from "../../interface/interface";
import truncateString from "../../Utilities/truncate-string";
import { format, parseISO } from "date-fns";
import { Rate } from "antd";
import { toast } from 'react-toastify';

interface MovieListItemProps {
  movie: Movie;
  onRate: (movieId: number, rating: number) => void;
  genres: Record<number, string>;
}

interface State {}

export default class MovieListItem extends Component<
  MovieListItemProps,
  State
> {
  handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const target = event.target as HTMLImageElement;

    toast.error('Ошибка загрузки изображения, будет использовано запасное.');

    target.src =
        "https://skomarket.ru/upload/iblock/349/fzk93483k2g5hmxa3mho61h94vlpxklq.jpg";
  };

  handleRate = (rating: number) => {
    this.props.onRate(this.props.movie.id, rating);
  };

  render() {
    const { movie, genres } = this.props;
    const validDate = movie.release_date;
    const validDateString = validDate.toString();
    const formattedDate = validDate
      ? format(parseISO(validDateString), "MMMM d, y")
      : "Unknown";
    let ratingClass: string;
    if (movie.vote_average > 7) {
      ratingClass = "rating-high";
    } else if (movie.vote_average >= 5) {
      ratingClass = "rating-medium";
    } else if (movie.vote_average >= 3) {
      ratingClass = "rating-low";
    } else {
      ratingClass = "rating-very-low";
    }

    const movieGenres = movie.genre_ids
      .map((id: number) => genres[id])
      .filter(Boolean);

    return (
      <div className="movie-list__item">
        <div className="movie-list__item-image">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt="Постер фильма"
            onError={this.handleImageError}
          />
        </div>
        <div className="movie-list__item-content">
          <h1 className="movie-list__item-title">
            {truncateString(movie.title, 30)}
          </h1>
          <div className={`movie-list__item-rate ${ratingClass}`}>
            {Math.round(movie.vote_average)}
          </div>
          <p className="movie-list__item-date">{formattedDate}</p>
          <div className="movie-list__item-genres">
            {movieGenres.map((genre: string) => {
              const key = `${movie.id}-${genre}-${movie.title}`;
              return (
                  <button
                      key={key}
                      type="button"
                      className="movie-list__item-button"
                  >
                    {genre}
                  </button>
              );
            })}
          </div>
          <p className="movie-list__item-description">
            {truncateString(movie.overview, 170)}
          </p>
          <div className="movie-list__item-user-rate">
            <Rate
              className="rateStyle"
              value={movie.rating === null ? undefined : movie.rating}
              count={10}
              onChange={this.handleRate}
            />
          </div>
        </div>
      </div>
    );
  }
}
