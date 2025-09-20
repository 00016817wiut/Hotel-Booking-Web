import "./Reviews.css"
import pfp from '../../../assets/images/pfp.png'
import pfp2 from '../../../assets/images/pfp2.png'
import pfp3 from '../../../assets/images/pfp3.png'

const Reviews = () => {
    return (
        <section className="reviews">
            <div className="reviews__contianer">
                <div className="reviews__header">
                    <h1>Our Happy Customers</h1>
                    <p>Know about our clients, we are a woldwide corporate brand</p>
                </div>
                <div className="reviews__cards">
                    <div className="reviews__cards-item">
                        <div className="reviews__content">
                            <img src={pfp} alt="profile-photo" />
                            <div className="profile__info">
                                <h2>Wade Warren</h2>
                                <p>Louis Vuitton</p>
                            </div>
                            <p className="review__descr">Necessary to deliver white glove,
                            fully managed campaigns that surpass
                            industry benchmarks.Take your career
                            to next level.
                            </p>
                        </div>
                        <div className="arrows"></div>
                        <div className="arrows2"></div>
                    </div>
                    <div className="reviews__cards-item">
                        <div className="reviews__content">
                            <img src={pfp2} alt="profile-photo" />
                            <div className="profile__info">
                                <h2>Albert Florise</h2>
                                <p>Nintendo</p>
                            </div>
                            <p className="review__descr">Necessary to deliver white glove,
                            fully managed campaigns that surpass
                            industry benchmarks.Take your career
                            to next level.
                            </p>
                        </div>
                        <div className="arrows"></div>
                        <div className="arrows2"></div>
                    </div>
                    <div className="reviews__cards-item">
                        <div className="reviews__content">
                            <img src={pfp3} alt="profile-photo" />
                            <div className="profile__info">
                                <h2>Jenny Wilson</h2>
                                <p>Bank of America</p>
                            </div>
                            <p className="review__descr">Necessary to deliver white glove,
                            fully managed campaigns that surpass
                            industry benchmarks.Take your career
                            to next level.
                            </p>
                        </div>
                        <div className="arrows"></div>
                        <div className="arrows2"></div>
                    </div>
                    
                    
                </div>
            </div>
        </section>
    )
}
export default Reviews;