import {Component} from "react";
import "./tabs.scss";

interface Props {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

interface State {
}

export default class Tabs extends Component<Props, State> {
    handleTabClick = (newTab: string) => {
        const {onTabChange} = this.props;
        onTabChange(newTab);
    };

    render() {
        const { activeTab } = this.props;
        return (
            <section className="tabs">
                <div
                    className={activeTab === 'search' ? 'tabs-search active' : 'tabs-search'}
                    onClick={() => this.handleTabClick('search')}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            this.handleTabClick('search');
                        }
                    }}
                    tabIndex={0}
                    role="button"
                    >
                    Search
            </div>
                <div
                    className={activeTab === 'rated' ? 'tabs-rated active' : 'tabs-rated'}
                    onClick={() => this.handleTabClick('rated')}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            this.handleTabClick('rated');
                        }
                    }}
                    tabIndex={0}
                    role="button"
                >
                    Rated
                </div>
    </section>
    )
        ;
    }
}
