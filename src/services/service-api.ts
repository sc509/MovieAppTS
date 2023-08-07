export default class MdbapiService {
  private options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2ZDJiMGM5NWQ4Zjg0OGYwNWFlYmZiZjliNTQ4Njc3NSIsInN1YiI6IjY0Y2Y5YTU4ZDlmNGE2MDNiODc1ZTFkOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.eYY6ASa1GtdnDJ5eGYAF6FelRSuYvRK7W4NNIDfpQzw",
    },
  };

  private async fetchWithAuthorization(url: string | URL): Promise<Response> {
    return fetch(url, this.options);
  }

  public async getMovies(query: string, page: number) {
    if (!query) {
      throw new Error("Фильмы не найдены");
    }

    const url = new URL(`https://api.themoviedb.org/3/search/movie`);
    url.search = new URLSearchParams({
      language: "en-US",
      query,
      page: page.toString(),
    }).toString();

    try {
      const response = await this.fetchWithAuthorization(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return {
        movies: data.results,
        total_results: data.total_results,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error searching movies: ${error.message}`);
      } else {
        throw error;
      }
    }
  }

  public async getGuestSession() {
    const url = new URL(
      `https://api.themoviedb.org/3/authentication/guest_session/new`,
    );

    try {
      const response = await this.fetchWithAuthorization(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error creating guest session: ${error.message}`);
      } else {
        throw error;
      }
    }
  }

  public async rateMovie(
    movieId: number,
    guestSessionId: string,
    rating: number,
  ) {
    const url = `https://api.themoviedb.org/3/movie/${movieId}/rating?api_key=6d2b0c95d8f848f05aebfbf9b5486775&guest_session_id=${guestSessionId}`;

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify({ value: rating }),
    };

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error rating movie: ${error.message}`);
      } else {
        throw error;
      }
    }
  }

  public async getRatedMovies(guestSessionId: string) {
    const url = `https://api.themoviedb.org/3/guest_session/${guestSessionId}/rated_movies?api_key=6d2b0c95d8f848f05aebfbf9b5486775`;

    try {
      const response = await fetch(url, this.options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.results;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error getting rated movies: ${error.message}`);
      } else {
        throw error;
      }
    }
  }
}
