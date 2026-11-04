import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';

import { VictoriaScreenShell } from '@/components/victoria/screen-shell';
import { ExitButton } from '@/components/victoria/ui';
import { VictoriaColors } from '@/constants/victoria-theme';
import {
  crearTarea,
  InstructorApiError,
  obtenerArbolCompetencias,
  obtenerPortafolios,
  obtenerTareas,
  subirAdjunto,
  Tarea,
} from '@/lib/instructor';
import { useRoleGuard } from '@/lib/role-guard';
import { styles, modalStyles } from './[idCompetencia].styles';

const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

/** "2026-10-06" -> "6 oct 2026" (se parsea el texto para evitar desfases de zona horaria). */
function formatearFecha(valor: string | null): string | null {
  if (!valor) return null;
  const [anio, mes, dia] = valor.slice(0, 10).split('-').map(Number);
  if (!anio || !mes || !dia) return valor;
  return `${dia} ${MESES[mes - 1]} ${anio}`;
}

export default function InstructorTareasScreen() {
  const perfil = useRoleGuard(['instructor']);
  const { idFicha: idFichaParam, idCompetencia: idCompetenciaParam } = useLocalSearchParams<{
    idFicha: string;
    idCompetencia: string;
  }>();
  const idFicha = Number(idFichaParam);
  const idCompetencia = Number(idCompetenciaParam);
  const { width } = useWindowDimensions();
  const pantallaAncha = width >= 800;

  const [tareas, setTareas] = useState<Tarea[] | null>(null);
  const [nombreCompetencia, setNombreCompetencia] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const cargar = useCallback(() => {
    if (!perfil || !idFicha || !idCompetencia) return;
    obtenerTareas(idFicha, idCompetencia)
      .then((res) => {
        setTareas(res);
        setError(null);
      })
      .catch((err) =>
        setError(err instanceof InstructorApiError ? err.message : 'No se pudieron cargar las tareas.')
      );

    // El nombre de la competencia (subtítulo) sale del árbol del instructor.
    obtenerArbolCompetencias()
      .then((arbol) => {
        for (const trimestre of arbol) {
          const materia = trimestre.materias.find((m) => m.id_competencia === idCompetencia);
          if (materia) {
            setNombreCompetencia(materia.nombre);
            return;
          }
        }
      })
      .catch(() => {
        // Silencioso: sin el subtítulo la pantalla funciona igual.
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [perfil, idFicha, idCompetencia]);

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
      <View style={styles.headerBlock}>
        <Pressable
          style={styles.backLink}
          onPress={() => router.push('/victoria/instructor/competencias' as never)}>
          <Ionicons name="arrow-back" size={12} color="rgba(255,255,255,0.8)" />
          <Text style={styles.backLinkText}>Volver a Competencias gestión de materias</Text>
        </Pressable>
        <Text style={styles.fichaTitle}>Ficha {idFichaParam}</Text>
        {nombreCompetencia ? <Text style={styles.fichaSubtitle}>- {nombreCompetencia}</Text> : null}
      </View>

      <View style={[styles.contentRow, !pantallaAncha && styles.contentRowNarrow]}>
        <View style={[styles.listCol, !pantallaAncha && styles.listColNarrow]}>
          {error ? <Text style={styles.error}>{error}</Text> : null}

          {!tareas && !error ? (
            <ActivityIndicator color={VictoriaColors.white} style={styles.loader} />
          ) : null}

          {tareas && tareas.length === 0 ? (
            <Text style={styles.empty}>Aún no hay tareas creadas para esta ficha y competencia.</Text>
          ) : null}

          {tareas?.map((tarea) => {
            const fecha = formatearFecha(tarea.fecha_limite);
            return (
              <Pressable
                key={tarea.id_tarea}
                style={styles.taskCard}
                onPress={() => router.push(`/victoria/instructor/tareas/${tarea.id_tarea}` as never)}>
                <View style={styles.taskIcon}>
                  <Ionicons name="layers-outline" size={18} color="#ffffff" />
                </View>
                <View style={styles.taskBody}>
                  <Text style={styles.taskName}>{tarea.titulo}</Text>
                  {tarea.descripcion ? (
                    <Text style={styles.taskDescription} numberOfLines={2}>
                      {tarea.descripcion}
                    </Text>
                  ) : null}
                  <View style={styles.taskChips}>
                    {fecha ? (
                      <View style={styles.datePill}>
                        <Ionicons name="calendar-outline" size={11} color="#ffffff" />
                        <Text style={styles.datePillText}>{fecha}</Text>
                      </View>
                    ) : null}
                    {tarea.archivo_url ? (
                      <View style={styles.filePill}>
                        <Ionicons name="attach-outline" size={11} color="#1b3a2a" />
                        <Text style={styles.filePillText}>1 archivo</Text>
                      </View>
                    ) : null}
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#666666" />
              </Pressable>
            );
          })}
        </View>

        <View style={styles.actionCol}>
          <Pressable style={styles.newBtn} onPress={() => setModalVisible(true)}>
            <Ionicons name="cloud-upload-outline" size={16} color="#ffffff" />
            <Text style={styles.newBtnText}>Nueva Tarea</Text>
          </Pressable>
        </View>
      </View>

      <ExitButton />

      <NuevaTareaModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onCreadas={(nuevas) => {
          // Solo se agregan a la lista las tareas de la ficha que se está viendo.
          const deEstaFicha = nuevas.filter((t) => t.id_ficha === idFicha);
          if (deEstaFicha.length > 0) {
            setTareas((prev) => (prev ? [...deEstaFicha, ...prev] : deEstaFicha));
          }
        }}
        idFicha={idFicha}
        idCompetencia={idCompetencia}
      />
    </VictoriaScreenShell>
  );
}

type FichaOpcion = {
  id_ficha: number;
  numero_ficha: string;
  num_estudiantes: number;
  programa: string | null;
};

/** Acepta "2026-10-06" (calendario web) o "06/10/2026" (escritura manual) y devuelve AAAA-MM-DD. */
function aFechaIso(valor: string): string | undefined {
  const v = valor.trim();
  if (!v) return undefined;
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
  const m = v.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (m) return `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
  return undefined;
}

function NuevaTareaModal({
  visible,
  onClose,
  onCreadas,
  idFicha,
  idCompetencia,
}: {
  visible: boolean;
  onClose: () => void;
  onCreadas: (t: Tarea[]) => void;
  idFicha: number;
  idCompetencia: number;
}) {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState('');
  const [fichas, setFichas] = useState<FichaOpcion[]>([]);
  const [cargandoFichas, setCargandoFichas] = useState(true);
  const [seleccionadas, setSeleccionadas] = useState<Set<number>>(new Set([idFicha]));
  const [archivoUrl, setArchivoUrl] = useState<string | null>(null);
  const [nombreArchivo, setNombreArchivo] = useState<string | null>(null);
  const [subiendo, setSubiendo] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Al abrir el modal: trae las fichas que el instructor tiene asignadas
  // en ESTA competencia (y el nombre del programa de cada una).
  useEffect(() => {
    if (!visible) return;
    let cancelado = false;
    setCargandoFichas(true);
    setSeleccionadas(new Set([idFicha]));

    Promise.all([obtenerArbolCompetencias(), obtenerPortafolios().catch(() => [])])
      .then(([arbol, portafolios]) => {
        if (cancelado) return;
        const programas = new Map<number, string | null>();
        portafolios.forEach((p) => programas.set(p.id_ficha, p.nombre_programa));

        const vistas = new Map<number, FichaOpcion>();
        arbol.forEach((trimestre) =>
          trimestre.materias.forEach((materia) => {
            if (materia.id_competencia !== idCompetencia) return;
            materia.fichas.forEach((f) => {
              if (vistas.has(f.id_ficha)) return;
              vistas.set(f.id_ficha, {
                id_ficha: f.id_ficha,
                numero_ficha: f.numero_ficha ?? String(f.id_ficha),
                num_estudiantes: f.num_estudiantes,
                programa: programas.get(f.id_ficha) ?? null,
              });
            });
          })
        );
        // La ficha desde la que se abrió el modal va primero.
        const lista = Array.from(vistas.values()).sort((a, b) =>
          a.id_ficha === idFicha ? -1 : b.id_ficha === idFicha ? 1 : 0
        );
        setFichas(lista);
      })
      .catch(() => {
        if (!cancelado) setError('No se pudieron cargar tus fichas.');
      })
      .finally(() => {
        if (!cancelado) setCargandoFichas(false);
      });

    return () => {
      cancelado = true;
    };
  }, [visible, idFicha, idCompetencia]);

  function toggleFicha(id: number) {
    setSeleccionadas((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function limpiarYCerrar() {
    setTitulo('');
    setDescripcion('');
    setFecha('');
    setArchivoUrl(null);
    setNombreArchivo(null);
    setError(null);
    onClose();
  }

  async function handleAdjuntar() {
    // type '*/*' = cualquier tipo de archivo.
    const resultado = await DocumentPicker.getDocumentAsync({ multiple: false, type: '*/*' });
    if (resultado.canceled || !resultado.assets?.[0]) return;
    const archivo = resultado.assets[0];
    setSubiendo(true);
    setError(null);
    try {
      const url = await subirAdjunto({
        uri: archivo.uri,
        name: archivo.name,
        mimeType: archivo.mimeType,
        file: archivo.file,
      });
      setArchivoUrl(url);
      setNombreArchivo(archivo.name);
    } catch (err) {
      setError(err instanceof InstructorApiError ? err.message : 'No se pudo adjuntar el archivo.');
    } finally {
      setSubiendo(false);
    }
  }

  async function handleCrear() {
    if (!titulo.trim()) {
      setError('El título de la evidencia es obligatorio.');
      return;
    }
    if (seleccionadas.size === 0) {
      setError('Selecciona al menos una ficha.');
      return;
    }
    const fechaIso = aFechaIso(fecha);
    if (fecha.trim() && !fechaIso) {
      setError('La fecha debe tener el formato dd/mm/aaaa.');
      return;
    }

    setGuardando(true);
    setError(null);
    const ids = Array.from(seleccionadas);
    const datos = {
      titulo: titulo.trim(),
      descripcion: descripcion.trim() || undefined,
      fecha_limite: fechaIso,
      archivo_url: archivoUrl ?? undefined,
    };

    // Una tarea por ficha seleccionada (el backend las crea de a una).
    const resultados = await Promise.allSettled(ids.map((id) => crearTarea(id, idCompetencia, datos)));
    const creadas: Tarea[] = [];
    const fallidas: number[] = [];
    let primerError: string | null = null;
    resultados.forEach((r, i) => {
      if (r.status === 'fulfilled') {
        creadas.push(r.value);
      } else {
        fallidas.push(ids[i]);
        if (!primerError) {
          primerError = r.reason instanceof InstructorApiError ? r.reason.message : null;
        }
      }
    });

    if (creadas.length > 0) onCreadas(creadas);

    if (fallidas.length === 0) {
      limpiarYCerrar();
    } else {
      // Se dejan marcadas solo las fichas que fallaron, para reintentar sin duplicar las demás.
      setSeleccionadas(new Set(fallidas));
      setError(primerError ?? `No se pudo crear la tarea en ${fallidas.length} ficha(s). Intenta de nuevo.`);
    }
    setGuardando(false);
  }

  const puedeCrear = titulo.trim().length > 0 && seleccionadas.size > 0 && !subiendo && !guardando;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={limpiarYCerrar}>
      <Pressable style={modalStyles.backdrop} onPress={limpiarYCerrar}>
        <Pressable style={modalStyles.card} onPress={(e) => e.stopPropagation()}>
          <ScrollView contentContainerStyle={modalStyles.cardContent}>
            <View style={modalStyles.headerRow}>
              <View>
                <Text style={modalStyles.title}>Nueva Tarea</Text>
                <Text style={modalStyles.subtitle}>Ficha {idFicha}</Text>
              </View>
              <Pressable onPress={limpiarYCerrar} hitSlop={8}>
                <Ionicons name="close" size={20} color="#1a3322" />
              </Pressable>
            </View>

            <Text style={modalStyles.label}>TÍTULO</Text>
            <TextInput
              value={titulo}
              onChangeText={setTitulo}
              placeholder="Título de la evidencia"
              placeholderTextColor="#8a8a8a"
              style={modalStyles.input}
            />

            <Text style={modalStyles.label}>INDICACIONES</Text>
            <TextInput
              value={descripcion}
              onChangeText={setDescripcion}
              placeholder="Describe la tarea y las indicaciones para el aprendiz"
              placeholderTextColor="#8a8a8a"
              multiline
              style={[modalStyles.input, modalStyles.textarea]}
            />

            <Text style={modalStyles.label}>FECHA LÍMITE DE ENTREGA</Text>
            <View style={modalStyles.pillInput}>
              <Ionicons name="calendar-outline" size={16} color="#556b5c" />
              {Platform.OS === 'web' ? (
                // En web se usa el calendario nativo del navegador.
                <input
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  onClick={(e) => {
                    try {
                      (e.currentTarget as HTMLInputElement & { showPicker?: () => void }).showPicker?.();
                    } catch {
                      // Algunos navegadores no permiten abrirlo por código; el icono nativo sigue funcionando.
                    }
                  }}
                  style={{
                    flex: 1,
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    fontSize: 14,
                    color: '#1a1a1a',
                    fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
                  }}
                />
              ) : (
                <TextInput
                  value={fecha}
                  onChangeText={setFecha}
                  placeholder="dd/mm/aaaa"
                  placeholderTextColor="#8a8a8a"
                  style={modalStyles.pillTextInput}
                />
              )}
            </View>
            <Text style={modalStyles.helper}>Los aprendices no podrán entregar después de esta fecha</Text>

            <Text style={modalStyles.label}>ASIGNAR A FICHAS</Text>
            <ScrollView
              nestedScrollEnabled
              style={modalStyles.fichasScroll}
              contentContainerStyle={modalStyles.fichasContent}>
              {cargandoFichas ? (
                <ActivityIndicator color="#556b5c" />
              ) : fichas.length === 0 ? (
                <Text style={modalStyles.helper}>No tienes fichas asignadas para esta competencia.</Text>
              ) : (
                fichas.map((f) => {
                  const marcada = seleccionadas.has(f.id_ficha);
                  return (
                    <Pressable
                      key={f.id_ficha}
                      style={[modalStyles.fichaOpcion, marcada && modalStyles.fichaOpcionActiva]}
                      onPress={() => toggleFicha(f.id_ficha)}>
                      <Ionicons
                        name={marcada ? 'checkmark-circle-outline' : 'ellipse-outline'}
                        size={20}
                        color={marcada ? '#2f5d46' : '#1a1a1a'}
                      />
                      <View style={{ flex: 1 }}>
                        <Text style={[modalStyles.fichaNombre, marcada && modalStyles.fichaNombreActiva]}>
                          Ficha {f.numero_ficha}
                        </Text>
                        <Text style={modalStyles.fichaDetalle} numberOfLines={1}>
                          {f.programa ? `${f.programa} - ` : ''}
                          {f.num_estudiantes} {f.num_estudiantes === 1 ? 'aprendiz' : 'aprendices'}
                        </Text>
                      </View>
                    </Pressable>
                  );
                })
              )}
            </ScrollView>

            {archivoUrl && nombreArchivo ? (
              <View style={modalStyles.fileAttached}>
                <Ionicons name="document-attach-outline" size={18} color="#2f5d46" />
                <Text style={modalStyles.fileAttachedText} numberOfLines={1}>
                  {nombreArchivo}
                </Text>
                <Pressable
                  onPress={() => {
                    setArchivoUrl(null);
                    setNombreArchivo(null);
                  }}
                  hitSlop={8}>
                  <Ionicons name="close-circle-outline" size={18} color="#556b5c" />
                </Pressable>
              </View>
            ) : (
              <Pressable style={modalStyles.attachBtn} onPress={handleAdjuntar} disabled={subiendo}>
                {subiendo ? (
                  <ActivityIndicator color="#556b5c" />
                ) : (
                  <>
                    <Ionicons name="cloud-upload-outline" size={18} color="#556b5c" />
                    <Text style={modalStyles.attachText}>Adjuntar archivos</Text>
                  </>
                )}
              </Pressable>
            )}

            {error ? <Text style={modalStyles.error}>{error}</Text> : null}

            <Pressable
              style={[modalStyles.submitBtn, puedeCrear && modalStyles.submitBtnReady]}
              onPress={handleCrear}
              disabled={!puedeCrear}>
              {guardando ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={[modalStyles.submitText, puedeCrear && modalStyles.submitTextReady]}>
                  {seleccionadas.size > 1 ? `Crear Tarea en ${seleccionadas.size} fichas` : 'Crear Tarea'}
                </Text>
              )}
            </Pressable>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}