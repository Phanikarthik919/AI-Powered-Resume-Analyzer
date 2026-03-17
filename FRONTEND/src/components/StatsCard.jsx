import { cardClass, subHeadingClass, mutedText, headingClass } from "../styles/common";

function StatsCard({ title, value, icon, subtitle }) {
  return (
    <div className={cardClass}>
      <div className="flex items-start justify-between mb-3">
        <p className={mutedText}>{title}</p>
        {icon && <span className="text-2xl">{icon}</span>}
      </div>
      <p className={headingClass}>{value}</p>
      {subtitle && <p className={`${mutedText} mt-1`}>{subtitle}</p>}
    </div>
  );
}

export default StatsCard;
