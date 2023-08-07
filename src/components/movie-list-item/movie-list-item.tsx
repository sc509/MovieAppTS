import React, { Component } from "react";
import './movie-list-item.scss'
import {Movie} from "../app/App";
import truncateString from "../../Utilities/truncate-string";
import { format, parseISO } from 'date-fns';
import { Rate } from 'antd';

interface MovieListItemProps {
  movie:Movie;
}

interface State {}

export default class MovieListItem extends Component<MovieListItemProps, State> {
  handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const target = event.target as HTMLImageElement;
    target.src = 'https://skomarket.ru/upload/iblock/349/fzk93483k2g5hmxa3mho61h94vlpxklq.jpg';
  };

  render() {
    const { movie } = this.props;
    const validDate = movie.release_date;
    const validDateString = validDate.toString();
    const formattedDate = validDate ? format(parseISO(validDateString), 'MMMM d, y') : 'Unknown';
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
          <h1 className="movie-list__item-title">{truncateString(movie.title,30)}</h1>
          <div className={`movie-list__item-rate`}>4</div>
          <p className="movie-list__item-date">{formattedDate}</p>
          <div className="movie-list__item-genres">
            <button type="button" className="movie-list__item-button">
              Абоба
            </button>
          </div>
          <p className="movie-list__item-description">{truncateString(movie.overview, 170)}</p>
          <div className="movie-list__item-user-rate">
            <Rate className="rateStyle" value={0} count={10} />
          </div>
        </div>
      </div>
    );
  }
}
