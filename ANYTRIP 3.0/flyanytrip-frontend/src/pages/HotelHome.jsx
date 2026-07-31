import React, { useEffect } from 'react';
import Home from './Home';
import { useSearchContext } from '../context/SearchContext';

const HotelHome = () => {
  const { setActiveTab } = useSearchContext();
  
  useEffect(() => {
    setActiveTab('hotels');
  }, [setActiveTab]);

  return <Home />;
};

export default HotelHome;
