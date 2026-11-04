
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from core.security import require_instructor, require_coordinador
from db.database import get_db
from models.usuario import Usuario
from schemas.tarea import (
    AprendizCreate,
    AprendizCreadoResponse,
    AprendizResumen,
    AsignacionCreate,
    AsignacionResponse,
    DashboardInstructorResponse,
    EntregaResponse,
    EntregaUpdate,
    PortafolioAprendizResponse,
    PortafolioFichaResponse,
    TareaCreate,
    TareaDetalleResponse,
    TareaResponse,
    TrimestreConMaterias,
    UploadResponse,
)
from core.uploads import guardar_adjunto
from services.instructor_service import InstructorService
from schemas.portafolio import (
    ArchivoPortafolioResponse,
    CarpetaAprendizResponse,
    CarpetaPortafolio,
    SubcarpetaPortafolio,
)
from services.portafolio_service import PortafolioService

router = APIRouter()

# Los adjuntos (extensiones, tamaño, carpeta) se manejan en core/uploads.py.


# ==========================================================================
# 0. Adjuntos
# ==========================================================================
@router.post("/uploads", response_model=UploadResponse, status_code=status.HTTP_201_CREATED)
async def subir_archivo(
    archivo: UploadFile = File(...),
    usuario_actual: Usuario = Depends(require_instructor),
):
    """Sube un adjunto (guía de una tarea, archivo de un aprendiz, etc.) y
    devuelve la URL que luego se manda en `archivo_url` al crear la tarea o
    el aprendiz. Solo instructores pueden subir archivos por esta vía."""
    url = await guardar_adjunto(archivo)
    return UploadResponse(url=url)


# ==========================================================================
# 1. Dashboard
# ==========================================================================
@router.get("/dashboard", response_model=DashboardInstructorResponse)
def dashboard_instructor(
    db: Session = Depends(get_db),
    usuario_actual: Usuario = Depends(require_instructor),
):
    return InstructorService(db).obtener_dashboard(usuario_actual.id_usuario)


# ==========================================================================
# 2. Competencias: Trimestre > Materia > Fichas
# ==========================================================================
@router.get("/competencias", response_model=list[TrimestreConMaterias])
def arbol_competencias(
    db: Session = Depends(get_db),
    usuario_actual: Usuario = Depends(require_instructor),
):
    return InstructorService(db).obtener_arbol_competencias(usuario_actual.id_usuario)


# ==========================================================================
# 3. Tareas de una ficha + materia
# ==========================================================================
@router.get("/fichas/{id_ficha}/competencias/{id_competencia}/tareas", response_model=list[TareaResponse])
def listar_tareas(
    id_ficha: int,
    id_competencia: int,
    db: Session = Depends(get_db),
    usuario_actual: Usuario = Depends(require_instructor),
):
    return InstructorService(db).obtener_tareas(usuario_actual.id_usuario, id_ficha, id_competencia)


@router.post(
    "/fichas/{id_ficha}/competencias/{id_competencia}/tareas",
    response_model=TareaResponse,
    status_code=status.HTTP_201_CREATED,
)
def crear_tarea(
    id_ficha: int,
    id_competencia: int,
    data: TareaCreate,
    db: Session = Depends(get_db),
    usuario_actual: Usuario = Depends(require_instructor),
):
    return InstructorService(db).crear_tarea(usuario_actual.id_usuario, id_ficha, id_competencia, data)


@router.get("/tareas/{id_tarea}", response_model=TareaDetalleResponse)
def detalle_tarea(
    id_tarea: int,
    db: Session = Depends(get_db),
    usuario_actual: Usuario = Depends(require_instructor),
):
    return InstructorService(db).obtener_tarea_detalle(usuario_actual.id_usuario, id_tarea)


@router.put("/entregas/{id_entrega}", response_model=EntregaResponse)
def actualizar_entrega(
    id_entrega: int,
    data: EntregaUpdate,
    db: Session = Depends(get_db),
    usuario_actual: Usuario = Depends(require_instructor),
):
    """Cambia el estado de la entrega de UN aprendiz (pendiente -> en
    revisión -> aprobado/rechazado) y opcionalmente la califica."""
    return InstructorService(db).actualizar_entrega(usuario_actual.id_usuario, id_entrega, data)


# ==========================================================================
# 4. Portafolios de fichas
# ==========================================================================
@router.get("/portafolios", response_model=list[PortafolioFichaResponse])
def listar_portafolios(
    db: Session = Depends(get_db),
    usuario_actual: Usuario = Depends(require_instructor),
):
    return InstructorService(db).obtener_portafolios(usuario_actual.id_usuario)


# ==========================================================================
# 5. Aprendices de una ficha
# ==========================================================================
@router.get("/fichas/{id_ficha}/aprendices", response_model=list[AprendizResumen])
def listar_aprendices(
    id_ficha: int,
    db: Session = Depends(get_db),
    usuario_actual: Usuario = Depends(require_instructor),
):
    return InstructorService(db).obtener_aprendices_ficha(usuario_actual.id_usuario, id_ficha)


@router.post(
    "/fichas/{id_ficha}/aprendices",
    response_model=AprendizCreadoResponse,
    status_code=status.HTTP_201_CREATED,
)
def crear_aprendiz(
    id_ficha: int,
    data: AprendizCreate,
    db: Session = Depends(get_db),
    usuario_actual: Usuario = Depends(require_instructor),
):
    return InstructorService(db).crear_aprendiz(usuario_actual.id_usuario, id_ficha, data)


