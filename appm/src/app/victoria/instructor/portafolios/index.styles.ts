/**
 * Estilos de app/victoria/instructor/portafolios/index.tsx
 * (extraídos del .tsx para mantener la pantalla ordenada).
 */
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  loader: { marginTop: 20 },
  error: { color: '#ff8a8a', marginBottom: 12 },
  empty: { color: 'rgba(255, 255, 255, 0.6)' },

  list: { gap: 12 },

  // --- Tarjeta de ficha ---
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    width: '100%',
    maxWidth: '75%',
    backgroundColor: 'rgba(235, 240, 233, 0.78)',
    borderRadius: 16,
    padding: 16,
  },
  cardNarrow: { maxWidth: '100%' },
  cardIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2f5d46',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: { flex: 1, gap: 3 },
  cardTitle: { fontSize: 15, color: '#1b1b1b' },
  cardDetail: { fontSize: 10, color: '#5a665d' },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    backgroundColor: '#1b3a2a',
    borderRadius: 999,
    paddingVertical: 3,
    paddingHorizontal: 10,
    marginTop: 4,
  },
  chipText: { color: '#ffffff', fontSize: 10, fontWeight: '600' },
});

// Expo Router trata todo archivo dentro de src/app como una ruta y exige un
// export default. Esta pantalla NO se navega; el default solo evita el aviso.
export default styles;