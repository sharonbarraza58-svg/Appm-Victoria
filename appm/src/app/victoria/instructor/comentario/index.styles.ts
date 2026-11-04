/**
 * Estilos de app/victoria/instructor/comentarios/index.tsx
 */
import { StyleSheet } from 'react-native';
import { VictoriaColors } from '@/constants/victoria-theme';

export const styles = StyleSheet.create({
  loader: { marginVertical: 20 },
  error: { color: '#ff8a8a', marginBottom: 12 },
  eyebrow: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 12,
  },
  title: {
    color: VictoriaColors.white,
    fontSize: 30,
    fontWeight: '300',
    marginTop: 4,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    marginTop: 4,
    marginBottom: 20,
  },
  panel: {
    width: '100%',
    maxWidth: 780,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 24,
    padding: 24,
    gap: 16,
  },
  panelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  panelIcono: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: VictoriaColors.darkGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  panelTitulo: {
    fontSize: 26,
    fontWeight: '300',
    color: '#1a3322',
  },
  panelConteo: {
    fontSize: 11,
    color: '#4d6355',
  },
  lista: {
    gap: 12,
  },
  comentario: {
    backgroundColor: 'rgba(120, 140, 125, 0.35)',
    borderRadius: 18,
    padding: 16,
    gap: 8,
  },
  comentarioHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: VictoriaColors.darkGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: VictoriaColors.white,
    fontSize: 11,
    fontWeight: '700',
  },
  autor: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a3322',
  },
  fecha: {
    fontSize: 10,
    color: '#4d6355',
  },
  texto: {
    fontSize: 12,
    lineHeight: 18,
    color: '#1a3322',
  },
  vacio: {
    fontSize: 12,
    color: '#4d6355',
    paddingVertical: 12,
  },
});

// Expo Router trata todo archivo dentro de src/app como una ruta y exige un
// export default. Esta pantalla NO se navega con este export; solo evita el aviso.
export default styles;