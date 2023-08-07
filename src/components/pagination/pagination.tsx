import { Component } from "react";
import "./pagination.scss";
import { Pagination } from "antd";

interface Props {
  currentPage: number;
  handlePageChange: (page: number) => void;
  totalResult: number;
}

interface State {}

export default class Paginations extends Component<Props, State> {
  render() {
    const { currentPage, handlePageChange, totalResult } = this.props;
    const maxPages = 500;
    const pageSize = 20;
    const limitedTotalResults = Math.min(totalResult, maxPages * pageSize - 1);
    console.log(totalResult)
    return (
      <div className="footer-pagination">
        <Pagination
            current={currentPage}
            onChange={handlePageChange}
            total={limitedTotalResults}
            pageSize={pageSize}
            showSizeChanger={false}
        />
      </div>
    );
  }
}
