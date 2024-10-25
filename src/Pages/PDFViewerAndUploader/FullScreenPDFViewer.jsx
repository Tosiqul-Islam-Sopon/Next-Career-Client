import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import PropTypes from 'prop-types';
import { zoomPlugin } from '@react-pdf-viewer/zoom';
import { fullScreenPlugin } from '@react-pdf-viewer/full-screen';
import { printPlugin } from '@react-pdf-viewer/print';
import { pageNavigationPlugin } from '@react-pdf-viewer/page-navigation';

const FullScreenPDFViewer = ({ fileUrl, onClose }) => {
  // Create plugins
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const zoomPluginInstance = zoomPlugin();
  const fullScreenPluginInstance = fullScreenPlugin();
  const printPluginInstance = printPlugin();
  const pageNavigationPluginInstance = pageNavigationPlugin();

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1000 }}>
      {/* Close button positioned at the middle of the bottom */}
      <button 
        onClick={onClose} 
        style={{
          position: 'absolute',
          bottom: '20px', // 20 pixels from the bottom
          left: '50%', // Center horizontally
          transform: 'translateX(-50%)', // Adjust to truly center
          zIndex: 1100,
          background: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white background
          border: '2px solid black', // Border for visibility
          color: 'black', // Text color
          fontSize: '24px', // Adjust size as needed
          cursor: 'pointer',
          borderRadius: '5px', // Slightly rounded corners
          padding: '10px 15px', // Padding for better touch area
        }}>
        &#10005; {/* This represents the close sign (X) */}
      </button>
      <div style={{ width: '100%', height: '100%' }}>
        <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
          <Viewer
            fileUrl={fileUrl}
            plugins={[
                defaultLayoutPluginInstance,
                zoomPluginInstance,
                fullScreenPluginInstance,
                printPluginInstance,
                pageNavigationPluginInstance
            ]}
          />
        </Worker>
      </div>
    </div>
  );
};

FullScreenPDFViewer.propTypes = {
  fileUrl: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default FullScreenPDFViewer;
