import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Linking, Modal, Pressable, Text, TextInput, View } from 'react-native';

import { VictoriaScreenShell } from '@/components/victoria/screen-shell';
import { ExitButton } from '@/components/victoria/ui';
import { VictoriaColors } from '@/constants/victoria-theme';
import { API_BASE_URL } from '@/lib/api-config';
import { formatearTamano } from '@/lib/documentos';
import {
  crearCarpetaPortafolio,
  elegirArchivoPortafolio,
  ExploradorPortafolio,
  NodoPortafolio,
  obtenerExplorador,
  subirArchivoPortafolio,
} from '@/lib/portafolio-instructor';
import { useRoleGuard } from '@/lib/role-guard';
import { styles, modalStyles } from './index.styles';

/** URL absoluta para abrir un archivo guardado (puede venir relativa). */
function urlDeArchivo(url: string): string {
  return /^https?:\/\//i.test(url) ? url : `${API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
}

function formatearFecha(fecha: string | null): string {
  if (!fecha) return '';
  const d = new Date(fecha);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('es-CO', { day: 'numeric', month: 'long' });
}

/** Portafolio propio del instructor: carpetas y archivos que él mismo organiza. */
export default function MiPortafolioScreen() {
  const perfil = useRoleGuard(['instructor']);

  const [idPadre, setIdPadre] = useState<number | null>(null);
  const [datos, setDatos] = useState<ExploradorPortafolio | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [modalCarpeta, setModalCarpeta] = useState(false);
  const [subiendo, setSubiendo] = useState(false);

  const cargar = useCallback(() => {
    if (!perfil) return;
    obtenerExplorador(perfil.id_usuario, idPadre)
      .then((res) => {
        setDatos(res);
        setError(null);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'No se pudo cargar el portafolio.'));
  }, [perfil, idPadre]);

  useFocusEffect(cargar);

  if (perfil === undefined) {
    return (
      <VictoriaScreenShell>
        <ActivityIndicator color={VictoriaColors.white} style={styles.loader} />
      </VictoriaScreenShell>
    );
  }
  if (!perfil) return null;

  const nombre = datos?.nombre_instructor ?? `${perfil.nombre} ${perfil.apellido ?? ''}`.trim();

  function abrirNodo(n: NodoPortafolio) {
    if (n.tipo === 'carpeta') {
      setDatos(null);
      setIdPadre(n.id_nodo);
    } else if (n.archivo_url) {
      Linking.openURL(urlDeArchivo(n.archivo_url)).catch(() => setError('No se pudo abrir el archivo.'));
    }
  }

  function irA(id: number | null) {
    setDatos(null);
    setIdPadre(id);
  }

  async function handleSubir() {
    setMenuAbierto(false);
    if (!perfil) return;
    setError(null);
    try {
      const asset = await elegirArchivoPortafolio();
      if (!asset) return; // cancelado
      setSubiendo(true);
      await subirArchivoPortafolio(perfil.id_usuario, asset, idPadre);
      cargar();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo subir el archivo.');
    } finally {
      setSubiendo(false);
    }
  }

  async function handleCrearCarpeta(nombreCarpeta: string) {
    if (!perfil) return;
    await crearCarpetaPortafolio(perfil.id_usuario, nombreCarpeta, idPadre);
    cargar();
  }

  return (
    <VictoriaScreenShell>
      <Text style={styles.eyebrow}>Portafolio {new Date().getFullYear()}</Text>

      <View style={styles.headerRow}>
        <Text style={styles.title}>Portafolio - {nombre}</Text>

        <View>
          <Pressable style={styles.nuevoBtn} onPress={() => setMenuAbierto((v) => !v)}>
            <Ionicons name="cloud-upload-outline" size={16} color={VictoriaColors.white} />
            <Text style={styles.nuevoText}>Nuevo</Text>
          </Pressable>

          {menuAbierto ? (
            <View style={styles.menu}>
              <Pressable
                style={styles.menuItem}
                onPress={() => {
                  setMenuAbierto(false);
                  setModalCarpeta(true);
                }}>
                <Ionicons name="cloud-upload-outline" size={16} color={VictoriaColors.white} />
                <Text style={styles.menuText}>Carpeta Nueva</Text>
              </Pressable>
              <View style={styles.menuDivider} />
              <Pressable style={styles.menuItem} onPress={handleSubir}>
                <Ionicons name="cloud-upload-outline" size={16} color={VictoriaColors.white} />
                <Text style={styles.menuText}>Subir Archivos</Text>
              </Pressable>
            </View>
          ) : null}
        </View>
      </View>

      <View style={styles.camino}>
        <Pressable onPress={() => irA(null)} hitSlop={6}>
          <Text style={styles.caminoText}>Portafolio - {nombre}</Text>
        </Pressable>
        {datos?.ruta.map((r) => (
          <View key={r.id_nodo} style={styles.caminoItem}>
            <Text style={styles.caminoText}>  ›  </Text>
            <Pressable onPress={() => irA(r.id_nodo)} hitSlop={6}>
              <Text style={styles.caminoText}>{r.nombre}</Text>
            </Pressable>
          </View>
        ))}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {subiendo ? <Text style={styles.aviso}>Subiendo archivo...</Text> : null}

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

        {!datos && !error ? <ActivityIndicator color="#1a3322" style={styles.loader} /> : null}

        {datos && datos.items.length === 0 ? (
          <Text style={styles.vacio}>Esta carpeta está vacía. Usa “Nuevo” para agregar contenido.</Text>
        ) : null}

        {datos?.items.map((n) => (
          <Pressable key={n.id_nodo} style={styles.fila} onPress={() => abrirNodo(n)}>
            <View style={styles.colIcono}>
              <View style={styles.iconoCirculo}>
                <Ionicons
                  name={n.tipo === 'carpeta' ? 'folder-outline' : 'document-text-outline'}
                  size={16}
                  color={VictoriaColors.white}
                />
              </View>
            </View>
            <Text style={[styles.celda, styles.colNombre]} numberOfLines={1}>
              {n.nombre}
            </Text>
            <Text style={[styles.celda, styles.colDato]}>{formatearFecha(n.fecha_modificacion)}</Text>
            <Text style={[styles.celda, styles.colDato]} numberOfLines={1}>
              {n.modificado_por ?? ''}
            </Text>
            <Text style={[styles.celda, styles.colDato]}>
              {n.tipo === 'carpeta'
                ? n.total_archivos > 0
                  ? `${n.total_archivos} docs`
                  : ''
                : n.tamano_bytes != null
                  ? formatearTamano(n.tamano_bytes)
                  : ''}
            </Text>
          </Pressable>
        ))}
      </View>

      <ExitButton />

      <CarpetaNuevaModal
        visible={modalCarpeta}
        onClose={() => setModalCarpeta(false)}
        onCrear={handleCrearCarpeta}
      />
    </VictoriaScreenShell>
  );
}

