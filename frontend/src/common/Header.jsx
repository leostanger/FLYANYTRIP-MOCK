import React from "react";
import TopBar from '../components/common/TopBar';
import Navbar from '../components/common/Navbar';

export default function Header() {
  return (
    <header className="w-full border-b border-gray-200 bg-white sticky top-0 z-50 shadow-xs">
      <TopBar />
      <Navbar />
    </header>
  );
}
