"use client"

import { useContext, useEffect, useState } from "react"
import useAxiosBase, { baseUrl } from "../../../CustomHooks/useAxiosBase"
import { useQuery } from "@tanstack/react-query"
import { useLocation, useParams } from "react-router-dom"
import {
  Phone,
  MapPin,
  Flag,
  Mail,
  Briefcase,
  GraduationCap,
  Clock,
  Building,
  BookOpen,
  Award,
  CheckCircle,
  Download,
  Linkedin,
  Github,
  Globe,
  Languages,
  Code,
  Star,
  FileText,
  X,
} from "lucide-react"
import RecruitmentProgressBar from "../../Recruiter/MyPostedJobs/RecruitmentProgressBar"
import Swal from "sweetalert2"
import { AuthContext } from "../../../Providers/AuthProvider"

// Add these animation styles
const animationStyles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideUp {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out;
  }
  
  .animate-slideUp {
    animation: slideUp 0.3s ease-out;
  }
`

const UserProfile = () => {
  const { user } = useContext(AuthContext)
  const { userId } = useParams()
  const location = useLocation()
  const jobId = location.state?.jobId
  const axiosBase = useAxiosBase()

  /* ------------------ local UI state ------------------ */
  const [activeTab, setActiveTab] = useState("resume")
  const [notes, setNotes] = useState("")
  const [showHireConfirmation, setShowHireConfirmation] = useState(false)
  const [showDateTimePicker, setShowDateTimePicker] = useState(false)
  const [selectedDate, setSelectedDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [showRejectConfirmation, setShowRejectConfirmation] = useState(false)

  /* --- NEW: localProgressStages mirrors backend data --- */
  const [localProgressStages, setLocalProgressStages] = useState([])
  const [isRejected, setIsRejected] = useState(false)

  /* ---------------------------------------------------- */
  /* queries (unchanged except for naming)               */
  /* ---------------------------------------------------- */

  const { data: recruiterInfo = null, isLoading: isRecruiterLoading } = useQuery({
    queryKey: ["user", user?.email],
    queryFn: () => axiosBase.get(`/user-by-email/${user?.email}`).then((r) => r.data),
    enabled: !!user?.email,
  })

  const { data: userInfo = null, isLoading } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => axiosBase.get(`/user/${userId}`).then((r) => r.data),
    enabled: !!userId,
  })

  const { data: fetchedJobData = null, isLoading: jobLoading } = useQuery({
    queryKey: ["job", jobId],
    queryFn: () => axiosBase.get(`/jobs/job/${jobId}`).then((r) => r.data),
    enabled: !!jobId,
  })

  const { isLoading: stageLoading, refetch: progressRefetch } = useQuery({
    queryKey: ["progressStages", userId, jobId],
    queryFn: async () => {
      const { data } = await axiosBase.get(`/applications/progressStages/${jobId}/${userId}`)
      setLocalProgressStages(data.progressStages || [])
      setIsRejected(data.rejected || false)
    },
    enabled: !!userId && !!jobId,
  })

  /* ----------------------------------------- */
  /* keep job data in local state if needed    */
  /* ----------------------------------------- */
  const [jobData, setJobData] = useState(null)
  useEffect(() => {
    if (fetchedJobData) setJobData(fetchedJobData)
  }, [fetchedJobData])

  /* ========= helper ========= */
  const formatDate = (d) => {
    if (!d) return "Present"
    const date = new Date(d)
    return isNaN(date) ? d : date.toLocaleDateString("en-US", { year: "numeric", month: "short" })
  }

  /* ========= stage utilities ========= */
  const pushStageOptimistic = (stage) => {
    setLocalProgressStages((prev) => (prev.includes(stage) ? prev : [...prev, stage]))
    setJobData((prev) => {
      if (!prev) return prev
      const done = prev.completedStages || []
      return {
        ...prev,
        completedStages: done.includes(stage) ? done : [...done, stage],
      }
    })
  }

  const popStageRollback = () => {
    setLocalProgressStages((prev) => prev.slice(0, -1))
    setJobData((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        completedStages: (prev.completedStages || []).slice(0, -1),
      }
    })
  }

  /* ========= actions ========= */
  const handleSelectForNextStep = () => {
    if (!jobData?.recruitmentStages) return
    const nextStage = jobData.recruitmentStages[localProgressStages.length]
    if (!nextStage) return

    nextStage.toLowerCase() === "hire" ? setShowHireConfirmation(true) : setShowDateTimePicker(true)
  }

  const advanceStageRequest = async (currentStage) => {
    await axiosBase.patch(`/jobs/advanceStage/${jobId}/${userId}`, {
      stage: currentStage,
    })
    await progressRefetch() // keep query fresh
  }

  const handleHireConfirm = async () => {
    const currentStage = jobData?.recruitmentStages[localProgressStages.length]
    if (!currentStage) return

    pushStageOptimistic(currentStage)
    setShowHireConfirmation(false)

    try {
      await advanceStageRequest(currentStage)
      Swal.fire({
        icon: "success",
        title: "Candidate hired",
        timer: 2500,
        showConfirmButton: false,
      })
    } catch {
      popStageRollback()
      Swal.fire({
        icon: "error",
        title: "Hiring failed",
        timer: 2000,
        showConfirmButton: false,
      })
    }
  }

  const handleSubmit = async () => {
    if (!selectedDate || !startTime || !endTime) {
      Swal.fire({
        icon: "error",
        title: "Complete all fields",
        timer: 1800,
        showConfirmButton: false,
      })
      return
    }
    const currentStage = jobData?.recruitmentStages[localProgressStages.length]
    const nextStage = jobData?.recruitmentStages[localProgressStages.length + 1]
    if (!currentStage) return

    pushStageOptimistic(currentStage)
    setShowDateTimePicker(false)

    try {
      await advanceStageRequest(currentStage)
      await axiosBase.post("/job/schedule", {
        jobId,
        recruiterId: recruiterInfo?._id,
        candidateId: userId,
        stageName: nextStage,
        scheduledDate: selectedDate,
        startTime,
        endTime,
        note: notes,
      })
      Swal.fire({
        icon: "success",
        title: "Candidate advanced",
        timer: 2500,
        showConfirmButton: false,
      })
      setSelectedDate("")
      setStartTime("")
      setEndTime("")
      setNotes("")
    } catch {
      popStageRollback()
      Swal.fire({
        icon: "error",
        title: "Something went wrong",
        timer: 2500,
        showConfirmButton: false,
      })
    }
  }

  const handleCancel = () => {
    setShowDateTimePicker(false)
    setSelectedDate("")
    setStartTime("")
    setEndTime("")
    setNotes("")
  }

  const handleReject = async () => {
    try {
      await axiosBase.patch(`/jobs/rejectCandidate/${jobId}/${userId}`)
      setIsRejected(true)
      Swal.fire({
        icon: "success",
        title: "Candidate rejected",
        text: "The candidate has been removed from consideration.",
        timer: 2500,
        showConfirmButton: false,
      })
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Rejection failed",
        text: "There was an error rejecting the candidate.",
        timer: 2000,
        showConfirmButton: false,
      })
    }
  }

  const handleDownloadResume = async () => {
    try {
      Swal.fire({
        title: "Generating PDF...",
        text: "Please wait while we prepare the resume",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading()
        },
      })

      // Import jsPDF
      const { jsPDF } = await import("jspdf")

      // Create a new document
      const doc = new jsPDF()

      // Set font sizes
      const titleFontSize = 16
      const headingFontSize = 14
      const normalFontSize = 10
      const smallFontSize = 8

      // Set initial position
      let yPos = 20
      const leftMargin = 20
      const pageWidth = 210 // A4 width in mm
      const contentWidth = pageWidth - leftMargin * 2

      // Helper function to add text and update position
      const addText = (text, fontSize, isBold = false, indent = 0) => {
        doc.setFontSize(fontSize)
        if (isBold) {
          doc.setFont("helvetica", "bold")
        } else {
          doc.setFont("helvetica", "normal")
        }

        // Check if we need a new page
        if (yPos > 280) {
          doc.addPage()
          yPos = 20
        }

        doc.text(text, leftMargin + indent, yPos)
        yPos += fontSize * 0.5
      }

      // Add a line and update position
      const addLine = () => {
        yPos += 5
        doc.setDrawColor(200, 200, 200)
        doc.line(leftMargin, yPos, pageWidth - leftMargin, yPos)
        yPos += 5
      }

      // Add space
      const addSpace = (space = 5) => {
        yPos += space
      }

      // Fetch and add profile image
      try {
        const profileImageUrl = `${baseUrl}/profileImage/${userInfo._id}`

        // Create a temporary image element to load the image
        const img = new Image()
        img.crossOrigin = "Anonymous" // Important for CORS

        // Wait for the image to load
        await new Promise((resolve, reject) => {
          img.onload = resolve
          img.onerror = () => {
            console.warn("Failed to load profile image, continuing without it")
            resolve()
          }
          img.src = profileImageUrl
        })

        // If image loaded successfully, add it to the PDF
        if (img.complete && img.naturalHeight !== 0) {
          // Convert the image to a data URL
          const canvas = document.createElement("canvas")
          canvas.width = img.width
          canvas.height = img.height
          const ctx = canvas.getContext("2d")
          ctx.drawImage(img, 0, 0)

          const imageData = canvas.toDataURL("image/jpeg")

          // Add image to PDF (right aligned)
          const imgWidth = 30 // mm
          const imgHeight = (img.height * imgWidth) / img.width
          doc.addImage(imageData, "JPEG", pageWidth - leftMargin - imgWidth, yPos, imgWidth, imgHeight)

          // Adjust yPos to account for the image
          yPos += imgHeight + 5
        }
      } catch (error) {
        console.warn("Error adding profile image to PDF:", error)
        // Continue without the image
      }

      // Header with name and title
      addText(userInfo?.name || "Candidate", titleFontSize, true)
      addText(userInfo?.title || "Professional", normalFontSize)
      addSpace()

      // Contact information
      if (userInfo?.email) {
        addText(`Email: ${userInfo.email}`, smallFontSize)
      }
      if (userInfo?.personalInfo?.contactNo) {
        addText(`Phone: ${userInfo.personalInfo.contactNo}`, smallFontSize)
      }
      if (userInfo?.personalInfo?.presentAddress) {
        addText(`Address: ${userInfo.personalInfo.presentAddress}`, smallFontSize)
      }
      if (userInfo?.personalInfo?.nationality) {
        addText(`Nationality: ${userInfo.personalInfo.nationality}`, smallFontSize)
      }

      addLine()

      // Professional Summary
      if (userInfo?.personalInfo?.bio) {
        addText("Professional Summary", headingFontSize, true)
        addSpace()

        // Split bio into multiple lines if needed
        const bioLines = doc.splitTextToSize(userInfo.personalInfo.bio, contentWidth)
        bioLines.forEach((line) => {
          addText(line, normalFontSize)
          yPos += 2 // Add a bit more space between lines
        })

        addLine()
      }

      // Work Experience
      if (userInfo?.experience && userInfo.experience.length > 0) {
        addText("Work Experience", headingFontSize, true)
        addSpace()

        userInfo.experience.forEach((exp, index) => {
          addText(exp.title, normalFontSize, true)
          addText(`${exp.company} | ${formatDate(exp.startDate)} - ${formatDate(exp.endDate)}`, smallFontSize)

          if (exp.description) {
            addSpace(3)
            const descLines = doc.splitTextToSize(exp.description, contentWidth - 5)
            descLines.forEach((line) => {
              addText(line, smallFontSize, false, 5)
            })
          }

          if (index < userInfo.experience.length - 1) {
            addSpace(8)
          }
        })

        addLine()
      }

      // Education
      if (userInfo?.education && userInfo.education.length > 0) {
        addText("Education", headingFontSize, true)
        addSpace()

        userInfo.education.forEach((edu, index) => {
          addText(edu.degree, normalFontSize, true)
          addText(`${edu.institution} | ${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}`, smallFontSize)
          addText(`Subject: ${edu.subject}`, smallFontSize)

          if (edu.grade) {
            addText(`Grade: ${edu.grade}`, smallFontSize)
          }

          if (index < userInfo.education.length - 1) {
            addSpace(8)
          }
        })

        addLine()
      }

      // Skills
      if (userInfo?.skills && userInfo.skills.length > 0) {
        addText("Skills", headingFontSize, true)
        addSpace()

        const skillsText = userInfo.skills.join(", ")
        const skillsLines = doc.splitTextToSize(skillsText, contentWidth)
        skillsLines.forEach((line) => {
          addText(line, normalFontSize)
        })

        addLine()
      }

      // Languages
      if (userInfo?.languages && userInfo.languages.length > 0) {
        addText("Languages", headingFontSize, true)
        addSpace()

        userInfo.languages.forEach((lang, index) => {
          addText(`${lang.name}: ${lang.level}/5`, normalFontSize)
          if (index < userInfo.languages.length - 1) {
            addSpace(2)
          }
        })

        addLine()
      }

      // Links
      if (userInfo?.links && userInfo.links.length > 0) {
        addText("Links", headingFontSize, true)
        addSpace()

        userInfo.links.forEach((link, index) => {
          const linkText = link.label ? `${link.label}: ${link.url}` : link.url
          const linkLines = doc.splitTextToSize(linkText, contentWidth)
          linkLines.forEach((line) => {
            addText(line, smallFontSize)
          })

          if (index < userInfo.links.length - 1) {
            addSpace(2)
          }
        })
      }

      // Save the PDF
      doc.save(`${userInfo?.name || "candidate"}_resume.pdf`)

      Swal.close()
    } catch (error) {
      console.error("Error generating PDF:", error)
      Swal.fire({
        icon: "error",
        title: "Download failed",
        text: "There was an error downloading the resume. Please try again.",
        timer: 3000,
        showConfirmButton: false,
      })
    }
  }

  // Check if all recruitment stages are completed
  const allStagesCompleted =
    jobData?.recruitmentStages && localProgressStages.length >= jobData.recruitmentStages.length

  if (isLoading || jobLoading || isRecruiterLoading || stageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-t-4 border-blue-600 border-solid rounded-full animate-spin"></div>
          <p className="mt-4 text-lg text-gray-700">Loading profile information...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-100 min-h-screen pt-24 pb-12">
      <style>{animationStyles}</style>
      <div className="max-w-5xl mx-auto px-4">
        {/* Resume Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Candidate Profile</h1>
          <div className="flex space-x-3">
            <button
              onClick={handleDownloadResume}
              className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Resume
            </button>
          </div>
        </div>

        {/* Resume Paper */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6 border border-gray-200">
          {/* Navigation Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto scrollbar-hide">
              <button
                onClick={() => setActiveTab("resume")}
                className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                  activeTab === "resume"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Resume
              </button>
              <button
                onClick={() => setActiveTab("education")}
                className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                  activeTab === "education"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Education
              </button>
              <button
                onClick={() => setActiveTab("experience")}
                className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                  activeTab === "experience"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Experience
              </button>
            </div>
          </div>

          {activeTab === "resume" && (
            <div className="p-8" id="resume-content">
              {/* Resume Header */}
              <div className="flex flex-col md:flex-row md:items-center mb-8 border-b border-gray-200 pb-6">
                <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                  <div className="h-32 w-32 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center border border-gray-200">
                    <img
                      loading="lazy"
                      className="h-full w-full object-cover"
                      src={`${baseUrl}/profileImage/${userInfo._id}`}
                      alt={`${userInfo.name}`}
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = "/placeholder.svg"
                      }}
                    />
                  </div>
                </div>
                <div className="flex-grow">
                  <h1 className="text-3xl font-bold text-gray-900 mb-1">{userInfo?.name}</h1>
                  <p className="text-lg text-gray-600 mb-3">{userInfo?.title || "Professional"}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="flex items-center text-gray-600">
                      <Mail className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-sm">{userInfo?.email}</span>
                    </div>
                    {userInfo?.personalInfo?.contactNo && (
                      <div className="flex items-center text-gray-600">
                        <Phone className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="text-sm">{userInfo?.personalInfo?.contactNo}</span>
                      </div>
                    )}
                    {userInfo?.personalInfo?.presentAddress && (
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="text-sm">{userInfo.personalInfo.presentAddress}</span>
                      </div>
                    )}
                    {userInfo?.personalInfo?.nationality && (
                      <div className="flex items-center text-gray-600">
                        <Flag className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="text-sm">{userInfo.personalInfo.nationality}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Professional Summary */}
              {userInfo?.personalInfo?.bio && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200 flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-blue-600" />
                    Professional Summary
                  </h2>
                  <p className="text-gray-700 leading-relaxed">{userInfo.personalInfo.bio}</p>
                </div>
              )}

              {/* Work Experience */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200 flex items-center">
                  <Briefcase className="h-5 w-5 mr-2 text-blue-600" />
                  Work Experience
                </h2>

                {userInfo?.experience && userInfo.experience.length > 0 ? (
                  <div className="space-y-6">
                    {userInfo.experience.map((exp, index) => (
                      <div key={index} className="flex">
                        <div className="mr-4 flex-shrink-0">
                          <div className="h-12 w-12 rounded-md bg-blue-100 flex items-center justify-center">
                            <Building className="h-6 w-6 text-blue-600" />
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{exp.title}</h3>
                          <div className="flex flex-wrap items-center text-gray-600 mt-1 mb-2">
                            <span className="font-medium">{exp.company}</span>
                            <span className="mx-2">•</span>
                            <span className="text-sm">
                              {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                            </span>
                          </div>
                          {exp.description && <p className="text-gray-700 text-sm">{exp.description}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No experience information available.</p>
                )}
              </div>

              {/* Education */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200 flex items-center">
                  <GraduationCap className="h-5 w-5 mr-2 text-blue-600" />
                  Education
                </h2>

                {userInfo?.education && userInfo.education.length > 0 ? (
                  <div className="space-y-6">
                    {userInfo.education.map((edu, index) => (
                      <div key={index} className="flex">
                        <div className="mr-4 flex-shrink-0">
                          <div className="h-12 w-12 rounded-md bg-blue-100 flex items-center justify-center">
                            <GraduationCap className="h-6 w-6 text-blue-600" />
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{edu.degree}</h3>
                          <div className="flex flex-wrap items-center text-gray-600 mt-1 mb-2">
                            <span className="font-medium">{edu.institution}</span>
                            <span className="mx-2">•</span>
                            <span className="text-sm">
                              {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                            </span>
                          </div>
                          <div className="flex items-center text-gray-700 mb-1 text-sm">
                            <BookOpen className="h-4 w-4 mr-2 text-gray-500" />
                            <span>{edu.subject}</span>
                          </div>
                          {edu.grade && (
                            <div className="flex items-center text-gray-700 mb-1 text-sm">
                              <Award className="h-4 w-4 mr-2 text-gray-500" />
                              <span>Grade: {edu.grade}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No education information available.</p>
                )}
              </div>

              {/* Skills Section (Placeholder) */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200 flex items-center">
                  <Code className="h-5 w-5 mr-2 text-blue-600" />
                  Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {userInfo?.skills?.length > 0 ? (
                    userInfo.skills.map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">No skills information available.</p>
                  )}
                </div>
              </div>

              {/* Languages Section (Placeholder) */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200 flex items-center">
                  <Languages className="h-5 w-5 mr-2 text-blue-600" />
                  Languages
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userInfo?.languages?.length > 0 ? (
                    userInfo.languages.map((language, index) => (
                      <div key={index} className="flex items-center">
                        <span className="font-medium mr-2">{language.name}:</span>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < language.level ? "text-blue-500 fill-blue-500" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">No language information available.</p>
                  )}
                </div>
              </div>

              {/* Links Section (Placeholder) */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200 flex items-center">
                  <Globe className="h-5 w-5 mr-2 text-blue-600" />
                  Links
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userInfo?.links?.length > 0 ? (
                    userInfo.links.map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-600 hover:underline"
                      >
                        {link.type === "linkedin" ? (
                          <Linkedin className="h-4 w-4 mr-2" />
                        ) : link.type === "github" ? (
                          <Github className="h-4 w-4 mr-2" />
                        ) : (
                          <Globe className="h-4 w-4 mr-2" />
                        )}
                        {link.label || link.url}
                      </a>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">No links information available.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "education" && (
            <div className="p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <GraduationCap className="h-5 w-5 mr-2 text-blue-600" />
                Education History
              </h2>

              {userInfo?.education && userInfo.education.length > 0 ? (
                <div className="space-y-8">
                  {userInfo.education.map((edu, index) => (
                    <div key={index} className="border-l-2 border-blue-200 pl-6 pb-6 relative">
                      <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-blue-600"></div>
                      <div className="bg-white rounded-lg p-6 border border-gray-100 shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3">
                          <h3 className="text-xl font-semibold text-gray-900">{edu.degree}</h3>
                          <div className="flex items-center text-sm text-gray-500 mt-1 sm:mt-0">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>
                              {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center text-gray-700 mb-3">
                          <Building className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="font-medium">{edu.institution}</span>
                        </div>
                        <div className="flex items-center text-gray-700 mb-3">
                          <BookOpen className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{edu.subject}</span>
                        </div>
                        {edu.grade && (
                          <div className="flex items-center text-gray-700 mb-3">
                            <Award className="h-4 w-4 mr-2 text-gray-500" />
                            <span>Grade: {edu.grade}</span>
                          </div>
                        )}
                        {edu.activities && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-md">
                            <p className="text-sm text-gray-700">
                              <span className="font-medium">Activities:</span> {edu.activities}
                            </p>
                          </div>
                        )}
                        {edu.description && (
                          <div className="mt-3">
                            <p className="text-sm text-gray-600">{edu.description}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <GraduationCap className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No education information available.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "experience" && (
            <div className="p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Briefcase className="h-5 w-5 mr-2 text-blue-600" />
                Work Experience
              </h2>

              {userInfo?.experience && userInfo.experience.length > 0 ? (
                <div className="space-y-8">
                  {userInfo.experience.map((exp, index) => (
                    <div key={index} className="border-l-2 border-blue-200 pl-6 pb-6 relative">
                      <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-blue-600"></div>
                      <div className="bg-white rounded-lg p-6 border border-gray-100 shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3">
                          <h3 className="text-xl font-semibold text-gray-900">{exp.title}</h3>
                          <div className="flex items-center text-sm text-gray-500 mt-1 sm:mt-0">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>
                              {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center text-gray-700 mb-3">
                          <Building className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="font-medium">{exp.company}</span>
                        </div>
                        {exp.location && (
                          <div className="flex items-center text-gray-700 mb-3">
                            <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                            <span>{exp.location}</span>
                          </div>
                        )}
                        {exp.description && (
                          <div className="mt-3">
                            <p className="text-sm text-gray-600">{exp.description}</p>
                          </div>
                        )}
                        {exp.achievements && (
                          <div className="mt-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Key Achievements:</h4>
                            <ul className="list-disc pl-5 space-y-1">
                              {exp.achievements.map((achievement, i) => (
                                <li key={i} className="text-sm text-gray-600">
                                  {achievement}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No experience information available.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Rejected Status Indicator */}
        {isRejected && (
          <div className="bg-white rounded-lg shadow-sm mb-6 p-4">
            <div className="flex flex-col items-center justify-center text-red-500 py-3">
              <div className="flex items-center mb-1">
                <X className="h-6 w-6 mr-2" />
                <span className="font-medium text-lg">Candidate Rejected</span>
              </div>
              {jobData?.recruitmentStages && (
                <p className="text-gray-600 text-center">
                  {localProgressStages.length === 0
                    ? `Rejected at the first stage (${jobData.recruitmentStages[0]})`
                    : localProgressStages.length < jobData.recruitmentStages.length
                      ? `Completed ${localProgressStages.length} of ${jobData.recruitmentStages.length} stages. Rejected at the ${jobData.recruitmentStages[localProgressStages.length]} stage.`
                      : `Rejected after completing all stages.`}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Hired Status Indicator */}
        {allStagesCompleted && !isRejected && jobId && (
          <div className="bg-white rounded-lg shadow-sm mb-6 p-4">
            <div className="flex flex-col items-center justify-center text-green-500 py-3">
              <div className="flex items-center mb-1">
                <CheckCircle className="h-6 w-6 mr-2" />
                <span className="font-medium text-lg">Candidate Hired</span>
              </div>
              <p className="text-gray-600 text-center">
                This candidate has successfully completed all {jobData?.recruitmentStages?.length || 0} stages of the
                recruitment process.
              </p>
            </div>
          </div>
        )}

        {/* Recruitment Progress */}
        {jobId && jobData?.recruitmentStages && !isRejected && (
          <div className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
            <RecruitmentProgressBar stages={jobData?.recruitmentStages} completedStages={localProgressStages || []} />
          </div>
        )}

        {/* Action Button - Only show if not all stages are completed and not rejected */}
        {!allStagesCompleted && jobId && !isRejected && (
          <div className="mt-6 flex justify-center space-x-4">
            <button
              onClick={handleSelectForNextStep}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              Select For Next Step
            </button>
            <button
              onClick={() => setShowRejectConfirmation(true)}
              className="px-8 py-3 bg-white border border-red-500 text-red-500 hover:bg-red-50 font-medium rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              <X className="h-5 w-5 mr-2" />
              Reject Candidate
            </button>
          </div>
        )}
      </div>
      {/* Date Time Picker Popup */}
      {showDateTimePicker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-t-xl w-full max-w-lg p-6 animate-slideUp">
            <h3 className="text-xl font-semibold mb-4">Schedule Next Stage</h3>

            <div className="space-y-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    id="startTime"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    id="endTime"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any notes or instructions for the candidate..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Hire Confirmation Popup */}
      {showHireConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full animate-slideUp">
            <h3 className="text-lg font-semibold mb-4 text-center">Are you sure you want to hire this candidate?</h3>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowHireConfirmation(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
              >
                No
              </button>
              <button
                onClick={handleHireConfirm}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Reject Confirmation Popup */}
      {showRejectConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full animate-slideUp">
            <div className="flex items-center justify-center text-red-500 mb-4">
              <X className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-center">Reject Candidate</h3>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to reject this candidate? This action cannot be undone.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowRejectConfirmation(false)}
                className="px-5 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowRejectConfirmation(false)
                  handleReject()
                }}
                className="px-5 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition font-medium"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserProfile
