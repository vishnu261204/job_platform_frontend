import SEO from '../components/SEO';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Terms = () => (
  <>
    <SEO title="Terms of Service" description="Talentyra terms of service and conditions of use." />
    <Navbar />
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Terms of Service</h1>
      <div className="prose prose-gray dark:prose-invert max-w-none text-sm leading-relaxed space-y-4 text-gray-600 dark:text-gray-300">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        <p>By using Talentyra, you agree to these terms. Please read them carefully.</p>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Account</h2>
        <p>You are responsible for maintaining your account credentials. You must be at least 16 years old to use this service.</p>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Use of Service</h2>
        <p>Talentyra aggregates job listings from various sources. We do not guarantee the accuracy or availability of any listed position.</p>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Limitation of Liability</h2>
        <p>Talentyra is provided "as is" without any warranty. We are not liable for any damages arising from your use of the platform.</p>
      </div>
    </div>
    <Footer />
  </>
);

export default Terms;
