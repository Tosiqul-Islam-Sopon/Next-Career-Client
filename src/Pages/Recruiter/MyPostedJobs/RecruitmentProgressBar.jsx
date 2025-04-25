"use client"

import { Check } from "lucide-react"
import PropTypes from "prop-types"

const RecruitmentProgressBar = ({ stages = [], completedStages = [] }) => {
  return (
    <div className="px-6 py-4 border-t border-gray-100">
      <h4 className="text-sm font-medium text-gray-700 mb-3 text-center">Recruitment Progress</h4>
      <div className="flex justify-between items-center w-full overflow-x-auto pb-1">
        {stages.map((stage, index) => {
          const isCompleted = completedStages.includes(stage)
          const isCurrent = !isCompleted && completedStages.length === index
          const isLast = index === stages.length - 1

          return (
            <div key={index} className="flex-1 flex flex-col items-center relative min-w-[80px]">
              {/* Circle */}
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-sm z-10 transition-all duration-300
                  ${
                    isCompleted
                      ? "bg-blue-600 text-white shadow-sm"
                      : isCurrent
                        ? "bg-white border-2 border-blue-600 text-blue-600 shadow-sm"
                        : "bg-gray-100 text-gray-400 border border-gray-200"
                  }
                `}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : index + 1}
              </div>

              {/* Label */}
              <div className="text-xs mt-2 text-center max-w-[90px] px-1">
                <span
                  className={`transition-colors duration-300 ${
                    isCompleted
                      ? "text-blue-600 font-medium"
                      : isCurrent
                        ? "text-blue-600 font-medium"
                        : "text-gray-500"
                  }`}
                >
                  {stage}
                </span>
              </div>

              {/* Connector Line - only between stages */}
              {!isLast && (
                <div className="absolute top-4 left-1/2 w-full h-[2px]">
                  <div className={`h-full ${isCompleted ? "bg-blue-600" : "bg-gray-200"}`}></div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

RecruitmentProgressBar.propTypes = {
  stages: PropTypes.arrayOf(PropTypes.string).isRequired,
  completedStages: PropTypes.arrayOf(PropTypes.string).isRequired,
}

export default RecruitmentProgressBar
