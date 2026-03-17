import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { styles } from '../ResumeStyles';

const PDFAchievements = ({ achievements = [] }) => {
  const filteredAch = achievements.filter(a => a && a.trim().length > 0);
  if (filteredAch.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Achievements & Accomplishments</Text>
      {filteredAch.map((ach, i) => (
        <View key={i} style={styles.bulletPoint}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.bulletText}>{ach}</Text>
        </View>
      ))}
    </View>
  );
};

export default React.memo(PDFAchievements);
