import React from 'react'
import { Shield, Lock, Eye, FileText, AlertCircle } from 'lucide-react'
import BlurCircle from '../components/BlurCircle'

const Privacy = () => {
  return (
    <div className="relative min-h-screen pt-20 sm:pt-24 md:pt-28 px-4 sm:px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden pb-12">
      <BlurCircle top="100px" left="0px" />
      <BlurCircle bottom="200px" right="50px" />

      <div className="max-w-4xl mx-auto py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">Privacy Policy</h1>
          </div>
          <p className="text-gray-400 text-sm sm:text-base">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="space-y-6 sm:space-y-8">
          {/* Introduction */}
          <section className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-5 sm:p-6 md:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Introduction</h2>
            <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
              At <strong className="text-white">KukiShow</strong>, we take your privacy seriously. This Privacy Policy 
              explains how we collect, use, disclose, and safeguard your information when you use our movie ticket 
              booking platform. Please read this privacy policy carefully. If you do not agree with the terms of this 
              privacy policy, please do not access the site.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-5 sm:p-6 md:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
              Information We Collect
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Personal Information</h3>
                <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                  We collect information that you provide directly to us, including:
                </p>
                <ul className="list-disc list-inside text-gray-300 mt-2 space-y-1 ml-2 sm:ml-4 text-sm sm:text-base">
                  <li>Name and contact information (email address, phone number)</li>
                  <li>Account credentials (managed through Clerk authentication)</li>
                  <li>Payment information (processed securely through Stripe)</li>
                  <li>Booking history and preferences</li>
                </ul>
              </div>
              <div className="mt-4">
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Automatically Collected Information</h3>
                <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                  When you use our service, we automatically collect certain information, including:
                </p>
                <ul className="list-disc list-inside text-gray-300 mt-2 space-y-1 ml-2 sm:ml-4 text-sm sm:text-base">
                  <li>Device information and browser type</li>
                  <li>IP address and location data</li>
                  <li>Usage patterns and interaction with our platform</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-5 sm:p-6 md:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
              How We Use Your Information
            </h2>
            <p className="text-gray-300 leading-relaxed mb-3 sm:mb-4 text-sm sm:text-base">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-2 sm:ml-4 text-sm sm:text-base">
              <li>Process and manage your ticket bookings</li>
              <li>Send booking confirmations and reminders</li>
              <li>Improve and personalize your experience on our platform</li>
              <li>Communicate with you about our services, updates, and promotional offers</li>
              <li>Detect and prevent fraud or unauthorized access</li>
              <li>Comply with legal obligations and enforce our terms of service</li>
            </ul>
          </section>

          {/* Data Security */}
          <section className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-5 sm:p-6 md:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
              Data Security
            </h2>
            <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
              We implement appropriate technical and organizational security measures to protect your personal information. 
              This includes:
            </p>
            <ul className="list-disc list-inside text-gray-300 mt-3 sm:mt-4 space-y-2 ml-2 sm:ml-4 text-sm sm:text-base">
              <li>Encryption of data in transit and at rest</li>
              <li>Secure authentication through Clerk</li>
              <li>PCI-DSS compliant payment processing via Stripe</li>
              <li>Regular security assessments and updates</li>
              <li>Access controls and employee training on data protection</li>
            </ul>
            <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <p className="text-yellow-400 text-xs sm:text-sm flex items-start gap-2">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" />
                <span>
                  While we strive to protect your personal information, no method of transmission over the Internet 
                  or electronic storage is 100% secure. We cannot guarantee absolute security.
                </span>
              </p>
            </div>
          </section>

          {/* Third-Party Services */}
          <section className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-5 sm:p-6 md:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Third-Party Services</h2>
            <p className="text-gray-300 leading-relaxed mb-3 sm:mb-4 text-sm sm:text-base">
              We use trusted third-party services to operate our platform:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-2 sm:ml-4 text-sm sm:text-base">
              <li><strong className="text-white">Clerk:</strong> User authentication and account management</li>
              <li><strong className="text-white">Stripe:</strong> Secure payment processing</li>
              <li><strong className="text-white">TMDB:</strong> Movie information and metadata</li>
              <li><strong className="text-white">Inngest:</strong> Background job processing and notifications</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-3 sm:mt-4 text-sm sm:text-base">
              These services have their own privacy policies, and we encourage you to review them.
            </p>
          </section>

          {/* Your Rights */}
          <section className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-5 sm:p-6 md:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Your Rights</h2>
            <p className="text-gray-300 leading-relaxed mb-3 sm:mb-4 text-sm sm:text-base">
              You have the right to:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-2 sm:ml-4 text-sm sm:text-base">
              <li>Access and receive a copy of your personal data</li>
              <li>Rectify inaccurate or incomplete information</li>
              <li>Request deletion of your personal data</li>
              <li>Object to or restrict processing of your data</li>
              <li>Data portability (receive your data in a structured format)</li>
              <li>Withdraw consent at any time</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-3 sm:mt-4 text-sm sm:text-base">
              To exercise these rights, please contact us at{' '}
              <a href="mailto:kushkore90@gmail.com" className="text-red-400 hover:text-red-300 break-all">
                kushkore90@gmail.com
              </a>
            </p>
          </section>

          {/* Cookies */}
          <section className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-5 sm:p-6 md:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Cookies and Tracking</h2>
            <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
              We use cookies and similar tracking technologies to enhance your experience, analyze usage patterns, 
              and improve our services. You can control cookies through your browser settings, but disabling cookies 
              may limit certain functionalities of our platform.
            </p>
          </section>

          {/* Changes to Privacy Policy */}
          <section className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-5 sm:p-6 md:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Changes to This Privacy Policy</h2>
            <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the 
              new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this 
              Privacy Policy periodically for any changes.
            </p>
          </section>

          {/* Contact Information */}
          <section className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-5 sm:p-6 md:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Contact Us</h2>
            <p className="text-gray-300 leading-relaxed mb-3 sm:mb-4 text-sm sm:text-base">
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <div className="space-y-2 text-gray-300 text-sm sm:text-base">
              <p><strong className="text-white">Email:</strong> <a href="mailto:kushkore90@gmail.com" className="text-red-400 hover:text-red-300 break-all">kushkore90@gmail.com</a></p>
              <p><strong className="text-white">Phone:</strong> <a href="tel:+918788397057" className="text-red-400 hover:text-red-300">+91 8788397057</a></p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default Privacy

