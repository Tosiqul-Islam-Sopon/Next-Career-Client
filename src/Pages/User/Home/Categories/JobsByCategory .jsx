"use client";

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useAxiosBase from "../../../../CustomHooks/useAxiosBase";
import JobCard from "../../../Shared/JobCard/JobCard";
import { Briefcase, Filter, Search, SlidersHorizontal } from "lucide-react";

const JobsByCategory = () => {
  const { category } = useParams();
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  //   const [showFilters, setShowFilters] = useState(false);
  const axiosBase = useAxiosBase();

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      try {
        const response = await axiosBase.get(`/jobs/category/${category}`);
        setJobs(response.data);
        setFilteredJobs(response.data);
      } catch (error) {
        console.error("Error fetching jobs by category:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [category, axiosBase]);

  useEffect(() => {
    // Filter jobs based on search term
    const filtered = jobs.filter(
      (job) =>
        job.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.companyInfo.companyName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
    );


    // Sort jobs
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.date || 0) - new Date(a.date || 0);
      } else if (sortBy === "oldest") {
        return new Date(a.date || 0) - new Date(b.date || 0);
      } else if (sortBy === "salary-high") {
        return (b.salary || 0) - (a.salary || 0);
      } else if (sortBy === "salary-low") {
        return (a.salary || 0) - (b.salary || 0);
      }
      return 0;
    });

    setFilteredJobs(sorted);
  }, [jobs, searchTerm, sortBy]);

  // Function to get a background color based on category name
  const getCategoryColor = () => {
    const colors = {
      Technology: "bg-emerald-50",
      Marketing: "bg-blue-50",
      Finance: "bg-amber-50",
      Healthcare: "bg-rose-50",
      Education: "bg-violet-50",
      Design: "bg-cyan-50",
      Sales: "bg-orange-50",
      Engineering: "bg-green-50",
      "Customer Service": "bg-purple-50",
      "Human Resources": "bg-pink-50",
    };

    return colors[category] || "bg-slate-50";
  };

  return (
    <div className={`min-h-screen ${getCategoryColor()}`}>
      {/* Hero section */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 pb-12 pt-28">
          <div className="flex items-center justify-center mb-2">
            <div className="bg-slate-100 p-3 rounded-full mr-3">
              <Briefcase className="h-6 w-6 text-slate-700" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
              {category} Jobs
            </h1>
          </div>
          <p className="text-center text-slate-600 max-w-2xl mx-auto mb-8">
            Discover the best {category.toLowerCase()} opportunities that match
            your skills and career goals.
          </p>

          {/* Search bar */}
          <div className="relative max-w-xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              placeholder={`Search ${category} jobs...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filter and sort controls */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center">
            <span className="text-slate-700 font-medium">
              {filteredJobs.length} {filteredJobs.length === 1 ? "job" : "jobs"}{" "}
              found
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </button> */}

            <div className="relative">
              <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg">
                <SlidersHorizontal className="h-4 w-4" />
                <select
                  className="bg-transparent appearance-none outline-none pr-8"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="salary-high">Highest Salary</option>
                  <option value="salary-low">Lowest Salary</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Expanded filters (hidden by default) */}
        {/* {showFilters && (
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Job Type
              </label>
              <select className="w-full p-2 border border-slate-300 rounded-md">
                <option value="">All Types</option>
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Experience Level
              </label>
              <select className="w-full p-2 border border-slate-300 rounded-md">
                <option value="">All Levels</option>
                <option value="entry">Entry Level</option>
                <option value="mid">Mid Level</option>
                <option value="senior">Senior Level</option>
                <option value="executive">Executive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Location
              </label>
              <select className="w-full p-2 border border-slate-300 rounded-md">
                <option value="">All Locations</option>
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
                <option value="onsite">On-site</option>
              </select>
            </div>
          </div>
        )} */}

        {/* Loading state */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-600 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-600">Loading jobs...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          // Empty state
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
              <Briefcase className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-medium text-slate-800 mb-2">
              No jobs found
            </h3>
            <p className="text-slate-600 mb-6">
              We couldn&apos;t find any {category.toLowerCase()} jobs matching
              your criteria.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSortBy("newest");
              }}
              className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
            >
              Clear filters
            </button>
          </div>
        ) : (
          // Jobs grid
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredJobs.map((job) => (
              <div
                key={job._id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <JobCard job={job} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobsByCategory;
