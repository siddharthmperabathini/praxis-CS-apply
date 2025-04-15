"use client";

import type React from "react";
import { useState } from "react";
import { Upload, X, Check, FileText, User, GraduationCap, Building, Shield, Globe, ClipboardList, Users } from "lucide-react";

export function ProfileForm() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  // Update the formData state to include an array of employment entries
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: "",
    email: "",
    phone: "",
    address: "",
    linkedin: "",
    portfolio: "",

    // Demographics
    gender: "",
    ethnicity: "",
    veteranStatus: "",
    disabilityStatus: "",
    lgbtqIdentification: "",
    eligibleForAffirmativeAction: "",

    // Work Authorization
    legallyAuthorized: "",
    requireSponsorship: "",
    over18: "",

    // Employment History is now an array
    employmentHistory: [
      {
        employer: "",
        jobTitle: "",
        employmentDates: "",
        responsibilities: "",
        reasonForLeaving: "",
        supervisorName: "",
        supervisorContact: "",
        canContactEmployer: "",
      },
    ],

    // Education
    educationLevel: "",
    schoolName: "",
    degree: "",
    fieldOfStudy: "",
    graduationDate: "",
    gpa: "",

    // Position Preferences
    positionApplyingFor: "",
    howHeardAboutJob: "",
    previouslyApplied: "",
    workedHereBefore: "",
    desiredStartDate: "",
    desiredSalary: "",

    // Background Information
    convictedFelonyMisdemeanor: "",
    terminatedResigned: "",
    backgroundCheck: "",
    drugTest: "",
  });

  // Add functions to handle employment entries
  const handleEmploymentChange = (index: number, field: string, value: string) => {
    setFormData((prev) => {
      const updatedEmployment = [...prev.employmentHistory];
      updatedEmployment[index] = {
        ...updatedEmployment[index],
        [field]: value,
      };
      return {
        ...prev,
        employmentHistory: updatedEmployment,
      };
    });
  };

  const addEmploymentEntry = () => {
    setFormData((prev) => ({
      ...prev,
      employmentHistory: [
        ...prev.employmentHistory,
        {
          employer: "",
          jobTitle: "",
          employmentDates: "",
          responsibilities: "",
          reasonForLeaving: "",
          supervisorName: "",
          supervisorContact: "",
          canContactEmployer: "",
        },
      ],
    }));
  };

  const removeEmploymentEntry = (index: number) => {
    if (formData.employmentHistory.length <= 1) return; // Keep at least one entry

    setFormData((prev) => ({
      ...prev,
      employmentHistory: prev.employmentHistory.filter((_, i) => i !== index),
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setResumeFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setResumeFile(null);
  };

  // Update the handleInputChange function to handle the new state structure
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Update the handleSubmit function to log the new state structure
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log("Form data:", formData);
    console.log("Resume file:", resumeFile);

    // Show success message
    alert("Profile updated successfully!");
  };

  return (
    <div className="max-w-3xl mx-auto pb-12">
      <h2 className="text-xl font-bold mb-6 text-white">Profile</h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Resume Upload Section */}
        <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
          <h3 className="text-lg font-medium text-white mb-4 flex items-center">
            <FileText className="mr-2 h-5 w-5 text-indigo-400" />
            Resume
          </h3>

          {!resumeFile ? (
            <div className={`border-2 border-dashed rounded-lg p-8 text-center ${isDragging ? "border-indigo-500 bg-indigo-500/10" : "border-zinc-700"}`} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
              <Upload className="h-10 w-10 text-zinc-500 mx-auto mb-4" />
              <p className="text-zinc-400 mb-2">Drag and drop your resume here, or</p>
              <label className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-md cursor-pointer hover:bg-indigo-700 transition-colors">
                Browse Files
                <input type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.doc,.docx" />
              </label>
              <p className="text-zinc-500 text-sm mt-2">Supported formats: PDF, DOC, DOCX</p>
            </div>
          ) : (
            <div className="bg-zinc-800 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center mr-3">
                  <FileText className="h-5 w-5 text-indigo-400" />
                </div>
                <div>
                  <p className="text-white font-medium">{resumeFile.name}</p>
                  <p className="text-zinc-500 text-sm">{(resumeFile.size / 1024 / 1024).toFixed(2)} MB • Uploaded just now</p>
                </div>
              </div>
              <button type="button" onClick={handleRemoveFile} className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-full">
                <X className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        {/* Personal Information */}
        <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
          <h3 className="text-lg font-medium text-white mb-4 flex items-center">
            <User className="mr-2 h-5 w-5 text-indigo-400" />
            Personal Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="fullName" className="block text-sm font-medium text-zinc-400">
                Full Name
              </label>
              <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="John Doe" />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-zinc-400">
                Email Address
              </label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="john@example.com" />
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-medium text-zinc-400">
                Phone Number
              </label>
              <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="(123) 456-7890" />
            </div>

            <div className="space-y-2">
              <label htmlFor="address" className="block text-sm font-medium text-zinc-400">
                Address
              </label>
              <input type="text" id="address" name="address" value={formData.address} onChange={handleInputChange} className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="123 Main St, City, State, Zip" />
            </div>

            <div className="space-y-2">
              <label htmlFor="linkedin" className="block text-sm font-medium text-zinc-400">
                LinkedIn Profile
              </label>
              <input type="url" id="linkedin" name="linkedin" value={formData.linkedin} onChange={handleInputChange} className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="https://linkedin.com/in/username" />
            </div>

            <div className="space-y-2">
              <label htmlFor="portfolio" className="block text-sm font-medium text-zinc-400">
                GitHub/Portfolio/Website URL
              </label>
              <input type="url" id="portfolio" name="portfolio" value={formData.portfolio} onChange={handleInputChange} className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="https://github.com/username" />
            </div>
          </div>
        </div>

        {/* Demographics */}
        <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
          <h3 className="text-lg font-medium text-white mb-4 flex items-center">
            <Users className="mr-2 h-5 w-5 text-indigo-400" />
            Demographics
          </h3>
          <p className="text-zinc-500 text-sm mb-4">This information is used for diversity tracking purposes. Providing this information is voluntary and will not be used in the application process.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="gender" className="block text-sm font-medium text-zinc-400">
                Gender
              </label>
              <select id="gender" name="gender" value={formData.gender} onChange={handleInputChange} className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">Select an option</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="non-binary">Non-binary</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="ethnicity" className="block text-sm font-medium text-zinc-400">
                Race/Ethnicity
              </label>
              <select id="ethnicity" name="ethnicity" value={formData.ethnicity} onChange={handleInputChange} className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">Select an option</option>
                <option value="asian">Asian</option>
                <option value="black">Black or African American</option>
                <option value="hispanic">Hispanic or Latino</option>
                <option value="native-american">Native American or Alaska Native</option>
                <option value="pacific-islander">Native Hawaiian or Pacific Islander</option>
                <option value="white">White</option>
                <option value="two-or-more">Two or more races</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="veteranStatus" className="block text-sm font-medium text-zinc-400">
                Veteran Status
              </label>
              <select id="veteranStatus" name="veteranStatus" value={formData.veteranStatus} onChange={handleInputChange} className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">Select an option</option>
                <option value="veteran">I am a veteran</option>
                <option value="not-veteran">I am not a veteran</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="disabilityStatus" className="block text-sm font-medium text-zinc-400">
                Disability Status
              </label>
              <select id="disabilityStatus" name="disabilityStatus" value={formData.disabilityStatus} onChange={handleInputChange} className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">Select an option</option>
                <option value="yes">Yes, I have a disability</option>
                <option value="no">No, I don&apos;t have a disability</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="lgbtqIdentification" className="block text-sm font-medium text-zinc-400">
                LGBTQ+ Identification
              </label>
              <select id="lgbtqIdentification" name="lgbtqIdentification" value={formData.lgbtqIdentification} onChange={handleInputChange} className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">Select an option</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="eligibleForAffirmativeAction" className="block text-sm font-medium text-zinc-400">
                Are you eligible for affirmative action?
              </label>
              <select id="eligibleForAffirmativeAction" name="eligibleForAffirmativeAction" value={formData.eligibleForAffirmativeAction} onChange={handleInputChange} className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">Select an option</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
                <option value="unsure">Unsure</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>
          </div>
        </div>

        {/* Work Authorization */}
        <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
          <h3 className="text-lg font-medium text-white mb-4 flex items-center">
            <Globe className="mr-2 h-5 w-5 text-indigo-400" />
            Work Authorization
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="legallyAuthorized" className="block text-sm font-medium text-zinc-400">
                Are you legally authorized to work in the U.S.?
              </label>
              <select id="legallyAuthorized" name="legallyAuthorized" value={formData.legallyAuthorized} onChange={handleInputChange} className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">Select an option</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="requireSponsorship" className="block text-sm font-medium text-zinc-400">
                Will you now or in the future require sponsorship?
              </label>
              <select id="requireSponsorship" name="requireSponsorship" value={formData.requireSponsorship} onChange={handleInputChange} className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">Select an option</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="over18" className="block text-sm font-medium text-zinc-400">
                Are you at least 18 years of age?
              </label>
              <select id="over18" name="over18" value={formData.over18} onChange={handleInputChange} className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">Select an option</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          </div>
        </div>

        {/* Employment History */}
        <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
          <h3 className="text-lg font-medium text-white mb-4 flex items-center">
            <Building className="mr-2 h-5 w-5 text-indigo-400" />
            Employment History
          </h3>

          {formData.employmentHistory.map((employment, index) => (
            <div key={index} className="mb-8 relative">
              {index > 0 && (
                <div className="absolute -top-2 -right-2">
                  <button type="button" onClick={() => removeEmploymentEntry(index)} className="p-1.5 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500/30 transition-colors" aria-label="Remove employment entry">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              {index > 0 && <div className="h-px w-full bg-zinc-800 mb-6"></div>}

              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor={`employer-${index}`} className="block text-sm font-medium text-zinc-400">
                    Employer
                  </label>
                  <input type="text" id={`employer-${index}`} value={employment.employer} onChange={(e) => handleEmploymentChange(index, "employer", e.target.value)} className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Company Name" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor={`jobTitle-${index}`} className="block text-sm font-medium text-zinc-400">
                      Job Title
                    </label>
                    <input type="text" id={`jobTitle-${index}`} value={employment.jobTitle} onChange={(e) => handleEmploymentChange(index, "jobTitle", e.target.value)} className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Software Engineer" />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor={`employmentDates-${index}`} className="block text-sm font-medium text-zinc-400">
                      Dates of Employment
                    </label>
                    <input type="text" id={`employmentDates-${index}`} value={employment.employmentDates} onChange={(e) => handleEmploymentChange(index, "employmentDates", e.target.value)} className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Jan 2020 - Present" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor={`responsibilities-${index}`} className="block text-sm font-medium text-zinc-400">
                    Responsibilities and Accomplishments
                  </label>
                  <textarea id={`responsibilities-${index}`} value={employment.responsibilities} onChange={(e) => handleEmploymentChange(index, "responsibilities", e.target.value)} rows={3} className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Describe your key responsibilities and accomplishments..." />
                </div>

                <div className="space-y-2">
                  <label htmlFor={`reasonForLeaving-${index}`} className="block text-sm font-medium text-zinc-400">
                    Reason for Leaving
                  </label>
                  <input type="text" id={`reasonForLeaving-${index}`} value={employment.reasonForLeaving} onChange={(e) => handleEmploymentChange(index, "reasonForLeaving", e.target.value)} className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Career advancement, still employed, etc." />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor={`supervisorName-${index}`} className="block text-sm font-medium text-zinc-400">
                      Supervisor Name (Optional)
                    </label>
                    <input type="text" id={`supervisorName-${index}`} value={employment.supervisorName} onChange={(e) => handleEmploymentChange(index, "supervisorName", e.target.value)} className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Jane Smith" />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor={`supervisorContact-${index}`} className="block text-sm font-medium text-zinc-400">
                      Supervisor Contact Info (Optional)
                    </label>
                    <input type="text" id={`supervisorContact-${index}`} value={employment.supervisorContact} onChange={(e) => handleEmploymentChange(index, "supervisorContact", e.target.value)} className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="jane.smith@company.com" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor={`canContactEmployer-${index}`} className="block text-sm font-medium text-zinc-400">
                    Can we contact this employer?
                  </label>
                  <select id={`canContactEmployer-${index}`} value={employment.canContactEmployer} onChange={(e) => handleEmploymentChange(index, "canContactEmployer", e.target.value)} className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="">Select an option</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                    <option value="after-offer">Only after an offer is made</option>
                  </select>
                </div>
              </div>
            </div>
          ))}

          <button type="button" onClick={addEmploymentEntry} className="mt-4 w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-md transition-colors flex items-center justify-center">
            <span className="mr-2 text-lg">+</span> Add Another Employment
          </button>
        </div>

        {/* Education */}
        <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
          <h3 className="text-lg font-medium text-white mb-4 flex items-center">
            <GraduationCap className="mr-2 h-5 w-5 text-indigo-400" />
            Education
          </h3>

          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="educationLevel" className="block text-sm font-medium text-zinc-400">
                Highest Level of Education Completed
              </label>
              <select id="educationLevel" name="educationLevel" value={formData.educationLevel} onChange={handleInputChange} className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">Select an option</option>
                <option value="high-school">High School or GED</option>
                <option value="associate">Associate&apos;s Degree</option>
                <option value="bachelor">Bachelor&apos;s Degree</option>
                <option value="master">Master&apos;s Degree</option>
                <option value="doctorate">Doctorate</option>
                <option value="vocational">Vocational Training</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="schoolName" className="block text-sm font-medium text-zinc-400">
                  Name of School/University
                </label>
                <input type="text" id="schoolName" name="schoolName" value={formData.schoolName} onChange={handleInputChange} className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="University of California, Berkeley" />
              </div>

              <div className="space-y-2">
                <label htmlFor="degree" className="block text-sm font-medium text-zinc-400">
                  Degree Earned
                </label>
                <input type="text" id="degree" name="degree" value={formData.degree} onChange={handleInputChange} className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Bachelor of Science" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="fieldOfStudy" className="block text-sm font-medium text-zinc-400">
                  Field of Study/Major
                </label>
                <input type="text" id="fieldOfStudy" name="fieldOfStudy" value={formData.fieldOfStudy} onChange={handleInputChange} className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Computer Science" />
              </div>

              <div className="space-y-2">
                <label htmlFor="graduationDate" className="block text-sm font-medium text-zinc-400">
                  Graduation Date
                </label>
                <input type="text" id="graduationDate" name="graduationDate" value={formData.graduationDate} onChange={handleInputChange} className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="May 2022" />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="gpa" className="block text-sm font-medium text-zinc-400">
                GPA (Optional)
              </label>
              <input type="text" id="gpa" name="gpa" value={formData.gpa} onChange={handleInputChange} className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="3.8/4.0" />
            </div>
          </div>
        </div>

        {/* Position Preferences */}
        <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
          <h3 className="text-lg font-medium text-white mb-4 flex items-center">
            <ClipboardList className="mr-2 h-5 w-5 text-indigo-400" />
            Position Preferences
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="positionApplyingFor" className="block text-sm font-medium text-zinc-400">
                Which position are you applying for?
              </label>
              <input type="text" id="positionApplyingFor" name="positionApplyingFor" value={formData.positionApplyingFor} onChange={handleInputChange} className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Software Engineer" />
            </div>

            <div className="space-y-2">
              <label htmlFor="howHeardAboutJob" className="block text-sm font-medium text-zinc-400">
                How did you hear about this job?
              </label>
              <select id="howHeardAboutJob" name="howHeardAboutJob" value={formData.howHeardAboutJob} onChange={handleInputChange} className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">Select an option</option>
                <option value="job-board">Job Board</option>
                <option value="company-website">Company Website</option>
                <option value="linkedin">LinkedIn</option>
                <option value="referral">Employee Referral</option>
                <option value="social-media">Social Media</option>
                <option value="career-fair">Career Fair</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="previouslyApplied" className="block text-sm font-medium text-zinc-400">
                Have you previously applied for a position here?
              </label>
              <select id="previouslyApplied" name="previouslyApplied" value={formData.previouslyApplied} onChange={handleInputChange} className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">Select an option</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="workedHereBefore" className="block text-sm font-medium text-zinc-400">
                Have you ever worked at this company before?
              </label>
              <select id="workedHereBefore" name="workedHereBefore" value={formData.workedHereBefore} onChange={handleInputChange} className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">Select an option</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="desiredStartDate" className="block text-sm font-medium text-zinc-400">
                Desired Start Date
              </label>
              <input type="text" id="desiredStartDate" name="desiredStartDate" value={formData.desiredStartDate} onChange={handleInputChange} className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Immediately, 2 weeks notice, etc." />
            </div>

            <div className="space-y-2">
              <label htmlFor="desiredSalary" className="block text-sm font-medium text-zinc-400">
                Desired Salary
              </label>
              <input type="text" id="desiredSalary" name="desiredSalary" value={formData.desiredSalary} onChange={handleInputChange} className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="$80,000 - $100,000" />
            </div>
          </div>
        </div>

        {/* Background Information */}
        <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
          <h3 className="text-lg font-medium text-white mb-4 flex items-center">
            <Shield className="mr-2 h-5 w-5 text-indigo-400" />
            Background Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="convictedFelonyMisdemeanor" className="block text-sm font-medium text-zinc-400">
                Have you ever been convicted of a felony or misdemeanor?
              </label>
              <select id="convictedFelonyMisdemeanor" name="convictedFelonyMisdemeanor" value={formData.convictedFelonyMisdemeanor} onChange={handleInputChange} className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">Select an option</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="terminatedResigned" className="block text-sm font-medium text-zinc-400">
                Have you ever been terminated or asked to resign?
              </label>
              <select id="terminatedResigned" name="terminatedResigned" value={formData.terminatedResigned} onChange={handleInputChange} className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">Select an option</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="backgroundCheck" className="block text-sm font-medium text-zinc-400">
                Are you willing to undergo a background check?
              </label>
              <select id="backgroundCheck" name="backgroundCheck" value={formData.backgroundCheck} onChange={handleInputChange} className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">Select an option</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="drugTest" className="block text-sm font-medium text-zinc-400">
                Are you willing to take a drug test?
              </label>
              <select id="drugTest" name="drugTest" value={formData.drugTest} onChange={handleInputChange} className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">Select an option</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button type="submit" className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center">
            <Check className="mr-2 h-5 w-5" />
            Save Profile
          </button>
        </div>
      </form>
    </div>
  );
}
