import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { styles } from '../ResumeStyles';

const PDFProjects = ({ projects = [] }) => {
  const filteredProj = projects.filter(p => p.name);
  if (filteredProj.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Projects</Text>
      {projects.map((proj, i) => (
        proj.name && (
          <View key={i} style={styles.entry}>
            <View style={styles.entryHeader}>
              <Text style={styles.company}>{proj.name}</Text>
              <Text style={styles.duration}>{Array.isArray(proj.techStack) ? proj.techStack.join(', ') : (proj.techStack || '')}</Text>
            </View>

            {(proj.projectLink || proj.gitRepo) && (
              <View style={{ flexDirection: 'row', gap: 10, marginTop: 1 }}>
                {proj.projectLink ? <Text style={styles.linkText}>Live: {proj.projectLink}</Text> : null}
                {proj.gitRepo ? <Text style={styles.linkText}>GitHub: {proj.gitRepo}</Text> : null}
              </View>
            )}

            {Array.isArray(proj.points) ? (
              proj.points.filter(p => p).map((p, j) => (
                <View key={j} style={styles.bulletPoint}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.bulletText}>{p}</Text>
                </View>
              ))
            ) : (
              proj.description ? <Text style={styles.description}>{proj.description}</Text> : null
            )}
          </View>
        )
      ))}
    </View>
  );
};

export default React.memo(PDFProjects);
