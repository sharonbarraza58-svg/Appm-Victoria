/**
 * Estilos de app/victoria/instructor/competencias/index.tsx
 * (extraídos del .tsx para mantener la pantalla ordenada).
 */
import { StyleSheet } from 'react-native';
import { VictoriaRadius, VictoriaColors } from '@/constants/victoria-theme';

export const styles = StyleSheet.create({
  loader: { marginTop: 20 },
  error: { color: '#ff8a8a', marginBottom: 12 },
  empty: { color: 'rgba(255, 255, 255, 0.6)' },
  emptySmall: { color: '#3d4a41', fontSize: 12, paddingVertical: 6, paddingLeft: 4 },

  columnsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    gap: 16,
  },
  column: {
    flex: 1,
    minWidth: 280,
    gap: 12,
  },

  // Nivel 1: el bloque es transparente, la píldora blanca es el header
  trimestreBlock: {
    gap: 8,
  },
  trimestreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: VictoriaRadius.card,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  trimestreHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  iconChip: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#2f5d46',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trimestreTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: VictoriaColors.black,
  },
  trimestreSubtitle: {
    fontSize: 12,
    color: '#666666',
  },

  // Nivel 2: competencias (tarjetas translúcidas, sin fondo blanco detrás)
  materiasWrap: {
    marginLeft: 14,
    gap: 8,
  },
  materiaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(225, 232, 226, 0.65)',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  iconChipSmall: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#9bb89f',
  },
  materiaTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: VictoriaColors.black,
    flexShrink: 1,
  },
  materiaRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badgeChip: {
    backgroundColor: VictoriaColors.darkGreen,
    borderRadius: VictoriaRadius.pill,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  badgeChipText: {
    color: VictoriaColors.white,
    fontSize: 11,
    fontWeight: '600',
  },

  // Nivel 3: fichas
  fichasWrap: {
    marginTop: 6,
    marginLeft: 14,
    gap: 6,
  },
  fichaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(235, 240, 236, 0.75)',
  },
  fichaIconCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#1f1f1f',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fichaTextWrap: { flexShrink: 1 },
  fichaTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: VictoriaColors.black,
  },
  fichaSubtitle: {
    fontSize: 11,
    color: '#5a665d',
  },
});

// Expo Router trata todo archivo dentro de src/app como una ruta y exige un
// export default. Esta pantalla NO se navega; el default solo evita el aviso.
export default styles;