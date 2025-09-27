import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsConditions() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card className="shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-orange-500 text-white rounded-t-lg">
            <CardTitle className="text-3xl font-bold text-center">Terms & Conditions</CardTitle>
            <p className="text-center text-blue-100 mt-2">Pool Design Consultant</p>
            <p className="text-center text-blue-100 text-sm">Last Updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          
          <CardContent className="p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700">
                By accessing and using Pool Design Consultant services, including our website and design consultation services, you accept and agree to be bound by these Terms & Conditions. If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">2. Services Description</h2>
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Design Services</h3>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Pool design concepts and 3D visualizations</li>
                    <li>Cost estimates and material specifications</li>
                    <li>Construction guidance for owner-builders</li>
                    <li>Professional consultation and project planning</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Service Limitations</h3>
                  <p className="mb-2">Our services do NOT include:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Structural engineering or licensed engineering services</li>
                    <li>Permit acquisition or regulatory approvals</li>
                    <li>Code compliance guarantees or certifications</li>
                    <li>Construction supervision or project management</li>
                    <li>Warranty on actual construction quality or outcomes</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Client Responsibilities</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Provide accurate and complete property information</li>
                <li>Obtain all necessary permits and approvals</li>
                <li>Ensure compliance with local building codes and regulations</li>
                <li>Verify HOA requirements and restrictions independently</li>
                <li>Make final decisions on code compliance and safety matters</li>
                <li>Engage licensed professionals for engineering and permit services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Estimates vs. Guarantees</h2>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
                <p className="text-gray-700">
                  <strong>Important:</strong> All cost estimates, timelines, and design specifications are estimates only and not guarantees. Actual costs may vary based on site conditions, material availability, labor costs, permit requirements, and other factors beyond our control.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Payment Terms</h2>
              <div className="space-y-4 text-gray-700">
                <ul className="list-disc list-inside space-y-2">
                  <li>Design consultation fees are due upon completion of initial concepts</li>
                  <li>Payment processing is handled through Stripe payment services</li>
                  <li>Chargebacks may result in termination of services</li>
                  <li>Additional services beyond initial scope require separate agreements</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">6. No-Refund Policy</h2>
              <div className="bg-red-50 border-l-4 border-red-400 p-4 my-4">
                <p className="text-gray-700">
                  <strong>Important:</strong> Because our services involve custom design work, engineering coordination, and digital deliverables prepared specifically for each client, we do not offer refunds once an order has been placed and work has begun.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">7. File Uploads and Content</h2>
              <div className="space-y-4 text-gray-700">
                <h3 className="text-lg font-semibold text-gray-800">Acceptable Use</h3>
                <p>When uploading files to our system, you agree that:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Files are free from malware, viruses, and harmful content</li>
                  <li>You own or have permission to share all uploaded materials</li>
                  <li>Content does not violate any laws or third-party rights</li>
                  <li>Files are relevant to your pool design project</li>
                </ul>
                
                <h3 className="text-lg font-semibold text-gray-800 mt-4">License to Use</h3>
                <p>By uploading files, you grant us a license to:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Use uploaded materials to provide design services</li>
                  <li>Include finished projects in our portfolio (with your consent)</li>
                  <li>Store and process files as necessary for service delivery</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">8. Intellectual Property</h2>
              <div className="space-y-4 text-gray-700">
                <h3 className="text-lg font-semibold text-gray-800">Design Ownership</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>Final design files become your property upon full payment</li>
                  <li>We retain the right to use completed projects for portfolio purposes</li>
                  <li>You may not redistribute or resell our design concepts</li>
                  <li>Our design methodologies and processes remain our intellectual property</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">9. Disclaimers and Liability</h2>
              <div className="space-y-4 text-gray-700">
                <h3 className="text-lg font-semibold text-gray-800">Service Disclaimers</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>Services are provided "as is" without warranties of any kind</li>
                  <li>We disclaim liability for construction outcomes or permit issues</li>
                  <li>No guarantee of specific cost savings or project success</li>
                  <li>Third-party service availability (Stripe, SendGrid) beyond our control</li>
                </ul>
                
                <h3 className="text-lg font-semibold text-gray-800">Limitation of Liability</h3>
                <div className="bg-red-50 border-l-4 border-red-400 p-4">
                  <p>
                    Our total liability for any claims related to our services is limited to the amount you paid for our services. We are not liable for indirect, consequential, or punitive damages.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">10. Indemnification</h2>
              <p className="text-gray-700">
                You agree to indemnify and hold harmless Pool Design Consultant from any claims, damages, or expenses arising from your use of our services, violation of these terms, or infringement of any third-party rights.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">11. Electronic Communications</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>You consent to receive electronic communications from us</li>
                <li>Electronic signatures are valid and binding</li>
                <li>We maintain records of all electronic communications</li>
                <li>You may opt out of marketing communications but not service-related emails</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">12. Third-Party Services</h2>
              <p className="text-gray-700">
                Our website and services integrate with third-party providers (Stripe for payments, SendGrid for emails, Crisp for chat). Use of these services is subject to their respective terms and conditions. We are not responsible for third-party service outages or policy changes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">13. Dispute Resolution</h2>
              <div className="space-y-4 text-gray-700">
                <h3 className="text-lg font-semibold text-gray-800">Governing Law</h3>
                <p>These terms are governed by the laws of Florida, United States.</p>
                
                <h3 className="text-lg font-semibold text-gray-800">Dispute Process</h3>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Attempt to resolve disputes through direct communication</li>
                  <li>Mediation through a mutually agreed mediator</li>
                  <li>Binding arbitration if mediation fails</li>
                  <li>Disputes under $10,000 may be filed in small claims court</li>
                </ol>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">14. Force Majeure</h2>
              <p className="text-gray-700">
                We are not liable for delays or failures in performance due to circumstances beyond our reasonable control, including natural disasters, government actions, internet outages, or other force majeure events.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">15. Termination</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Either party may terminate services with reasonable notice</li>
                <li>We may suspend services for violation of these terms</li>
                <li>Termination does not affect completed work or payment obligations</li>
                <li>Some provisions survive termination (intellectual property, liability limitations)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">16. Modifications</h2>
              <p className="text-gray-700">
                We may update these Terms & Conditions from time to time. Material changes will be communicated via email or website notification. Continued use of our services after changes constitutes acceptance of new terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">17. Contact Information</h2>
              <div className="text-gray-700">
                <p className="mb-3">For questions about these Terms & Conditions, please contact us:</p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p><strong>Pool Design Consultant</strong></p>
                  <p>Email: <a href="mailto:kayne@pooldesignconsultant.com" className="text-blue-600 hover:underline">kayne@pooldesignconsultant.com</a></p>
                  <p>Address: 4300 W Lake Mary Blvd, Suite 1010, Lake Mary, FL 32746</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">18. Severability</h2>
              <p className="text-gray-700">
                If any provision of these terms is found to be unenforceable, the remaining provisions will continue in full force and effect.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}