import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow bg-slate-50">
                {/* Main content area with semantic HTML */}
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
