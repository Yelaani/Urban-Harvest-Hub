import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <h1 className="text-6xl font-bold text-urban-green mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-slate-800 mb-6">Page Not Found</h2>
            <p className="text-slate-600 mb-8 max-w-md">
                Oops! The page you're looking for seems to have grown legs and wandered off.
            </p>
            <Link to="/" className="btn-primary">
                Return to Homepage
            </Link>
        </div>
    );
};

export default NotFound;
