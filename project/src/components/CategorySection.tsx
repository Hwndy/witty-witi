import React from 'react';
import { Link } from 'react-router-dom';
import { Smartphone, Laptop, Headphones, Battery, Zap, Fan } from 'lucide-react';

const categories = [
  {
    id: 'phones',
    name: 'Phones',
    icon: <Smartphone className="h-10 w-10 mb-4 text-primary" />,
    description: 'Latest smartphones and accessories',
    link: '/products/phones'
  },
  {
    id: 'laptops',
    name: 'Laptops',
    icon: <Laptop className="h-10 w-10 mb-4 text-primary" />,
    description: 'Powerful laptops for work and play',
    link: '/products/laptops'
  },
  {
    id: 'fans',
    name: 'Fans',
    icon: <Fan className="h-10 w-10 mb-4 text-primary" />,
    description: 'Portable and desktop fans',
    link: '/products/fans'
  },
  {
    id: 'headphones',
    name: 'Headphones',
    icon: <Headphones className="h-10 w-10 mb-4 text-primary" />,
    description: 'Wireless and wired headphones',
    link: '/products/headphones'
  },
  {
    id: 'chargers',
    name: 'Chargers',
    icon: <Zap className="h-10 w-10 mb-4 text-primary" />,
    description: 'Fast charging solutions',
    link: '/products/chargers'
  },
  {
    id: 'powerbanks',
    name: 'Power Banks',
    icon: <Battery className="h-10 w-10 mb-4 text-primary" />,
    description: 'Portable power on the go',
    link: '/products/powerbanks'
  }
];

const CategorySection: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Product Categories</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our wide range of tech gadgets and accessories for all your needs
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link 
              key={category.id}
              to={category.link}
              className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex flex-col items-center">
                {category.icon}
                <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                <p className="text-gray-600 mb-4">{category.description}</p>
                <span className="text-primary font-medium">View Products →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;