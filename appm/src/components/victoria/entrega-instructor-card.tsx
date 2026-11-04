import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';

import { EstadoEntrega, tipoDeArchivo } from '@/lib/instructor';
import { modalStyles, styles } from './entrega-instructor-card.styles';

/**
 * Tarjeta de entrega EXCLUSIVA del instructor (no sustituye a
 * entrega-grade-card.tsx, que siguen usando los demás roles).
 */

type Cambios = { estado?: EstadoEntrega; nota?: number; comentario?: string };

type Props = {
  titulo: string; // nombre del aprendiz
  tituloTarea?: string; // título de la tarea (se muestra bajo el título de la ventana de calificar)
  archivoUrl: string | null;
  estado: EstadoEntrega;
  nota: number | null;
  comentario: string | null;
  onGuardar: (cambios: Cambios) => Promise<void>;
};

type Visual = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  pillBg: string;
  pillText: string;
  notaBg: string;
  notaText: string;
};

const VISUAL: Record<EstadoEntrega, Visual> = {
  aprobado: {
    label: 'Aprobado',
    icon: 'checkmark-circle-outline',
    pillBg: '#8aa386',
    pillText: '#ffffff',
    notaBg: '#3f6b4f',
    notaText: '#ffffff',
  },
  rechazado: {
    label: 'Desaprobado',
    icon: 'close-circle-outline',
    pillBg: '#a86a6e',
    pillText: '#ffffff',
    notaBg: '#a86a6e',
    notaText: '#ffffff',
  },
  en_revision: {
    label: 'En revisión',
    icon: 'hourglass-outline',
    pillBg: '#a69f6b',
    pillText: '#ffffff',
    notaBg: '#a69f6b',
    notaText: '#ffffff',
  },
  pendiente: {
    label: 'Pendiente',
    icon: 'time-outline',
    pillBg: 'rgba(0, 0, 0, 0.07)',
    pillText: '#5a665d',
    notaBg: 'rgba(255, 255, 255, 0.75)',
    notaText: '#9aa59d',
  },
};

// Estados que el instructor puede asignar a mano desde el botón "Estado".
const OPCIONES_ESTADO: EstadoEntrega[] = ['en_revision', 'aprobado', 'rechazado'];

const ETIQUETA_TIPO = { pdf: 'PDF', word: 'Word', video: 'Video', otro: 'Archivo' } as const;

// Rango de la calificación y cuánto suben/bajan las flechas ▲▼ en cada clic.
const NOTA_MIN = 1.0;
const NOTA_MAX = 10.0;
const PASO_NOTA = 0.1;

const redondear = (n: number) => Math.round(n * 10) / 10;

