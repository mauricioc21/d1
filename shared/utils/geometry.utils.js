/**
 * Utilidades para procesamiento de imágenes y geometría 3D
 */

/**
 * Calcula la distancia entre dos puntos 3D
 */
export const distance3D = (p1, p2) => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const dz = p2.z - p1.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
};

/**
 * Convierte grados a radianes
 */
export const degreesToRadians = (degrees) => {
  return degrees * (Math.PI / 180);
};

/**
 * Convierte radianes a grados
 */
export const radiansToDegrees = (radians) => {
  return radians * (180 / Math.PI);
};

/**
 * Calcula el área de un triángulo en 3D
 */
export const triangleArea3D = (p1, p2, p3) => {
  const a = distance3D(p1, p2);
  const b = distance3D(p2, p3);
  const c = distance3D(p3, p1);
  const s = (a + b + c) / 2;
  return Math.sqrt(s * (s - a) * (s - b) * (s - c));
};

/**
 * Normaliza un vector 3D
 */
export const normalizeVector = (vector) => {
  const length = Math.sqrt(
    vector.x * vector.x + 
    vector.y * vector.y + 
    vector.z * vector.z
  );
  
  if (length === 0) return { x: 0, y: 0, z: 0 };
  
  return {
    x: vector.x / length,
    y: vector.y / length,
    z: vector.z / length
  };
};

/**
 * Producto cruz de dos vectores 3D
 */
export const crossProduct = (v1, v2) => {
  return {
    x: v1.y * v2.z - v1.z * v2.y,
    y: v1.z * v2.x - v1.x * v2.z,
    z: v1.x * v2.y - v1.y * v2.x
  };
};

/**
 * Producto punto de dos vectores 3D
 */
export const dotProduct = (v1, v2) => {
  return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
};

/**
 * Redimensiona imagen manteniendo aspecto
 */
export const calculateAspectRatioFit = (srcWidth, srcHeight, maxWidth, maxHeight) => {
  const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
  return {
    width: srcWidth * ratio,
    height: srcHeight * ratio
  };
};

/**
 * Convierte coordenadas esféricas a cartesianas
 */
export const sphericalToCartesian = (radius, theta, phi) => {
  return {
    x: radius * Math.sin(phi) * Math.cos(theta),
    y: radius * Math.sin(phi) * Math.sin(theta),
    z: radius * Math.cos(phi)
  };
};

/**
 * Convierte coordenadas cartesianas a esféricas
 */
export const cartesianToSpherical = (x, y, z) => {
  const radius = Math.sqrt(x * x + y * y + z * z);
  return {
    radius,
    theta: Math.atan2(y, x),
    phi: Math.acos(z / radius)
  };
};

/**
 * Genera matriz de transformación 4x4
 */
export const createTransformMatrix = (position, rotation, scale) => {
  // Matriz de identidad 4x4
  const matrix = [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1]
  ];
  
  // Aplicar escala
  matrix[0][0] = scale.x;
  matrix[1][1] = scale.y;
  matrix[2][2] = scale.z;
  
  // Aplicar posición
  matrix[0][3] = position.x;
  matrix[1][3] = position.y;
  matrix[2][3] = position.z;
  
  // TODO: Aplicar rotación (requiere quaternions o ángulos de Euler)
  
  return matrix;
};

export default {
  distance3D,
  degreesToRadians,
  radiansToDegrees,
  triangleArea3D,
  normalizeVector,
  crossProduct,
  dotProduct,
  calculateAspectRatioFit,
  sphericalToCartesian,
  cartesianToSpherical,
  createTransformMatrix
};
