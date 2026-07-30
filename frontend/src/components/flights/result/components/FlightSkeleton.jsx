import React from "react";

export default function FlightSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4].map((index) => (
        <div
          key={index}
          className="w-full bg-white border border-[#eaeaea] border-[1.157px] rounded-[13.88px] p-5 md:px-[23.13px] md:py-[20px] shadow-[0_2px_12px_rgba(0,0,0,0.02)] animate-pulse"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 md:gap-4">
            {/* 1. Airline Logo & Code Skeleton */}
            <div className="flex items-center gap-3.5 min-w-[180px]">
              <div className="w-[42px] h-[42px] rounded-lg bg-gray-200 flex-shrink-0" />
              <div className="space-y-2">
                <div className="w-28 h-4 bg-gray-200 rounded" />
                <div className="w-16 h-3 bg-gray-100 rounded" />
              </div>
            </div>

            {/* 2. Departure Skeleton */}
            <div className="flex flex-col items-center min-w-[70px] space-y-1.5">
              <div className="w-16 h-6 bg-gray-200 rounded" />
              <div className="w-10 h-3 bg-gray-100 rounded" />
            </div>

            {/* 3. Duration Line Skeleton */}
            <div className="flex-grow max-w-xs w-full flex flex-col items-center space-y-2 px-2">
              <div className="w-16 h-3 bg-gray-100 rounded" />
              <div className="w-full h-[2px] bg-gray-200 rounded-full relative my-1 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
              </div>
              <div className="w-16 h-3 bg-gray-100 rounded" />
            </div>

            {/* 4. Arrival Skeleton */}
            <div className="flex flex-col items-center min-w-[70px] space-y-1.5">
              <div className="w-16 h-6 bg-gray-200 rounded" />
              <div className="w-10 h-3 bg-gray-100 rounded" />
            </div>

            {/* 5. Price & CTA Skeleton */}
            <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-3 min-w-[130px]">
              <div className="space-y-1 text-right">
                <div className="w-20 h-6 bg-gray-200 rounded" />
                <div className="w-12 h-3 bg-gray-100 rounded ml-auto" />
              </div>
              <div className="w-24 h-9 bg-gray-200 rounded-xl" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
