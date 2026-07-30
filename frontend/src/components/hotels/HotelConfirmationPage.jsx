import React from 'react';
import { Check, Copy, Mail, MapPin, Building2, Eye, Star, Calendar, LogOut, Clock, Users, Coffee, XCircle, FileText, Navigation, Phone, StarHalf, CreditCard } from 'lucide-react';
import TopBar from '../common/TopBar';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';

export default function HotelConfirmationPage({ booking, onClose }) {
  if (!booking) return null;

  const formatDateDisplay = (date) => {
    const d = new Date(date);
    const day = d.getDate();
    const month = d.toLocaleString('default', { month: 'short' });
    const year = d.getFullYear();
    const weekday = d.toLocaleString('default', { weekday: 'long' });
    return `${day} ${month} ${year} (${weekday})`;
  };

  const {
    name = "Taj Exotica Resort & Spa",
    location = "Benaulim Beach, South Goa",
    image = "https://images.unsplash.com/photo-1542314831-c6a4d1407e34?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    rating = 5.0,
    bookingDetails = {},
    finalPrice = 62160,
    price = 18500,
    taxes = 6660,
    paymentMethod = "HDFC Credit Card · XXXX 4521"
  } = booking;

  // Use values from booking or fallback to static data matching the design
  const nights = bookingDetails.nightsCount || 3;
  const guests = bookingDetails.guestsCount || 2;
  const checkinDate = bookingDetails.checkinDate || new Date();
  const checkoutDate = bookingDetails.checkoutDate || new Date(new Date().setDate(new Date().getDate() + 3));

  const bookingId = "HTL-GOA-4821X";
  const transactionId = "TXN240220183015";

  return (
    <div className="bg-[#f5f5f5] min-h-screen w-full flex flex-col font-quicksand">
      <TopBar />
      <Navbar />

      <div className="flex-grow pt-8 pb-20">
        <div className="max-w-[1320px] mx-auto w-full px-4 lg:px-0">

          {/* Top Banner */}
          <div
            className="relative w-full h-[358px] rounded-[22.5px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] overflow-hidden flex flex-col items-center justify-center mb-[30px]"
            style={{ backgroundImage: "linear-gradient(165.577deg, rgb(0, 153, 102) 0%, rgb(0, 120, 111) 100%)" }}
          >
            <div className="absolute inset-0 opacity-20">
              <img alt="Hotel" className="w-full h-full object-cover" src={image || "https://images.unsplash.com/photo-1542314831-c6a4d1407e34?auto=format&fit=crop&q=80"} />
            </div>
            <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(165.597deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0) 100%)" }} />

            <div className="relative z-10 flex flex-col items-center w-full px-4">
              <div className="bg-white/20 border-2 border-white/40 rounded-full w-[75px] h-[75px] flex items-center justify-center mb-[15px]">
                <Check className="text-white w-10 h-10" strokeWidth={3} />
              </div>

              <h1 className="font-bold text-[33.75px] text-white mb-2 leading-[37.5px]">Hotel Confirmed!</h1>
              <p className="font-medium text-[15px] text-white/80 mb-6 leading-[22.5px]">Your room is reserved. Enjoy your stay!</p>

              <div className="bg-white/20 border border-white/30 rounded-[15px] flex items-center gap-[15px] px-[23.5px] py-[16px] mb-4">
                <div className="flex flex-col">
                  <span className="font-semibold text-[11.25px] text-white/70 leading-[15px]">Booking ID</span>
                  <span className="font-bold font-jetbrains text-[22.5px] text-white tracking-[2.25px] leading-[30px]">{bookingId}</span>
                </div>
                <button className="bg-white/20 border border-white/20 rounded-[13.375px] flex items-center gap-[5.625px] px-[12.25px] py-[8.5px] hover:bg-white/30 transition-colors cursor-pointer">
                  <Copy className="text-white w-3 h-3" />
                  <span className="font-bold text-[11.25px] text-white leading-[15px]">Copy</span>
                </button>
              </div>

              <p className="font-medium text-[11.25px] text-white/60 leading-[15px]">
                Confirmation sent to <span className="font-bold text-white">user@email.com</span>
              </p>
            </div>
          </div>

          {/* Content Layout */}
          <div className="flex flex-col lg:flex-row gap-[22.5px] w-full items-start">

            {/* Main Content (Left) */}
            <div className="flex-1 flex flex-col gap-[15px] w-full min-w-0">

              {/* Hotel Details */}
              <div className="bg-white border border-[#d0d0d0] rounded-[15px] p-[19.75px] w-full">
                <div className="flex items-center gap-[7.5px] mb-[15px]">
                  <div className="bg-[#e53935] rounded-[9.375px] w-[26.25px] h-[26.25px] flex items-center justify-center">
                    <Building2 className="text-white w-[13px] h-[13px]" />
                  </div>
                  <h3 className="font-satoshi font-bold text-[18px] text-[#1a1a1a] leading-[25px]">Hotel Details</h3>
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center justify-between py-[12px] border-b border-[#d0d0d0]">
                    <span className="font-semibold text-[#6b6b6b] text-[14px]">Property</span>
                    <span className="font-bold text-[#1a1a1a] text-[14px] text-right">{name}</span>
                  </div>
                  <div className="flex items-center justify-between py-[12px] border-b border-[#d0d0d0]">
                    <span className="font-semibold text-[#6b6b6b] text-[14px]">Location</span>
                    <span className="font-bold text-[#1a1a1a] text-[14px] text-right">{location}</span>
                  </div>
                  <div className="flex items-center justify-between py-[12px] border-b border-[#d0d0d0]">
                    <span className="font-semibold text-[#6b6b6b] text-[14px]">Room</span>
                    <span className="font-bold text-[#1a1a1a] text-[14px] text-right">Sea View Room (1 King Bed, 48 sqm)</span>
                  </div>
                  <div className="flex items-center justify-between py-[12px] border-b border-[#d0d0d0]">
                    <span className="font-semibold text-[#6b6b6b] text-[14px]">View</span>
                    <span className="font-bold text-[#1a1a1a] text-[14px] text-right">Arabian Sea View · Balcony</span>
                  </div>
                  <div className="flex items-center justify-between pt-[13px] pb-[5px]">
                    <span className="font-semibold text-[#6b6b6b] text-[14px]">Stars</span>
                    <span className="font-bold text-[#1a1a1a] text-[14px] text-right">★★★★★ Luxury Beach Resort</span>
                  </div>
                </div>
              </div>

              {/* Stay Details */}
              <div className="bg-white border border-[#d0d0d0] rounded-[15px] p-[19.75px] w-full">
                <div className="flex items-center gap-[7.5px] mb-[15px]">
                  <div className="bg-[#e53935] rounded-[9.375px] w-[26.25px] h-[26.25px] flex items-center justify-center">
                    <Calendar className="text-white w-[13px] h-[13px]" />
                  </div>
                  <h3 className="font-satoshi font-bold text-[18px] text-[#1a1a1a] leading-[25px]">Stay Details</h3>
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center justify-between py-[12px] border-b border-[#d0d0d0]">
                    <span className="font-semibold text-[#6b6b6b] text-[14px]">Check-in</span>
                    <span className="font-bold text-[#1a1a1a] text-[14px] text-right">{formatDateDisplay(checkinDate)} · From 2:00 PM</span>
                  </div>
                  <div className="flex items-center justify-between py-[12px] border-b border-[#d0d0d0]">
                    <span className="font-semibold text-[#6b6b6b] text-[14px]">Check-out</span>
                    <span className="font-bold text-[#1a1a1a] text-[14px] text-right">{formatDateDisplay(checkoutDate)} · By 11:00 AM</span>
                  </div>
                  <div className="flex items-center justify-between py-[12px] border-b border-[#d0d0d0]">
                    <span className="font-semibold text-[#6b6b6b] text-[14px]">Duration</span>
                    <span className="font-bold text-[#1a1a1a] text-[14px] text-right">{nights} Nights</span>
                  </div>
                  <div className="flex items-center justify-between py-[12px] border-b border-[#d0d0d0]">
                    <span className="font-semibold text-[#6b6b6b] text-[14px]">Guests</span>
                    <span className="font-bold text-[#1a1a1a] text-[14px] text-right">{guests} Adults</span>
                  </div>
                  <div className="flex items-center justify-between py-[12px] border-b border-[#d0d0d0]">
                    <span className="font-semibold text-[#6b6b6b] text-[14px]">Breakfast</span>
                    <span className="font-bold text-[#1a1a1a] text-[14px] text-right">Included (Continental)</span>
                  </div>
                  <div className="flex items-center justify-between pt-[13px] pb-[5px]">
                    <span className="font-semibold text-[#6b6b6b] text-[14px]">Cancellation</span>
                    <span className="font-bold text-[#1a1a1a] text-[14px] text-right">Free cancellation until 18 Dec 2024</span>
                  </div>
                </div>
              </div>

              {/* Payment Summary */}
              <div className="bg-white border border-[#d0d0d0] rounded-[15px] p-[19.75px] w-full">
                <div className="flex items-center gap-[7.5px] mb-[15px]">
                  <div className="bg-[#e53935] rounded-[9.375px] w-[26.25px] h-[26.25px] flex items-center justify-center">
                    <CreditCard className="text-white w-[13px] h-[13px]" />
                  </div>
                  <h3 className="font-satoshi font-bold text-[18px] text-[#1a1a1a] leading-[25px]">Payment Summary</h3>
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center justify-between py-[12px] border-b border-[#d0d0d0]">
                    <span className="font-semibold text-[#6b6b6b] text-[14px]">Room Rate</span>
                    <span className="font-bold text-[#1a1a1a] text-[14px] text-right">₹{price.toLocaleString('en-IN')} × {nights} nights</span>
                  </div>
                  <div className="flex items-center justify-between py-[12px] border-b border-[#d0d0d0]">
                    <span className="font-semibold text-[#6b6b6b] text-[14px]">GST & Taxes (12%)</span>
                    <span className="font-bold text-[#1a1a1a] text-[14px] text-right">₹{taxes.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex items-center justify-between py-[12px] border-b border-[#d0d0d0]">
                    <span className="font-semibold text-[#6b6b6b] text-[14px]">Total Paid</span>
                    <span className="font-bold text-[#1a1a1a] text-[14px] text-right">₹{finalPrice.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex items-center justify-between py-[12px] border-b border-[#d0d0d0]">
                    <span className="font-semibold text-[#6b6b6b] text-[14px]">Payment Method</span>
                    <span className="font-bold text-[#1a1a1a] text-[14px] text-right">{paymentMethod}</span>
                  </div>
                  <div className="flex items-center justify-between pt-[13px] pb-[5px]">
                    <span className="font-semibold text-[#6b6b6b] text-[14px]">Transaction ID</span>
                    <span className="font-bold text-[#1a1a1a] text-[14px] text-right">{transactionId}</span>
                  </div>
                </div>
              </div>

              {/* Refund Status */}
              <div className="bg-white border border-[#d0d0d0] border-dashed rounded-[15px] p-[19.75px] w-full flex flex-col gap-[16px]">
                <div className="flex items-center gap-[7.5px]">
                  <Clock className="w-[14px] h-[14px] text-[#1a1a1a]" />
                  <h3 className="font-satoshi font-bold text-[16.875px] text-[#1a1a1a] leading-[25px]">Refund Status (Post-Cancellation)</h3>
                </div>

                <div className="flex items-center gap-[11px] pt-[11.25px] w-full">

                  {/* Step 1 */}
                  <div className="flex items-center gap-[7.5px]">
                    <div className="flex flex-col gap-[4px] items-center">
                      <div className="bg-[#e53935] border-2 border-[#e53935] rounded-full w-[30px] h-[30px] flex items-center justify-center">
                        <Check className="text-white w-4 h-4" />
                      </div>
                      <span className="font-semibold text-[11.25px] text-[#6b6b6b] text-center w-[75px] mt-[3.75px] leading-[15px]">Cancellation Requested</span>
                    </div>
                    <div className="h-[1px] w-[22.5px] bg-[#d0d0d0] mb-[18.75px]"></div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex items-center gap-[7.5px]">
                    <div className="flex flex-col gap-[4px] items-center">
                      <div className="bg-white border-2 border-[#d0d0d0] rounded-full w-[30px] h-[30px] flex items-center justify-center">
                        <span className="font-medium text-[11.25px] text-[#6b6b6b] leading-[15px]">2</span>
                      </div>
                      <span className="font-semibold text-[11.25px] text-[#6b6b6b] text-center w-[75px] mt-[3.75px] leading-[15px]">Provider Confirmation</span>
                    </div>
                    <div className="h-[1px] w-[22.5px] bg-[#d0d0d0] mb-[18.75px]"></div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex items-center gap-[7.5px]">
                    <div className="flex flex-col gap-[4px] items-center">
                      <div className="bg-white border-2 border-[#d0d0d0] rounded-full w-[30px] h-[30px] flex items-center justify-center">
                        <span className="font-medium text-[11.25px] text-[#6b6b6b] leading-[15px]">3</span>
                      </div>
                      <span className="font-semibold text-[11.25px] text-[#6b6b6b] text-center w-[75px] mt-[3.75px] leading-[15px]">Refund Initiated</span>
                    </div>
                    <div className="h-[1px] w-[22.5px] bg-[#d0d0d0] mb-[18.75px]"></div>
                  </div>

                  {/* Step 4 */}
                  <div className="flex flex-col gap-[4px] items-center">
                    <div className="bg-white border-2 border-[#d0d0d0] rounded-full w-[30px] h-[30px] flex items-center justify-center">
                      <span className="font-medium text-[11.25px] text-[#6b6b6b] leading-[15px]">4</span>
                    </div>
                    <span className="font-semibold text-[11.25px] text-[#6b6b6b] text-center w-[75px] mt-[3.75px] leading-[15px]">Refund Credited</span>
                  </div>

                </div>

                {/* Refund Info Cards */}
                <div className="flex gap-[11px] w-full pt-[15px] mt-[15px]">
                  <div className="border border-[#d0d0d0] rounded-[13.375px] px-[12.25px] py-[8.5px] flex-1 flex flex-col gap-[4px]">
                    <span className="font-medium text-[11.25px] text-[#6b6b6b] leading-[15px]">Refund Amount</span>
                    <span className="font-bold text-[13.125px] text-[#1a1a1a] leading-[18.75px]">₹0 (not requested)</span>
                  </div>
                  <div className="border border-[#d0d0d0] rounded-[13.375px] px-[12.25px] py-[8.5px] flex-1 flex flex-col gap-[4px]">
                    <span className="font-medium text-[11.25px] text-[#6b6b6b] leading-[15px]">Refund to</span>
                    <span className="font-bold text-[13.125px] text-[#1a1a1a] leading-[18.75px]">Original payment method</span>
                  </div>
                  <div className="border border-[#d0d0d0] rounded-[13.375px] px-[12.25px] py-[8.5px] flex-1 flex flex-col gap-[4px]">
                    <span className="font-medium text-[11.25px] text-[#6b6b6b] leading-[15px]">Expected by</span>
                    <span className="font-bold text-[13.125px] text-[#1a1a1a] leading-[18.75px]">5–7 business days</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Sidebar (Right) */}
            <div className="w-[270px] flex flex-col gap-[15px] shrink-0">

              {/* Booking Actions */}
              <div className="bg-white border border-[#d0d0d0] rounded-[15px] p-[19.75px]">
                <h4 className="font-satoshi font-bold text-[15px] text-[#1a1a1a] leading-[22.5px] mb-[15px]">Booking Actions</h4>
                <div className="flex flex-col gap-[7.5px]">
                  <button className="bg-gradient-to-r from-[#009966] to-[#00786f] shadow-[0px_4px_3px_rgba(0,0,0,0.1),0px_2px_2px_rgba(0,0,0,0.1)] rounded-[13.375px] w-full py-[11.25px] flex items-center justify-center gap-[7.5px] hover:opacity-90 transition-opacity cursor-pointer">
                    <FileText className="text-white w-[14px] h-[14px]" />
                    <span className="font-bold text-[13.125px] text-white leading-[18.75px]">Download Voucher</span>
                  </button>
                  <button className="border border-[#d0d0d0] rounded-[13.375px] w-full py-[10.375px] flex items-center justify-center gap-[7.5px] hover:bg-gray-50 transition-colors cursor-pointer">
                    <Mail className="text-[#1a1a1a] w-[13px] h-[13px]" />
                    <span className="font-bold text-[13.125px] text-[#1a1a1a] leading-[18.75px]">Email Confirmation</span>
                  </button>
                  <button className="border border-[#d0d0d0] rounded-[13.375px] w-full py-[10.375px] flex items-center justify-center gap-[7.5px] hover:bg-gray-50 transition-colors cursor-pointer">
                    <Navigation className="text-[#1a1a1a] w-[13px] h-[13px]" />
                    <span className="font-bold text-[13.125px] text-[#1a1a1a] leading-[18.75px]">Get Directions</span>
                  </button>
                  <button className="border border-[#d0d0d0] rounded-[13.375px] w-full py-[10.375px] flex items-center justify-center gap-[7.5px] hover:bg-gray-50 transition-colors cursor-pointer">
                    <Phone className="text-[#1a1a1a] w-[13px] h-[13px]" />
                    <span className="font-bold text-[13.125px] text-[#1a1a1a] leading-[18.75px]">Contact Hotel</span>
                  </button>
                  {/* Back to Home Action */}
                  <button
                    onClick={onClose}
                    className="mt-2 border border-[#d0d0d0] bg-gray-100 rounded-[13.375px] w-full py-[10.375px] flex items-center justify-center gap-[7.5px] hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    <LogOut className="text-[#1a1a1a] w-[13px] h-[13px]" />
                    <span className="font-bold text-[13.125px] text-[#1a1a1a] leading-[18.75px]">Back to Home</span>
                  </button>
                </div>
              </div>

              {/* Enjoyed FlyAnyTrip? */}
              <div className="bg-white border border-[#d0d0d0] rounded-[15px] p-[16px] flex flex-col items-center justify-center text-center">
                <p className="font-bold text-[11.25px] text-[#1a1a1a] leading-[15px] mb-[3.75px]">Enjoyed FlyAnyTrip?</p>
                <div className="flex gap-[3.75px] py-[3.75px] mb-[5px]">
                  <Star className="text-yellow-400 fill-yellow-400 w-[18px] h-[18px]" />
                  <Star className="text-yellow-400 fill-yellow-400 w-[18px] h-[18px]" />
                  <Star className="text-yellow-400 fill-yellow-400 w-[18px] h-[18px]" />
                  <Star className="text-yellow-400 fill-yellow-400 w-[18px] h-[18px]" />
                  <StarHalf className="text-yellow-400 fill-yellow-400 w-[18px] h-[18px]" />
                </div>
                <button className="text-[#e0e0e0] hover:text-gray-400 transition-colors font-bold text-[11.25px] leading-[15px] cursor-pointer bg-transparent border-none">
                  Rate your experience
                </button>
              </div>

              {/* Need help? */}
              <div className="bg-white border border-[#d0d0d0] rounded-[15px] p-[16px]">
                <p className="font-bold text-[11.25px] text-[#1a1a1a] leading-[15px]">Need help?</p>
                <p className="font-medium text-[11.25px] text-[#6b6b6b] leading-[15px] mt-[3.75px] mb-[11.25px]">Our support team is available 24/7</p>
                <button className="border border-[#d0d0d0] rounded-[13.375px] w-full py-[8.5px] flex items-center justify-center gap-[5.625px] hover:bg-gray-50 transition-colors cursor-pointer">
                  <Phone className="text-[#1a1a1a] w-[13px] h-[13px]" />
                  <span className="font-bold text-[13.125px] text-[#1a1a1a] leading-[18.75px]">Contact Support</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
