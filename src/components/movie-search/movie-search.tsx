import React, { Component } from "react";
import './movie-search.scss'

interface Props {}

interface State {}


export default class MovieSearch extends Component<Props, State> {
  handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  render() {
    return (
      <section className="movie-search">
        <form className="movie-search__form" onSubmit={this.handleSubmit} >
          <label htmlFor="inputText">
            <input
              className="movie-search__form-input"
              type="text"
              id="inputText"
              name="inputText"
              placeholder="Type to search..."
              required
            />
          </label>
        </form>
      </section>
    );
  }
}
