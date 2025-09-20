import React from 'react';
import { useParams, Link } from 'react-router-dom';
import rooms from '../rooms/rooms-data';
import Carousel from '../ui/Carousel';
import emailjs from 'emailjs-com';

export default function RoomDetail(){
  const { id } = useParams();
  const room = rooms.find(r => r.id === id);
  if(!room) return (
    <div style={{padding:28}}>
      <h2>Room not found</h2>
      <Link to="/">Back to rooms</Link>
    </div>
  );

  const handleContact = (e) => {
    e.preventDefault();
    const form = e.target;
    const data = {
      room: room.title,
      name: form.name.value,
      email: form.email.value,
      message: form.message.value,
      checkin: form.checkin.value,
      checkout: form.checkout.value
    };
    // Configure emailJS: replace SERVICE_ID, TEMPLATE_ID, USER_ID with your values
    emailjs.send('SERVICE_ID','TEMPLATE_ID', data, 'USER_ID')
      .then(()=> alert('Message sent! (configure emailJS ids in code)'))
      .catch(()=> alert('Send failed. Configure emailJS IDs first.'));
    form.reset();
  };

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
          <div style={{borderRadius:12,boxShadow:'var(--card-shadow)',padding:16,background:'linear-gradient(180deg, rgba(255,255,255,0.98), rgba(255,255,255,0.95))'}}>
            <h4>Book your stay</h4>
            <form onSubmit={handleContact} style={{marginTop:8,display:'grid',gap:10}}>
              <input name="name" required placeholder="Your name" style={{padding:8,borderRadius:8,border:'1px solid #ddd'}} />
              <input name="email" type="email" required placeholder="Email" style={{padding:8,borderRadius:8,border:'1px solid #ddd'}} />
              <div style={{display:'flex',gap:8}}>
                <input name="checkin" type="date" style={{flex:1,padding:8,borderRadius:8,border:'1px solid #ddd'}} />
                <input name="checkout" type="date" style={{flex:1,padding:8,borderRadius:8,border:'1px solid #ddd'}} />
              </div>
              <textarea name="message" rows="3" placeholder="Message" style={{padding:8,borderRadius:8,border:'1px solid #ddd'}} />
              <button className="link-btn" type="submit">Send inquiry</button>
            </form>
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