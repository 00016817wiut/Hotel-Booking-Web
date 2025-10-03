import "./Rooms.css"
import { Link } from "react-router-dom";
import size from "../../../assets/icons/size.svg";
import bed from "../../../assets/icons/bed.svg";
import bath from "../../../assets/icons/bath.svg";
import roomsInfo from "./data/roomsInfo.js"

const Rooms = () => {
   
    return (
        <section className="rooms" id="rooms">
            <div className="rooms__container content">
                <div className="rooms__header">
                    <h1>Our Rooms</h1>
                    <p>It is a long established fact that a reader will be distracted by the readable content of a page.</p>
                </div>

                <div className="rooms__body">
                {
                    roomsInfo.map(room => (
                      <div className="rooms__body-item" key={room.id}>
                          <Link to={`/room/${room.id}`}>
                            <div className="room__image">
                              <img src={room.image} alt="Pic" />
                            </div>
                          </Link>
                          <div className="room__info">
                              <h1>{room.title}</h1>
                              <ul>
                                  <li><img src={size} alt="" /> {room.size}</li>
                                  <li><img src={bed} alt="" /> {room.beds}</li>
                                  <li><img src={bath} alt="" /> {room.bath}</li>
                              </ul>
                              <p><span>{room.price}</span>/Night</p>
                          </div>
                      </div>          
                    ))
                }
                </div>
            </div>
        </section>
    )
}
export default Rooms;