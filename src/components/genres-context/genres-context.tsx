import React, { Component, ReactNode } from 'react';
import MdbapiService from '../../services/service-api';
import {Genre, GenresState, GenresContextValue} from '../../interface/interface'

interface GenresProviderProps {
    children: ReactNode;
}

const GenresContext = React.createContext<GenresContextValue | null>(null);

export class GenresProvider extends Component<GenresProviderProps, GenresState> {
    mdbapiService = new MdbapiService();

    state: GenresState = {
        genres: {},
        error: null,
        value: null,
    };

    componentDidMount() {
        this.fetchGenres();
    }

    componentDidUpdate(prevProps: Record<string, unknown>, prevState: GenresState) {
        const { genres, error } = this.state;

        if (genres !== prevState.genres || error !== prevState.error) {
            this.setState({
                value: {
                    genres,
                    error,
                },
            });
        }
    }

    fetchGenres = () => {
        this.mdbapiService
            .getGenres()
            .then((genres: Genre[]) => {
                const genresMap: Record<number, string> = {};
                genres.forEach((genre: Genre) => {
                    genresMap[genre.id] = genre.name;
                });
                this.setState({
                    genres: genresMap,
                    error: null,
                });
            })
            .catch((error: Error) => {
                this.setState({ error: error.message });
            });
    };

    render() {
        const { children } = this.props;
        const { error, value } = this.state;
        return (
            <GenresContext.Provider value={value}>
                {children}
        {error && <div>{`Ошибка: ${error}`}</div>}
        </GenresContext.Provider>
        );
        }
    }

    export const GenresConsumer = GenresContext.Consumer;