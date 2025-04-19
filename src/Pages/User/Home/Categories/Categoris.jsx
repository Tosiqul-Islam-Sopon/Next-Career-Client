"use client";
import { useQuery } from "@tanstack/react-query";
import useAxiosBase from "../../../../CustomHooks/useAxiosBase";
import CategoryCard from "./CategoryCard";
import {
  MdSupportAgent,
  MdPeople,
  MdAssignment,
  MdSchool,
  MdDesignServices,
  MdAttachMoney,
  MdEngineering,
  MdCode,
  MdSecurity,
  MdLocalShipping,
  MdCategory,
  MdBusiness,
  MdAnalytics,
  MdOutlineManageAccounts,
  MdOutlineContentPaste,
  MdOutlineDevices,
} from "react-icons/md";
import {
  FaHandshake,
  FaUserMd,
  FaBalanceScale,
  FaNetworkWired,
  FaPaintBrush,
  FaChartLine,
  FaDatabase,
  FaServer,
  FaUserTie,
  FaFileContract,
  FaRegNewspaper,
} from "react-icons/fa";

const iconMap = {
  // Marketing & Communications
  Content: <FaRegNewspaper />,

  // Customer Support
  "Customer Service": <MdSupportAgent />,
  "Customer Support": <MdSupportAgent />,

  // HR & Management
  "Human Resource": <MdPeople />,
  Management: <MdOutlineManageAccounts />,
  "Project Management": <MdAssignment />,

  // Business
  "Business Development": <FaChartLine />,
  Sales: <FaHandshake />,
  "Sales & Communication": <FaHandshake />,

  // Education
  "Teaching & Education": <MdSchool />,
  Training: <MdSchool />,

  // Design
  Design: <FaPaintBrush />,
  "Design & Creative": <MdDesignServices />,
  "UX/UI Design": <MdDesignServices />,

  // Finance
  Finance: <MdAttachMoney />,
  "Finance & Accounting": <MdAttachMoney />,
  Accounting: <MdAttachMoney />,

  // Engineering & Tech
  Engineering: <MdEngineering />,
  "Software Development": <MdCode />,
  "Software Engineer": <MdCode />,
  Development: <MdCode />,
  DevOps: <FaServer />,
  "Information Technology": <FaNetworkWired />,
  "Information Technology (IT)": <FaNetworkWired />,
  "IT Security": <MdSecurity />,

  // Operations
  Operations: <MdBusiness />,
  "Operations & Logistics": <MdLocalShipping />,

  // Healthcare
  Healthcare: <FaUserMd />,

  // Legal
  Legal: <FaBalanceScale />,

  // Data
  "Data Science": <FaDatabase />,
  "Data Science & Analytics": <FaDatabase />,
  Analytics: <MdAnalytics />,

  // Other common categories
  Product: <MdOutlineDevices />,
  "Product Management": <MdOutlineDevices />,
  Consulting: <FaUserTie />,
  Administrative: <MdOutlineContentPaste />,
  "Legal & Compliance": <FaFileContract />,
};

const Categories = () => {
  const axiosBase = useAxiosBase();

  // Use React Query for data fetching with loading state
  const { data, isLoading } = useQuery({
    queryKey: ["jobCategories"],
    queryFn: async () => {
      const response = await axiosBase.get("/jobs/categoriesVacancy");
      return response.data;
    },
  });

  // Helper to find closest match
  const getCategoryIcon = (label) => {
    const normalized = label.toLowerCase().replace(/[^a-z]/gi, " ");
    const matchedKey = Object.keys(iconMap).find((key) =>
      normalized.includes(key.toLowerCase().replace(/[^a-z]/gi, " "))
    );
    return iconMap[matchedKey] || <MdCategory />;
  };

  // Format categories with icons
  const categories = data
    ? data.map((category) => ({
        title: category._id,
        vacancy: category.totalVacancy,
        icon: getCategoryIcon(category._id),
      }))
    : [];

  return (
    <div className="bg-gray-50 py-12">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-10">
          <div className="flex flex-col items-center text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Explore Career Categories
            </h2>
            <p className="text-gray-600 max-w-2xl">
              Browse job opportunities by category and find the perfect role
              that matches your expertise and career goals
            </p>
          </div>
          <div className="h-1 w-20 bg-blue-600 rounded mx-auto"></div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 font-medium">Loading categories...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <MdCategory className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No categories found
            </h3>
            <p className="text-gray-600">
              We couldn&apos;t find any job categories at this time.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {categories.map((category, index) => (
              <CategoryCard
                key={index}
                icon={category.icon}
                title={category.title}
                vacancies={category.vacancy}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
