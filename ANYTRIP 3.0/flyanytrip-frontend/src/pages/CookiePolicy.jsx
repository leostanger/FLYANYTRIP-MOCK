import React from 'react';

const CookiePolicy = () => {
  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100">
          <h1 className="text-4xl font-black text-brand-black mb-2">Cookie Policy</h1>
          <p className="text-brand-black/50 mb-8">Last Updated: June 2026</p>
          
          <div className="prose prose-lg text-brand-black/70 max-w-none space-y-6">
            <p>
              This Cookie Policy explains how FlyAnyTrip uses cookies and similar technologies to recognize you when you visit our website or use our app.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-8 mb-4">1. What are Cookies?</h2>
            <p>
              Cookies are small data files that are placed on your computer or mobile device when you visit a website. They are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-8 mb-4">2. Why do we use Cookies?</h2>
            <p>
              We use first-party and third-party cookies for several reasons:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Essential Cookies:</strong> Some cookies are required for technical reasons in order for our platform to operate, such as securing your session and processing your bookings.</li>
              <li><strong>Performance and Functionality Cookies:</strong> These cookies are used to enhance the performance and functionality of our platform but are non-essential to their use (e.g., remembering your language preference or currency).</li>
              <li><strong>Analytics and Customization Cookies:</strong> These cookies collect information that is used in aggregate form to help us understand how our platform is being used and how effective our marketing campaigns are.</li>
              <li><strong>Advertising Cookies:</strong> These cookies are used to make advertising messages more relevant to you and your interests.</li>
            </ul>

            <h2 className="text-2xl font-bold text-brand-black mt-8 mb-4">3. How can I control Cookies?</h2>
            <p>
              You have the right to decide whether to accept or reject cookies. You can set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our website though your access to some functionality and areas of our website may be restricted.
            </p>
            <p>
              For more information on how to manage cookies, please visit the help pages of your browser.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-8 mb-4">4. Updates to this Policy</h2>
            <p>
              We may update this Cookie Policy from time to time in order to reflect changes to the cookies we use or for other operational, legal, or regulatory reasons. Please revisit this page regularly to stay informed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;
