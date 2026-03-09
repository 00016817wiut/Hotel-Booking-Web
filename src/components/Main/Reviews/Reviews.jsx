import "./Reviews.css";
import pfp from "../../../assets/images/pfp.png";
import pfp2 from "../../../assets/images/pfp2.png";
import pfp3 from "../../../assets/images/pfp3.png";

const reviews = [
  {
    name: "Wade Warren",
    company: "Louis Vuitton",
    photo: pfp,
    quote:
      "The team made every detail effortless. The room was peaceful, the service was warm, and the location was perfect for meetings.",
  },
  {
    name: "Albert Florise",
    company: "Nintendo",
    photo: pfp2,
    quote:
      "Excellent stay from start to finish. I appreciated the fast check-in, calm atmosphere, and very attentive support throughout the week.",
  },
  {
    name: "Jenny Wilson",
    company: "Bank of America",
    photo: pfp3,
    quote:
      "A beautiful boutique feel with practical comfort. The hotel strikes the right balance between modern style and genuine hospitality.",
  },
];

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
