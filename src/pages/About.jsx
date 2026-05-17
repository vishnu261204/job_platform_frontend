import SEO from '../components/SEO';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Briefcase, Sparkles, Users, Globe } from 'lucide-react';

const About = () => (
  <>
    <SEO title="About Us" description="Learn about Talentyra and our mission to connect talent with opportunity." />
    <Navbar />
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/20">
          <Briefcase className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">About Talentyra</h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">We're on a mission to make job searching simple, intelligent, and accessible for everyone.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          { icon: Sparkles, title: 'Smart Matching', desc: 'AI-powered algorithms find the best roles for your unique skills and preferences.' },
          { icon: Users, title: 'Community Driven', desc: 'Join thousands of professionals discovering opportunities that align with their career goals.' },
          { icon: Globe, title: 'Global Reach', desc: 'Access job listings from companies worldwide, from remote startups to global enterprises.' },
        ].map((f, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700/50">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center mb-3">
              <f.icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{f.title}</h3>
            <p className="text-sm text-gray-500">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
    <Footer />
  </>
);

export default About;
