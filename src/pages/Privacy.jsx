import SEO from '../components/SEO';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Privacy = () => (
  <>
    <SEO title="Privacy Policy" description="Talentyra privacy policy - how we collect, use, and protect your data." />
    <Navbar />
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Privacy Policy</h1>
      <div className="prose prose-gray dark:prose-invert max-w-none text-sm leading-relaxed space-y-4 text-gray-600 dark:text-gray-300">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        <p>Talentyra respects your privacy. This policy explains how we collect, use, and protect your information.</p>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Information We Collect</h2>
        <p>We collect information you provide when creating an account (name, email) and data about your job search preferences and interactions.</p>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">How We Use Your Data</h2>
        <ul><li>To personalize your job recommendations</li><li>To improve our platform</li><li>To send relevant job alerts (with your consent)</li></ul>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Cookies</h2>
        <p>We use essential cookies for authentication and optional cookies for analytics and personalization.</p>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Contact</h2>
        <p>Email: support@talentyra.com</p>
      </div>
    </div>
    <Footer />
  </>
);

export default Privacy;
