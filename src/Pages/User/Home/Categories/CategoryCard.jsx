"use client"

import PropTypes from "prop-types"
import { useNavigate } from "react-router-dom"
import { cloneElement } from "react"

const CategoryCard = ({ icon, title, vacancies }) => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/jobs/${title}`)
  }

  // Clone the icon element to add consistent sizing
  const iconElement = cloneElement(icon, {
    size: 28,
    className: "text-blue-600",
  })

  return (
    <div
      onClick={handleClick}
      className="bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md group cursor-pointer"
    >
      <div className="p-6">
        <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mb-4 mx-auto group-hover:bg-blue-100 transition-colors">
          {iconElement}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 text-center mb-2 line-clamp-1">{title}</h3>
        <div className="flex items-center justify-center">
          <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
            {vacancies} {vacancies === 1 ? "Vacancy" : "Vacancies"}
          </span>
        </div>
      </div>
      <div className="h-1 w-0 bg-blue-600 group-hover:w-full transition-all duration-300"></div>
    </div>
  )
}

CategoryCard.propTypes = {
  icon: PropTypes.element.isRequired,
  title: PropTypes.string.isRequired,
  vacancies: PropTypes.number.isRequired,
}

export default CategoryCard
