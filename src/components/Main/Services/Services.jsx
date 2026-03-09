import "./Services.css";
import pickup from "../../../assets/icons/pickup.svg";
import parking from "../../../assets/icons/parking.svg";
import roomserv from "../../../assets/icons/roomserv.svg";
import internet from "../../../assets/icons/internet.svg";
import breakfast from "../../../assets/icons/breakfast.svg";

const services = [
  { title: "Pick up & drop", icon: pickup },
  { title: "Parking space", icon: parking },
  { title: "Room service", icon: roomserv },
  { title: "Fiber internet", icon: internet },
  { title: "Breakfast", icon: breakfast },
];

const stats = [
  { number: "9", label: "Rooms & suites" },
  { number: "25", label: "Restaurant partners" },
  { number: "510+", label: "Satisfied guests" },
  { number: "65", label: "Nearby destinations" },
];

const Services = () => {
  return (
    <section className="services" id="services">
      <div className="services__container">
        <div className="services__header">
          <h3>OUR SERVICES</h3>
          <h1>Hotel Facilities</h1>
        </div>

        <div className="services__body">
          {services.map((service) => (
            <article className="services__body-item" key={service.title}>
              <h2>
                {service.title}
                <img src={service.icon} alt="" aria-hidden="true" />
              </h2>
              <p>
                Thoughtfully managed amenities designed to keep your stay smooth, comfortable, and stress-free from arrival to departure.
              </p>
            </article>
          ))}
        </div>

        <div className="services__info" aria-label="Hotel stats">
          {stats.map((item) => (
            <div className="services__info-item" key={item.label}>
              <h2>{item.number}</h2>
              <p>{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
