import React from 'react';

const StandardCVTemplate = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">Standard CV Template</h2>
      
      <div className="space-y-6">
        {/* Contact Information Section */}
        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-3 text-[#2c3e50] dark:text-white">Contact Information</h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
            <li>Full name</li>
            <li>Professional email address</li>
            <li>Phone number</li>
            <li>Location (city and country)</li>
            <li>LinkedIn profile (if applicable)</li>
          </ul>
        </section>

        {/* Personal Statement Section */}
        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-3 text-[#2c3e50] dark:text-white">Personal Statement</h3>
          <p className="text-gray-600 dark:text-gray-400">
            A brief summary of your skills, experience, and career goals. Should be 2-3 sentences long and tailored to the job you're applying for.
          </p>
        </section>

        {/* Work Experience Section */}
        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-3 text-[#2c3e50] dark:text-white">Work Experience</h3>
          <div className="space-y-4">
            <div className="border-l-4 border-[#2c3e50] dark:border-blue-500 pl-4">
              <h4 className="font-semibold text-gray-800 dark:text-gray-200">Job Title</h4>
              <p className="text-gray-600 dark:text-gray-400">Company Name | Start Date - End Date</p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700 dark:text-gray-300">
                <li>Key responsibilities and achievements</li>
                <li>Use action verbs (e.g., managed, developed, implemented)</li>
                <li>Include quantifiable results where possible</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Education Section */}
        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-3 text-[#2c3e50] dark:text-white">Education</h3>
          <div className="space-y-4">
            <div className="border-l-4 border-[#2c3e50] dark:border-blue-500 pl-4">
              <h4 className="font-semibold text-gray-800 dark:text-gray-200">Degree/Qualification</h4>
              <p className="text-gray-600 dark:text-gray-400">Institution Name | Graduation Year</p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700 dark:text-gray-300">
                <li>Relevant modules or specializations</li>
                <li>Grade/Classification (if strong)</li>
                <li>Academic achievements</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-3 text-[#2c3e50] dark:text-white">Skills</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Technical Skills</h4>
              <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                <li>Programming languages</li>
                <li>Software proficiency</li>
                <li>Technical tools</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Soft Skills</h4>
              <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                <li>Communication</li>
                <li>Teamwork</li>
                <li>Problem-solving</li>
                <li>Leadership</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Additional Sections (Optional) */}
        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-3 text-[#2c3e50] dark:text-white">Additional Sections</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Certifications</h4>
              <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                <li>Professional certifications</li>
                <li>Training courses</li>
                <li>Accreditations</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Projects</h4>
              <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                <li>Personal or academic projects</li>
                <li>Open-source contributions</li>
                <li>Portfolio work</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Languages</h4>
              <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                <li>Languages spoken</li>
                <li>Proficiency levels</li>
              </ul>
            </div>
          </div>
        </section>

        {/* References Section */}
        <section>
          <h3 className="text-xl font-semibold mb-3 text-[#2c3e50] dark:text-white">References</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Available upon request
          </p>
        </section>
      </div>
    </div>
  );
};

export default StandardCVTemplate; 