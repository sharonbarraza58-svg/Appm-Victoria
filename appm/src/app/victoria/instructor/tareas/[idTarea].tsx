import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Linking, Platform, Pressable, Text, View } from 'react-native';

import { EntregaInstructorCard } from '@/components/victoria/entrega-instructor-card';
import { VictoriaScreenShell } from '@/components/victoria/screen-shell';
import { ExitButton } from '@/components/victoria/ui';
import { VictoriaColors } from '@/constants/victoria-theme';
import {
  actualizarEntrega,
  EstadoEntrega,
  InstructorApiError,
  obtenerTareaDetalle,
  TareaDetalle,
  tipoDeArchivo,
} from '@/lib/instructor';
import { useRoleGuard } from '@/lib/role-guard';
import { styles } from './[idTarea].styles';

const MESES_CORTOS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const MESES_LARGOS = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];
const ETIQUETA_TIPO = { pdf: 'PDF', word: 'Word', video: 'Video', otro: 'Archivo' } as const;

/** Toma "2026-07-20" o "2026-07-20T10:30:00" y devuelve [año, mes, día] (sin desfases de zona horaria). */
function partesFecha(valor: string | null): [number, number, number] | null {
  if (!valor) return null;
  const [anio, mes, dia] = valor.slice(0, 10).split('-').map(Number);
  if (!anio || !mes || !dia) return null;
  return [anio, mes, dia];
}

/** "20 jul" */
function fechaCorta(valor: string | null): string | null {
  const p = partesFecha(valor);
  return p ? `${p[2]} ${MESES_CORTOS[p[1] - 1]}` : null;
}

/** "6 de octubre 2026" */
function fechaLarga(valor: string | null): string | null {
  const p = partesFecha(valor);
  return p ? `${p[2]} de ${MESES_LARGOS[p[1] - 1]} ${p[0]}` : null;
}

function nombreDeArchivo(url: string): string {
  const limpio = url.split('?')[0].split('/').pop() ?? 'Archivo';
  try {
    return decodeURIComponent(limpio);
  } catch {
    return limpio;
  }
}

function abrirArchivo(url: string) {
  if (Platform.OS === 'web') window.open(url, '_blank');
  else Linking.openURL(url);
}

function StatCard({
  icon,
  color,
  value,
  label,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  value: number;
  label: string;
}) {
  return (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: color }]}>
        <Ionicons name={icon} size={18} color="#ffffff" />
      </View>
      <View>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </View>
    </View>
  );
}

