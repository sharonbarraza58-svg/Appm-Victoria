/**
 * Estilos de app/victoria/instructor/tareas/[idTarea].tsx
 * (extraídos del .tsx para mantener la pantalla ordenada).
 */
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  loader: { marginTop: 20 },
  error: { color: '#ff8a8a', marginBottom: 12 },
  empty: { color: 'rgba(255, 255, 255, 0.6)' },

  // --- Enlace de regreso ---
  backLink: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 14 },
  backLinkText: { color: 'rgba(255, 255, 255, 0.8)', fontSize: 11 },

  // --- Tarjeta de información de la tarea ---
  infoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.78)',
    borderRadius: 24,
    padding: 20,
    gap: 6,
    marginBottom: 14,
  },
  infoHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  infoIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2f5d46',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoTitle: { flex: 1, fontSize: 24, color: '#1f3d2e' },
  infoMeta: { fontSize: 11, color: '#5a665d', marginTop: 6 },
  infoDeadline: { fontSize: 11, color: '#1b1b1b' },
  infoDeadlineLabel: { fontWeight: '600' },
  divider: { height: 1, backgroundColor: 'rgba(0, 0, 0, 0.2)', marginVertical: 12 },
  metaFicha: { fontSize: 10, color: '#5a665d' },
  infoDescription: { fontSize: 12, color: '#3d4a41', lineHeight: 18 },
  infoDescriptionEmpty: { fontSize: 12, color: '#7a857d', fontStyle: 'italic' },

  // --- Archivo adjunto de la tarea ---
  fileCard: {
    flexDirection: 'row',
    alignItems: 'stretch',
    alignSelf: 'flex-start',
    maxWidth: '100%',
    marginTop: 10,
    backgroundColor: 'rgba(155, 184, 159, 0.75)',
    borderRadius: 14,
    overflow: 'hidden',
  },
  fileInfo: { paddingVertical: 12, paddingHorizontal: 14, justifyContent: 'center', gap: 2, maxWidth: 240 },
  fileName: { fontSize: 11, fontWeight: '600', color: '#1f3d2e' },
  fileType: { fontSize: 9, color: '#1f3d2e' },
  fileBadge: {
    width: 70,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  fileBadgeText: { fontSize: 10, color: '#1f3d2e' },

  // --- Contadores ---
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 22 },
  statCard: {
    flexGrow: 1,
    flexBasis: 150,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 14,
    padding: 12,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: { fontSize: 22, fontWeight: '700', color: '#1b1b1b' },
  statLabel: { fontSize: 10, color: '#4b5b50' },

  // --- Entregas ---
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionLabel: { fontSize: 22, color: '#ffffff' },
  portfolioBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#1b3a2a',
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  portfolioBtnText: { color: '#ffffff', fontSize: 13, fontWeight: '600' },
  list: { gap: 12 },
});

// Expo Router trata todo archivo dentro de src/app como una ruta y exige un
// export default. Esta pantalla NO se navega; el default solo evita el aviso.
export default styles;