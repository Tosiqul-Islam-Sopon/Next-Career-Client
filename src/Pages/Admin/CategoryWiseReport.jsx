import { useQuery } from "@tanstack/react-query"
import { FaChartPie, FaArrowLeft, FaDownload } from "react-icons/fa"
import useAxiosBase from "../../CustomHooks/useAxiosBase"
import { Link } from "react-router-dom"

const CategoryWiseReport = () => {
  const axiosBase = useAxiosBase()

  const { data: categoryData = [], isLoading } = useQuery({
    queryKey: ["categoryWiseRecruited"],
    queryFn: async () => {
      const res = await axiosBase.get("/admin/categoryWiseRecruited")
      return res.data
    },
  })

  // Calculate total for percentage
  const totalRecruited = categoryData.reduce((sum, cat) => sum + cat.totalRecruited, 0)

  // Get colors for categories
  const getColor = (index) => {
    const colors = [
      { bg: "bg-blue-500", light: "bg-blue-100", text: "text-blue-500" },
      { bg: "bg-green-500", light: "bg-green-100", text: "text-green-500" },
      { bg: "bg-purple-500", light: "bg-purple-100", text: "text-purple-500" },
      { bg: "bg-amber-500", light: "bg-amber-100", text: "text-amber-500" },
      { bg: "bg-indigo-500", light: "bg-indigo-100", text: "text-indigo-500" },
      { bg: "bg-pink-500", light: "bg-pink-100", text: "text-pink-500" },
      { bg: "bg-teal-500", light: "bg-teal-100", text: "text-teal-500" },
      { bg: "bg-orange-500", light: "bg-orange-100", text: "text-orange-500" },
    ]
    return colors[index % colors.length]
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header with navigation */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/admin" className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors">
              <FaArrowLeft className="text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Category-wise Recruitment Report</h1>
              <p className="text-sm text-gray-500">Detailed breakdown of hiring by job category</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <FaDownload className="text-gray-500" />
            Export Report
          </button>
        </div>

        {/* Main content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mr-3">
                <FaChartPie className="text-blue-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Category Distribution</h2>
            </div>
          </div>

          {isLoading ? (
            <div className="p-8 flex flex-col items-center justify-center">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-500 font-medium">Loading report data...</p>
            </div>
          ) : categoryData.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaChartPie className="text-gray-400 text-xl" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-1">No Data Available</h3>
              <p className="text-gray-500">There is no category data to display at this time.</p>
            </div>
          ) : (
            <div className="p-6">
              {/* Visual bar chart */}
              <div className="mb-8">
                <div className="h-8 w-full bg-gray-100 rounded-lg overflow-hidden flex">
                  {categoryData.map((cat, index) => {
                    const percentage = (cat.totalRecruited / totalRecruited) * 100
                    return (
                      <div
                        key={index}
                        className={`${getColor(index).bg} h-full`}
                        style={{ width: `${percentage}%` }}
                        title={`${cat._id}: ${percentage.toFixed(1)}%`}
                      ></div>
                    )
                  })}
                </div>
                <div className="mt-2 flex flex-wrap gap-3">
                  {categoryData.map((cat, index) => (
                    <div key={index} className="flex items-center text-xs">
                      <div className={`w-3 h-3 rounded-full ${getColor(index).bg} mr-1`}></div>
                      <span className="text-gray-600">{cat._id}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detailed list */}
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Category
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Hired
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Percentage
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Distribution
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {categoryData.map((cat, index) => {
                      const percentage = (cat.totalRecruited / totalRecruited) * 100
                      const color = getColor(index)
                      return (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div
                                className={`w-8 h-8 rounded-md ${color.light} flex items-center justify-center mr-3`}
                              >
                                <div className={`w-2 h-2 rounded-full ${color.bg}`}></div>
                              </div>
                              <div className="text-sm font-medium text-gray-900">{cat._id || "Unknown"}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-semibold text-gray-900">{cat.totalRecruited}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{percentage.toFixed(1)}%</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="w-full bg-gray-100 rounded-full h-2.5">
                              <div
                                className={`${color.bg} h-2.5 rounded-full`}
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CategoryWiseReport
