/**
 * Estilos de components/victoria/entrega-instructor-card.tsx
 */
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  card: {
    width: '100%',
    maxWidth: 700,
    backgroundColor: 'rgba(235, 240, 233, 0.88)',
    borderRadius: 18,
    padding: 16,
    gap: 10,
  },

  // --- Nombre + estado ---
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  nombre: { flex: 1, fontSize: 14, fontWeight: '700', color: '#1f3d2e' },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: 999,
    paddingVertical: 5,
    paddingHorizontal: 12,
  },
  pillText: { fontSize: 11 },

  // --- Archivo entregado ---
  fileCard: {
    flexDirection: 'row',
    alignItems: 'stretch',
    alignSelf: 'flex-start',
    maxWidth: '100%',
    backgroundColor: 'rgba(127, 155, 132, 0.85)',
    borderRadius: 14,
    overflow: 'hidden',
  },
  fileInfo: { paddingVertical: 10, paddingHorizontal: 14, justifyContent: 'center', gap: 2, maxWidth: 260 },
  fileName: { fontSize: 11, color: '#ffffff' },
  fileType: { fontSize: 9, color: 'rgba(255, 255, 255, 0.85)' },
  fileBadge: {
    width: 70,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  fileBadgeText: { fontSize: 10, color: '#ffffff' },
  sinArchivo: { fontSize: 12, fontStyle: 'italic', color: '#7a857d' },

  // --- Nota + comentario ---
  notaRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  notaChip: { borderRadius: 12, paddingVertical: 4, paddingHorizontal: 14 },
  notaText: { fontSize: 14, fontWeight: '700' },
  comentario: { flex: 1, fontSize: 10, color: '#2f4a3b' },

  // --- Botones ---
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#8aa386',
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  actionText: { color: '#ffffff', fontSize: 11 },
});

export const modalStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: 20,
  },
  card: {
    width: 450,
    maxWidth: '100%',
    backgroundColor: 'rgba(225, 232, 222, 0.98)',
    borderRadius: 25,
    padding: 24,
    gap: 8,
  },
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
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
  textarea: {
    minHeight: 80,
    borderRadius: 18,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    textAlignVertical: 'top',
  },
  // Campo de calificación con flechas ▲▼ a la derecha
  notaBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#2f5d46',
    borderRadius: 999,
    paddingLeft: 16,
    paddingRight: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
  notaInput: { flex: 1, paddingVertical: 12, fontSize: 14, color: '#1a1a1a' },
  stepper: { alignItems: 'center', justifyContent: 'center', gap: 2 },

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

  // --- Opciones de estado ---
  opcion: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  opcionActiva: { backgroundColor: 'rgba(155, 184, 159, 0.55)' },
  opcionText: { flex: 1, fontSize: 14, fontWeight: '600', color: '#1a1a1a' },
  opcionTextActiva: { color: '#2f5d46' },
});