import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { styles } from '../ResumeStyles';

const PDFSummary = ({ summary }) => {
  if (!summary || summary.trim().length === 0) return null;
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Professional Summary</Text>
      <Text style={styles.description}>{summary}</Text>
    </View>
  );
};

export default React.memo(PDFSummary);
