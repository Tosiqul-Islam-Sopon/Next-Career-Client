// import { useState } from 'react';
// import axios from 'axios';

// const UploadResume = () => {
//   const [file, setFile] = useState(null);

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     // Update the key to match backend expectations
//     formData.append('file', file); // Change 'resume' to 'file'

//     try {
//       await axios.post('http://localhost:5000/uploadResume', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//       alert('Resume uploaded successfully');
//     } catch (error) {
//       console.error(error);
//       alert('Failed to upload resume');
//     }
//   };

//   return (
//     <div>
//       <h2>Upload Resume</h2>
//       <form onSubmit={handleSubmit}>
//         <input type="file" onChange={handleFileChange} />
//         <button type="submit">Upload</button>
//       </form>
//     </div>
//   );
// };

// export default UploadResume;
