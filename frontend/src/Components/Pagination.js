import React from "react";

const Pagination = ({ totalOrders, ordersPerPage, setCurrentPage, currentPage }) => {
  const totalPages = Math.ceil(totalOrders / ordersPerPage);
  const pages = [];

  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  const   handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handlePrevClick = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <nav aria-label="Page navigation example " className="main"style={{marginLeft:"350px"}}>
      <ul className="pagination">
        {/* Previous Button */}
        <li className="page-item">
          <button
            className="page-link"
            onClick={handlePrevClick}
            disabled={currentPage === 1}
          >
            Previous
          </button>
        </li>

        {/* Page Numbers */}
        {pages.map((page) => (
          <li
            key={page}
            className={`page-item ${page === currentPage ? "active" : ""}`}
          >
            <button className="page-link" onClick={() => handlePageClick(page)}>
              {page}
            </button>
          </li>
        ))}

        {/* Next Button */}
        <li className="page-item">
          <button
            className="page-link"
            onClick={handleNextClick}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
