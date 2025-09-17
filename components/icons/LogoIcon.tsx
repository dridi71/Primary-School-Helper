import React from 'react';

const LogoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" {...props}>
    <g fill="currentColor">
      {/* Book cover */}
      <path d="M50,15 C20,15 10,25 10,50 C10,75 20,85 50,85 L50,15 Z" />
      <path d="M50,15 C80,15 90,25 90,50 C90,75 80,85 50,85 L50,15 Z" />
      {/* Book pages */}
      <path d="M50,20 C25,20 15,30 15,50 C15,70 25,80 50,80 L50,20 Z" fill="#fff" stroke="currentColor" strokeWidth="2"/>
      <path d="M50,20 C75,20 85,30 85,50 C85,70 75,80 50,80 L50,20 Z" fill="#fff" stroke="currentColor" strokeWidth="2"/>
      {/* Smile */}
      <path d="M35,60 Q50,70 65,60" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      {/* Eyes */}
      <circle cx="40" cy="50" r="3" fill="currentColor" />
      <circle cx="60" cy="50" r="3" fill="currentColor" />
    </g>
  </svg>
);

export default LogoIcon;
