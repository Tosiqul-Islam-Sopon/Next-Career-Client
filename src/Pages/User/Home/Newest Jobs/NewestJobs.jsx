"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import useAxiosBase from "../../../../CustomHooks/useAxiosBase"
import JobCard from "../../../Shared/JobCard/JobCard"
import { MdArrowBack, MdArrowForward, MdWorkOutline } from "react-icons/md"

const NewestJobs = () => {
  const [page, setPage] = useState(1) // State to track current page
  const axiosBase = useAxiosBase()

  // Fetch newest jobs from the backend
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["newestJobs", page],
    queryFn: async () => {
      const response = await axiosBase.get(`/jobs/newestJobs?page=${page}&limit=10`)
      return response.data
    },
    keepPreviousData: true, // Retains previous data until new data is fetched
  })

  const jobs = data?.jobs || []
  const totalPages = data?.totalPages || 1
  const totalJobs = data?.totalJobs || 0

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage((prevPage) => prevPage + 1)
      // Scroll to top when changing page
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1)
      // Scroll to top when changing page
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      // If total pages is less than max visible, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      // Always show first page
      pageNumbers.push(1)

      // Calculate start and end of middle pages
      let start = Math.max(2, page - 1)
      let end = Math.min(totalPages - 1, page + 1)

      // Adjust if we're near the beginning
      if (page <= 3) {
        end = 4
      }

      // Adjust if we're near the end
      if (page >= totalPages - 2) {
        start = totalPages - 3
      }

      // Add ellipsis after first page if needed
      if (start > 2) {
        pageNumbers.push("...")
      }

      // Add middle pages
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i)
      }

      // Add ellipsis before last page if needed
      if (end < totalPages - 1) {
        pageNumbers.push("...")
      }

      // Always show last page
      pageNumbers.push(totalPages)
    }

    return pageNumbers
  }

  return (
    <div className="bg-gray-50 py-12">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Newest Job Opportunities</h1>
              <p className="text-gray-600">
                {isLoading
                  ? "Finding opportunities..."
                  : `Showing ${jobs.length} of ${totalJobs} recently posted positions`}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <span className="text-sm text-gray-500">
                Page {page} of {totalPages}
              </span>
            </div>
          </div>
          <div className="h-1 w-20 bg-blue-600 rounded"></div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 font-medium">Loading job listings...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <MdWorkOutline className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No jobs found</h3>
            <p className="text-gray-600">We couldn&apos;t find any job listings at this time.</p>
          </div>
        ) : (
          <>
            {/* Job Grid with Overlay for Fetching */}
            <div className="relative">
              {isFetching && !isLoading && (
                <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10 rounded-lg">
                  <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {jobs.map((job) => (
                  <JobCard key={job._id} job={job} />
                ))}
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg shadow-sm">
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{jobs.length}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                      <button
                        onClick={handlePreviousPage}
                        disabled={page === 1}
                        className={`relative inline-flex items-center rounded-l-md px-3 py-2 text-sm font-medium ${
                          page === 1
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-white text-gray-700 hover:bg-gray-50 cursor-pointer"
                        } border border-gray-300`}
                      >
                        <MdArrowBack className="h-5 w-5" />
                        <span className="sr-only">Previous</span>
                      </button>

                      {/* Page Numbers */}
                      {getPageNumbers().map((pageNum, index) => {
                        if (pageNum === "...") {
                          return (
                            <span
                              key={`ellipsis-${index}`}
                              className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 bg-white"
                            >
                              ...
                            </span>
                          )
                        }

                        return (
                          <button
                            key={`page-${pageNum}`}
                            onClick={() => {
                              if (pageNum !== page) {
                                setPage(pageNum)
                                window.scrollTo({ top: 0, behavior: "smooth" })
                              }
                            }}
                            className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
                              page === pageNum ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"
                            } border border-gray-300`}
                          >
                            {pageNum}
                          </button>
                        )
                      })}

                      <button
                        onClick={handleNextPage}
                        disabled={page === totalPages}
                        className={`relative inline-flex items-center rounded-r-md px-3 py-2 text-sm font-medium ${
                          page === totalPages
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-white text-gray-700 hover:bg-gray-50 cursor-pointer"
                        } border border-gray-300`}
                      >
                        <MdArrowForward className="h-5 w-5" />
                        <span className="sr-only">Next</span>
                      </button>
                    </nav>
                  </div>
                </div>

                {/* Mobile Pagination */}
                <div className="flex w-full sm:hidden justify-between">
                  <button
                    onClick={handlePreviousPage}
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
                    onClick={handleNextPage}
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
    </div>
  )
}

export default NewestJobs
