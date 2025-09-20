import React, { useState } from 'react';

export default function Carousel({images}){
  const [index, setIndex] = useState(0);
  const prev = ()=> setIndex(i => (i-1+images.length)%images.length);
  const next = ()=> setIndex(i => (i+1)%images.length);
  return (
    <div style={{position:'relative'}}>
      <img src={images[index]} alt={'Slide '+(index+1)} />
      <div className="carousel-controls" aria-hidden>
        <button className="control-btn" onClick={prev} aria-label="Previous">‹</button>
        <div style={{display:'flex',gap:6,position:'absolute',left:'50%',transform:'translateX(-50%)',bottom:10}}>
          {images.map((_,i)=>(
            <button key={i} onClick={()=>setIndex(i)} style={{
              width:10,height:10,borderRadius:999,border:'none',background:i===index?'var(--brand)':'rgba(255,255,255,0.8)'
            }} aria-label={'Go to slide '+(i+1)} />
          ))}
        </div>
        <button className="control-btn" onClick={next} aria-label="Next">›</button>
      </div>
    </div>
  );
}
