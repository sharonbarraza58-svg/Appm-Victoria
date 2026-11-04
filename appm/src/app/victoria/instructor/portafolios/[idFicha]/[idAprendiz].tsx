import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Linking, Pressable, Text, View } from 'react-native';

import { VictoriaScreenShell } from '@/components/victoria/screen-shell';
import { ExitButton } from '@/components/victoria/ui';
import { VictoriaColors } from '@/constants/victoria-theme';
import { API_BASE_URL } from '@/lib/api-config';
import {
  InstructorApiError,
  obtenerAprendices,
  obtenerDriveArchivosDeCarpeta,
  obtenerDriveArchivosDeSubcarpeta,
  obtenerDriveCarpetas,
  obtenerDriveCarpetasDeSubcarpeta,
  obtenerDriveSubcarpetas,
} from '@/lib/instructor';
import { useRoleGuard } from '@/lib/role-guard';
import { styles } from './[idAprendiz].styles';

/**
 * Portafolio (estilo Drive) de UN aprendiz, en modo consulta para el
 * instructor. Se navega dentro de la misma pantalla:
 *   Carpetas fijas > Trimestres > Carpetas/archivos del aprendiz > Archivos
 */
type Ruta = {
  categoria?: { id: string; nombre: string };
  subcarpeta?: { id: string; nombre: string };
  carpeta?: { id: number; nombre: string };
};

type Fila = {
  key: string;
  tipo: 'carpeta' | 'archivo';
  nombre: string;
  fecha: string | null;
  archivos: number | null;
  onPress: () => void;
};

function formatearFecha(fecha: string | null): string {
  if (!fecha) return '';
  const d = new Date(fecha);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('es-CO', { day: 'numeric', month: 'long' });
}

