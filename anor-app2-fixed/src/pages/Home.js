import React from 'react';
import RoomCard from '../rooms/RoomCard';
import roomsData from '../rooms/rooms-data';

export default function Home(){
  return (
    <div>
      <section className="hero">
        <h2>Welcome to Anor Avenue Hotel</h2>
        <p>Comfortable rooms, thoughtful service and a central location in Tashkent.</p>
      </section>
      <section className="grid" aria-label="Available rooms">
        {roomsData.map(r => <RoomCard key={r.id} room={r} />)}
      </section>
    </div>
  );
}
