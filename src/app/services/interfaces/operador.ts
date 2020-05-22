export default interface Operador {
  primerNombre: string;
  apellido: string;
  direccion: string;
  correo: string;
  nombreEmpresa: string;
  // Optional
  imagen?: File;
  clave?: string;
  id?: string;
  cargo?: string;
  habilitado?: boolean;
}
