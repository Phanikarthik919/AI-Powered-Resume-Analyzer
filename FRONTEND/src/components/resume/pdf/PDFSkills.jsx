import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { styles } from '../ResumeStyles';

const PDFSkills = ({ skills = {} }) => {
  if (!skills || typeof skills !== 'object' || Object.keys(skills).length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Skills</Text>
      {Object.entries(skills).map(([key, value]) => {
        const displayValue = Array.isArray(value) ? value.join(', ') : value;
        if (!displayValue || displayValue.length === 0) return null;

        return (
          <View key={key} style={{ flexDirection: 'row', marginBottom: 2 }}>
            <Text style={styles.skillLabel}>{key.charAt(0).toUpperCase() + key.slice(1)}:</Text>
            <Text style={styles.skillValue}>{displayValue}</Text>
          </View>
        );
      })}
    </View>
  );
};

export default React.memo(PDFSkills);
