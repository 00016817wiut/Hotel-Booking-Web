import "./Services.css"
import pickup from "../../../assets/icons/pickup.svg";
import parking from "../../../assets/icons/parking.svg";
import roomserv from "../../../assets/icons/roomserv.svg";
import pool from "../../../assets/icons/pool.svg";
import internet from "../../../assets/icons/internet.svg";
import breakfast from "../../../assets/icons/breakfast.svg";


const Services = () => {
    return (
        <section className="services" id="services">
            <div className="services__container">
                <div className="services__header">
                    <h3>OUR SERVICES</h3>
                    <h1>Hotel Facilities</h1>
                </div>

                <div className="services__body">
                    <div className="services__body-item">
                        <h1>Pick up & Drop <img src={pickup} alt="Pick Up & Drop" /></h1>
                        <p>It is a long established fact that a reader will be distracted by the readable content of a page.</p>
                    </div>

                    <div className="services__body-item">
                        <h1>Parking Space <img src={parking} alt="Pick Up & Drop" /></h1>
                        <p>It is a long established fact that a reader will be distracted by the readable content of a page.</p>
                    </div>

                    <div className="services__body-item">
                        <h1>Room Services <img src={roomserv    } alt="Pick Up & Drop" /></h1>
                        <p>It is a long established fact that a reader will be distracted by the readable content of a page.</p>
                    </div>

                    <div className="services__body-item">
                        <h1>Swimming Pool <img src={pool} alt="Pick Up & Drop" /></h1>
                        <p>It is a long established fact that a reader will be distracted by the readable content of a page.</p>
                    </div>

                    <div className="services__body-item">
                        <h1>Fibre Internet <img src={internet} alt="Pick Up & Drop" /></h1>
                        <p>It is a long established fact that a reader will be distracted by the readable content of a page.</p>
                    </div>

                    <div className="services__body-item">
                        <h1>Breakfast <img src={breakfast} alt="Pick Up & Drop" /></h1>
                        <p>It is a long established fact that a reader will be distracted by the readable content of a page.</p>
                    </div>
                </div>

                <div className="services__info">
                    <div className="services__info-item">
                        <h1>9</h1>
                        <p>Room & Suites</p>
                        <div className="line"></div>
                    </div>
                    <div className="services__info-item">
                        <h1>25</h1>
                        <p>Restaurant</p>
                        <div className="line"></div>
                    </div>
                     <div className="services__info-item">
                        <h1>510 + </h1>
                        <p>Exceptional Food</p>
                        <div className="line"></div>
                    </div>
                    <div className="services__info-item">
                        <h1>65</h1>
                        <p>Destination</p>
                    </div>
                </div>
            </div>
        </section>
    )
}
export default Services;