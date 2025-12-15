import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const ContactModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    email: '',
    message: ''
  });

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    // You can add your form submission logic here
    alert('Message sent successfully!');
    
    // Reset form
    setFormData({
      name: '',
      subject: '',
      email: '',
      message: ''
    });
    onClose();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      subject: '',
      email: '',
      message: ''
    });
  };

  // Don't render anything if modal is not open
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        // Close modal if clicking on backdrop
        if (e.target === e.currentTarget) {
          onClose();
          resetForm();
        }
      }}
    >
      <div 
        className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside
      >
        
        {/* Header */}
        <div className="bg-red-500 text-white p-8 text-center relative">
          <button
            onClick={() => {
              onClose();
              resetForm();
            }}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
          >
            <X size={24} />
          </button>
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Get in touch with Platea, Whether you have a question, need assistance, or want to make a reservation, our team is here to help. Reach out to us today for a seamless experience.
          </p>
        </div>

        {/* Form Content */}
        <div className="p-8 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
            
            {/* Your Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                placeholder="Enter your full name"
              />
            </div>

            {/* Subject */}
            <div>
              <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                placeholder="What is this regarding?"
              />
            </div>

            {/* Email Address */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                placeholder="your.email@example.com"
              />
            </div>

            {/* Your Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">
                Your Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-vertical"
                placeholder="Tell us how we can help you..."
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="bg-black text-white px-8 py-3 font-semibold uppercase tracking-wider hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;