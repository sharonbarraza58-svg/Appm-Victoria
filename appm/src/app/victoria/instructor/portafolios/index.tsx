import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, Text, useWindowDimensions, View } from 'react-native';

import { VictoriaScreenShell } from '@/components/victoria/screen-shell';
import { ExitButton, PaneHeader } from '@/components/victoria/ui';
import { VictoriaColors } from '@/constants/victoria-theme';
import { InstructorApiError, obtenerPortafolios, PortafolioFicha } from '@/lib/instructor';
import { useRoleGuard } from '@/lib/role-guard';
import { styles } from './index.styles';

/** Lista de fichas del instructor para entrar a los portafolios de sus aprendices. */
export default function InstructorPortafoliosScreen() {
  const perfil = useRoleGuard(['instructor']);
  const { width } = useWindowDimensions();
  const pantallaAncha = width >= 800;

  const [fichas, setFichas] = useState<PortafolioFicha[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(() => {
    if (!perfil) return;
    obtenerPortafolios()
      .then((res) => {
        setFichas(res);
        setError(null);
      })
      .catch((err) =>
        setError(err instanceof InstructorApiError ? err.message : 'No se pudieron cargar los portafolios.')
      );
  }, [perfil]);

  useFocusEffect(cargar);

  if (perfil === undefined) {
    return (
      <VictoriaScreenShell>
        <ActivityIndicator color={VictoriaColors.white} style={styles.loader} />
      </VictoriaScreenShell>
    );
  }
  if (!perfil) return null;

  return (
    <VictoriaScreenShell>
      <PaneHeader eyebrow="VICTORIA > Seguimiento" title="Portafolios Fichas" />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {!fichas && !error ? <ActivityIndicator color={VictoriaColors.white} style={styles.loader} /> : null}

      {fichas && fichas.length === 0 ? (
        <Text style={styles.empty}>Todavía no tienes fichas asignadas.</Text>
      ) : null}

      <View style={styles.list}>
        {fichas?.map((ficha) => {
          const detalle = [
            ficha.nombre_competencia ?? ficha.nombre_programa,
            ficha.trimestre !== null ? `Trimestre ${ficha.trimestre}` : null,
          ]
            .filter(Boolean)
            .join(' · ');

          return (
            <Pressable
              key={ficha.id_ficha}
              style={[styles.card, !pantallaAncha && styles.cardNarrow]}
              onPress={() => router.push(`/victoria/instructor/portafolios/${ficha.id_ficha}` as never)}>
              <View style={styles.cardIcon}>
                <Ionicons name="layers-outline" size={18} color="#ffffff" />
              </View>

              <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>Ficha {ficha.numero_ficha ?? ficha.id_ficha}</Text>
                {detalle ? <Text style={styles.cardDetail}>{detalle}</Text> : null}
                <View style={styles.chip}>
                  <Ionicons name="people-outline" size={11} color="#ffffff" />
                  <Text style={styles.chipText}>
                    {ficha.num_aprendices} {ficha.num_aprendices === 1 ? 'Aprendiz' : 'Aprendices'}
                  </Text>
                </View>
              </View>

              <Ionicons name="chevron-down" size={18} color="#3d4a41" />
            </Pressable>
          );
        })}
      </View>

      <ExitButton />
    </VictoriaScreenShell>
  );
}