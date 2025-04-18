"use client"

import { useEffect, useState } from "react"
import useAxiosBase from "../../../CustomHooks/useAxiosBase"
import JobCard from "../../Shared/JobCard/JobCard"
import { MdSearch, MdFilterList, MdBusinessCenter, MdSort } from "react-icons/md"

const Jobs = () => {
  const axiosBase = useAxiosBase()

  const [jobs, setJobs] = useState([])
  const [searchTitle, setSearchTitle] = useState("")
  const [searchCompany, setSearchCompany] = useState("")
  const [category, setCategory] = useState("")
  const [sortCriteria, setSortCriteria] = useState("")
  const [jobType, setJobType] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalJobs, setTotalJobs] = useState(0)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const loadJobs = async () => {
      try {
        setIsLoading(true)
        const response = await axiosBase.get("/jobs", {
          params: {
            searchTitle,
            searchCompany,
            category,
            sortCriteria,
            jobType,
            page,
            limit: 16,
          },
        })
        setJobs(response.data.jobs)
        setPage(response.data.currentPage)
        setTotalPages(response.data.totalPages)
        setTotalJobs(response.data.totalJobs || response.data.jobs.length * response.data.totalPages)
      } catch (error) {
        console.error("Error fetching jobs:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadJobs()
  }, [searchTitle, searchCompany, category, sortCriteria, jobType, page, axiosBase])

  const handlePageChange = (newPage) => {
    setPage(newPage)
    // Scroll to top when changing page
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleClearFilters = () => {
    setSearchTitle("")
    setSearchCompany("")
    setCategory("")
    setSortCriteria("")
    setJobType("")
    setPage(1)
  }

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Job Listings</h1>
        <p className="text-gray-600">
          {isLoading ? "Finding opportunities..." : `Showing ${jobs.length} of ${totalJobs} available positions`}
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MdSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by Job Title"
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MdBusinessCenter className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by Company"
                value={searchCompany}
                onChange={(e) => setSearchCompany(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-4 py-2.5 border border-gray-200 text-gray-700 bg-white rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <MdFilterList className="h-5 w-5 mr-2" />
              Filters
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="p-4 bg-gray-50 border-t border-gray-100">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="block w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                >
                  <option value="">All Categories</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Customer Service">Customer Service</option>
                  <option value="Human Resource">Human Resource</option>
                  <option value="Project Management">Project Management</option>
                  <option value="Business Development">Business Development</option>
                  <option value="Sales & Communication">Sales & Communication</option>
                  <option value="Teaching & Education">Teaching & Education</option>
                  <option value="Design & Creative">Design & Creative</option>
                  <option value="Finance & Accounting">Finance & Accounting</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Software Development">Software Development</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Operations & Logistics">Operations & Logistics</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Legal">Legal</option>
                  <option value="Data Science">Data Science</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MdSort className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    value={sortCriteria}
                    onChange={(e) => setSortCriteria(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">Default Sorting</option>
                    <option value="Salary">Salary</option>
                    <option value="Vacancy">Vacancy</option>
                    <option value="Visitors">Visitors</option>
                    <option value="Deadline">Deadline</option>
                  </select>
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                <select
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                  className="block w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                >
                  <option value="">All Job Types</option>
                  <option value="Remote">Remote</option>
                  <option value="On Site">On Site</option>
                  <option value="Full Time">Full Time</option>
                  <option value="Part Time">Part Time</option>
                </select>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 font-medium">Loading job listings...</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <MdSearch className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No jobs found</h3>
          <p className="text-gray-600 mb-4">We couldn&apos;t find any jobs matching your search criteria.</p>
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          {/* Job Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg shadow-sm">
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing page <span className="font-medium">{page}</span> of{" "}
                    <span className="font-medium">{totalPages}</span>
                  </p>
                </div>
                <div>
                  <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                      className={`relative inline-flex items-center rounded-l-md px-4 py-2 text-sm font-medium ${
                        page === 1
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white text-gray-700 hover:bg-gray-50 cursor-pointer"
                      } border border-gray-300`}
                    >
                      Previous
                    </button>

                    {/* Page Numbers */}
                    {[...Array(totalPages)].map((_, i) => {
                      const pageNum = i + 1
                      // Only show current page, first, last, and pages around current
                      if (pageNum === 1 || pageNum === totalPages || (pageNum >= page - 1 && pageNum <= page + 1)) {
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
                              page === pageNum ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"
                            } border border-gray-300`}
                          >
                            {pageNum}
                          </button>
                        )
                      } else if ((pageNum === 2 && page > 3) || (pageNum === totalPages - 1 && page < totalPages - 2)) {
                        // Show ellipsis
                        return (
                          <span
                            key={pageNum}
                            className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 bg-white"
                          >
                            ...
                          </span>
                        )
                      }
                      return null
                    })}

                    <button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === totalPages}
                      className={`relative inline-flex items-center rounded-r-md px-4 py-2 text-sm font-medium ${
                        page === totalPages
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white text-gray-700 hover:bg-gray-50 cursor-pointer"
                      } border border-gray-300`}
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>

              {/* Mobile Pagination */}
              <div className="flex w-full sm:hidden justify-between">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className={`relative inline-flex items-center rounded-md px-4 py-2 text-sm font-medium ${
                    page === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-gray-50 cursor-pointer"
                  } border border-gray-300`}
                >
                  Previous
                </button>
                <span className="text-sm text-gray-700">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className={`relative inline-flex items-center rounded-md px-4 py-2 text-sm font-medium ${
                    page === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-gray-50 cursor-pointer"
                  } border border-gray-300`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Jobs