/** Convierte lo escrito ("8,5", "9") en un número entre 1.0 y 10.0, o null si no es válido. */
function leerNota(texto: string): number | null {
  const limpio = texto.trim().replace(',', '.');
  if (!limpio) return null;
  const valor = Number(limpio);
  if (!Number.isFinite(valor) || valor < NOTA_MIN || valor > NOTA_MAX) return null;
  return valor;
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

export function EntregaInstructorCard({
  titulo,
  tituloTarea,
  archivoUrl,
  estado,
  nota,
  comentario,
  onGuardar,
}: Props) {
  const visual = VISUAL[estado] ?? VISUAL.pendiente;
  const tipo = tipoDeArchivo(archivoUrl);
  const etiquetaTipo = tipo ? ETIQUETA_TIPO[tipo] : 'Archivo';
  const comentarioLimpio = comentario?.trim() ?? '';

  const [modal, setModal] = useState<'nota' | 'estado' | null>(null);
  const [notaTexto, setNotaTexto] = useState('');
  const [comentarioTexto, setComentarioTexto] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function abrirCalificar() {
    setNotaTexto(nota !== null && nota >= NOTA_MIN ? nota.toFixed(1) : '');
    setComentarioTexto(comentarioLimpio);
    setError(null);
    setModal('nota');
  }

  function abrirEstado() {
    setError(null);
    setModal('estado');
  }

  function cerrar() {
    if (!guardando) setModal(null);
  }

  async function guardar(cambios: Cambios) {
    setGuardando(true);
    setError(null);
    try {
      await onGuardar(cambios);
      setModal(null);
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : 'No se pudo guardar el cambio.');
    } finally {
      setGuardando(false);
    }
  }

  const notaValida = leerNota(notaTexto);

  // Flechas ▲▼ del campo: suben o bajan la nota de a 0.1, siempre dentro de 1.0 - 10.0.
  function ajustarNota(delta: number) {
    const actual = leerNota(notaTexto);
    // Con el campo vacío (o con algo inválido), la primera flecha arranca en 1.0.
    const base = actual ?? (notaTexto.trim() ? NOTA_MIN : NOTA_MIN - delta);
    const siguiente = Math.min(NOTA_MAX, Math.max(NOTA_MIN, redondear(base + delta)));
    setNotaTexto(siguiente.toFixed(1));
    setError(null);
  }

  function guardarCalificacion() {
    const valor = leerNota(notaTexto);
    if (valor === null) {
      setError('La calificación debe estar entre 1.0 y 10.0.');
      return;
    }
    guardar({ nota: valor, comentario: comentarioTexto.trim() });
  }

  return (
    <View style={styles.card}>
      {/* Nombre + etiqueta de estado */}
      <View style={styles.topRow}>
        <Text style={styles.nombre} numberOfLines={1}>
          {titulo}
        </Text>
        <View style={[styles.pill, { backgroundColor: visual.pillBg }]}>
          <Ionicons name={visual.icon} size={13} color={visual.pillText} />
          <Text style={[styles.pillText, { color: visual.pillText }]}>{visual.label}</Text>
        </View>
      </View>

      {/* Archivo entregado */}
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
      ) : (
        <Text style={styles.sinArchivo}>Sin archivo adjunto.</Text>
      )}

      {/* Nota + comentario */}
      <View style={styles.notaRow}>
        <View style={[styles.notaChip, { backgroundColor: visual.notaBg }]}>
          <Text style={[styles.notaText, { color: visual.notaText }]}>
            {nota !== null ? nota.toFixed(1) : '0.0'}
          </Text>
        </View>
        <Text style={styles.comentario} numberOfLines={2}>
          {comentarioLimpio ? `“${comentarioLimpio}”` : 'Sin comentarios'}
        </Text>
      </View>

      {/* Acciones */}
      <View style={styles.actionsRow}>
        <Pressable style={styles.actionBtn} onPress={abrirCalificar}>
          <Ionicons name="pencil-outline" size={13} color="#ffffff" />
          <Text style={styles.actionText}>Editar calificación</Text>
        </Pressable>
        <Pressable style={styles.actionBtn} onPress={abrirEstado}>
          <Ionicons name="swap-vertical-outline" size={13} color="#ffffff" />
          <Text style={styles.actionText}>Estado</Text>
        </Pressable>
      </View>

      {/* Ventana: calificar */}
      <Modal visible={modal === 'nota'} transparent animationType="fade" onRequestClose={cerrar}>
        <Pressable style={modalStyles.backdrop} onPress={cerrar}>
          <Pressable style={modalStyles.card} onPress={(e) => e.stopPropagation()}>
            <View style={modalStyles.headerRow}>
              <View style={{ flex: 1 }}>
                <Text style={modalStyles.title}>Calificar - {titulo}</Text>
                {tituloTarea ? <Text style={modalStyles.subtitle}>{tituloTarea}</Text> : null}
              </View>
              <Pressable onPress={cerrar} hitSlop={8}>
                <Ionicons name="close" size={20} color="#1a3322" />
              </Pressable>
            </View>

            <Text style={modalStyles.label}>CALIFICACIÓN  (1.0 - 10.0)</Text>
            <View style={modalStyles.notaBox}>
              <TextInput
                value={notaTexto}
                onChangeText={(t) => {
                  setNotaTexto(t);
                  setError(null);
                }}
                placeholder="Ej: 8,5"
                placeholderTextColor="#8a8a8a"
                keyboardType="decimal-pad"
                style={[modalStyles.notaInput, { outlineStyle: 'none' } as object]}
              />
              {/* Flechas: suben o bajan la nota de a 0.1 */}
              <View style={modalStyles.stepper}>
                <Pressable onPress={() => ajustarNota(PASO_NOTA)} hitSlop={6}>
                  <Ionicons name="caret-up" size={14} color="#1a3322" />
                </Pressable>
                <Pressable onPress={() => ajustarNota(-PASO_NOTA)} hitSlop={6}>
                  <Ionicons name="caret-down" size={14} color="#1a3322" />
                </Pressable>
              </View>
            </View>

            <Text style={modalStyles.label}>COMENTARIO</Text>
            <TextInput
              value={comentarioTexto}
              onChangeText={setComentarioTexto}
              placeholder="Escribe un comentario para el aprendiz"
              placeholderTextColor="#8a8a8a"
              multiline
              style={[modalStyles.input, modalStyles.textarea]}
            />

            {error ? <Text style={modalStyles.error}>{error}</Text> : null}

            <Pressable
              style={[modalStyles.submitBtn, notaValida !== null && modalStyles.submitBtnReady]}
              onPress={guardarCalificacion}
              disabled={notaValida === null || guardando}>
              {guardando ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={[modalStyles.submitText, notaValida !== null && modalStyles.submitTextReady]}>
                  Guardar Calificación
                </Text>
              )}
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Ventana: cambiar estado */}
      <Modal visible={modal === 'estado'} transparent animationType="fade" onRequestClose={cerrar}>
        <Pressable style={modalStyles.backdrop} onPress={cerrar}>
          <Pressable style={modalStyles.card} onPress={(e) => e.stopPropagation()}>
            <View style={modalStyles.headerRow}>
              <View>
                <Text style={modalStyles.title}>Cambiar estado</Text>
                <Text style={modalStyles.subtitle}>{titulo}</Text>
              </View>
              <Pressable onPress={cerrar} hitSlop={8}>
                <Ionicons name="close" size={20} color="#1a3322" />
              </Pressable>
            </View>

            {OPCIONES_ESTADO.map((op) => {
              const activa = op === estado;
              return (
                <Pressable
                  key={op}
                  style={[modalStyles.opcion, activa && modalStyles.opcionActiva]}
                  onPress={() => guardar({ estado: op })}
                  disabled={guardando}>
                  <Ionicons
                    name={VISUAL[op].icon}
                    size={18}
                    color={activa ? '#2f5d46' : '#1a1a1a'}
                  />
                  <Text style={[modalStyles.opcionText, activa && modalStyles.opcionTextActiva]}>
                    {VISUAL[op].label}
                  </Text>
                  {activa ? <Ionicons name="checkmark" size={16} color="#2f5d46" /> : null}
                </Pressable>
              );
            })}

            {guardando ? <ActivityIndicator color="#556b5c" /> : null}
            {error ? <Text style={modalStyles.error}>{error}</Text> : null}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}