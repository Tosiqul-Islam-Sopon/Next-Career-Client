import { useQuery } from "@tanstack/react-query";
import { MdCategory } from "react-icons/md";
import { FaArrowLeft, FaDownload, FaChartLine } from "react-icons/fa";
import useAxiosBase from "../../CustomHooks/useAxiosBase";
import { Link } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";

const TopRecruitingSectors = () => {
  const axiosBase = useAxiosBase();
  const pdfRef = useRef(null);

  const {
    data: sectors = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["topRecruitingSectors"],
    queryFn: async () => {
      const res = await axiosBase.get("/admin/topRecruitingSectors");
      return res.data;
    },
  });

  const handleExportPDF = useReactToPrint({
    contentRef: pdfRef,
    documentTitle: "next-career-top-recruiting-sectors",
  });

  // Calculate max for visualization
  const maxRecruited =
    sectors.length > 0 ? Math.max(...sectors.map((s) => s.totalRecruited)) : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header with navigation */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center">
            <Link
              to="/adminHome"
              className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors"
            >
              <FaArrowLeft className="text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Top Recruiting Sectors
              </h1>
              <p className="text-sm text-gray-500">
                Analysis of the most active industry sectors
              </p>
            </div>
          </div>
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <FaDownload className="text-gray-500" />
            Export Data
          </button>
        </div>

        {/* Main content */}
        <div
          ref={pdfRef}
          className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center mr-3">
                  <MdCategory className="text-purple-600 text-xl" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Top 5 Recruiting Sectors
                </h2>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FaChartLine className="text-purple-500" />
                <span>Last updated: Today</span>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="p-8 flex flex-col items-center justify-center">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-purple-600 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-500 font-medium">
                Loading sector data...
              </p>
            </div>
          ) : isError || !sectors.length ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MdCategory className="text-gray-400 text-xl" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-1">
                No Data Available
              </h3>
              <p className="text-gray-500">
                There is no sector data to display at this time.
              </p>
            </div>
          ) : (
            <div className="p-6">
              {/* Sectors list */}
              <div className="space-y-6">
                {sectors.map((sector, index) => {
                  const percentage =
                    (sector.totalRecruited / maxRecruited) * 100;
                  return (
                    <div key={index} className="relative">
                      <div className="flex items-center mb-2">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            index === 0
                              ? "bg-amber-100 text-amber-600"
                              : index === 1
                                ? "bg-gray-200 text-gray-600"
                                : index === 2
                                  ? "bg-orange-100 text-orange-600"
                                  : "bg-purple-50 text-purple-600"
                          }`}
                        >
                          {index < 3 ? (
                            <span className="font-bold">{index + 1}</span>
                          ) : (
                            <span className="text-xs font-medium">
                              {index + 1}
                            </span>
                          )}
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {sector._id}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-700">
                              {sector.totalRecruited} hires
                            </span>
                            {index === 0 && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                Leading Sector
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 relative">
                        <div className="w-full bg-gray-100 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full ${
                              index === 0
                                ? "bg-amber-500"
                                : index === 1
                                  ? "bg-gray-500"
                                  : index === 2
                                    ? "bg-orange-500"
                                    : "bg-purple-500"
                            }`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <div className="absolute right-0 -top-6 text-xs font-medium text-gray-500">
                          {percentage.toFixed(0)}%
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Additional insights */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <h3 className="text-sm font-medium text-gray-500 mb-3">
                  INSIGHTS
                </h3>
                <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-purple-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-purple-800">
                        Sector Growth Analysis
                      </h3>
                      <div className="mt-2 text-sm text-purple-700">
                        <p>
                          {sectors[0] && sectors[0]._id} is currently the
                          leading sector with{" "}
                          {sectors[0] && sectors[0].totalRecruited} hires,
                          showing a strong demand in the market. Consider
                          focusing resources on expanding opportunities in this
                          sector.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopRecruitingSectors;
