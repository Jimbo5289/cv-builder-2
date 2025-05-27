// Import the NewsletterSignup component
import NewsletterSignup from '../components/NewsletterSignup';

// Add the component to the Landing page JSX near the bottom but above the footer
// ...existing Landing page code...

{/* Newsletter Signup Section */}
<section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
  <div className="container mx-auto px-4">
    <div className="max-w-3xl mx-auto">
      <NewsletterSignup className="shadow-xl" />
    </div>
  </div>
</section>

{/* Footer Section */}
// ...rest of the footer section... 