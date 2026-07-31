/*
 * Flyanytrip
 * Authors: Gaurav Thakur, Milan Pandavadara
 *
 * Creates a shared "search state" that any component in the app can read.
 * Uses React Context so we don't have to pass props down through every level.
 */

import React, { createContext, useContext } from 'react';
import { useSearchState } from '../hooks/useSearchState';

// Create an empty context — it will be filled by SearchProvider
const SearchContext = createContext();

/**
 * Wraps the app (or part of it) and provides shared search state
 * to all child components via context.
 *
 * @param children - The child components that can access the context
 */
export const SearchProvider = ({ children }) => {
  // Get all search-related state and actions from the custom hook
  const searchState = useSearchState();

  return (
    <SearchContext.Provider value={searchState}>
      {children}
    </SearchContext.Provider>
  );
};

/**
 * Custom hook that any component can call to access shared search state.
 * Throws an error if used outside of a SearchProvider, which helps
 * catch mistakes early.
 *
 * @returns The full search state object (tabs, airports, dates, results, etc.)
 */
export const useSearchContext = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearchContext must be used within a SearchProvider');
  }
  return context;
};
