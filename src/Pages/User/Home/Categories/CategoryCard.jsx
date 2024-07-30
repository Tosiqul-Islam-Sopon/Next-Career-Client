// src/components/CategoryCard.js
import PropTypes from 'prop-types';

const CategoryCard = ({ icon, title, vacancies }) => {
  return (
    <div className="bg-white shadow-md p-6 rounded-lg text-center transform transition-transform duration-500 hover:scale-105">
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
