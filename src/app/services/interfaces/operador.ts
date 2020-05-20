export default interface Operador {
  primerNombre: string;
  apellido: string;
  tipoDocumento: string;
  numeroDocumento: string;
  telefono: string;
  nombreEmpresa: string;
  correo: string;
  // Optional
  imagen?: File;
  clave?: string;
  id?: string;
  cargo?: string;
}
