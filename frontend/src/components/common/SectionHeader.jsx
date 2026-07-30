import { Link } from 'react-router-dom'

export default function SectionHeader({ title, subtitle, linkText, linkTo }) {
  return (
    <div className="flex items-end justify-between mb-6">
      <div>
        <h2 className="text-2xl font-bold text-dark">{title}</h2>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      {linkText && linkTo && (
        <Link
          to={linkTo}
          className="text-primary text-sm font-semibold hover:underline no-underline"
        >
          {linkText} →
        </Link>
      )}
    </div>
  )
}
