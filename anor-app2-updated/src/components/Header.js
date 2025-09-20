import React from 'react';
import { Link } from 'react-router-dom';

function LogoSVG(){
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect width="24" height="24" rx="6" fill="url(#g)"/>
      <defs>
        <linearGradient id="g" x1="0" x2="1">
          <stop offset="0" stopColor="#8b0f12"/>
          <stop offset="1" stopColor="#b22222"/>
        </linearGradient>
      </defs>
      <g transform="translate(4,4)" fill="white" opacity="0.95">
        <circle cx="4" cy="4" r="1.1"></circle>
        <circle cx="8" cy="6" r="1.1"></circle>
        <path d="M2 9c1.6-2 5-3 7 0 2 3 0 4.2 0 4.2" stroke="white" strokeWidth="0.6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
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
        <a href="#contact" className="cta">Contact</a>
      </nav>
    </header>
  );
}
