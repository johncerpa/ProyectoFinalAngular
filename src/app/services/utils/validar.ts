import Admin from '../interfaces/admin';

function validarCorreo(correo) {
  return /\S+@\S+\.\S+/.test(correo);
}

// Mín: 6 caracteres, una letra, un número y un caracter especial
function validarClave(clave) {
  return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/.test(
    clave
  );
}

function validarNumero(num) {
  return /^[0-9]+$/.test(num);
}

export function validarAdmin(informacion: Admin) {
  const {
    primerNombre,
    apellido,
    nombreEmpresa,
    tipoDocumento,
    numeroDocumento,
    imagen,
    correo,
    clave,
    telefono,
  } = informacion;

  if (primerNombre.length === 0) {
    return {
      valido: false,
      problema: 'El primer nombre no puede estar vacio, revisa y escribelo.',
    };
  }

  if (apellido.length === 0) {
    return {
      valido: false,
      problema: 'El apellido no puede estar vacio, revisa y escribelo.',
    };
  }

  if (!tipoDocumento) {
    return {
      valido: false,
      problema: 'Debes escoger el tipo de documento.',
    };
  }

  if (!validarNumero(numeroDocumento)) {
    return {
      valido: false,
      problema:
        'El número de documento es inválido, revisa y escribelo nuevamente.',
    };
  }

  if (!validarNumero(telefono)) {
    return {
      valido: false,
      problema: 'El teléfono es inválido, revisa y escribelo nuevamente.',
    };
  }

  if (nombreEmpresa.length === 0) {
    return {
      valido: false,
      problema:
        'El nombre de la empresa no puede estar vacio, revisa y escribelo.',
    };
  }

  if (!imagen) {
    return {
      valido: false,
      problema: 'Debes incluir una imagen de perfil.',
    };
  }

  if (!validarCorreo(correo)) {
    return {
      valido: false,
      problema: 'El correo es inválido, revisa y escribelo nuevamente.',
    };
  }

  if (!validarClave(clave)) {
    return {
      valido: false,
      problema:
        'La clave debe contener mínimo 6 caracteres, debe contener por lo menos una letra y por lo menos un número.',
    };
  }

  return {
    valido: true,
  };
}

export function validarOperador(informacion) {
  const {
    primerNombre,
    apellido,
    direccion,
    imagen,
    correo,
    clave,
  } = informacion;

  if (primerNombre.length === 0) {
    return {
      valido: false,
      problema: 'El primer nombre no puede estar vacio, revisa y escribelo.',
    };
  }

  if (apellido.length === 0) {
    return {
      valido: false,
      problema: 'El apellido no puede estar vacio, revisa y escribelo.',
    };
  }

  if (direccion.length === 0) {
    return {
      valido: false,
      problema: 'La dirección no puede estar vacia, revisa y escribela.',
    };
  }

  if (!validarCorreo(correo)) {
    return {
      valido: false,
      problema: 'El correo es inválido, revisa y escribelo nuevamente.',
    };
  }

  if (!validarClave(clave)) {
    return {
      valido: false,
      problema:
        'La clave debe contener mínimo 6 caracteres, debe contener por lo menos una letra y por lo menos un número.',
    };
  }

  if (!imagen) {
    return {
      valido: false,
      problema: 'Debes incluir una imagen de perfil.',
    };
  }

  return {
    valido: true,
  };
}
