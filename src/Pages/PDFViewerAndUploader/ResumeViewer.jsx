import { useState, useEffect } from 'react';
import ViewResumeThumbnails from './ViewResumeThumbnails';
import FullScreenPDFViewer from './FullScreenPDFViewer';
import PropTypes from 'prop-types';

const ResumeViewer = ({ resumes }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  // Check for saved filename in local storage on mount
  useEffect(() => {
    const savedFile = localStorage.getItem('selectedResume');
    if (savedFile) {
      setSelectedFile(savedFile);
    }
  }, []);

  const handleThumbnailClick = (filename) => {
    setSelectedFile(filename);
    localStorage.setItem('selectedResume', filename); // Save to local storage
  };

  const handleCloseViewer = () => {
    setSelectedFile(null);
    localStorage.removeItem('selectedResume'); // Clear from local storage
  };

  return (
    <div>
      <h2>Resume Viewer</h2>
      <ViewResumeThumbnails files={resumes} onClick={handleThumbnailClick} />
      {selectedFile && (
        <FullScreenPDFViewer 
          fileUrl={`http://localhost:5000/resume/${selectedFile}`} 
          onClose={handleCloseViewer} 
        />
      )}
    </div>
  );
};

ResumeViewer.propTypes = {
  resumes: PropTypes.arrayOf(
    PropTypes.shape({
      filename: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default ResumeViewer;
