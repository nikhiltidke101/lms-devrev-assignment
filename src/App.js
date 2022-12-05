import React, {useState, useEffect} from 'react';
import axios from 'axios';
import './App.css';
import BookCard from './components/BookCard/BookCard';
import SearchFilter from './components/SearchFilter/SearchFilter';
import Pagination from './utils/Pagination';


function App() {
  const [books, setBooks] = useState([]);
  const [totalBookCount, setTotalBookCount] = useState([]);
  const [bookCount, setBookCount] = useState([]);
  const [params, setParams] = useState({author:"ruskin bond"});
  const [loading, setLoading] = useState(false);
  const [loadMore, setLoadMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage, setBooksPerPage] = useState(10);
  const [currentBookIndex, setCurrentBookIndex] = useState(40);

  // let currentBookIndex = 40;

  

  // Fetch data from Google Books API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await axios.get('https://www.googleapis.com/books/v1/volumes'
      , {
        params: {
          q: `
          ${
            params.title ? (`+intitle:${params.title}`): 
            (params.author ? (`+inauthor:${params.author}`): 
            (params.publisher ? (`+inpublisher:${params.publisher}`): 
            (params.subject ? (`+subject:${params.subject}`) : ""))) 
          }`,
          projection: "full",
          key: "AIzaSyD9s_lJ2IQvCNaZtnntRfj14tBp-o9E2lE",
          printType:"books",
          maxResults:"40",
        }
      }
      ).then((res) => {
        setBooks(res.data.items.filter(isDate));
        setTotalBookCount(res.data.totalItems);
      });
  
      setBookCount(books.length);
      setLoading(false);
    }
    fetchData();
  }, [params]);

  useEffect(() => {
    setBookCount(books.length);
  }, [books])

  const fetchMoreData = async () => {
    setLoading(true);
    await axios.get('https://www.googleapis.com/books/v1/volumes'
    , {
      params: {
        q: `
        ${
          params.title ? (`+intitle:${params.title}`): 
          (params.author ? (`+inauthor:${params.author}`): 
          (params.publisher ? (`+inpublisher:${params.publisher}`): 
          (params.subject ? (`+subject:${params.subject}`) : ""))) 
        }`,
        projection: "full",
        key: "AIzaSyD9s_lJ2IQvCNaZtnntRfj14tBp-o9E2lE",
        printType:"books",
        maxResults:"40",
        startIndex: `${currentBookIndex}`,
      }
    }
    ).then((res) => {
      setBooks(existingValues => ([
        ...existingValues,
        ...res.data.items
      ]));
      setCurrentBookIndex(currentBookIndex + 40);
    });
    setLoading(false);
  }

  // Get current Posts
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);

  // Change Page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    if(pageNumber < totalBookCount/booksPerPage) pageNumber === Math.ceil(books.length / booksPerPage) ? setLoadMore(true) : setLoadMore(false);
    else setLoadMore(false);
  } 
  
  const trigger = (data) => {
    console.log(data);
    setParams(data);
  }

  const isDate = (value) => {
    // console.log(params.date);
    if(params.date == "") return true;
    if(params.date != undefined && value.volumeInfo.publishedDate != undefined){ 
      var date = params.date?.toString().split("-");
      if(date.length == 0) return false;
      var date2 = value.volumeInfo.publishedDate?.split("-")

      if(date.length === 1) return date[0] === date2[0];
      else if(date.length === 2) return (date[0] == date2[0] || date[1] === date2[1])
      else if(date.length === 3){
        if(date[0] === date2[0] && (date[1] === date2[1] || date[2] === date2[2])) return true;
        else return false;
      }
    }else{
        return true;
      }
  }


  return (
    <div className="App">
      <div className='search'>
        <h3 className='books-shown'>
          <span>Total Books: {totalBookCount}</span> <br />
          <span>Shown Books: {bookCount}</span>
        </h3>
        
        
        <div className='book-logo'>
          <img src="./book-logo.png" alt="" srcset="" />
        </div>
        <SearchFilter trigger={trigger} />
      </div>
      <div className='booklist'>
        <div className='list-group mb-4'>
        
          {
              loading ? <h4> Loading... </h4> : 
              currentBooks.map(book => (
                  <div className='card' key={book.id}>
                    <BookCard title={book.volumeInfo.title} 
                    imageUrl={book.volumeInfo.imageLinks?.thumbnail}
                    authors = {book.volumeInfo.authors}
                    publisher = {book.volumeInfo.publisher}
                    publishedDate = {book.volumeInfo.publishedDate}
                    categories = {book.volumeInfo.categories}
                    previewLink = {book.volumeInfo.previewLink}
                    />
                  </div>
              ))
          }
        </div>
        <Pagination booksPerPage={booksPerPage} totalBooks={books.length} paginate={paginate} loadMore={loadMore} moreData={fetchMoreData}/>
      </div>
    </div>
  );
}

export default App;
