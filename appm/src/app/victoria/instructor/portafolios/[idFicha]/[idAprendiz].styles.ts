/**
 * Estilos de app/victoria/instructor/portafolios/[idFicha]/[idAprendiz].tsx
 * (extraídos del .tsx para mantener la pantalla ordenada).
 */
import { StyleSheet } from 'react-native';
import { VictoriaColors } from '@/constants/victoria-theme';

export const styles = StyleSheet.create({
  loader: { marginVertical: 20 },
  error: { color: '#ff8a8a', marginBottom: 12 },
  backLink: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 12,
  },
  eyebrow: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 12,
    marginTop: 18,
  },
  title: {
    color: VictoriaColors.white,
    fontSize: 30,
    fontWeight: '300',
    marginTop: 4,
  },
  camino: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    marginTop: 8,
    marginBottom: 14,
  },
  tabla: {
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
    borderRadius: 20,
    overflow: 'hidden',
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

// Expo Router trata todo archivo dentro de src/app como una ruta y exige un
// export default. Esta pantalla NO se navega; el default solo evita el aviso.
export default styles;