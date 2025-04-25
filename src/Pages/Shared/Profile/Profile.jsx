"use client";

import { useContext, useEffect, useState } from "react";
import useAxiosBase from "../../../CustomHooks/useAxiosBase";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useParams } from "react-router-dom";
import {
  User,
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
} from "lucide-react";
import RecruitmentProgressBar from "../../Recruiter/MyPostedJobs/RecruitmentProgressBar";
import Swal from "sweetalert2";
import { AuthContext } from "../../../Providers/AuthProvider";

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
`;

const UserProfile = () => {
  const { user } = useContext(AuthContext);
  const { userId } = useParams();
  const location = useLocation();
  const jobId = location.state?.jobId;
  const axiosBase = useAxiosBase();
  const [activeTab, setActiveTab] = useState("resume");
  const [notes, setNotes] = useState("");
  const [showHireConfirmation, setShowHireConfirmation] = useState(false);

  const { data: recruiterInfo = null, isRecruiterLoading } = useQuery({
    queryKey: ["user", user?.email],
    queryFn: async () => {
      const response = await axiosBase.get(`/user-by-email/${user?.email}`);
      return response.data;
    },
  });

  const { data: userInfo = null, isLoading } = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      const response = await axiosBase.get(`/user/${userId}`);
      return response.data;
    },
  });

  // Fetch job data including recruitment stages
  const { data: fetchedJobData = null, isLoading: jobLoading } = useQuery({
    queryKey: ["job", jobId],
    queryFn: async () => {
      const response = await axiosBase.get(`/jobs/job/${jobId}`);
      return response.data;
    },
    enabled: !!jobId,
  });

  const [jobData, setJobData] = useState(null);

  // Sync fetched data into local state once loaded
  useEffect(() => {
    if (fetchedJobData) {
      setJobData(fetchedJobData);
    }
  }, [fetchedJobData]);

  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleSelectForNextStep = () => {
    if (!jobData || !jobData.recruitmentStages) return;

    const totalStages = jobData?.recruitmentStages.length;
    const nextStageIndex = jobData.completedStages?.length || 0;

    if (nextStageIndex >= totalStages) return;

    const currentStage = jobData.recruitmentStages[nextStageIndex];

    if (!currentStage) return;

    if (currentStage.toLowerCase() === "hire") {
      setShowHireConfirmation(true);
    } else {
      setShowDateTimePicker(true);
    }
  };

  const handleHireConfirm = async () => {
    if (!jobData || !jobData.recruitmentStages) return;

    const nextStageIndex = jobData.completedStages?.length || 0;
    const currentStage = jobData.recruitmentStages[nextStageIndex];

    // ✅ Optimistically update UI
    if (!jobData.completedStages) {
      jobData.completedStages = [];
    }
    jobData.completedStages.push(currentStage);

    setJobData({ ...jobData });
    setShowHireConfirmation(false);

    try {
      await axiosBase.patch(`/jobs/advanceStage/${jobId}/${userId}`, {
        stage: currentStage,
      });

      // Optionally: toast notification
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Candidate has been hired successfully",
        showConfirmButton: false,
        timer: 3000,
      });
    } catch (err) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Hiring failed. Please try again.",
        showConfirmButton: false,
        timer: 1500,
      });
      // Revert if failed
      jobData.completedStages.pop();
      setJobData({ ...jobData });
    }
  };

  const handleCancel = () => {
    setShowDateTimePicker(false);
    setSelectedDate("");
    setStartTime("");
    setEndTime("");
    setNotes("");
  };

  const handleSubmit = async () => {
    if (!selectedDate || !startTime || !endTime) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Please fill all the required fields",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }

    if (!jobData || !jobData.recruitmentStages) return;

    const totalStages = jobData?.recruitmentStages.length;
    const nextStageIndex = jobData.completedStages?.length || 0;

    if (nextStageIndex >= totalStages) return;

    const currentStage = jobData.recruitmentStages[nextStageIndex];
    const nextStage = jobData.recruitmentStages[nextStageIndex + 1];

    if (!currentStage) return;

    // ✅ Optimistically update UI
    if (!jobData.completedStages) {
      jobData.completedStages = [];
    }
    jobData.completedStages.push(currentStage);

    setJobData({ ...jobData });
    setShowDateTimePicker(false);

    try {
      await axiosBase.patch(`/jobs/advanceStage/${jobId}/${userId}`, {
        stage: currentStage,
      });

      await axiosBase.post("/job/schedule", {
        jobId: jobId,
        recruiterId: recruiterInfo?._id,
        candidateId: userId,
        stageName: nextStage,
        scheduledDate: selectedDate,
        startTime: startTime,
        endTime: endTime,
        note: notes,
      });

      // Reset form values
      setSelectedDate("");
      setStartTime("");
      setEndTime("");
      setNotes("");

      // Optionally: toast notification
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Candidate has been selected for the next stage successfully",
        showConfirmButton: false,
        timer: 3000,
      });
    } catch (err) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Sorry! Something went wrong",
        showConfirmButton: false,
        timer: 3000,
      });
      // Revert if failed
      jobData.completedStages.pop();
      setJobData({ ...jobData });
    }
  };

  if (isLoading || jobLoading || isRecruiterLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-t-4 border-blue-600 border-solid rounded-full animate-spin"></div>
          <p className="mt-4 text-lg text-gray-700">
            Loading profile information...
          </p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return "Present";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen pt-24 pb-12">
      <style>{animationStyles}</style>
      <div className="max-w-5xl mx-auto px-4">
        {/* Resume Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Candidate Profile
          </h1>
          <div className="flex space-x-3">
            <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
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
            <div className="p-8">
              {/* Resume Header */}
              <div className="flex flex-col md:flex-row md:items-center mb-8 border-b border-gray-200 pb-6">
                <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                  <div className="h-32 w-32 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center border border-gray-200">
                    {userInfo?.profilePic ? (
                      <img
                        src={userInfo.profilePic || "/placeholder.svg"}
                        alt={`${userInfo?.name}'s profile`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User className="h-16 w-16 text-gray-300" />
                    )}
                  </div>
                </div>
                <div className="flex-grow">
                  <h1 className="text-3xl font-bold text-gray-900 mb-1">
                    {userInfo?.name}
                  </h1>
                  <p className="text-lg text-gray-600 mb-3">
                    {userInfo?.title || "Professional"}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="flex items-center text-gray-600">
                      <Mail className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-sm">{userInfo?.email}</span>
                    </div>
                    {userInfo?.personalInfo?.contactNo && (
                      <div className="flex items-center text-gray-600">
                        <Phone className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="text-sm">
                          {userInfo?.personalInfo?.contactNo}
                        </span>
                      </div>
                    )}
                    {userInfo?.personalInfo?.presentAddress && (
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="text-sm">
                          {userInfo.personalInfo.presentAddress}
                        </span>
                      </div>
                    )}
                    {userInfo?.personalInfo?.nationality && (
                      <div className="flex items-center text-gray-600">
                        <Flag className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="text-sm">
                          {userInfo.personalInfo.nationality}
                        </span>
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
                  <p className="text-gray-700 leading-relaxed">
                    {userInfo.personalInfo.bio}
                  </p>
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
                          <h3 className="text-lg font-medium text-gray-900">
                            {exp.title}
                          </h3>
                          <div className="flex flex-wrap items-center text-gray-600 mt-1 mb-2">
                            <span className="font-medium">{exp.company}</span>
                            <span className="mx-2">•</span>
                            <span className="text-sm">
                              {formatDate(exp.startDate)} -{" "}
                              {formatDate(exp.endDate)}
                            </span>
                          </div>
                          {exp.description && (
                            <p className="text-gray-700 text-sm">
                              {exp.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">
                    No experience information available.
                  </p>
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
                          <h3 className="text-lg font-medium text-gray-900">
                            {edu.degree}
                          </h3>
                          <div className="flex flex-wrap items-center text-gray-600 mt-1 mb-2">
                            <span className="font-medium">
                              {edu.institution}
                            </span>
                            <span className="mx-2">•</span>
                            <span className="text-sm">
                              {formatDate(edu.startDate)} -{" "}
                              {formatDate(edu.endDate)}
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
                  <p className="text-gray-500 italic">
                    No education information available.
                  </p>
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
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">
                      No skills information available.
                    </p>
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
                        <span className="font-medium mr-2">
                          {language.name}:
                        </span>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < language.level
                                  ? "text-blue-500 fill-blue-500"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">
                      No language information available.
                    </p>
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
                    <p className="text-gray-500 italic">
                      No links information available.
                    </p>
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
                    <div
                      key={index}
                      className="border-l-2 border-blue-200 pl-6 pb-6 relative"
                    >
                      <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-blue-600"></div>
                      <div className="bg-white rounded-lg p-6 border border-gray-100 shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {edu.degree}
                          </h3>
                          <div className="flex items-center text-sm text-gray-500 mt-1 sm:mt-0">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>
                              {formatDate(edu.startDate)} -{" "}
                              {formatDate(edu.endDate)}
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
                              <span className="font-medium">Activities:</span>{" "}
                              {edu.activities}
                            </p>
                          </div>
                        )}
                        {edu.description && (
                          <div className="mt-3">
                            <p className="text-sm text-gray-600">
                              {edu.description}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <GraduationCap className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">
                    No education information available.
                  </p>
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
                    <div
                      key={index}
                      className="border-l-2 border-blue-200 pl-6 pb-6 relative"
                    >
                      <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-blue-600"></div>
                      <div className="bg-white rounded-lg p-6 border border-gray-100 shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {exp.title}
                          </h3>
                          <div className="flex items-center text-sm text-gray-500 mt-1 sm:mt-0">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>
                              {formatDate(exp.startDate)} -{" "}
                              {formatDate(exp.endDate)}
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
                            <p className="text-sm text-gray-600">
                              {exp.description}
                            </p>
                          </div>
                        )}
                        {exp.achievements && (
                          <div className="mt-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">
                              Key Achievements:
                            </h4>
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
                  <p className="text-gray-500">
                    No experience information available.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Recruitment Progress */}
        {jobId && jobData?.recruitmentStages && (
          <div className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
            <RecruitmentProgressBar
              stages={jobData?.recruitmentStages}
              completedStages={jobData?.completedStages || []}
            />
          </div>
        )}

        {/* Action Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleSelectForNextStep}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            <CheckCircle className="h-5 w-5 mr-2" />
            Select For Next Step
          </button>
        </div>
      </div>
      {/* Date Time Picker Popup */}
      {showDateTimePicker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-t-xl w-full max-w-lg p-6 animate-slideUp">
            <h3 className="text-xl font-semibold mb-4">Schedule Next Stage</h3>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
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
                  <label
                    htmlFor="startTime"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
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
                  <label
                    htmlFor="endTime"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
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
                <label
                  htmlFor="notes"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
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
            <h3 className="text-lg font-semibold mb-4 text-center">
              Are you sure you want to hire this candidate?
            </h3>
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
    </div>
  );
};

export default UserProfile;
