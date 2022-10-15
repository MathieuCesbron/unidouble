import React from "react"

import "./PaginationSearch.css"


export default function PaginationSearch(props) {
    const pageNumbers = []

    for (let i = 1; i <= Math.ceil(props.totalArticles / props.articlesPerPage); i++) {
        pageNumbers.push(i)
    }

    const style = number => number == props.currentPage ? { backgroundColor: "lightgrey" } : {}

    const changePage = number => {
        props.paginate(number)
        document.body.scrollTop = 0
    }

    return (
        <div>
            <ul className="pagination-search">
                {pageNumbers.map(number => (
                    <li
                        key={number}
                        className="pagination-search-number"
                        style={style(number)}>
                        <a onClick={() => changePage(number)} className="pagination-search-a">
                            {number}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    )
}