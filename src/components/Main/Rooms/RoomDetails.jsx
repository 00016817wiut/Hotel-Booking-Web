import {useParams} from "react-router-dom";

const RoomDetails = ( {title } ) => {
  const {id} = useParams();

  return (
    <>
      <h1>Hello</h1>
      <p>Room №: {id}</p>
      <p>Info: {title}</p>
    </>
  )
}
export default RoomDetails;