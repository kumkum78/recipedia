// import React from 'react';
import SectionTitle from './SectionTitle';

const ContactUs = () => {
    return (
        <section id="contact" className="py-20 lg:py-28 bg-gray-50">
            <div className="container mx-auto px-4">
                <SectionTitle title="Contact Us" subtitle="Have a project in mind? We'd love to hear from you. Fill out the form below and we'll get back to you as soon as possible." />
                <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-lg shadow-xl">
                    <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <input type="text" placeholder="Your Name" className="p-3 bg-gray-100 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" />
                        <input type="email" placeholder="Your Email" className="p-3 bg-gray-100 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" />
                        <input type="text" placeholder="Subject" className="md:col-span-2 p-3 bg-gray-100 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" />
                        <textarea placeholder="Your Message" rows="5" className="md:col-span-2 p-3 bg-gray-100 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"></textarea>
                        <div className="md:col-span-2 text-center">
                            <button type="submit" className="bg-blue-600 text-white font-bold uppercase tracking-wider px-8 py-4 rounded-full hover:bg-blue-700 transition-all duration-300 transform hover:scale-105">
                                Send Message
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};


export default ContactUs;
