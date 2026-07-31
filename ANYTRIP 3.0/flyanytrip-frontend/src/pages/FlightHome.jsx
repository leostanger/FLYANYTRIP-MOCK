import React, { useEffect } from 'react';
import Home from './Home';
import { useSearchContext } from '../context/SearchContext';

const FlightHome = () => {
  const { setActiveTab } = useSearchContext();
  
  useEffect(() => {
    setActiveTab('flights');
  }, [setActiveTab]);

  return <Home />;
};

export default FlightHome;
