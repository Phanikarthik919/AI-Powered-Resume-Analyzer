import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { styles } from '../ResumeStyles';

const PDFExperience = ({ experience = [] }) => {
  const filteredExp = experience.filter(e => e.company || e.title);
  if (filteredExp.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Experience</Text>
      {experience.map((exp, i) => (
        (exp.company || exp.title) && (
          <View key={i} style={styles.entry}>
            <View style={styles.entryHeader}>
              <Text style={styles.company}>{exp.company || ''} {exp.company && exp.title ? '—' : ''} {exp.title || ''}</Text>
              <Text style={styles.duration}>{exp.duration || ''}</Text>
            </View>
            {Array.isArray(exp.description) ? (
              exp.description.filter(d => d).map((desc, j) => (
                <View key={j} style={styles.bulletPoint}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.bulletText}>{desc}</Text>
                </View>
              ))
            ) : (
              exp.description ? <Text style={styles.description}>{exp.description}</Text> : null
            )}
          </View>
        )
      ))}
    </View>
  );
};

export default React.memo(PDFExperience);
