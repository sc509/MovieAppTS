import {Component} from "react";
import "./tabs.scss"

interface Props {}

interface State {}

export default class Tabs extends Component<Props, State> {
    render() {
        return(
            <section className="tabs">
                <div className="tabs-search">Search</div>
                <div className="tabs-rated">Rated</div>
            </section>
            )
    }
}