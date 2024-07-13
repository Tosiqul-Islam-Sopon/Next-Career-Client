import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
// import logo from "../../../../assets/Images/logo.png";

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white py-8">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0 text-center">
                        <h2 className="text-2xl font-bold">InnovateX</h2>
                        <p className='text-center'>Transforming Ideas into Reality.</p>
                    </div>
                    
                    <div className="mb-4 md:mb-0">
                        <p className="mb-1">Email: contact@innovatex.com</p>
                        <p className="mb-1">Phone: +1 (234) 567-890</p>
                        <p>Address: 123 Innovation Drive, Tech City, TX 78901</p>
                    </div>
                    
                    <div className="flex space-x-4 mb-4 md:mb-0">
                        <a href="https://facebook.com" className="text-gray-400 hover:text-white">
                            <FaFacebook size={24} />
                        </a>
                        <a href="https://twitter.com" className="text-gray-400 hover:text-white">
                            <FaTwitter size={24} />
                        </a>
                        <a href="https://instagram.com" className="text-gray-400 hover:text-white">
                            <FaInstagram size={24} />
                        </a>
                        <a href="https://linkedin.com" className="text-gray-400 hover:text-white">
                            <FaLinkedin size={24} />
                        </a>
                    </div>
                </div>
                
                <div className="text-center mt-4 md:mt-8">
                    <p className="text-gray-400">&copy; 2024 InnovateX. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
