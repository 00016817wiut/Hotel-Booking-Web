import React, { useState, useRef, useEffect } from 'react';

export default function Carousel({images}){
  const [index, setIndex] = useState(0);
  const len = images ? images.length : 0;
  const startX = useRef(null);

  useEffect(()=>{
    setIndex(0);
  }, [images]);

  const prev = ()=> setIndex(i => (i-1+len)%len);
  const next = ()=> setIndex(i => (i+1)%len);

  const onTouchStart = (e)=>{
    startX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e)=>{
    if(startX.current === null) return;
    const dx = e.changedTouches[0].clientX - startX.current;
    if(Math.abs(dx) > 40){
      if(dx < 0) next(); else prev();
    }
    startX.current = null;
  };

  if(!images || len===0) return null;
  return (
    <div style={{position:'relative'}} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <img src={images[index]} alt={'Slide '+(index+1)} style={{width:'100%'}} />
      <div className="carousel-controls" aria-hidden>
        <button className="control-btn" onClick={prev} aria-label="Previous">‹</button>
        <div style={{display:'flex',gap:6,position:'absolute',left:'50%',transform:'translateX(-50%)',bottom:12}}>
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