export default function PortafolioAprendizScreen() {
  const perfil = useRoleGuard(['instructor']);
  const { idFicha: idFichaParam, idAprendiz: idAprendizParam } = useLocalSearchParams<{
    idFicha: string;
    idAprendiz: string;
  }>();
  const idFicha = Number(idFichaParam);
  const idAprendiz = Number(idAprendizParam);

  const [nombreAprendiz, setNombreAprendiz] = useState('');
  const [ruta, setRuta] = useState<Ruta>({});
  const [filas, setFilas] = useState<Fila[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function abrirArchivo(url: string) {
    const destino = /^https?:\/\//i.test(url)
      ? url
      : `${API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
    Linking.openURL(destino).catch(() => setError('No se pudo abrir el archivo.'));
  }

  // Nombre del aprendiz (para el título y la columna "Modificado por").
  useEffect(() => {
    if (!perfil || !idFicha || !idAprendiz) return;
    obtenerAprendices(idFicha)
      .then((lista) => {
        const a = lista.find((x) => x.id_usuario === idAprendiz);
        if (a) setNombreAprendiz(a.nombre_completo);
      })
      .catch(() => {});
  }, [perfil, idFicha, idAprendiz]);

  // Contenido del nivel actual.
  useEffect(() => {
    if (!perfil || !idFicha || !idAprendiz) return;
    let activo = true;
    setCargando(true);
    setError(null);

    const { categoria, subcarpeta, carpeta } = ruta;
    let promesa: Promise<Fila[]>;

    if (!categoria) {
      promesa = obtenerDriveCarpetas(idFicha, idAprendiz).then((lista) =>
        lista.map((c) => ({
          key: c.categoria,
          tipo: 'carpeta' as const,
          nombre: c.nombre,
          fecha: c.ultima_modificacion,
          archivos: c.total_archivos,
          onPress: () => setRuta({ categoria: { id: c.categoria, nombre: c.nombre } }),
        }))
      );
    } else if (!subcarpeta) {
      promesa = obtenerDriveSubcarpetas(idFicha, idAprendiz, categoria.id).then((lista) =>
        lista.map((s) => ({
          key: s.subcarpeta,
          tipo: 'carpeta' as const,
          nombre: s.nombre,
          fecha: s.ultima_modificacion,
          archivos: s.total_archivos,
          onPress: () => setRuta({ categoria, subcarpeta: { id: s.subcarpeta, nombre: s.nombre } }),
        }))
      );
    } else if (!carpeta) {
      promesa = Promise.all([
        obtenerDriveCarpetasDeSubcarpeta(idFicha, idAprendiz, categoria.id, subcarpeta.id),
        obtenerDriveArchivosDeSubcarpeta(idFicha, idAprendiz, categoria.id, subcarpeta.id),
      ]).then(([carpetas, archivos]) => [
        ...carpetas.map((c) => ({
          key: `c-${c.id_carpeta}`,
          tipo: 'carpeta' as const,
          nombre: c.nombre,
          fecha: c.ultima_modificacion,
          archivos: c.total_archivos,
          onPress: () => setRuta({ categoria, subcarpeta, carpeta: { id: c.id_carpeta, nombre: c.nombre } }),
        })),
        ...archivos.map((a, i) => ({
          key: `a-${a.id_archivo ?? i}`,
          tipo: 'archivo' as const,
          nombre: a.nombre_archivo,
          fecha: a.fecha_subida,
          archivos: null,
          onPress: () => abrirArchivo(a.url),
        })),
      ]);
    } else {
      promesa = obtenerDriveArchivosDeCarpeta(
        idFicha,
        idAprendiz,
        categoria.id,
        subcarpeta.id,
        carpeta.id
      ).then((archivos) =>
        archivos.map((a, i) => ({
          key: `a-${a.id_archivo ?? i}`,
          tipo: 'archivo' as const,
          nombre: a.nombre_archivo,
          fecha: a.fecha_subida,
          archivos: null,
          onPress: () => abrirArchivo(a.url),
        }))
      );
    }

    promesa
      .then((res) => {
        if (activo) setFilas(res);
      })
      .catch((err) => {
        if (activo)
          setError(err instanceof InstructorApiError ? err.message : 'No se pudo cargar el portafolio.');
      })
      .finally(() => {
        if (activo) setCargando(false);
      });

    return () => {
      activo = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [perfil, idFicha, idAprendiz, ruta]);

  if (perfil === undefined) {
    return (
      <VictoriaScreenShell>
        <ActivityIndicator color={VictoriaColors.white} style={styles.loader} />
      </VictoriaScreenShell>
    );
  }
  if (!perfil) return null;

  function volver() {
    if (ruta.carpeta) setRuta({ categoria: ruta.categoria, subcarpeta: ruta.subcarpeta });
    else if (ruta.subcarpeta) setRuta({ categoria: ruta.categoria });
    else if (ruta.categoria) setRuta({});
    else router.push(`/victoria/instructor/portafolios/${idFichaParam}` as never);
  }

  const enRaiz = !ruta.categoria;
  const camino = [
    `Portafolio - ${nombreAprendiz || '...'}`,
    ruta.categoria?.nombre,
    ruta.subcarpeta?.nombre,
    ruta.carpeta?.nombre,
  ]
    .filter(Boolean)
    .join('  ›  ');

  return (
    <VictoriaScreenShell>
      <Pressable onPress={volver} hitSlop={8}>
        <Text style={styles.backLink}>{enRaiz ? '← Volver a la ficha' : '← Volver'}</Text>
      </Pressable>
      <Text style={styles.eyebrow}>Portafolio {new Date().getFullYear()}</Text>
      <Text style={styles.title}>Portafolio - {nombreAprendiz || '...'}</Text>
      <Text style={styles.camino}>{camino}</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.tabla}>
        <View style={[styles.fila, styles.filaHeader]}>
          <View style={styles.colIcono}>
            <Ionicons name="folder-outline" size={18} color="#1a3322" />
          </View>
          <Text style={[styles.headerText, styles.colNombre]}>Nombre</Text>
          <Text style={[styles.headerText, styles.colDato]}>Modificado</Text>
          <Text style={[styles.headerText, styles.colDato]}>Modificado por</Text>
          <Text style={[styles.headerText, styles.colDato]}>Archivos</Text>
        </View>

        {cargando ? <ActivityIndicator color="#1a3322" style={styles.loader} /> : null}

        {!cargando && filas.length === 0 && !error ? (
          <Text style={styles.vacio}>Esta carpeta está vacía.</Text>
        ) : null}

        {!cargando &&
          filas.map((f) => (
            <Pressable key={f.key} style={styles.fila} onPress={f.onPress}>
              <View style={styles.colIcono}>
                <View style={styles.iconoCirculo}>
                  <Ionicons
                    name={f.tipo === 'carpeta' ? 'folder-outline' : 'document-text-outline'}
                    size={16}
                    color={VictoriaColors.white}
                  />
                </View>
              </View>
              <Text style={[styles.celda, styles.colNombre]} numberOfLines={1}>
                {f.nombre}
              </Text>
              <Text style={[styles.celda, styles.colDato]}>{formatearFecha(f.fecha)}</Text>
              <Text style={[styles.celda, styles.colDato]} numberOfLines={1}>
                {nombreAprendiz}
              </Text>
              <Text style={[styles.celda, styles.colDato]}>
                {f.archivos ? `${f.archivos} docs` : ''}
              </Text>
            </Pressable>
          ))}
      </View>

      <ExitButton />
    </VictoriaScreenShell>
  );
}