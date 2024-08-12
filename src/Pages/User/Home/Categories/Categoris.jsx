import { useEffect, useState } from 'react';
import { FaHandshake, FaBriefcaseMedical, FaLaptopCode, FaUniversity } from 'react-icons/fa';
import CategoryCard from './CategoryCard';
import {
  MdEmail,
  MdHeadset,
  MdPeople,
  MdAssignment,
  MdTrendingUp,
  MdSchool,
  MdDesignServices,
  MdBusiness,
  MdEngineering,
  MdSecurity,
  MdSupport,
} from 'react-icons/md';
import useAxiosBase from '../../../../CustomHooks/useAxiosBase';

const iconMap = {
  'Marketing': <MdEmail size={40} />,
  'Customer Service': <MdHeadset size={40} />,
  'Human Resource': <MdPeople size={40} />,
  'Project Management': <MdAssignment size={40} />,
  'Business Development': <MdTrendingUp size={40} />,
  'Sales & Communication': <FaHandshake size={40} />,
  'Teaching & Education': <MdSchool size={40} />,
  'Design & Creative': <MdDesignServices size={40} />,
  'Finance & Accounting': <MdBusiness size={40} />,
  'Engineering': <MdEngineering size={40} />,
  'Software Development': <FaLaptopCode size={40} />,
  'Information Technology (IT)': <MdSecurity size={40} />,
  'Operations & Logistics': <MdSupport size={40} />,
  'Healthcare': <FaBriefcaseMedical size={40} />,
  'Legal': <FaUniversity size={40} />,
  'Data Science & Analytics': <MdTrendingUp size={40} />,
};

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const axiosBase = useAxiosBase();

  useEffect(() => {
    axiosBase.get('/jobs/categoriesVacancy') // Update with your actual backend URL
      .then(res => {
        const formattedCategories = res.data.map(category => ({
          title: category._id,
          vacancies: category.vacancies,
          icon: iconMap[category._id] || <MdBusiness size={40} /> // Fallback icon
        }));
        setCategories(formattedCategories);
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
      });
  }, [axiosBase]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-8">Explore By Category</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category, index) => (
          <CategoryCard
            key={index}
            icon={category.icon}
            title={category.title}
            vacancies={category.vacancies}
          />
        ))}
      </div>
    </div>
  );
};

export default Categories;
