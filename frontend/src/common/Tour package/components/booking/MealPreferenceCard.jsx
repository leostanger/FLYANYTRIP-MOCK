import { Utensils, Check } from 'lucide-react'

export const MEAL_OPTIONS = [
  { id: 'veg', label: 'Vegetarian', price: 299, icon: '🥗' },
  { id: 'non_veg', label: 'Non-Vegetarian', price: 349, icon: '🍗' },
  { id: 'vegan', label: 'Vegan', price: 329, icon: '🌱' },
  { id: 'jain', label: 'Jain', price: 299, icon: '🫘' },
  { id: 'no_pref', label: 'No Preference', price: 0, icon: <span className="text-red-500 font-bold px-1">—</span> },
]

export default function MealPreferenceCard({ selectedMeal, onSelect }) {
  return (
    <div 
      className="bg-white border border-gray-200 rounded-2xl p-6 mb-5"
      style={{ fontFamily: '"Quicksand", sans-serif' }}
    >
      <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-[#D0D0D0]">
        <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center shrink-0">
          <Utensils size={16} className="text-red-500" />
        </div>
        <div className="flex items-center gap-2 flex-1">
          <h2 className="text-base font-bold text-gray-900">Meal Preference</h2>
          <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full">Pre-order & save</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-6 gap-3">
        {MEAL_OPTIONS.map((meal, index) => {
          const isSelected = selectedMeal?.id === meal.id
          const isTopRow = index < 3
          const colSpan = isTopRow ? 'sm:col-span-2' : 'sm:col-span-3'
          
          return (
            <div
              key={meal.id}
              onClick={() => onSelect(meal)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${colSpan} ${
                isSelected
                  ? 'bg-red-50 border-red-500 shadow-sm'
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="text-xl shrink-0 flex items-center justify-center w-6">
                  {meal.icon}
                </div>
                <div>
                  <div className={`font-bold text-sm ${isSelected ? 'text-gray-900' : 'text-gray-800'}`}>
                    {meal.label}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {meal.price === 0 ? 'Free' : `+₹${meal.price}`}
                  </div>
                </div>
              </div>
              
              {isSelected && (
                <div className="shrink-0 text-red-500">
                  <Check size={18} strokeWidth={2.5} />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
