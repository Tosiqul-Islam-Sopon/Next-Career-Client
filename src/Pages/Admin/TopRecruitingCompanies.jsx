import { useQuery } from "@tanstack/react-query";
import {
  FaBriefcase,
  FaArrowLeft,
  FaDownload,
  FaBuilding,
  FaChartLine,
} from "react-icons/fa";
import useAxiosBase from "../../CustomHooks/useAxiosBase";
import { Link } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";

const TopRecruitingCompanies = () => {
  const axiosBase = useAxiosBase();
  const pdfRef = useRef(null);

  const {
    data: companies = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["topRecruitingCompanies"],
    queryFn: async () => {
      const res = await axiosBase.get("/admin/topRecruitingCompanies");
      return res.data;
    },
  });

  const handleExportPDF = useReactToPrint({
    contentRef: pdfRef,
    documentTitle: "next-career-top-recruiting-companies",
  });

  // Get badge color based on index
  const getBadgeColor = (index) => {
    if (index === 0) return "bg-amber-500";
    if (index === 1) return "bg-gray-400";
    if (index === 2) return "bg-orange-500";
    return "bg-blue-500";
  };

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
                Top Recruiting Companies
              </h1>
              <p className="text-sm text-gray-500">
                Analysis of the most active hiring companies
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
                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center mr-3">
                  <FaBuilding className="text-green-600 text-xl" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Top 5 Recruiting Companies
                </h2>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FaChartLine className="text-green-500" />
                <span>Last updated: Today</span>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="p-8 flex flex-col items-center justify-center">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-500 font-medium">
                Loading company data...
              </p>
            </div>
          ) : isError || companies.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaBuilding className="text-gray-400 text-xl" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-1">
                No Company Data Available
              </h3>
              <p className="text-gray-500">
                There are currently no recruiting companies to display.
              </p>
            </div>
          ) : (
            <div className="p-6">
              {/* Companies grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {companies.map((company, index) => (
                  <div
                    key={index}
                    className="relative bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
                  >
                    {/* Rank badge */}
                    {index < 3 && (
                      <div className="absolute top-0 left-0">
                        <div
                          className={`${getBadgeColor(index)} text-white px-3 py-1 text-xs font-bold uppercase tracking-wider`}
                        >
                          #{index + 1}
                        </div>
                      </div>
                    )}

                    <div className="p-6">
                      <div className="flex items-center">
                        <div className="h-16 w-16 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center overflow-hidden mr-4">
                          {company.companyLogo ? (
                            <img
                              src={company.companyLogo || "/placeholder.svg"}
                              alt={company._id}
                              className="h-12 w-12 object-contain"
                            />
                          ) : (
                            <FaBriefcase className="text-gray-400 text-xl" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                            {company._id}
                          </h3>
                          <div className="mt-1 flex items-center">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {company.totalRecruited}{" "}
                              {company.totalRecruited === 1 ? "hire" : "hires"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500">Hiring activity</span>
                          <span
                            className={`font-medium ${
                              index === 0
                                ? "text-amber-600"
                                : index === 1
                                  ? "text-gray-600"
                                  : index === 2
                                    ? "text-orange-600"
                                    : "text-blue-600"
                            }`}
                          >
                            {index === 0
                              ? "Very High"
                              : index === 1
                                ? "High"
                                : index === 2
                                  ? "Above Average"
                                  : "Average"}
                          </span>
                        </div>
                        <div className="mt-2 w-full bg-gray-100 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${getBadgeColor(index)}`}
                            style={{ width: `${100 - index * 15}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary section */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <h3 className="text-sm font-medium text-gray-500 mb-3">
                  SUMMARY
                </h3>
                <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-green-600"
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
                      <h3 className="text-sm font-medium text-green-800">
                        Recruitment Insights
                      </h3>
                      <div className="mt-2 text-sm text-green-700">
                        <p>
                          {companies[0] && companies[0]._id} leads with{" "}
                          {companies[0] && companies[0].totalRecruited} hires,
                          showing strong growth. Consider developing strategic
                          partnerships with these top companies to enhance
                          placement opportunities.
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

export default TopRecruitingCompanies;
