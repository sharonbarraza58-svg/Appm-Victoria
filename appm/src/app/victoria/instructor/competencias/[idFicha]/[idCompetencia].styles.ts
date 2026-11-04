/**
 * Estilos de app/victoria/instructor/competencias/[idFicha]/[idCompetencia].tsx
 * (extraídos del .tsx para mantener la pantalla ordenada).
 */
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  loader: { marginTop: 20 },
  error: { color: '#ff8a8a', marginBottom: 12 },
  empty: { color: 'rgba(255, 255, 255, 0.6)' },

  // --- Encabezado ---
  headerBlock: { marginBottom: 20 },
  backLink: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  backLinkText: { color: 'rgba(255, 255, 255, 0.8)', fontSize: 11 },
  fichaTitle: { color: '#ffffff', fontSize: 34, fontWeight: '400' },
  fichaSubtitle: { color: 'rgba(255, 255, 255, 0.7)', fontSize: 11, marginTop: 2 },

  // --- Lista + botón a la derecha ---
  contentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 16,
  },
  contentRowNarrow: { flexDirection: 'column-reverse', alignItems: 'stretch' },
  listCol: { flexGrow: 1, flexShrink: 1, maxWidth: '70%', gap: 12 },
  listColNarrow: { maxWidth: '100%' },
  actionCol: { alignSelf: 'flex-start' },
  newBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#1b3a2a',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  newBtnText: { color: '#ffffff', fontSize: 13, fontWeight: '600' },

  // --- Tarjeta de tarea ---
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 14,
    padding: 14,
  },
  taskIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2f5d46',
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskBody: { flex: 1, gap: 4 },
  taskName: { fontSize: 14, fontWeight: '600', color: '#1b1b1b' },
  taskDescription: { fontSize: 11, color: '#5a665d' },
  taskChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 },
  datePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#1b3a2a',
    borderRadius: 999,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  datePillText: { color: '#ffffff', fontSize: 10, fontWeight: '600' },
  filePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#9bb89f',
    borderRadius: 999,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  filePillText: { color: '#1b3a2a', fontSize: 10, fontWeight: '600' },
});

export const modalStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 20,
  },
  card: {
    width: 480,
    maxWidth: '100%',
    maxHeight: '92%',
    backgroundColor: 'rgba(225, 232, 222, 0.98)',
    borderRadius: 25,
    overflow: 'hidden',
  },
  cardContent: { padding: 24, gap: 8 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  title: { fontSize: 18, fontWeight: '700', color: '#1a3322' },
  subtitle: { fontSize: 12, color: '#6b6b6b' },

  label: { fontSize: 12, fontWeight: '600', color: '#1a3322', letterSpacing: 0.5, marginTop: 8 },
  input: {
    borderWidth: 1.5,
    borderColor: '#2f5d46',
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#1a1a1a',
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  textarea: {
    minHeight: 80,
    borderRadius: 18,
    borderColor: 'rgba(255,255,255,0.7)',
    textAlignVertical: 'top',
  },
  pillInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: '#2f5d46',
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  pillTextInput: { flex: 1, fontSize: 14, color: '#1a1a1a' },
  helper: { fontSize: 10, color: '#6b6b6b', marginLeft: 4 },

  fichasScroll: { maxHeight: 170 },
  fichasContent: { gap: 6 },
  fichaOpcion: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(0,0,0,0.12)',
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  fichaOpcionActiva: { backgroundColor: 'rgba(155, 184, 159, 0.55)' },
  fichaNombre: { fontSize: 14, fontWeight: '600', color: '#1a1a1a' },
  fichaNombreActiva: { color: '#2f5d46' },
  fichaDetalle: { fontSize: 10, color: '#5a665d' },

  attachBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 999,
    paddingVertical: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginTop: 10,
  },
  attachText: { fontSize: 13, color: '#556b5c', maxWidth: '80%' },
  fileAttached: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(155, 184, 159, 0.55)',
    marginTop: 10,
  },
  fileAttachedText: { flex: 1, fontSize: 13, fontWeight: '600', color: '#2f5d46' },

  error: { color: '#b3261e', fontSize: 12 },

  submitBtn: {
    backgroundColor: '#b9cdb4',
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 6,
  },
  submitBtnReady: { backgroundColor: '#143520' },
  submitText: { color: '#6f8a73', fontWeight: '600', fontSize: 14 },
  submitTextReady: { color: '#ffffff' },
});

// Expo Router trata todo archivo dentro de src/app como una ruta y exige un
// export default. Esta pantalla NO se navega; el default solo evita el aviso.
export default styles;