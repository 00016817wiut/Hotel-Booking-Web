import React from 'react';
import { Link } from 'react-router-dom';

export default function RoomCard({room}){
  const bg = room.images && room.images[0] ? room.images[0] : '';
  return (
    <article className="card" aria-labelledby={'title-'+room.id} style={{backgroundImage:`url(${bg})`}}>
      <div className="card-body">
        <div className="room-title">
          <h3 id={'title-'+room.id} style={{margin:0}}>{room.title}</h3>
          <div className="price">${room.price}</div>
        </div>
        <div className="amenities">{room.beds} • {room.size}</div>
        <p style={{flex:1,color:'rgba(255,255,255,0.95)'}}>{room.description}</p>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <Link to={'/room/'+room.id} className="link-btn">View room</Link>
          <div className="badge">{room.amenities.length} amenities</div>
        </div>
      </div>
    </article>
  );
}