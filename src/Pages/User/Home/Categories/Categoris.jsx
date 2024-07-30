// src/components/CategoryGrid.js
import { FaHandshake } from 'react-icons/fa';
import CategoryCard from './CategoryCard';
import { 
  MdEmail, 
  MdHeadset, 
  MdPeople, 
  MdAssignment, 
  MdTrendingUp, 
  MdSchool, 
  MdDesignServices,
  
} from 'react-icons/md';
const categories = [
  { icon: <MdEmail size={40} />, title: 'Marketing', vacancies: 123 },
  { icon: <MdHeadset size={40} />, title: 'Customer Service', vacancies: 123 },
  { icon: <MdPeople size={40} />, title: 'Human Resource', vacancies: 123 },
  { icon: <MdAssignment size={40} />, title: 'Project Management', vacancies: 123 },
  { icon: <MdTrendingUp size={40} />, title: 'Business Development', vacancies: 123 },
  { icon: <FaHandshake size={40} />, title: 'Sales & Communication', vacancies: 123 },
  { icon: <MdSchool size={40} />, title: 'Teaching & Education', vacancies: 123 },
  { icon: <MdDesignServices size={40} />, title: 'Design & Creative', vacancies: 123 },
];

const Categories = () => {
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
