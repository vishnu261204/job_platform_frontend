import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import Navbar from '../components/Navbar';

const NotFound = () => (
  <>
    <SEO title="Page Not Found" description="The page you're looking for doesn't exist." />
    <Navbar />
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-6xl font-bold text-indigo-500 mb-4">404</p>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Page not found</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all text-sm">
          Go home
        </Link>
      </div>
    </div>
  </>
);

export default NotFound;
