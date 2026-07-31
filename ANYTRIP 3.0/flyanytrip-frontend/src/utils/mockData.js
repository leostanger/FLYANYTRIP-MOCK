/*
 * Flyanytrip
 * Authors: Gaurav Thakur, Milan Pandavadara
 *
 * This file contains centralized mock data for the application.
 * It includes lists of airports, destinations, activities, and testimonials
 * used for development and demonstration purposes.
 */

// Airports removed as they are now fetched from Adivaha API

export const tourDestinations = ['Thailand', 'Vietnam', 'Dubai', 'Singapore', 'India', 'Oman', 'Bali'];
export const visaDestinations = ['Thailand', 'Vietnam', 'Dubai', 'Singapore', 'Oman', 'Bali'];
export const activityDestinations = ['Thailand', 'Vietnam', 'Dubai', 'Singapore', 'Vadodara', 'Oman', 'Bali'];

export const allActivities = [
  // Thailand
  {
    id: 1, type: 'activity', name: 'Floating Market & Railway Track Tour', city: 'Thailand', price: '3,800', rating: 4.8, tag: 'Cultural Experience',
    desc: 'Visit the famous Maeklong Railway Market and Damnoen Saduak Floating Market.',
    img: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 8, type: 'activity', name: 'Phi Phi Islands Speedboat Tour', city: 'Thailand', price: '4,500', rating: 4.9, tag: 'Nature & Adventure',
    desc: 'Explore the stunning Maya Bay, Monkey Beach, and snorkel in crystal-clear waters.',
    img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop'
  },
  // Vietnam
  {
    id: 2, type: 'activity', name: 'Ha Long Bay Luxury Day Cruise', city: 'Vietnam', price: '5,500', rating: 4.9, tag: 'Nature & Adventure',
    desc: 'Sail through the iconic limestone karsts of Ha Long Bay with a seafood lunch included.',
    img: 'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 9, type: 'activity', name: 'Cu Chi Tunnels Half-Day Tour', city: 'Vietnam', price: '1,800', rating: 4.7, tag: 'History',
    desc: 'Discover the vast underground network used during the Vietnam War.',
    img: 'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1000&auto=format&fit=crop'
  },
  // Dubai
  {
    id: 3, type: 'activity', name: 'Burj Khalifa At The Top (Levels 124 & 125)', city: 'Dubai', price: '3,200', rating: 4.7, tag: 'Must Visit',
    desc: 'Witness breathtaking views of Dubai from the world\'s tallest building.',
    img: 'https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 10, type: 'activity', name: 'Premium Red Dunes Camel Safari', city: 'Dubai', price: '4,500', rating: 4.8, tag: 'Adventure',
    desc: 'Experience dune bashing, camel riding, and a traditional BBQ dinner in the desert.',
    img: 'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?q=80&w=1000&auto=format&fit=crop'
  },
  // Vadodara
  {
    id: 4, type: 'activity', name: 'Laxmi Vilas Palace Heritage Tour', city: 'Vadodara', price: '1,200', rating: 4.9, tag: 'History',
    desc: 'Explore the grand architecture and royal history of the world\'s largest private residence.',
    img: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 11, type: 'activity', name: 'Statue of Unity Day Trip', city: 'Vadodara', price: '2,500', rating: 4.9, tag: 'Culture & Sightseeing',
    desc: 'Visit the world\'s tallest statue dedicated to the Iron Man of India, Sardar Vallabhbhai Patel.',
    img: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?q=80&w=1000&auto=format&fit=crop'
  },
  // Singapore
  {
    id: 5, type: 'activity', name: 'Gardens by the Bay Entry Ticket', city: 'Singapore', price: '2,100', rating: 4.8, tag: 'Nature',
    desc: 'Wander through the futuristic Supertrees and the stunning Cloud Forest conservatory.',
    img: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 12, type: 'activity', name: 'Universal Studios Singapore', city: 'Singapore', price: '5,800', rating: 4.8, tag: 'Theme Park',
    desc: 'Experience cutting-edge rides, shows, and attractions based on your favorite blockbuster films.',
    img: 'https://images.unsplash.com/photo-1554284126-aa88f22d8b74?q=80&w=1000&auto=format&fit=crop'
  },
  // Oman
  {
    id: 6, type: 'activity', name: 'Wadi Shab & Bimmah Sinkhole Tour', city: 'Oman', price: '6,200', rating: 4.8, tag: 'Adventure',
    desc: 'Hike through breathtaking wadis and swim in the emerald waters of Bimmah Sinkhole.',
    img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 13, type: 'activity', name: 'Wahiba Sands Desert Safari', city: 'Oman', price: '7,500', rating: 4.9, tag: 'Adventure',
    desc: 'Explore the rolling sand dunes of Wahiba Sands followed by a dip in Wadi Bani Khalid.',
    img: 'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?q=80&w=1000&auto=format&fit=crop'
  },
  // Bali
  {
    id: 7, type: 'activity', name: 'Ubud Monkey Forest & Swing', city: 'Bali', price: '2,800', rating: 4.7, tag: 'Culture & Nature',
    desc: 'Interact with macaques in lush forests and experience the iconic Bali jungle swing.',
    img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 14, type: 'activity', name: 'Mount Batur Sunrise Trek', city: 'Bali', price: '3,500', rating: 4.8, tag: 'Adventure',
    desc: 'Hike an active volcano under the stars and witness a breathtaking sunrise from the summit.',
    img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1000&auto=format&fit=crop'
  }
];

