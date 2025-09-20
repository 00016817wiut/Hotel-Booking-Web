import React from 'react';
import RoomCard from '../rooms/RoomCard';
import roomsData from '../rooms/rooms-data';

export default function Home(){
  return (
    <div>
      <section className="hero">
        <h2>Welcome to Anor Avenue Hotel</h2>
        <p>Comfortable rooms, thoughtful service and a central location.</p>
      </section>
      <section className="grid" aria-label="Available rooms">
        {roomsData.map(r => <RoomCard key={r.id} room={r} />)}
      </section>

      <section id="about" style={{marginTop:28}}>
        <h3>About us</h3>
        <p style={{color:'#555'}}>Anor Avenue is a boutique hotel offering cozy stays with modern amenities.
        Our design uses a clean white palette with pomegranate accents and glass-like cards.</p>
      </section>

      <section id="contact" style={{marginTop:18}}>
        <h3>Contact</h3>
        <p>If you want, use the contact form on the room page to send a message.</p>
      </section>
    </div>
  );
}