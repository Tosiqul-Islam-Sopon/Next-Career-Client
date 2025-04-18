import {
    FaFacebook,
    FaTwitter,
    FaInstagram,
    FaLinkedin,
    FaMapMarkerAlt,
    FaPhone,
    FaEnvelope,
    FaChevronRight,
  } from "react-icons/fa";
  
  const Footer = () => {
    const currentYear = new Date().getFullYear();
  
    return (
      <footer className="bg-gray-900 text-gray-300">
        {/* Main Footer */}
        <div className="pt-16 pb-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Company Info */}
              <div>
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-white">Next Career</h2>
                </div>
                <p className="mb-4 text-gray-400 text-sm leading-relaxed">
                  Next Career is your trusted career companion. We connect talented individuals with top companies and streamline the recruitment journey with powerful tools and real-time collaboration.
                </p>
                <div className="flex space-x-4 mt-6">
                  <a
                    href="https://facebook.com"
                    className="bg-gray-800 hover:bg-blue-600 h-10 w-10 rounded-full flex items-center justify-center transition-colors duration-300"
                  >
                    <FaFacebook size={18} />
                  </a>
                  <a
                    href="https://twitter.com"
                    className="bg-gray-800 hover:bg-blue-400 h-10 w-10 rounded-full flex items-center justify-center transition-colors duration-300"
                  >
                    <FaTwitter size={18} />
                  </a>
                  <a
                    href="https://instagram.com"
                    className="bg-gray-800 hover:bg-pink-600 h-10 w-10 rounded-full flex items-center justify-center transition-colors duration-300"
                  >
                    <FaInstagram size={18} />
                  </a>
                  <a
                    href="https://linkedin.com"
                    className="bg-gray-800 hover:bg-blue-700 h-10 w-10 rounded-full flex items-center justify-center transition-colors duration-300"
                  >
                    <FaLinkedin size={18} />
                  </a>
                </div>
              </div>
  
              {/* Quick Links */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-gray-700 inline-block">
                  Quick Links
                </h3>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="/about"
                      className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center"
                    >
                      <FaChevronRight className="mr-2 text-xs" /> About Next Career
                    </a>
                  </li>
                  <li>
                    <a
                      href="/services"
                      className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center"
                    >
                      <FaChevronRight className="mr-2 text-xs" /> Our Platform
                    </a>
                  </li>
                  <li>
                    <a
                      href="/jobs"
                      className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center"
                    >
                      <FaChevronRight className="mr-2 text-xs" /> Job Opportunities
                    </a>
                  </li>
                  <li>
                    <a
                      href="/careers"
                      className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center"
                    >
                      <FaChevronRight className="mr-2 text-xs" /> Career Support
                    </a>
                  </li>
                  <li>
                    <a
                      href="/contact"
                      className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center"
                    >
                      <FaChevronRight className="mr-2 text-xs" /> Get in Touch
                    </a>
                  </li>
                </ul>
              </div>
  
              {/* Services */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-gray-700 inline-block">
                  Our Services
                </h3>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="/services/software-development"
                      className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center"
                    >
                      <FaChevronRight className="mr-2 text-xs" /> Job Posting & Tracking
                    </a>
                  </li>
                  <li>
                    <a
                      href="/services/web-design"
                      className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center"
                    >
                      <FaChevronRight className="mr-2 text-xs" /> AI Candidate Matching
                    </a>
                  </li>
                  <li>
                    <a
                      href="/services/mobile-apps"
                      className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center"
                    >
                      <FaChevronRight className="mr-2 text-xs" /> Stage-based Recruitment
                    </a>
                  </li>
                  <li>
                    <a
                      href="/services/cloud-solutions"
                      className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center"
                    >
                      <FaChevronRight className="mr-2 text-xs" /> Real-time Notifications
                    </a>
                  </li>
                  <li>
                    <a
                      href="/services/consulting"
                      className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center"
                    >
                      <FaChevronRight className="mr-2 text-xs" /> Resume Insights
                    </a>
                  </li>
                </ul>
              </div>
  
              {/* Contact Info */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-gray-700 inline-block">
                  Contact Us
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <FaMapMarkerAlt className="mt-1 mr-3 text-blue-500" />
                    <span>Dhaka, Bangladesh</span>
                  </li>
                  <li className="flex items-center">
                    <FaPhone className="mr-3 text-blue-500" />
                    <span>+880 123 456 789</span>
                  </li>
                  <li className="flex items-center">
                    <FaEnvelope className="mr-3 text-blue-500" />
                    <a
                      href="mailto:support@nextcareer.io"
                      className="hover:text-white transition-colors duration-300"
                    >
                      support@nextcareer.io
                    </a>
                  </li>
                </ul>
  
                {/* Newsletter Signup */}
                <div className="mt-6">
                  <h4 className="text-white text-sm font-semibold mb-2">
                    Subscribe to our newsletter
                  </h4>
                  <div className="flex">
                    <input
                      type="email"
                      placeholder="Your email"
                      className="bg-gray-800 text-sm rounded-l-md px-4 py-2 w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-md text-sm font-medium transition-colors duration-300">
                      Subscribe
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        {/* Bottom Footer */}
        <div className="py-4 border-t border-gray-800 bg-gray-950">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-sm text-gray-500 mb-4 md:mb-0">
                &copy; {currentYear} Next Career. All rights reserved.
              </div>
              <div className="flex space-x-6 text-sm">
                <a href="/privacy" className="text-gray-500 hover:text-white transition-colors duration-300">
                  Privacy Policy
                </a>
                <a href="/terms" className="text-gray-500 hover:text-white transition-colors duration-300">
                  Terms of Service
                </a>
                <a href="/cookies" className="text-gray-500 hover:text-white transition-colors duration-300">
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  