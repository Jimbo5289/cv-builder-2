import React from 'react';

const StandardCVTemplate = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Standard CV Template</h2>
      
      <div className="space-y-6">
        {/* Contact Information Section */}
        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-3 text-[#2c3e50]">Contact Information</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Full name</li>
            <li>Professional email address</li>
            <li>Phone number</li>
            <li>Location (city and country)</li>
            <li>LinkedIn profile (if applicable)</li>
          </ul>
        </section>

        {/* Personal Statement Section */}
        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-3 text-[#2c3e50]">Personal Statement</h3>
          <p className="text-gray-600">
            A brief summary of your skills, experience, and career goals. Should be 2-3 sentences long and tailored to the job you're applying for.
          </p>
        </section>

        {/* Work Experience Section */}
        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-3 text-[#2c3e50]">Work Experience</h3>
          <div className="space-y-4">
            <div className="border-l-4 border-[#2c3e50] pl-4">
              <h4 className="font-semibold">Job Title</h4>
              <p className="text-gray-600">Company Name | Start Date - End Date</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Key responsibilities and achievements</li>
                <li>Use action verbs (e.g., managed, developed, implemented)</li>
                <li>Include quantifiable results where possible</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Education Section */}
        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-3 text-[#2c3e50]">Education</h3>
          <div className="space-y-4">
            <div className="border-l-4 border-[#2c3e50] pl-4">
              <h4 className="font-semibold">Degree/Qualification</h4>
              <p className="text-gray-600">Institution Name | Graduation Year</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Relevant modules or specializations</li>
                <li>Grade/Classification (if strong)</li>
                <li>Academic achievements</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-3 text-[#2c3e50]">Skills</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Technical Skills</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Programming languages</li>
                <li>Software proficiency</li>
                <li>Technical tools</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Soft Skills</h4>
              <ul className="list-disc pl-5 space-y-1">
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
          <h3 className="text-xl font-semibold mb-3 text-[#2c3e50]">Additional Sections</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Certifications</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Professional certifications</li>
                <li>Training courses</li>
                <li>Accreditations</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Projects</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Personal or academic projects</li>
                <li>Open-source contributions</li>
                <li>Portfolio work</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Languages</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Languages spoken</li>
                <li>Proficiency levels</li>
              </ul>
            </div>
          </div>
        </section>

        {/* References Section */}
        <section>
          <h3 className="text-xl font-semibold mb-3 text-[#2c3e50]">References</h3>
          <p className="text-gray-600">
            Available upon request
          </p>
        </section>
      </div>
    </div>
  );
};

export default StandardCVTemplate; 