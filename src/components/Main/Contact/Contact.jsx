import "./Contact.css";
import arrows from "../../../assets/icons/contact_arrows.svg";

const Contact = () => {
    return (
        <section className="contact" id="contact">
            <div className="contact__header">
                <h1>Contact Us</h1>
                <p>It is a long established fact that a reader will be distracted by the readable content of a page.</p>
            </div>
            <div className="contact__body">
                <div className="contact__body-map">
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2994.8593400852214!2d69.28343107590683!3d41.35541097130396!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ae8da0a35e9343%3A0x834748472407735f!2sAnor%20Avenue%20Hotel!5e0!3m2!1sru!2s!4v1772962115599!5m2!1sru!2s"  allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                </div>
                <div className="contact__body-contacts">
                    <img src={arrows} alt="" aria-hidden="true" />
                    <div className="contact__body-contacts-info">
                        <h1>Contact Us</h1>
                        <p>To get information on available rooms</p>
                        <ul>
                            <li><a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a></li>
                            <li><a href="https://t.me" target="_blank" rel="noreferrer">Telegram</a></li>
                            <li><a href="tel:+998777673000">+998 (77) 767 30 00</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    )
}
export default Contact;
