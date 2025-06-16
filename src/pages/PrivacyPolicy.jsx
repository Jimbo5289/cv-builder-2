/* eslint-disable */
import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-[#2c3e50] mb-6">Privacy Policy</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-[#2c3e50] mb-4">Last Updated: June 16, 2025</h2>
        
        <p className="mb-4 text-gray-700">
          MyCVBuilder Ltd ("we", "us", or "our") operates MyCVBuilder.co.uk. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our service and the choices you have associated with that data.
        </p>

        <h3 className="text-lg font-semibold text-[#2c3e50] mt-6 mb-3">Information We Collect</h3>
        
        <div className="mb-4">
          <h4 className="font-medium text-[#2c3e50] mb-2">Personal Information</h4>
          <p className="text-gray-700 mb-2">
            When you create an account or use our services, we may collect the following personal information:
          </p>
          <ul className="list-disc pl-5 mb-2 text-gray-700">
            <li>Name and email address (for account creation and communication)</li>
            <li>CV content including work experience, education, and skills</li>
            <li>Payment information (processed securely through Stripe)</li>
            <li>Profile information you choose to provide</li>
          </ul>
        </div>

        <div className="mb-4">
          <h4 className="font-medium text-[#2c3e50] mb-2">Automatically Collected Information</h4>
          <p className="text-gray-700 mb-2">
            We automatically collect certain information when you visit our website:
          </p>
          <ul className="list-disc pl-5 mb-2 text-gray-700">
            <li>IP address and browser information</li>
            <li>Pages visited and time spent on our site</li>
            <li>Device information and operating system</li>
            <li>Referral source and search terms used to find our site</li>
          </ul>
        </div>

        <h3 className="text-lg font-semibold text-[#2c3e50] mt-6 mb-3">How We Use Your Information</h3>
        <p className="mb-2 text-gray-700">We use the information we collect to:</p>
        <ul className="list-disc pl-5 mb-4 text-gray-700">
          <li>Provide and maintain our CV building service</li>
          <li>Process your account registration and manage your profile</li>
          <li>Generate and store your CV content</li>
          <li>Process payments and manage subscriptions</li>
          <li>Send you important updates about our service</li>
          <li>Improve our website and develop new features</li>
          <li>Respond to your support requests and communications</li>
          <li>Analyze usage patterns to enhance user experience</li>
        </ul>

        <h3 className="text-lg font-semibold text-[#2c3e50] mt-6 mb-3">Legal Basis for Processing (GDPR)</h3>
        <p className="mb-2 text-gray-700">Under GDPR, we process your personal data based on:</p>
        <ul className="list-disc pl-5 mb-4 text-gray-700">
          <li><strong>Contract:</strong> To provide our CV building services as agreed</li>
          <li><strong>Legitimate Interest:</strong> To improve our services and prevent fraud</li>
          <li><strong>Consent:</strong> For marketing communications (where you have opted in)</li>
          <li><strong>Legal Obligation:</strong> To comply with applicable laws and regulations</li>
        </ul>

        <h3 className="text-lg font-semibold text-[#2c3e50] mt-6 mb-3">Data Sharing and Disclosure</h3>
        <p className="mb-2 text-gray-700">
          We do not sell or rent your personal information to third parties. We may share your information only in the following circumstances:
        </p>
        <ul className="list-disc pl-5 mb-4 text-gray-700">
          <li><strong>Service Providers:</strong> With trusted third-party services (like Stripe for payments) who assist in operating our service</li>
          <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
          <li><strong>Business Transfer:</strong> In the event of a merger, acquisition, or sale of assets</li>
          <li><strong>With Your Consent:</strong> When you explicitly agree to share information</li>
        </ul>

        <h3 className="text-lg font-semibold text-[#2c3e50] mt-6 mb-3">Data Security</h3>
        <p className="mb-4 text-gray-700">
          We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes:
        </p>
        <ul className="list-disc pl-5 mb-4 text-gray-700">
          <li>Encryption of data in transit via SSL/TLS</li>
          <li>Secure password hashing and authentication systems</li>
          <li>Regular security assessments and updates</li>
          <li>Limited access to personal data on a need-to-know basis</li>
          <li>Secure payment processing through PCI-compliant providers</li>
        </ul>

        <h3 className="text-lg font-semibold text-[#2c3e50] mt-6 mb-3">Data Retention</h3>
        <p className="mb-4 text-gray-700">
          We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this policy. Specifically:
        </p>
        <ul className="list-disc pl-5 mb-4 text-gray-700">
          <li>Account information: Until you delete your account</li>
          <li>CV content: Until you delete specific CVs or your account</li>
          <li>Payment records: As required by law (typically 7 years)</li>
          <li>Analytics data: In aggregated, anonymized form for service improvement</li>
        </ul>

        <h3 className="text-lg font-semibold text-[#2c3e50] mt-6 mb-3">Your Rights</h3>
        <p className="mb-2 text-gray-700">Under applicable data protection laws, you have the following rights:</p>
        <ul className="list-disc pl-5 mb-4 text-gray-700">
          <li><strong>Access:</strong> Request a copy of the personal data we hold about you</li>
          <li><strong>Correction:</strong> Request correction of inaccurate or incomplete data</li>
          <li><strong>Deletion:</strong> Request deletion of your personal data (subject to legal obligations)</li>
          <li><strong>Portability:</strong> Request transfer of your data to another service</li>
          <li><strong>Restriction:</strong> Request limitation of processing in certain circumstances</li>
          <li><strong>Objection:</strong> Object to processing based on legitimate interests</li>
          <li><strong>Withdraw Consent:</strong> Withdraw consent for marketing communications</li>
        </ul>
        <p className="mb-4 text-gray-700">
          To exercise these rights, please contact us at 
          <a href="mailto:support@mycvbuilder.co.uk" className="text-[#2c3e50] font-medium ml-1 hover:underline">
            support@mycvbuilder.co.uk
          </a>
        </p>

        <h3 className="text-lg font-semibold text-[#2c3e50] mt-6 mb-3">Cookies and Tracking</h3>
        <p className="mb-4 text-gray-700">
          Our website uses cookies and similar tracking technologies. For detailed information about our use of cookies, please see our 
          <Link to="/cookie-policy" className="text-[#2c3e50] font-medium hover:underline">
            Cookie Policy
          </Link>.
        </p>

        <h3 className="text-lg font-semibold text-[#2c3e50] mt-6 mb-3">Third-Party Services</h3>
        <p className="mb-2 text-gray-700">We use the following third-party services:</p>
        <ul className="list-disc pl-5 mb-4 text-gray-700">
          <li><strong>Stripe:</strong> For secure payment processing (subject to Stripe's privacy policy)</li>
          <li><strong>Google Analytics:</strong> For website analytics (anonymized data)</li>
          <li><strong>AWS/Render:</strong> For hosting and data storage</li>
        </ul>

        <h3 className="text-lg font-semibold text-[#2c3e50] mt-6 mb-3">International Data Transfers</h3>
        <p className="mb-4 text-gray-700">
          Your personal data may be transferred to and processed in countries other than your country of residence. We ensure that such transfers are subject to appropriate safeguards, including adequate protection under applicable data protection laws.
        </p>

        <h3 className="text-lg font-semibold text-[#2c3e50] mt-6 mb-3">Children's Privacy</h3>
        <p className="mb-4 text-gray-700">
          Our service is not intended for use by children under the age of 16. We do not knowingly collect personal information from children under 16. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
        </p>

        <h3 className="text-lg font-semibold text-[#2c3e50] mt-6 mb-3">Changes to This Privacy Policy</h3>
        <p className="mb-4 text-gray-700">
          We may update our Privacy Policy from time to time. We will notify you of any significant changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. For material changes, we may also send you an email notification.
        </p>

        <h3 className="text-lg font-semibold text-[#2c3e50] mt-6 mb-3">Contact Us</h3>
        <p className="mb-2 text-gray-700">
          If you have any questions about this Privacy Policy or our data practices, please contact us:
        </p>
        <ul className="list-none mb-4 text-gray-700">
          <li><strong>Email:</strong> 
            <a href="mailto:support@mycvbuilder.co.uk" className="text-[#2c3e50] font-medium ml-1 hover:underline">
              support@mycvbuilder.co.uk
            </a>
          </li>
          <li><strong>Website:</strong> 
            <Link to="/contact" className="text-[#2c3e50] font-medium ml-1 hover:underline">
              Contact Form
            </Link>
          </li>
        </ul>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <strong>Data Protection Officer:</strong> For specific GDPR-related inquiries, you may contact our Data Protection Officer at 
            <a href="mailto:dpo@mycvbuilder.co.uk" className="text-[#2c3e50] font-medium ml-1 hover:underline">
              dpo@mycvbuilder.co.uk
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy; 