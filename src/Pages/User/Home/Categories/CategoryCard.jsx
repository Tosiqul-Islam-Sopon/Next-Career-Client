import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const CategoryCard = ({ icon, title, vacancies }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/jobs/${title}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white shadow-md p-6 rounded-lg text-center transform transition-transform duration-500 hover:scale-105 cursor-pointer"
    >
      <div className="flex justify-center mb-4 text-green-500">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-green-500">{vacancies} Vacancy</p>
    </div>
  );
};

CategoryCard.propTypes = {
  icon: PropTypes.element.isRequired,
  title: PropTypes.string.isRequired,
  vacancies: PropTypes.number.isRequired,
};

export default CategoryCard;
