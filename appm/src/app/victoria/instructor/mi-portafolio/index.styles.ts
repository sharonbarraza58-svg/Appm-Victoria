/**
 * Estilos de app/victoria/instructor/mi-portafolio/index.tsx
 */
import { StyleSheet } from 'react-native';
import { VictoriaColors, VictoriaRadius } from '@/constants/victoria-theme';

export const styles = StyleSheet.create({
  loader: { marginVertical: 20 },
  error: { color: '#ff8a8a', marginBottom: 12 },
  aviso: { color: 'rgba(255, 255, 255, 0.85)', fontSize: 12, marginBottom: 10 },
  eyebrow: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 12,
  },
  headerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    marginTop: 4,
    zIndex: 20,
  },
  title: {
    color: VictoriaColors.white,
    fontSize: 30,
    fontWeight: '300',
    flexShrink: 1,
  },
  nuevoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: VictoriaColors.darkGreen,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: VictoriaRadius.pill,
  },
  nuevoText: {
    color: VictoriaColors.white,
    fontWeight: '600',
    fontSize: 13,
  },
  menu: {
    position: 'absolute',
    top: 48,
    right: 0,
    minWidth: 170,
    backgroundColor: '#2f5a3d',
    borderRadius: 12,
    paddingVertical: 4,
    zIndex: 30,
    elevation: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  menuText: {
    color: VictoriaColors.white,
    fontSize: 13,
  },
  menuDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    marginHorizontal: 12,
  },
  camino: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 14,
    zIndex: 1,
  },
  caminoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  caminoText: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 12,
  },
  tabla: {
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
    borderRadius: 20,
    overflow: 'hidden',
    zIndex: 1,
  },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(26, 51, 34, 0.15)',
  },
  filaHeader: {
    paddingVertical: 14,
  },
  colIcono: {
    width: 44,
    alignItems: 'flex-start',
  },
  colNombre: {
    flex: 3,
  },
  colDato: {
    flex: 1.4,
    textAlign: 'center',
  },
  iconoCirculo: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: VictoriaColors.darkGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 12,
    color: '#1a3322',
  },
  celda: {
    fontSize: 12,
    color: '#1a3322',
  },
  vacio: {
    padding: 20,
    fontSize: 12,
    color: '#4d6355',
    textAlign: 'center',
  },
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
    width: 380,
    maxWidth: '100%',
    backgroundColor: 'rgba(225, 232, 222, 0.98)',
    borderRadius: 25,
    padding: 24,
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a3322',
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#1a1a1a',
  },
  error: {
    color: '#b3261e',
    fontSize: 12,
  },
  submitBtn: {
    backgroundColor: '#143520',
    borderRadius: 15,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 6,
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
});

// Expo Router trata todo archivo dentro de src/app como una ruta y exige un
// export default. Esta pantalla NO se navega con este export; solo evita el aviso.
export default styles;