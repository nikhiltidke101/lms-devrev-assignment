import React from 'react'
import "./pagination.css"

const Pagination = ({booksPerPage, totalBooks, paginate, loadMore, moreData}) => {
    const pageNumbers = [];
    for(let i=1; i<=Math.ceil(totalBooks/booksPerPage); i++){
        pageNumbers.push(i);
    }
  return (
    <div>
        <ul className='pagination'>
            {pageNumbers.map(number => (
                <li key={number} className="page-item">
                    <a onClick={(e) => {
                        e.preventDefault();
                            paginate(number)
                        }} 
                        href="!#" className='page-link'>
                        {number}
                    </a>
                </li>
            ))}
            {
                loadMore ?
                <li className="page-item">
                    <a 
                        onClick={(e) => {
                        e.preventDefault();
                            moreData();
                        }} 
                        href="!#" className='page-link'>
                        Load More
                    </a>
                </li> : <></>
            }
            
        </ul>
    </div>
  )
}

export default Pagination