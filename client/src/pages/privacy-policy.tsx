import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card className="shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-orange-500 text-white rounded-t-lg">
            <CardTitle className="text-3xl font-bold text-center">Privacy Policy</CardTitle>
            <p className="text-center text-blue-100 mt-2">Pool Design Consultant</p>
            <p className="text-center text-blue-100 text-sm">Last Updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          
          <CardContent className="p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Information We Collect</h2>
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>
                  <p>We collect information you provide directly to us, including:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Contact information (name, email address, phone number)</li>
                    <li>Property information (address, location details)</li>
                    <li>Pool design preferences and specifications</li>
                    <li>Project requirements and budget information</li>
                    <li>Files you upload (surveys, photos, documents)</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Automatically Collected Information</h3>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>IP address and location data</li>
                    <li>Browser type and device information</li>
                    <li>Usage data and website interactions</li>
                    <li>Cookies and similar tracking technologies</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">2. How We Use Your Information</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Provide pool design consultation and services</li>
                <li>Create custom pool designs and cost estimates</li>
                <li>Communicate about your project and provide customer support</li>
                <li>Process payments and manage billing</li>
                <li>Send project updates and service-related notifications</li>
                <li>Improve our website and services</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Information Sharing and Disclosure</h2>
              <div className="space-y-4 text-gray-700">
                <p>We may share your information with:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Service Providers:</strong> SendGrid (email), Stripe (payments), database hosting providers</li>
                  <li><strong>Business Partners:</strong> Contractors and suppliers when necessary for your project</li>
                  <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                  <li><strong>Business Transfers:</strong> In connection with a merger, sale, or acquisition</li>
                </ul>
                <p className="font-medium">We do not sell, rent, or share your personal information for marketing purposes.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Data Security</h2>
              <p className="text-gray-700">
                We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no internet transmission is completely secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Data Retention</h2>
              <p className="text-gray-700">
                We retain your personal information for as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements. Project files and designs are typically retained for 7 years for reference purposes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Your Rights</h2>
              <div className="text-gray-700">
                <p className="mb-3">You have the right to:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Access and review your personal information</li>
                  <li>Correct inaccurate or incomplete information</li>
                  <li>Request deletion of your personal information</li>
                  <li>Object to or restrict processing of your information</li>
                  <li>Receive a copy of your information in a portable format</li>
                  <li>Withdraw consent where processing is based on consent</li>
                </ul>
                <p className="mt-3">
                  To exercise these rights, please contact us at <a href="mailto:kayne@pooldesignconsultant.com" className="text-blue-600 hover:underline">kayne@pooldesignconsultant.com</a>
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">7. Cookies and Tracking</h2>
              <p className="text-gray-700">
                We use cookies and similar technologies to enhance your experience, analyze website usage, and provide personalized content. You can control cookie settings through your browser preferences.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">8. Third-Party Services</h2>
              <div className="text-gray-700">
                <p className="mb-3">Our website integrates with third-party services:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>SendGrid:</strong> Email delivery and notifications</li>
                  <li><strong>Stripe:</strong> Payment processing and billing</li>
                  <li><strong>Crisp:</strong> Customer chat and support</li>
                </ul>
                <p className="mt-3">These services have their own privacy policies and terms of use.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">9. California Privacy Rights</h2>
              <p className="text-gray-700">
                California residents have additional rights under the CCPA, including the right to know about personal information collected, sold, or disclosed, and the right to delete personal information. We do not sell personal information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">10. International Data Transfers</h2>
              <p className="text-gray-700">
                Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information in accordance with applicable data protection laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">11. Changes to This Policy</h2>
              <p className="text-gray-700">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on our website and updating the "Last Updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">12. Contact Us</h2>
              <div className="text-gray-700">
                <p className="mb-3">If you have questions about this Privacy Policy or our data practices, please contact us:</p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p><strong>Pool Design Consultant</strong></p>
                  <p>Email: <a href="mailto:kayne@pooldesignconsultant.com" className="text-blue-600 hover:underline">kayne@pooldesignconsultant.com</a></p>
                  <p>Address: 4300 W Lake Mary Blvd, Suite 1010, Lake Mary, FL 32746</p>
                </div>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}