export const trendingDestinations = [
  { name: 'Vietnam', price: '48,000', img: '/assets/destinations/vietnam.png' },
  { name: 'Bali', price: '42,500', img: '/assets/destinations/bali.png' },
  { name: 'Oman', price: '85,000', img: '/assets/destinations/oman.png' },
  { name: 'Thailand', price: '38,900', img: '/assets/destinations/thailand.png' },
  { name: 'Singapore', price: '52,000', img: '/assets/destinations/singapore.png' }
];

export const popularActivities = [
  { name: 'Heritage Walk', city: 'Vadodara', price: '1,200', tag: 'Cultural', img: '/assets/activities/vadodara.png' },
  { name: 'Desert Safari', city: 'Dubai', price: '4,500', tag: 'Adventure', img: '/assets/activities/dubai.png' },
  { name: 'Island Hopping', city: 'Thailand', price: '3,800', tag: 'Leisure', img: '/assets/activities/island_hopping.png' },
  { name: 'Skydeck Views', city: 'Singapore', price: '2,900', tag: 'Must Visit', img: '/assets/activities/skydeck.png' }
];

export const testimonials = [
  { name: "Ananya Sharma", role: "Software Engineer, Google", text: "FlyAnyTrip made my international work trip completely seamless. From visas to flights, they handled everything with absolute professional precision.", rating: 5 },
  { name: "Rahul Malhotra", role: "CEO, TechSphere", text: "The corporate travel services are unmatched. They understand the value of time and provide a level of service that is truly premium.", rating: 5 },
  { name: "Priya Patel", role: "Travel Enthusiast", text: "I've used many platforms, but the curated tours here are something else. They find those hidden gems that make every trip truly unforgettable.", rating: 4.9 }
];

export const partners = [
  { name: "AIR INDIA", logo: "/assets/airlines/AI.png" },
  { name: "LUFTHANSA", logo: "/assets/airlines/LH.png" },
  { name: "SINGAPORE AIRLINES", logo: "/assets/airlines/SQ.png" },
  { name: "UNITED", logo: "/assets/airlines/UA.png" },
  { name: "EMIRATES", logo: "/assets/airlines/EK.png" },
  { name: "VISTARA", logo: "/assets/airlines/UK.png" },
  { name: "SWISS", logo: "/assets/airlines/LX.png" },
  { name: "THAI AIRWAYS", logo: "/assets/airlines/TG.png" },
  { name: "TURKISH", logo: "/assets/airlines/TK.png" },
  { name: "AIR CANADA", logo: "/assets/airlines/AC.png" },
  { name: "ANA", logo: "/assets/airlines/NH.png" },
  { name: "STAR ALLIANCE", logo: "/assets/airlines/AI.png" }
];
