import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import { VictoriaScreenShell } from '@/components/victoria/screen-shell';
import { ExitButton } from '@/components/victoria/ui';
import { VictoriaColors } from '@/constants/victoria-theme';
import { ComentarioRecibido, InstructorApiError, obtenerMisComentarios } from '@/lib/instructor';
import { useRoleGuard } from '@/lib/role-guard';
import { styles } from './index.styles';

/** "7 de octubre, 2026" */
function formatearFecha(fecha: string): string {
  const d = new Date(fecha);
  if (isNaN(d.getTime())) return '';
  const mes = d.toLocaleDateString('es-CO', { month: 'long' });
  return `${d.getDate()} de ${mes}, ${d.getFullYear()}`;
}

/** Retroalimentación que el coordinador dejó sobre el instructor (solo lectura). */
export default function InstructorComentariosScreen() {
  const perfil = useRoleGuard(['instructor']);
  const [comentarios, setComentarios] = useState<ComentarioRecibido[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(() => {
    if (!perfil) return;
    obtenerMisComentarios()
      .then((res) => {
        setComentarios(res);
        setError(null);
      })
      .catch((err) =>
        setError(err instanceof InstructorApiError ? err.message : 'No se pudieron cargar los comentarios.')
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

  const total = comentarios?.length ?? 0;

  return (
    <VictoriaScreenShell>
      <Text style={styles.eyebrow}>Retroalimentación de tu portafolio</Text>
      <Text style={styles.title}>Comentarios - Portafolio</Text>
      <Text style={styles.subtitle}>Observaciones que el coordinador ha dejado sobre tu portafolio</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {!comentarios && !error ? <ActivityIndicator color={VictoriaColors.white} style={styles.loader} /> : null}

      {comentarios ? (
        <View style={styles.panel}>
          <View style={styles.panelHeader}>
            <View style={styles.panelIcono}>
              <Ionicons name="chatbox-outline" size={18} color={VictoriaColors.white} />
            </View>
            <View>
              <Text style={styles.panelTitulo}>Comentarios</Text>
              <Text style={styles.panelConteo}>
                {total} {total === 1 ? 'comentario' : 'comentarios'}
              </Text>
            </View>
          </View>

          {total === 0 ? (
            <Text style={styles.vacio}>Todavía no tienes comentarios del coordinador.</Text>
          ) : (
            <View style={styles.lista}>
              {comentarios.map((c) => (
                <View key={c.id_comentario} style={styles.comentario}>
                  <View style={styles.comentarioHeader}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>{c.nombre_autor.charAt(0).toUpperCase()}</Text>
                    </View>
                    <View>
                      <Text style={styles.autor}>{c.nombre_autor}</Text>
                      <Text style={styles.fecha}>{formatearFecha(c.fecha_creacion)}</Text>
                    </View>
                  </View>
                  <Text style={styles.texto}>{c.texto}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      ) : null}

      <ExitButton />
    </VictoriaScreenShell>
  );
}