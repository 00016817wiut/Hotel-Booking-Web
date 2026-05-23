import { services, stats } from "../../../utils/base";
import "./Services.css";


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
