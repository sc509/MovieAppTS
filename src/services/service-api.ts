export default class MdbapiService {
  private options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2ZDJiMGM5NWQ4Zjg0OGYwNWFlYmZiZjliNTQ4Njc3NSIsInN1YiI6IjY0Y2Y5YTU4ZDlmNGE2MDNiODc1ZTFkOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.eYY6ASa1GtdnDJ5eGYAF6FelRSuYvRK7W4NNIDfpQzw",
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
        total_results: data.total_results
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error searching movies: ${error.message}`);
      } else {
        throw error;
      }
    }
  }
}