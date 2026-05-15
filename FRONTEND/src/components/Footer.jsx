import { Link } from "react-router-dom";
import { navBrandClass, mutedText, linkClass } from "../styles/common";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white/40 backdrop-blur-md border-t border-[#e8e8ed] py-12 mt-20 relative z-10">

      <div className="max-w-5xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className={`${navBrandClass} text-xl flex items-center gap-2 mb-4`}>
              <span className="text-2xl">☁️</span> ResumeAI
            </Link>
            <p className={`${mutedText} leading-relaxed`}>
              Elevating careers with AI-powered resume intelligence and professional design optimization.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-[11px] font-bold text-[#1d1d1f] uppercase tracking-widest mb-4">Product</h4>
            <ul className="space-y-2">
              <li><Link to="/upload" className={`${linkClass} text-sm font-medium`}>ATS Checker</Link></li>
              <li><Link to="/resume-builder/new" className={`${linkClass} text-sm font-medium`}>Resume Builder</Link></li>
              <li><Link to="/history" className={`${linkClass} text-sm font-medium`}>History</Link></li>
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="text-[11px] font-bold text-[#1d1d1f] uppercase tracking-widest mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className={`${linkClass} text-sm font-medium`}>AI Guidelines</a></li>
              <li><a href="#" className={`${linkClass} text-sm font-medium`}>Resume Tips</a></li>
              <li><a href="#" className={`${linkClass} text-sm font-medium`}>Privacy Policy</a></li>
            </ul>
          </div>

          {/* Social / Contact */}
          <div>
            <h4 className="text-[11px] font-bold text-[#1d1d1f] uppercase tracking-widest mb-4">Connect</h4>
            <ul className="space-y-2">
              <li><a href="https://github.com" target="_blank" rel="noreferrer" className={`${linkClass} text-sm font-medium`}>GitHub</a></li>
              <li><a href="mailto:support@resumeai.com" className={`${linkClass} text-sm font-medium`}>Support</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[#e8e8ed] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className={`${mutedText} text-[12px]`}>
            © {currentYear} ResumeAI Inc. Crafted for professional excellence.
          </p>
          <div className="flex gap-6">
            <span className="text-[12px] text-[#a1a1a6]">System Status: <span className="text-[#34c759] font-medium">Operational</span></span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

