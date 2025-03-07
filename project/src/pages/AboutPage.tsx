import React from 'react';
import { Users, Award, Clock, Truck } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="py-8">
      <div className="container">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary to-accent text-white rounded-lg overflow-hidden mb-12">
          <div className="p-8 md:p-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">About WITTY WITI</h1>
            <p className="text-xl mb-6">A gizmo planet where smart gadget equals MERCHANDISE</p>
            <p className="max-w-2xl">
              WITTY WITI is a leading provider of tech gadgets and phone accessories in Nigeria. 
              We offer a wide range of high-quality products at competitive prices, with a focus 
              on customer satisfaction and excellent service.
            </p>
          </div>
        </div>
        
        {/* Our Story */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Story</h2>
            <div className="w-20 h-1 bg-primary mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-gray-700 mb-4">
                Founded in 2018, WITTY WITI started as a small shop selling phone accessories in Lagos. 
                Our founder, recognizing the growing demand for quality tech products, expanded the business 
                to include a wider range of gadgets and accessories.
              </p>
              <p className="text-gray-700 mb-4">
                Over the years, we have grown to become a trusted name in the tech retail industry, 
                serving thousands of customers across Nigeria. Our commitment to quality, affordability, 
                and customer service has been the cornerstone of our success.
              </p>
              <p className="text-gray-700">
                Today, WITTY WITI continues to evolve, embracing new technologies and trends to bring 
                the best products to our customers. We remain dedicated to our mission of making smart 
                gadgets accessible to everyone.
              </p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4">
                  <div className="text-3xl font-bold text-primary mb-2">5+</div>
                  <p className="text-gray-600">Years in Business</p>
                </div>
                <div className="text-center p-4">
                  <div className="text-3xl font-bold text-primary mb-2">10k+</div>
                  <p className="text-gray-600">Happy Customers</p>
                </div>
                <div className="text-center p-4">
                  <div className="text-3xl font-bold text-primary mb-2">500+</div>
                  <p className="text-gray-600">Products</p>
                </div>
                <div className="text-center p-4">
                  <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                  <p className="text-gray-600">Customer Support</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Our Values */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <div className="w-20 h-1 bg-primary mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="inline-block p-3 bg-primary bg-opacity-10 rounded-full mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Customer First</h3>
              <p className="text-gray-600">
                We prioritize our customers' needs and strive to exceed their expectations in every interaction.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="inline-block p-3 bg-primary bg-opacity-10 rounded-full mb-4">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Quality</h3>
              <p className="text-gray-600">
                We are committed to offering only the highest quality products that meet our strict standards.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="inline-block p-3 bg-primary bg-opacity-10 rounded-full mb-4">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Reliability</h3>
              <p className="text-gray-600">
                We believe in being dependable and consistent in our service and product offerings.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="inline-block p-3 bg-primary bg-opacity-10 rounded-full mb-4">
                <Truck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Efficiency</h3>
              <p className="text-gray-600">
                We strive for operational excellence to deliver products quickly and efficiently.
              </p>
            </div>
          </div>
        </div>
        
        {/* Our Team */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Team</h2>
            <div className="w-20 h-1 bg-primary mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
                alt="CEO" 
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-1">Adeniji Oluwaseun</h3>
                <p className="text-primary mb-3">Founder & CEO</p>
                <p className="text-gray-600">
                  With over 10 years of experience in the tech industry, Oluwaseun leads WITTY WITI with 
                  vision and passion.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
                alt="COO" 
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-1">Sarah Johnson</h3>
                <p className="text-primary mb-3">Chief Operations Officer</p>
                <p className="text-gray-600">
                  Sarah oversees the day-to-day operations, ensuring that everything runs smoothly and efficiently.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
                alt="CTO" 
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-1">Michael Chen</h3>
                <p className="text-primary mb-3">Chief Technology Officer</p>
                <p className="text-gray-600">
                  Michael leads our tech team, keeping us at the forefront of technological advancements.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Call to Action */}
        <div className="bg-gray-100 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Experience WITTY WITI?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            Browse our wide selection of tech gadgets and accessories, and find the perfect products for your needs.
          </p>
          <div className="flex justify-center space-x-4">
            <a href="/products" className="btn btn-primary">
              Shop Now
            </a>
            <a href="/contact" className="btn btn-outline">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;