export default function InstructorTareaDetalleScreen() {
  const perfil = useRoleGuard(['instructor']);
  const { idTarea: idTareaParam } = useLocalSearchParams<{ idTarea: string }>();
  const idTarea = Number(idTareaParam);

  const [tarea, setTarea] = useState<TareaDetalle | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [infoAbierta, setInfoAbierta] = useState(true);

  const cargar = useCallback(() => {
    if (!perfil || !idTarea) return;
    obtenerTareaDetalle(idTarea)
      .then((res) => {
        setTarea(res);
        setError(null);
      })
      .catch((err) =>
        setError(err instanceof InstructorApiError ? err.message : 'No se pudo cargar la tarea.')
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [perfil, idTarea]);

  useFocusEffect(cargar);

  if (perfil === undefined) {
    return (
      <VictoriaScreenShell>
        <ActivityIndicator color={VictoriaColors.white} style={styles.loader} />
      </VictoriaScreenShell>
    );
  }
  if (!perfil) return null;

  async function guardarCambiosEntrega(
    idEntrega: number,
    cambios: { estado?: EstadoEntrega; nota?: number; comentario?: string }
  ) {
    const actualizada = await actualizarEntrega(idEntrega, cambios);
    // Los contadores se calculan a partir de las entregas, así que basta con reemplazar la entrega.
    setTarea((prev) =>
      prev
        ? {
            ...prev,
            entregas: prev.entregas.map((e) => (e.id_entrega === idEntrega ? actualizada : e)),
          }
        : prev
    );
  }

  const entregas = tarea?.entregas ?? [];
  const contar = (estado: EstadoEntrega) => entregas.filter((e) => e.estado === estado).length;

  const archivoUrl = tarea?.archivo_url ?? null;
  const tipo = tipoDeArchivo(archivoUrl);
  const etiquetaTipo = tipo ? ETIQUETA_TIPO[tipo] : 'Archivo';
  const fechaLimite = fechaLarga(tarea?.fecha_limite ?? null);
  const autorYFecha = [tarea?.nombre_instructor, fechaCorta(tarea?.fecha_creacion ?? null)]
    .filter(Boolean)
    .join(' · ');
  const volverHref = tarea
    ? `/victoria/instructor/competencias/${tarea.id_ficha}/${tarea.id_competencia}`
    : '/victoria/instructor/competencias';

  return (
    <VictoriaScreenShell>
      <Pressable style={styles.backLink} onPress={() => router.push(volverHref as never)}>
        <Ionicons name="arrow-back" size={12} color="rgba(255,255,255,0.8)" />
        <Text style={styles.backLinkText}>Volver a la ficha</Text>
      </Pressable>

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {!tarea && !error ? <ActivityIndicator color={VictoriaColors.white} style={styles.loader} /> : null}

      {tarea ? (
        <>
          {/* Tarjeta de información: se despliega / pliega con la flecha */}
          <View style={styles.infoCard}>
            <Pressable style={styles.infoHeader} onPress={() => setInfoAbierta((v) => !v)}>
              <View style={styles.infoIcon}>
                <Ionicons name="layers-outline" size={18} color="#ffffff" />
              </View>
              <Text style={styles.infoTitle}>{tarea.titulo}</Text>
              <Ionicons name={infoAbierta ? 'chevron-up' : 'chevron-down'} size={20} color="#3d4a41" />
            </Pressable>

            {autorYFecha ? <Text style={styles.infoMeta}>{autorYFecha}</Text> : null}
            {fechaLimite ? (
              <Text style={styles.infoDeadline}>
                <Text style={styles.infoDeadlineLabel}>Fecha límite:  </Text>
                {fechaLimite}
              </Text>
            ) : null}

            {infoAbierta ? (
              <>
                <View style={styles.divider} />
                <Text style={styles.metaFicha}>
                  Ficha {tarea.numero_ficha ?? tarea.id_ficha} · {tarea.nombre_competencia ?? 'Competencia'}
                </Text>
                {tarea.descripcion ? (
                  <Text style={styles.infoDescription}>{tarea.descripcion}</Text>
                ) : (
                  <Text style={styles.infoDescriptionEmpty}>Esta tarea no tiene indicaciones.</Text>
                )}
                {archivoUrl ? (
                  <Pressable style={styles.fileCard} onPress={() => abrirArchivo(archivoUrl)}>
                    <View style={styles.fileInfo}>
                      <Text style={styles.fileName} numberOfLines={1}>
                        {nombreDeArchivo(archivoUrl)}
                      </Text>
                      <Text style={styles.fileType}>{etiquetaTipo}</Text>
                    </View>
                    <View style={styles.fileBadge}>
                      <Text style={styles.fileBadgeText}>{etiquetaTipo}</Text>
                    </View>
                  </Pressable>
                ) : null}
              </>
            ) : null}
          </View>

          {/* Contadores */}
          <View style={styles.statsRow}>
            <StatCard icon="person-circle-outline" color="#9bb89f" value={entregas.length} label="Aprendices" />
            <StatCard icon="checkmark-circle-outline" color="#6f8f6f" value={contar('aprobado')} label="Aprobados" />
            <StatCard icon="time-outline" color="#a69f6b" value={contar('en_revision')} label="En revisión" />
            <StatCard icon="close-circle-outline" color="#a86a6e" value={contar('rechazado')} label="Desaprobados" />
            <StatCard icon="ribbon-outline" color="#9bb89f" value={contar('pendiente')} label="Pendientes" />
          </View>

          {/* Entregas */}
          <View style={styles.headerActions}>
            <Text style={styles.sectionLabel}>Entregas</Text>
            <Pressable
              style={styles.portfolioBtn}
              onPress={() => router.push(`/victoria/instructor/portafolios/${tarea.id_ficha}` as never)}>
              <Text style={styles.portfolioBtnText}>Ir a Portafolio</Text>
              <Ionicons name="arrow-forward" size={14} color="#ffffff" />
            </Pressable>
          </View>

          <View style={styles.list}>
            {tarea.entregas.length === 0 ? (
              <Text style={styles.empty}>Todavía no hay aprendices en esta ficha.</Text>
            ) : (
              tarea.entregas.map((entrega) => (
                <EntregaInstructorCard
                  key={entrega.id_entrega}
                  titulo={entrega.nombre_aprendiz}
                  tituloTarea={tarea.titulo}
                  archivoUrl={entrega.archivo_url}
                  estado={entrega.estado}
                  nota={entrega.nota}
                  comentario={entrega.comentario}
                  onGuardar={(cambios) => guardarCambiosEntrega(entrega.id_entrega, cambios)}
                />
              ))
            )}
          </View>
        </>
      ) : null}

      <ExitButton />
    </VictoriaScreenShell>
  );
}