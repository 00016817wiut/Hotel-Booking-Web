import "./Reviews.css";
import { reviews } from "../../../utils/base";

const Reviews = () => {
  return (
    <section className="reviews" id="reviews">
      <div className="reviews__container">
        <div className="reviews__header">
          <h1>Our Happy Customers</h1>
          <p>Real stories from guests who choose Anor Avenue Hotel for business trips and family stays.</p>
        </div>

        <div className="reviews__cards">
          {reviews.map((review) => (
            <article className="reviews__cards-item" key={review.name}>
              <div className="reviews__profile">
                <img src={review.photo} alt={`${review.name} profile`} />
                <div className="profile__info">
                  <h2>{review.name}</h2>
                  <p>{review.company}</p>
                </div>
              </div>
              <p className="review__descr">"{review.quote}"</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
