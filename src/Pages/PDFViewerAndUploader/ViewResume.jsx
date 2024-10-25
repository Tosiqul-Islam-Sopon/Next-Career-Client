import { useEffect, useState } from 'react';
import axios from 'axios';
import ResumeViewer from './ResumeViewer';
import PropTypes from 'prop-types';

const ViewResume = () => {
  const [resumes, setResumes] = useState([]);

  // Fetch all the resumes from the backend
  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/allResumes');
        setResumes(response.data);
      } catch (error) {
        console.error('Error fetching resumes:', error);
      }
    };

    fetchResumes();
  }, []);

  console.log({ resumes });

  return (
    <div>
      <h2>Resume Viewer</h2>
      {resumes.length === 0 ? (
        <p>No resumes available</p>
      ) : (
        <ResumeViewer resumes={resumes} />
      )}
    </div>
  );
};

ViewResume.propTypes = {
  resumes: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      filename: PropTypes.string.isRequired,
    })
  ),
};

export default ViewResume;
