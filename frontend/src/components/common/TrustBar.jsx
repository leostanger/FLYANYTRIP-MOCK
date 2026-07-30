import React from 'react';
import { 
  SupportIcon, 
  SecurePaymentsIcon, 
  BestPriceIcon, 
  InstantConfirmationIcon, 
  HappyTravellersIcon 
} from '../common/Icons';

const TrustBar = () => {
  const features = [
    { 
      icon: SupportIcon, 
      text: "24/7 Customer Support", 
      width: '18.66px', 
      height: '18.65px' 
    },
    { 
      icon: SecurePaymentsIcon, 
      text: "100% Secure Payments", 
      width: '18.54px', 
      height: '18.52px' 
    },
    { 
      icon: BestPriceIcon, 
      text: "Best Price Guarantee", 
      width: '18.54px', 
      height: '18.52px' 
    },
    { 
      icon: InstantConfirmationIcon, 
      text: "Instant Confirmation", 
      width: '18.54px', 
      height: '18.52px' 
    },
    { 
      icon: HappyTravellersIcon, 
      text: "5M+ Happy Travellers", 
      width: '16.36px', 
      height: '15.63px' 
    },
  ];

  return (
    <div 
      className="text-white h-[60px] w-full flex items-center justify-center select-none"
      style={{ background: 'linear-gradient(-89.5deg, #ff2d1a 0%, #991b10 100%)' }}
    >
      <div className="container mx-auto px-4 max-w-[1400px] flex flex-wrap justify-between items-center gap-4">
        {features.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="flex items-center gap-[9px]">
              <Icon 
                className="text-white shrink-0" 
                style={{ width: item.width, height: item.height }} 
              />
              <span className="text-[18.945px] font-medium font-satoshi tracking-wide leading-none whitespace-nowrap">
                {item.text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrustBar;
