export interface Movie {
    id: number;
    overview: string;
    release_date: number;
    title: string;
    poster_path: string;
    rating?: number;
    vote_average: number;
    genre_ids: number[];
}

export interface Genre {
    id: number;
    name: string;
}

export interface GenresState {
    genres: Record<number, string>;
    error: string | null;
    value: {
        genres: Record<number, string>;
        error: string | null;
    } | null;
}

export interface GenresContextValue {
    genres: Record<number, string>;
    error: string | null;
}