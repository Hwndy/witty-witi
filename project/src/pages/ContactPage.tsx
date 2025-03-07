import React from 'react';
import ContactSection from '../components/ContactSection';

const ContactPage: React.FC = () => {
  return (
    <div className="py-8">
      <div className="container">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
          <p className="text-gray-600">
            We'd love to hear from you. Get in touch with our team.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.7286885172613!2d3.3751328!3d6.4511552!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8b2a74c66d69%3A0xb2ef3c2aaff87d15!2sLagos%2C%20Nigeria!5e0!3m2!1sen!2s!4v1620123456789!5m2!1sen!2s" 
                width="100%" 
                height="300" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy"
                title="WITTY WITI Location"
                className="rounded-lg"
              ></iframe>
              <div className="mt-4">
                <h3 className="text-xl font-bold mb-2">Our Location</h3>
                <p className="text-gray-600">
                  Lagos, Nigeria
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Contact</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-1">Phone</h4>
                  <p className="text-gray-600 mb-1">08096560016</p>
                  <p className="text-gray-600">07031467508</p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-1">Email</h4>
                  <p className="text-gray-600">adeniji1440@gmail.com</p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-1">Social Media</h4>
                  <p className="text-gray-600">@wittywiti</p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-1">Business Hours</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li className="flex justify-between">
                      <span>Monday - Friday:</span>
                      <span>9:00 AM - 6:00 PM</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Saturday:</span>
                      <span>10:00 AM - 4:00 PM</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Sunday:</span>
                      <span>Closed</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <ContactSection />
      </div>
    </div>
  );
};

export default ContactPage;