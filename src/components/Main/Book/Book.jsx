import "./Book.css";
import book from "../../../assets/images/book.png";
import arrows from "../../../assets/icons/book_arrows.svg";

const Book = () => {
    return (
        <section className="book" id="book">
                <div className="book__header">
                    <h1>Check Availability</h1>
                    <p>It is a long established fact that a reader will be distracted by the readable content of a page.</p>
                </div>

                <div className="book__body">
                    <div className="book__body-image">
                        <img src={book} alt="" />
                    </div>
                    <div className="book__body-contacts">
                        <img src={arrows} alt="" />
                        <div className="book__body-contacts-info">
                            <h1>Contact Us</h1>
                            <p>To get information on available rooms</p>
                            <ul>
                                <li><a href="#">Instagram</a></li>
                                <li><a href="#">Telegram</a></li>
                                <li><a href="#">+998 (77) 767 30 00</a></li>
                                <li><a href="#">Booking</a></li>
                                <li><a href="#">Agoda</a></li>
                                <li><a href="#">MyBooking</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
        </section>
    )
}
export default Book;