function CarpetaNuevaModal({
  visible,
  onClose,
  onCrear,
}: {
  visible: boolean;
  onClose: () => void;
  onCrear: (nombre: string) => Promise<void>;
}) {
  const [nombre, setNombre] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function limpiarYCerrar() {
    setNombre('');
    setError(null);
    onClose();
  }

  async function handleCrear() {
    if (!nombre.trim()) {
      setError('Escribe un nombre para la carpeta.');
      return;
    }
    setGuardando(true);
    setError(null);
    try {
      await onCrear(nombre.trim());
      limpiarYCerrar();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo crear la carpeta.');
    } finally {
      setGuardando(false);
    }
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={limpiarYCerrar}>
      <Pressable style={modalStyles.backdrop} onPress={limpiarYCerrar}>
        <Pressable style={modalStyles.card} onPress={(e) => e.stopPropagation()}>
          <View style={modalStyles.headerRow}>
            <Text style={modalStyles.title}>Carpeta Nueva</Text>
            <Pressable onPress={limpiarYCerrar} hitSlop={8}>
              <Ionicons name="close" size={20} color="#556b5c" />
            </Pressable>
          </View>

          <TextInput
            value={nombre}
            onChangeText={setNombre}
            placeholder="Nombre de la carpeta"
            placeholderTextColor="#8a8a8a"
            autoFocus
            maxLength={100}
            onSubmitEditing={handleCrear}
            style={modalStyles.input}
          />

          {error ? <Text style={modalStyles.error}>{error}</Text> : null}

          <Pressable
            style={[modalStyles.submitBtn, guardando && modalStyles.submitBtnDisabled]}
            onPress={handleCrear}
            disabled={guardando}>
            {guardando ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={modalStyles.submitText}>Crear carpeta</Text>
            )}
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}