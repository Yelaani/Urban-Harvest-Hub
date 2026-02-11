import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900">
            <Navbar />
            <main className="flex-grow bg-slate-50 dark:bg-slate-900">
                {/* Main content area with semantic HTML */}
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
