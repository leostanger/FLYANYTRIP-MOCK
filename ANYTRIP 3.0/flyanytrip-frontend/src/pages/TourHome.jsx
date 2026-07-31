import React, { useEffect } from 'react';
import Home from './Home';
import { useSearchContext } from '../context/SearchContext';

const TourHome = () => {
  const { setActiveTab } = useSearchContext();
  
  useEffect(() => {
    setActiveTab('tours');
  }, [setActiveTab]);

  return <Home />;
};

export default TourHome;