@router.get("/fichas/{id_ficha}/aprendices/{id_aprendiz}/portafolio", response_model=PortafolioAprendizResponse)
def portafolio_aprendiz(
    id_ficha: int,
    id_aprendiz: int,
    db: Session = Depends(get_db),
    usuario_actual: Usuario = Depends(require_instructor),
):
    """Sección exacta del portafolio de UN aprendiz: sus Competencias con
    las Actividades (tareas) de cada una, el archivo que subió para cada
    una y, si ya la calificó, la nota + el comentario."""
    return InstructorService(db).obtener_portafolio_aprendiz(usuario_actual.id_usuario, id_ficha, id_aprendiz)


# ==========================================================================
# 6. Asignaciones (instructor <-> ficha <-> materia <-> trimestre).
#    Exclusivo del coordinador: decide quién enseña qué.
# ==========================================================================
@router.post(
    "/asignaciones",
    response_model=AsignacionResponse,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_coordinador)],
)
def crear_asignacion(data: AsignacionCreate, db: Session = Depends(get_db)):
    return InstructorService(db).crear_asignacion(data)


@router.get("/asignaciones", response_model=list[AsignacionResponse], dependencies=[Depends(require_coordinador)])
def listar_asignaciones(db: Session = Depends(get_db)):
    return InstructorService(db).listar_asignaciones()

# ==========================================================================
# 5c. Portafolio tipo Drive de UN aprendiz (solo lectura para el instructor)
# ==========================================================================
_BASE_DRIVE = "/fichas/{id_ficha}/aprendices/{id_aprendiz}/portafolio/carpetas"


@router.get(_BASE_DRIVE, response_model=list[CarpetaPortafolio])
def drive_carpetas(
    id_ficha: int,
    id_aprendiz: int,
    db: Session = Depends(get_db),
    usuario_actual: Usuario = Depends(require_instructor),
):
    aprendiz = InstructorService(db).obtener_aprendiz_de_ficha(usuario_actual.id_usuario, id_ficha, id_aprendiz)
    return PortafolioService(db).obtener_carpetas(aprendiz)


@router.get(_BASE_DRIVE + "/{categoria}/subcarpetas", response_model=list[SubcarpetaPortafolio])
def drive_subcarpetas(
    id_ficha: int,
    id_aprendiz: int,
    categoria: str,
    db: Session = Depends(get_db),
    usuario_actual: Usuario = Depends(require_instructor),
):
    aprendiz = InstructorService(db).obtener_aprendiz_de_ficha(usuario_actual.id_usuario, id_ficha, id_aprendiz)
    return PortafolioService(db).obtener_subcarpetas(categoria, aprendiz)


@router.get(
    _BASE_DRIVE + "/{categoria}/subcarpetas/{subcarpeta}/carpetas",
    response_model=list[CarpetaAprendizResponse],
)
def drive_carpetas_de_subcarpeta(
    id_ficha: int,
    id_aprendiz: int,
    categoria: str,
    subcarpeta: str,
    db: Session = Depends(get_db),
    usuario_actual: Usuario = Depends(require_instructor),
):
    aprendiz = InstructorService(db).obtener_aprendiz_de_ficha(usuario_actual.id_usuario, id_ficha, id_aprendiz)
    return PortafolioService(db).obtener_carpetas_de_subcarpeta(categoria, subcarpeta, aprendiz)


@router.get(
    _BASE_DRIVE + "/{categoria}/subcarpetas/{subcarpeta}/archivos",
    response_model=list[ArchivoPortafolioResponse],
)
def drive_archivos_de_subcarpeta(
    id_ficha: int,
    id_aprendiz: int,
    categoria: str,
    subcarpeta: str,
    db: Session = Depends(get_db),
    usuario_actual: Usuario = Depends(require_instructor),
):
    aprendiz = InstructorService(db).obtener_aprendiz_de_ficha(usuario_actual.id_usuario, id_ficha, id_aprendiz)
    return PortafolioService(db).obtener_archivos_de_subcarpeta(categoria, subcarpeta, aprendiz)


@router.get(
    _BASE_DRIVE + "/{categoria}/subcarpetas/{subcarpeta}/carpetas/{id_carpeta}",
    response_model=CarpetaAprendizResponse,
)
def drive_detalle_carpeta(
    id_ficha: int,
    id_aprendiz: int,
    categoria: str,
    subcarpeta: str,
    id_carpeta: int,
    db: Session = Depends(get_db),
    usuario_actual: Usuario = Depends(require_instructor),
):
    aprendiz = InstructorService(db).obtener_aprendiz_de_ficha(usuario_actual.id_usuario, id_ficha, id_aprendiz)
    return PortafolioService(db).obtener_detalle_carpeta(categoria, subcarpeta, id_carpeta, aprendiz)


@router.get(
    _BASE_DRIVE + "/{categoria}/subcarpetas/{subcarpeta}/carpetas/{id_carpeta}/archivos",
    response_model=list[ArchivoPortafolioResponse],
)
def drive_archivos_de_carpeta(
    id_ficha: int,
    id_aprendiz: int,
    categoria: str,
    subcarpeta: str,
    id_carpeta: int,
    db: Session = Depends(get_db),
    usuario_actual: Usuario = Depends(require_instructor),
):
    aprendiz = InstructorService(db).obtener_aprendiz_de_ficha(usuario_actual.id_usuario, id_ficha, id_aprendiz)
    return PortafolioService(db).obtener_archivos_de_carpeta(categoria, subcarpeta, id_carpeta, aprendiz)
