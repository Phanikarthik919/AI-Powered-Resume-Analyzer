import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { styles } from '../ResumeStyles';

const PDFHeader = ({ personalInfo = {} }) => (
  <View style={styles.header}>
    <Text style={styles.name}>{personalInfo.name || 'Your Full Name'}</Text>
    <View style={styles.contact}>
      {personalInfo.email ? <Text>{personalInfo.email}</Text> : null}
      {personalInfo.phone ? <Text>{personalInfo.phone}</Text> : null}
      {personalInfo.linkedin ? <Text>LinkedIn</Text> : null}
      {personalInfo.github ? <Text>GitHub</Text> : null}
    </View>
  </View>
);

export default React.memo(PDFHeader);
