import {Link} from 'react-router-dom';
import './PageNotFound.css';

const PageNotFound = () => {
  return (
    <div className="page-not-found">
      <h1>404</h1>
      <h2>Page not found</h2>
      <p>We are sorry, the page you requested could not be found. <br /> Please go back to home page</p>
      
      <Link to={"/"}>
        <button className="page-not-found-btn">Go to Home</button>
      </Link>
    </div> 
  )
}

export default PageNotFound;