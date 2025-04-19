"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { MdBusinessCenter, MdPeople, MdTimeline, MdStarRate } from "react-icons/md"

// Import images
import img1 from "../../../../assets/Images/about/about1.jpg"
import img2 from "../../../../assets/Images/about/about2.jpg"
import img3 from "../../../../assets/Images/about/about3.jpg"
import img4 from "../../../../assets/Images/about/about4.jpg"

const AboutUs = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  return (
    <div className="bg-gray-50 py-16 md:py-24">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={fadeIn}
          className="text-center mb-16"
        >
          <h2 className="text-sm font-semibold text-blue-600 tracking-wide uppercase mb-2">Our Story</h2>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">About Next Career</h1>
          <div className="h-1 w-20 bg-blue-600 mx-auto mb-6"></div>
          <p className="max-w-2xl mx-auto text-lg text-gray-600">
            Connecting talented professionals with their dream careers since 2015
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image Grid Section */}
          <motion.div
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            variants={staggerChildren}
            className="grid grid-cols-2 gap-4 md:gap-6"
          >
            <motion.div variants={fadeIn} className="relative overflow-hidden rounded-lg shadow-lg h-48 md:h-64">
              <img
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                src={img1 || "/placeholder.svg"}
                alt="Team collaboration in modern office"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            </motion.div>
            <motion.div variants={fadeIn} className="relative overflow-hidden rounded-lg shadow-lg h-48 md:h-64">
              <img
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                src={img2 || "/placeholder.svg"}
                alt="Professional workspace environment"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            </motion.div>
            <motion.div variants={fadeIn} className="relative overflow-hidden rounded-lg shadow-lg h-48 md:h-64">
              <img
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                src={img3 || "/placeholder.svg"}
                alt="Team meeting and strategy discussion"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            </motion.div>
            <motion.div variants={fadeIn} className="relative overflow-hidden rounded-lg shadow-lg h-48 md:h-64">
              <img
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                src={img4 || "/placeholder.svg"}
                alt="Career professionals in action"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            </motion.div>
          </motion.div>

          {/* Content Section */}
          <motion.div
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            variants={staggerChildren}
            className="space-y-8"
          >
            <motion.div variants={fadeIn}>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Next Career</h2>
              <div className="h-1 w-16 bg-blue-600 mb-6"></div>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                At Next Career, we are dedicated to helping you find the perfect job that matches your skills and
                passions. Our platform connects you with top employers looking for talented professionals just like you.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Join our community and take the next step in your career journey. Whether you&apos;re looking for a new
                challenge, a better opportunity, or a complete career change, Next Career is here to support you every
                step of the way.
              </p>
            </motion.div>

            {/* Stats Section */}
            <motion.div variants={fadeIn} className="grid grid-cols-2 gap-6 mt-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center mb-2">
                  <MdBusinessCenter className="text-blue-600 text-2xl mr-2" />
                  <h3 className="font-semibold text-gray-900">10,000+</h3>
                </div>
                <p className="text-gray-600 text-sm">Job Opportunities</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center mb-2">
                  <MdPeople className="text-blue-600 text-2xl mr-2" />
                  <h3 className="font-semibold text-gray-900">5,000+</h3>
                </div>
                <p className="text-gray-600 text-sm">Successful Placements</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center mb-2">
                  <MdTimeline className="text-blue-600 text-2xl mr-2" />
                  <h3 className="font-semibold text-gray-900">8+ Years</h3>
                </div>
                <p className="text-gray-600 text-sm">Industry Experience</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center mb-2">
                  <MdStarRate className="text-blue-600 text-2xl mr-2" />
                  <h3 className="font-semibold text-gray-900">4.8/5</h3>
                </div>
                <p className="text-gray-600 text-sm">Client Satisfaction</p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Mission Statement */}
        <motion.div
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={fadeIn}
          className="mt-20 bg-blue-600 rounded-lg p-8 md:p-12 text-center text-white"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-lg md:text-xl max-w-3xl mx-auto">
            To empower professionals to achieve their career aspirations by connecting them with opportunities that
            align with their skills, values, and ambitions.
          </p>
        </motion.div>

        {/* Core Values */}
        <motion.div
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={staggerChildren}
          className="mt-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <div className="h-1 w-20 bg-blue-600 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div variants={fadeIn} className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">Integrity</h3>
              <p className="text-gray-600 text-center">
                We uphold the highest standards of honesty and ethical conduct in all our interactions.
              </p>
            </motion.div>

            <motion.div variants={fadeIn} className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">Innovation</h3>
              <p className="text-gray-600 text-center">
                We continuously seek new ways to improve our services and create value for our users.
              </p>
            </motion.div>

            <motion.div variants={fadeIn} className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">Community</h3>
              <p className="text-gray-600 text-center">
                We foster a supportive environment where professionals can connect, learn, and grow together.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AboutUs
