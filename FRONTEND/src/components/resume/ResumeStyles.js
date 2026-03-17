import { StyleSheet } from '@react-pdf/renderer';

export const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#1d1d1f',
    lineHeight: 1.5,
  },
  header: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8ed',
    paddingBottom: 12,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1d1d1f',
    marginBottom: 8,
    lineHeight: 1.2,
  },
  contact: {
    flexDirection: 'row',
    fontSize: 9,
    color: '#6e6e73',
    flexWrap: 'wrap',
    gap: 10,
  },
  section: {
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0066cc',
    textTransform: 'uppercase',
    letterSpacing: 1,
    borderBottomWidth: 0.5,
    borderBottomColor: '#d2d2d7',
    paddingBottom: 2,
    marginBottom: 6,
  },
  entry: {
    marginBottom: 8,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontWeight: 'bold',
    fontSize: 10.5,
  },
  company: {
    fontWeight: 'bold',
    flex: 1,
  },
  duration: {
    fontSize: 9,
    color: '#86868b',
    marginLeft: 10,
  },
  description: {
    marginTop: 3,
    fontSize: 9.5,
    color: '#1d1d1f',
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: 1.5,
    paddingLeft: 5,
  },
  bullet: {
    width: 10,
    fontWeight: 'bold',
  },
  bulletText: {
    flex: 1,
    fontSize: 9.5,
  },
  skillLabel: {
    fontWeight: 'bold',
    fontSize: 9.5,
    width: 90,
  },
  skillValue: {
    flex: 1,
    fontSize: 9.5,
  },
  linkText: {
    fontSize: 8.5,
    color: '#0066cc',
    marginTop: 2,
  }
});
