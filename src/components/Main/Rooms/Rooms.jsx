import "./Rooms.css"
import room1 from "../../../assets/images/room1.png";
import room2 from "../../../assets/images/room2.png";
import room3 from "../../../assets/images/room3.png";
import size from "../../../assets/icons/size.svg";
import bed from "../../../assets/icons/bed.svg";
import bath from "../../../assets/icons/bath.svg";

const Rooms = () => {

    const roomData = [
  {
    id: 1,
    image: room1,
    title: "Deluxe Contrast Room",
    size: "52 sqm",
    beds: "2 Bed",
    bath: "1 Bathroom",
    price: "$200"
  },
  {
    id: 2,
    image: room2,
    title: "Luxery Twin Room",
    size: "52 sqm",
    beds: "2 Bed",
    bath: "1 Bathroom",
    price: "$250"
  },
  {
    id: 3,
    image: room3,
    title: "Single Contrast Room",
    size: "52 sqm",
    beds: "1 Bed",
    bath: "1 Bathroom",
    price: "$200"
  },
  {
    id: 4,
    image: room1,
    title: "Deluxe Contrast Room",
    size: "52 sqm",
    beds: "2 Bed",
    bath: "1 Bathroom",
    price: "$200"
  },
  {
    id: 5,
    image: room2,
    title: "Luxery Twin Room",
    size: "52 sqm",
    beds: "2 Bed",
    bath: "1 Bathroom",
    price: "$250"
  },
  {
    id: 6,
    image: room3,
    title: "Single Contrast Room",
    size: "52 sqm",
    beds: "1 Bed",
    bath: "1 Bathroom",
    price: "$200"
  },
  {
    id: 7,
    image: room1,
    title: "Deluxe Contrast Room",
    size: "52 sqm",
    beds: "2 Bed",
    bath: "1 Bathroom",
    price: "$200"
  },
  {
    id: 8,
    image: room2,
    title: "Luxery Twin Room",
    size: "52 sqm",
    beds: "2 Bed",
    bath: "1 Bathroom",
    price: "$250"
  },
  {
    id: 9,
    image: room3,
    title: "Single Contrast Room",
    size: "52 sqm",
    beds: "1 Bed",
    bath: "1 Bathroom",
    price: "$200"
  }
];
    return (
        <section className="rooms" id="rooms">
            <div className="rooms__container">
                <div className="rooms__header">
                    <h1>Our Rooms</h1>
                    <p>It is a long established fact that a reader will be distracted by the readable content of a page.</p>
                </div>

                <div className="rooms__body">
                {
                    roomData.map(room => (
                        <div className="rooms__body-item" key={room.id}>
                            <div className="room__image">
                              <img src={room.image} alt="Pic" />
                            </div>
                            <div className="room__info">
                                <h1>Deluxe Contrast Room</h1>
                                <ul>
                                    <li><img src={size} alt="" /> {room.size}</li>
                                    <li><img src={bed} alt="" /> {room.beds}</li>
                                    <li><img src={bath} alt="" /> {room.bath}</li>
                                </ul>
                                <p><span>$200</span>/Night</p>
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