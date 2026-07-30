import appStoreImg from '../../assets/Mobile phone/App store.svg';
import playStoreImg from '../../assets/Mobile phone/Playstore.svg';
import mobileImg from '../../assets/mobile.png';

const AppDownloadBanner = () => {
  return (
    <section className="py-12 bg-white w-full overflow-hidden isolate">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
        <div
          className="w-full flex flex-col lg:flex-row items-center justify-between overflow-hidden"
          style={{
            padding: '32px',
            borderRadius: '15px',
            border: '1px solid #D0D0D0',
            background: '#FFF',
          }}
        >
          {/* Left Content */}
          <div className="flex flex-col items-start max-w-[480px]">
            <h2 className="font-satoshi font-extrabold text-[#1a1a1a] text-[22px] leading-tight tracking-tight mb-2 whitespace-nowrap">
              Plan Better, Travel Smarter
            </h2>
            <p className="font-satoshi font-normal text-[#888] text-[13px] leading-relaxed mb-6 max-w-[380px]">
              Download the FlyAnyTrip app for exclusive app-only deals,<br />
              1-tap bookings, and offline access to all your tickets.
            </p>

            {/* Store Buttons */}
            <div className="flex flex-row gap-4">
              <a
                href="https://apps.apple.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform hover:scale-[1.03] active:scale-95 duration-200 block"
              >
                <img
                  src={appStoreImg}
                  alt="Download on the App Store"
                  className="h-10 w-auto object-contain block"
                />
              </a>

              <a
                href="https://play.google.com/store/apps?hl=en_IN"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform hover:scale-[1.03] active:scale-95 duration-200 block"
              >
                <img
                  src={playStoreImg}
                  alt="Get it on Google Play"
                  className="h-10 w-auto object-contain block"
                />
              </a>
            </div>
          </div>

          {/* Right — Phone Image */}
          <div className="hidden lg:flex items-center justify-end flex-shrink-0 self-stretch overflow-hidden">
            <img
              src={mobileImg}
              alt="FlyAnyTrip App"
              className="h-full max-h-[200px] w-auto object-contain"
              draggable={false}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppDownloadBanner;
