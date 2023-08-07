import React, { Component } from "react";
import "./movie-search.scss";
import { DebouncedFunc } from "lodash";

interface Props {
  handleSearch: DebouncedFunc<(text: string, page:number) => Promise<void>>;
}

interface State {}

export default class MovieSearch extends Component<Props, State> {
  handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchText = event.target.value;
    const {handleSearch} = this.props;
    handleSearch(searchText, 1);
  };

  handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  render() {
    return (
      <section className="movie-search">
        <form className="movie-search__form" onSubmit={this.handleSubmit}>
          <label htmlFor="inputText">
            <input
              className="movie-search__form-input"
              type="text"
              id="inputText"
              name="inputText"
              placeholder="Type to search..."
              required
              onChange={this.handleInputChange}
            />
          </label>
        </form>
      </section>
    );
  }
}
