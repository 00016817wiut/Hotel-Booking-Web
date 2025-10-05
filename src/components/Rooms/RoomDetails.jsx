import {useParams} from "react-router-dom";

const RoomDetails = ( {title } ) => {
  const {id} = useParams();

  return (
    <div className="outlet-box">
      <h1>Hello</h1>
      <p>Room №: {id}</p>
      <p>Info: {title}</p>
    </div>
  )
}
export default RoomDetails;