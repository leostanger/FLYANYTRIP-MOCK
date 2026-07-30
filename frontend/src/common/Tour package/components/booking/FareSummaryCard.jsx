export default function FareSummaryCard({
  pkg,
  adults = 1,
  price = 0,
  selectedMeal = null,
  selectedAddOns = [],
  insuranceSelected = false,
  insurancePrice = 149,
  appliedCoupon = null
}) {
  const baseSubtotal = price * adults
  const mealSubtotal = selectedMeal && selectedMeal.price ? selectedMeal.price * adults : 0
  const addOnsSubtotal = selectedAddOns.reduce((acc, item) => acc + item.price, 0)
  const insuranceSubtotal = insuranceSelected ? insurancePrice * adults : 0

  const totalSubtotal = baseSubtotal + mealSubtotal + addOnsSubtotal + insuranceSubtotal
  const gst = Math.round(totalSubtotal * 0.05)
  const savings = (pkg?.originalPrice && price ? (pkg.originalPrice - price) * adults : 10002)
  const totalBeforeDiscount = totalSubtotal + gst
  const couponDiscount = appliedCoupon && appliedCoupon.discount ? appliedCoupon.discount : 0
  const total = Math.max(0, totalBeforeDiscount - couponDiscount)

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-4 shadow-sm">
      <h3 className="font-bold text-gray-900 text-base mb-4 pb-3 border-b border-gray-100">Fare Summary</h3>
      <div className="flex flex-col gap-3 text-sm">
        {/* Base Price */}
        <div className="flex justify-between items-center text-gray-600">
          <span>₹{price.toLocaleString('en-IN')} × {adults}</span>
          <span className="font-semibold text-gray-900">₹{baseSubtotal.toLocaleString('en-IN')}</span>
        </div>

        {/* Meal Preference */}
        {selectedMeal && selectedMeal.price > 0 && (
          <div className="flex justify-between items-center text-gray-600">
            <span>Meal ({selectedMeal.label}) × {adults}</span>
            <span className="font-semibold text-gray-900">+₹{mealSubtotal.toLocaleString('en-IN')}</span>
          </div>
        )}

        {/* Add-on Services */}
        {selectedAddOns.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center text-gray-600">
            <span>{item.title}</span>
            <span className="font-semibold text-gray-900">+₹{item.price.toLocaleString('en-IN')}</span>
          </div>
        ))}

        {/* Travel Insurance */}
        {insuranceSelected && (
          <div className="flex justify-between items-center text-gray-600">
            <span>Travel Insurance × {adults}</span>
            <span className="font-semibold text-gray-900">+₹{insuranceSubtotal.toLocaleString('en-IN')}</span>
          </div>
        )}

        {/* GST */}
        <div className="flex justify-between items-center text-gray-600">
          <span>GST (5%)</span>
          <span className="font-semibold text-gray-900">₹{gst.toLocaleString('en-IN')}</span>
        </div>

        {/* Savings */}
        {savings > 0 && (
          <div className="flex justify-between items-center text-emerald-600 font-semibold">
            <span>Savings</span>
            <span>₹{savings.toLocaleString('en-IN')}</span>
          </div>
        )}

        {/* Coupon Discount */}
        {appliedCoupon && appliedCoupon.discount > 0 && (
          <div className="flex justify-between items-center text-emerald-600 font-semibold">
            <span>Coupon ({appliedCoupon.code})</span>
            <span>− ₹{couponDiscount.toLocaleString('en-IN')}</span>
          </div>
        )}

        {/* Total */}
        <div className="border-t border-gray-100 pt-3.5 mt-1 flex justify-between items-center font-bold text-gray-900 text-lg">
          <span>Total</span>
          <span className="text-xl text-gray-900">₹{total.toLocaleString('en-IN')}</span>
        </div>
      </div>
    </div>
  )
}
