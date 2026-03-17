import { Document, Page } from '@react-pdf/renderer';
import { styles } from './resume/ResumeStyles';
import PDFHeader from './resume/pdf/PDFHeader';
import PDFSummary from './resume/pdf/PDFSummary';
import PDFExperience from './resume/pdf/PDFExperience';
import PDFSkills from './resume/pdf/PDFSkills';
import PDFProjects from './resume/pdf/PDFProjects';
import PDFAchievements from './resume/pdf/PDFAchievements';
import PDFEducation from './resume/pdf/PDFEducation';

const ResumePDFTemplate = ({ data }) => {
  if (!data) return null;

  const {
    personalInfo = {},
    summary = "",
    skills = {},
    experience = [],
    projects = [],
    education = [],
    achievements = []
  } = data;

  return (
    <Document title={`${personalInfo.name || 'Resume'} - Optimized`}>
      <Page size="A4" style={styles.page}>
        <PDFHeader personalInfo={personalInfo} />
        <PDFSummary summary={summary} />
        <PDFExperience experience={experience} />
        <PDFSkills skills={skills} />
        <PDFProjects projects={projects} />
        <PDFAchievements achievements={achievements} />
        <PDFEducation education={education} />
      </Page>
    </Document>
  );
};

export default ResumePDFTemplate;
