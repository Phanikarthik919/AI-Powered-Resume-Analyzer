import { cardClass, subHeadingClass, mutedText, emptyStateClass } from "../styles/common";

function FilePreview({ file }) {
  if (!file) {
    return (
      <div className={cardClass}>
        <p className={emptyStateClass}>No file selected for preview.</p>
      </div>
    );
  }

  const previewUrl = URL.createObjectURL(file);

  return (
    <div className={cardClass}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={subHeadingClass}>File Preview</h3>
        <p className={mutedText}>{file.name}</p>
      </div>
      <iframe
        src={previewUrl}
        title="Resume Preview"
        className="w-full h-[600px] rounded-xl border border-[#d2d2d7]"
      />
    </div>
  );
}

export default FilePreview;
