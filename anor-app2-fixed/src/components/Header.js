import React from 'react';
import { Link } from 'react-router-dom';

function LogoSVG(){
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="10" fill="#8b0f12"/>
      <path d="M8.5 9.5c1-1 3.5-2 5.5 0 2 2 1.5 4 0 5.5" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.95"/>
      <g fill="#fff" opacity="0.95">
        <circle cx="9" cy="8" r="0.9"></circle>
        <circle cx="15" cy="10" r="0.9"></circle>
      </g>
    </svg>
  );
}

export default function Header(){
  return (
    <header className="header">
      <div className="brand">
        <div className="logo"><LogoSVG/></div>
        <div>
          <h1 style={{margin:0}}>Anor Avenue</h1>
          <div style={{fontSize:12,color:'#777'}}>Boutique Hotel</div>
        </div>
      </div>
      <nav className="nav" aria-label="Main navigation">
        <Link to="/">Rooms</Link>
        <a href="#about">About</a>
        <Link to="/" className="cta">Book now</Link>
      </nav>
    </header>
  );
}
