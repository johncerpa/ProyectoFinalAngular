export default interface Admin {
  primerNombre: string;
  apellido: string;
  tipoDocumento: string;
  numeroDocumento: string;
  telefono: string;
  nombreEmpresa: string;
  imagen?: File;
  correo: string;
  clave?: string;
  id?: string;
  cargo?: string;
  habilitado?: boolean;
}
