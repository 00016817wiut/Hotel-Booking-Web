import React from 'react';
import { useParams, Link } from 'react-router-dom';
import rooms from '../rooms/rooms-data';
import Carousel from '../ui/Carousel';

export default function RoomDetail(){
  const { id } = useParams();
  const room = rooms.find(r => r.id === id);
  if(!room) return (
    <div style={{padding:28}}>
      <h2>Room not found</h2>
      <Link to="/">Back to rooms</Link>
    </div>
  );
  return (
    <div className="detail">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div>
          <h2 style={{margin:0}}>{room.title}</h2>
          <div style={{color:'#666'}}>{room.beds} • {room.size}</div>
        </div>
        <div className="price-box">
          <div style={{fontSize:12,color:'#666'}}>Price per night</div>
          <div style={{fontSize:22,fontWeight:700,color:'var(--brand)'}}>${room.price}</div>
        </div>
      </div>

      <div className="detail-grid">
        <div>
          <div className="carousel" aria-roledescription="carousel">
            <Carousel images={room.images} />
          </div>

          <div className="detail-info" style={{marginTop:12}}>
            <h3>About this room</h3>
            <p style={{color:'#444'}}>{room.description}</p>

            <h4>Amenities</h4>
            <ul>
              {room.amenities.map((a,i)=><li key={i}>{a}</li>)}
            </ul>
          </div>
        </div>
        <aside>
          <div style={{borderRadius:12,boxShadow:'var(--card-shadow)',padding:16,background:'#fff'}}>
            <h4>Book your stay</h4>
            <p style={{marginTop:6}}>Select dates and complete booking on our secure system.</p>
            <div style={{marginTop:12}}>
              <label style={{display:'block',fontSize:13,color:'#444'}}>Check-in</label>
              <input type="date" style={{width:'100%',padding:8,borderRadius:8,border:'1px solid #ddd'}} />
            </div>
            <div style={{marginTop:10}}>
              <label style={{display:'block',fontSize:13,color:'#444'}}>Check-out</label>
              <input type="date" style={{width:'100%',padding:8,borderRadius:8,border:'1px solid #ddd'}} />
            </div>
            <div style={{marginTop:12,display:'flex',gap:8}}>
              <button className="link-btn" style={{flex:1}}>Reserve for ${room.price}</button>
              <Link to="/" style={{alignSelf:'center'}}>Cancel</Link>
            </div>
          </div>

          <div style={{marginTop:12,fontSize:13,color:'#666'}}>
            <strong>Need help?</strong>
            <p style={{margin:6}}>Contact our front desk: +998 71 000 0000</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
