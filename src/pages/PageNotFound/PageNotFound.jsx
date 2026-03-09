import { Link } from "react-router-dom";
import "./PageNotFound.css";

const PageNotFound = () => {
  return (
    <section className="page-not-found">
      <div className="page-not-found__shape page-not-found__shape--left" />
      <div className="page-not-found__shape page-not-found__shape--right" />

      <div className="page-not-found__card">
        <p className="page-not-found__code">404</p>
        <h1>Looks like this page has checked out.</h1>
        <p>
          The page you requested does not exist anymore or may have been moved. You can return to the homepage and continue browsing.
        </p>

        <div className="page-not-found__actions">
          <Link to="/" className="page-not-found-btn page-not-found-btn--primary">
            Go to home
          </Link>
          <Link to="/rooms" className="page-not-found-btn page-not-found-btn--ghost">
            Browse rooms
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PageNotFound;
