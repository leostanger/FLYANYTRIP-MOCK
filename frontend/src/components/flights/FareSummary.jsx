/**
 * ============================================================================
 * PATH: client/src/pages/flights/booking/components/FareSummary.jsx
 * DESCRIPTION: Fare breakdown card with live coupon discount updates.
 * ============================================================================
 */

import React from "react";
import { Tag } from "lucide-react";

export default function FareSummary({ basePrice, taxes, additionalAmount, totalAmount, couponCode, couponDiscount, couponApplied }) {
  const hasCoupon = couponApplied || (couponDiscount && couponDiscount > 0);

  return (
    <div className="w-full bg-white border border-[#eaeaea] rounded-[13.88px] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] font-['Quicksand'] select-none text-left">

      {/* Title */}
      <h3 className="font-['Satoshi'] font-bold text-[18px] text-[#1A1A1A]">Fare Summary</h3>
      <p className="font-['Quicksand'] text-[12px] text-[#999999] font-medium mt-0.5 mb-5">
        Live-updating fare details
      </p>

      {/* Line Items */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-['Quicksand'] text-[14px] font-medium text-[#444444]">Base Fare</span>
          <span className="font-['Satoshi'] font-bold text-[14.5px] text-[#1A1A1A] tracking-[0.5px]">
            ₹{basePrice.toLocaleString("en-IN")}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-['Quicksand'] text-[14px] font-medium text-[#444444]">Taxes &amp; Fees</span>
          <span className="font-['Satoshi'] font-bold text-[14.5px] text-[#1A1A1A] tracking-[0.5px]">
            ₹{taxes.toLocaleString("en-IN")}
          </span>
        </div>

        {additionalAmount > 0 && (
          <div className="flex items-center justify-between">
            <span className="font-['Quicksand'] text-[14px] font-medium text-[#444444]">Add-on Services</span>
            <span className="font-['Satoshi'] font-bold text-[14.5px] text-[#1A1A1A] tracking-[0.5px]">
              +₹{additionalAmount.toLocaleString("en-IN")}
            </span>
          </div>
        )}

        {hasCoupon && (
          <div className="flex items-center justify-between text-emerald-600 bg-emerald-50/60 px-2.5 py-1.5 rounded-lg border border-emerald-100">
            <span className="font-['Quicksand'] text-[13px] font-bold flex items-center gap-1.5">
              <Tag size={13} className="text-emerald-600" />
              <span>Coupon ({couponCode || "Applied"})</span>
            </span>
            <span className="font-['Satoshi'] font-bold text-[14px] tracking-[0.5px]">
              −₹{couponDiscount.toLocaleString("en-IN")}
            </span>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-[#EFEFEF] mt-4 pt-4 flex items-center justify-between">
        <span className="font-['Satoshi'] font-bold text-[17px] text-[#1A1A1A]">Total</span>
        <span className="font-['Satoshi'] font-bold text-[22px] text-[#1A1A1A] tracking-[0.8px]">
          ₹{totalAmount.toLocaleString("en-IN")}
        </span>
      </div>

    </div>
  );
}
