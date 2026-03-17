import { cardClass, headingClass, bodyText, primaryBtn, secondaryBtn } from "../styles/common";

function DownloadResume({ fileName = "resume.pdf", fileUrl }) {
  const handleDownload = () => {
    if (!fileUrl) return;
    const a = document.createElement("a");
    a.href = fileUrl;
    a.download = fileName;
    a.click();
  };

  return (
    <div className={cardClass}>
      <h2 className={headingClass}>Download Resume</h2>
      <p className={`${bodyText} mt-1 mb-5`}>
        Download your original or AI-enhanced resume.
      </p>
      <div className="flex items-center gap-3">
        <button className={primaryBtn} onClick={handleDownload} disabled={!fileUrl}>
          ⬇ Download PDF
        </button>
        <button className={secondaryBtn}>Share Link</button>
      </div>
    </div>
  );
}

export default DownloadResume;
