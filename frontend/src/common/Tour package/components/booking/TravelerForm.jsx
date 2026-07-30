import { ChevronDown, Info } from 'lucide-react'

const COUNTRIES = [
  'Indian', 'American', 'British', 'Australian', 'Canadian', 'French', 'German',
  'Italian', 'Japanese', 'Chinese', 'Singaporean', 'Malaysian', 'Thai', 'Other',
]

const inputClass = (err) =>
  `w-full px-4 py-3.5 border rounded-xl text-sm bg-gray-50 text-gray-800 outline-none focus:bg-white focus:ring-2 transition-all ${  
    err ? 'border-red-400 focus:ring-red-100' : 'border-gray-200 focus:border-gray-400 focus:ring-gray-100'
  }`

const selectClass = `w-full px-4 py-3.5 border border-gray-200 rounded-xl text-sm bg-gray-50 text-gray-800 outline-none focus:bg-white focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all appearance-none cursor-pointer`

const labelClass = 'block text-xs font-medium text-gray-700 mb-1.5'

// Auto-formats digits into DD-MM-YYYY as the user types
const formatDOB = (raw) => {
  const digits = raw.replace(/\D/g, '').slice(0, 8)
  if (digits.length <= 2) return digits
  if (digits.length <= 4) return digits.slice(0, 2) + '-' + digits.slice(2)
  return digits.slice(0, 2) + '-' + digits.slice(2, 4) + '-' + digits.slice(4)
}

// Auto-formats digits into MM/YY as the user types
const formatExpiry = (raw) => {
  const digits = raw.replace(/\D/g, '').slice(0, 4)
  if (digits.length <= 2) return digits
  return digits.slice(0, 2) + '/' + digits.slice(2)
}

export default function TravelerForm({ index, data, onChange, isInternational = false, errors }) {
  return (
    <div className="space-y-4">

      {/* Row 1 — Title (narrow) / First Name / Last Name */}
      <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 2fr 2fr' }}>
        {/* Title */}
        <div>
          <label className={labelClass}>Title *</label>
          <div className="relative">
            <select
              className={selectClass}
              value={data.title}
              onChange={e => onChange('title', e.target.value)}
            >
              <option value="Mr.">Mr.</option>
              <option value="Mrs.">Mrs.</option>
              <option value="Ms.">Ms.</option>
              <option value="Dr.">Dr.</option>
            </select>
            <ChevronDown size={13} className="absolute right-3.5 top-4 text-gray-400 pointer-events-none" />
          </div>
          {errors?.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
        </div>

        {/* First Name */}
        <div>
          <label className={labelClass}>First Name *</label>
          <input
            className={inputClass(errors?.firstName)}
            placeholder="First Name"
            value={data.firstName}
            onChange={e => onChange('firstName', e.target.value)}
          />
          {errors?.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
        </div>

        {/* Last Name */}
        <div>
          <label className={labelClass}>Last Name *</label>
          <input
            className={inputClass(errors?.lastName)}
            placeholder="Last Name"
            value={data.lastName}
            onChange={e => onChange('lastName', e.target.value)}
          />
          {errors?.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
        </div>
      </div>

      {/* Row 2 — Date of Birth / Nationality (equal halves) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Date of Birth *</label>
          <input
            type="text"
            inputMode="numeric"
            className={inputClass(errors?.dob)}
            placeholder="DD-MM-YYYY"
            value={data.dob}
            maxLength={10}
            onChange={e => onChange('dob', formatDOB(e.target.value))}
          />
          {errors?.dob && <p className="text-red-500 text-xs mt-1">{errors.dob}</p>}
        </div>
        <div>
          <label className={labelClass}>Nationality *</label>
          <div className="relative">
            <select
              className={selectClass}
              value={data.nationality || 'Indian'}
              onChange={e => onChange('nationality', e.target.value)}
            >
              {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <ChevronDown size={13} className="absolute right-3.5 top-4 text-gray-400 pointer-events-none" />
          </div>
          {errors?.nationality && <p className="text-red-500 text-xs mt-1">{errors.nationality}</p>}
        </div>
      </div>

      {/* Passport section — always shown (dimmed when not required) */}
      <div className="pt-1">
        <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium mb-3">
          <Info size={13} className="text-gray-400 shrink-0" />
          <span>Passport required for international travel</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Passport Number</label>
            <input
              className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-sm bg-gray-50 text-gray-700 placeholder-gray-400 outline-none focus:bg-white focus:border-gray-400 transition-all"
              placeholder="Required for international travel"
              value={data.passport || ''}
              onChange={e => onChange('passport', e.target.value)}
            />
            {errors?.passport && <p className="text-red-500 text-xs mt-1">{errors.passport}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Passport Expiry</label>
            <input
              type="text"
              inputMode="numeric"
              className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-sm bg-gray-50 text-gray-700 placeholder-gray-400 outline-none focus:bg-white focus:border-gray-400 transition-all"
              placeholder="MM/YY"
              value={data.passportExpiry || ''}
              maxLength={5}
              onChange={e => onChange('passportExpiry', formatExpiry(e.target.value))}
            />
            {errors?.passportExpiry && <p className="text-red-500 text-xs mt-1">{errors.passportExpiry}</p>}
          </div>
        </div>
      </div>

    </div>
  )
}
