const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2ZDJiMGM5NWQ4Zjg0OGYwNWFlYmZiZjliNTQ4Njc3NSIsInN1YiI6IjY0Y2Y5YTU4ZDlmNGE2MDNiODc1ZTFkOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.eYY6ASa1GtdnDJ5eGYAF6FelRSuYvRK7W4NNIDfpQzw'
    }
};


export async function getMovies(query = '1') {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&language=en-US`, options);
        const data = await response.json();
        return data.results;
    } catch (err) {
        console.error(err);
    }
}