import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { styles } from '../ResumeStyles';

const PDFEducation = ({ education = [] }) => {
  const filteredEdu = education.filter(e => e.institution);
  if (filteredEdu.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Education</Text>
      {education.map((edu, i) => (
        edu.institution && (
          <View key={i} style={styles.entry}>
            <View style={styles.entryHeader}>
              <Text style={styles.company}>{edu.institution}</Text>
              <Text style={styles.duration}>{edu.year || ''}</Text>
            </View>
            <Text style={styles.description}>{edu.degree || ''} {edu.score ? `(${edu.score})` : ''}</Text>
          </View>
        )
      ))}
    </View>
  );
};

export default React.memo(PDFEducation);
