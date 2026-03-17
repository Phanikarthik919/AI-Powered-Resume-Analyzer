import { divider, mutedText, navBrandClass } from "../styles/common";

function Footer() {
  return (
    <footer className="bg-white border-t border-[#e8e8ed] mt-auto">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className={divider} />
        <div className="flex items-center justify-between">
          <span className={navBrandClass}>☁️ ResumeAI</span>
          <p className={mutedText}>
            © {new Date().getFullYear()} ResumeAI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
