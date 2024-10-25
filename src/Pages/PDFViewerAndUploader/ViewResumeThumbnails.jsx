import { useState, useEffect } from 'react';
import '@react-pdf-viewer/core/lib/styles/index.css'; // PDF viewer styles
import PropTypes from 'prop-types';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist/build/pdf'; // Import getDocument and GlobalWorkerOptions
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.js'; // Import the worker locally

// Set the worker source directly using the correct path
GlobalWorkerOptions.workerSrc = pdfWorker;

const ViewResumeThumbnails = ({ files, onClick }) => {
  const [thumbnails, setThumbnails] = useState([]);

  // Function to get the first page of each PDF file
  const loadThumbnails = async () => {
    const loadedThumbnails = await Promise.all(
      files.map(async (file) => {
        const pdfUrl = `http://localhost:5000/resume/${file.filename}`; // URL to fetch the PDF
        const pdfDoc = await getDocument(pdfUrl).promise; // Load the PDF document
        const page = await pdfDoc.getPage(1); // Get the first page
        const viewport = page.getViewport({ scale: 0.4 }); // Adjust scale for thumbnail size
        const canvas = document.createElement('canvas'); // Create a canvas for rendering
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({
          canvasContext: context,
          viewport: viewport,
        }).promise;

        return {
          filename: file.filename,
          thumbnail: canvas.toDataURL(), // Convert canvas to Data URL for thumbnail image
        };
      })
    );

    setThumbnails(loadedThumbnails);
  };

  // Load thumbnails when the component mounts or when files change
  useEffect(() => {
    loadThumbnails();
  }, [files]);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px'}}>
      {thumbnails.map((thumbnail, index) => (
        <div key={index} style={{ cursor: 'pointer', width: '200px', height: '300px', overflow: 'hidden', position: 'relative' }} onClick={() => onClick(thumbnail.filename)}>
          <img 
            src={thumbnail.thumbnail} 
            alt={`Thumbnail of ${thumbnail.filename}`} 
            style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }} 
          />
          <p style={{ textAlign: 'center', marginTop: '5px' }}>{thumbnail.filename}</p>
        </div>
      ))}
    </div>
  );
};

ViewResumeThumbnails.propTypes = {
  files: PropTypes.arrayOf(
    PropTypes.shape({
      filename: PropTypes.string.isRequired,
    })
  ).isRequired,
  onClick: PropTypes.func.isRequired,
};

export default ViewResumeThumbnails;
