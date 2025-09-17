import React from 'react';

const GeographyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 0 1-9-9 9 9 0 0 1 9-9 9 9 0 0 1 9 9 9 9 0 0 1-9 9Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 21a9 9 0 0 0 0-18m6 18a9 9 0 0 1 0-18M2.475 15H21.525" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.475 9h19.05" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c-1.933 0-3.5 4.03-3.5 9s1.567 9 3.5 9 3.5-4.03 3.5-9-1.567-9-3.5-9Z" />
  </svg>
);

export default GeographyIcon;