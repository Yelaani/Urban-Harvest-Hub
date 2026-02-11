import { Github, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-slate-900 text-slate-300 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-xl font-bold text-white mb-4">Urban Harvest Hub</h3>
                        <p className="text-sm leading-relaxed">
                            Connecting urban communities with sustainable gardening, eco-friendly events, and organic products.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-urban-green transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-urban-green transition-colors">Workshops</a></li>
                            <li><a href="#" className="hover:text-urban-green transition-colors">Products</a></li>
                            <li><a href="#" className="hover:text-urban-green transition-colors">Contact</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Connect</h3>
                        <div className="flex space-x-4">
                            <a href="#" className="hover:text-urban-green transition-colors" aria-label="Twitter"><Twitter className="h-5 w-5" /></a>
                            <a href="#" className="hover:text-urban-green transition-colors" aria-label="Instagram"><Instagram className="h-5 w-5" /></a>
                            <a href="#" className="hover:text-urban-green transition-colors" aria-label="GitHub"><Github className="h-5 w-5" /></a>
                        </div>
                    </div>
                </div>
                <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-500">
                    © {new Date().getFullYear()} Urban Harvest Hub. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
