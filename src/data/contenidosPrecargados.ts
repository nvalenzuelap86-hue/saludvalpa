// ============================================================================
// saludvalpa 3.0 - CONTENIDOS PRECARGADOS DE BIBLIOTECA
// ============================================================================

import type { RecursoBiblioteca } from '../types';
import { TipoProfesion } from '../types';

// ============================================================================
// FISIOTERAPIA - EJERCICIOS Y RECURSOS
// ============================================================================

export const contenidosFisioterapia: Omit<RecursoBiblioteca, 'id' | 'fechaCreacion' | 'fechaActualizacion'>[] = [
  {
    titulo: 'Ejercicios de Estiramiento Cervical',
    descripcion: 'Rutina básica para aliviar tensión en el cuello',
    contenido: `
      <h3>Estiramiento Cervical Básico</h3>
      <p><strong>Duración:</strong> 10-15 minutos</p>
      <p><strong>Frecuencia:</strong> 2-3 veces al día</p>
      
      <h4>1. Inclinación Lateral</h4>
      <ul>
        <li>Siéntate con la espalda recta</li>
        <li>Inclina la cabeza hacia un lado, acercando la oreja al hombro</li>
        <li>Mantén 20 segundos</li>
        <li>Repite 3 veces por cada lado</li>
      </ul>
      
      <h4>2. Rotación Cervical</h4>
      <ul>
        <li>Gira lentamente la cabeza hacia la derecha</li>
        <li>Mantén 15 segundos</li>
        <li>Repite hacia la izquierda</li>
        <li>Realiza 3 series completas</li>
      </ul>
      
      <h4>3. Flexión y Extensión</h4>
      <ul>
        <li>Baja el mentón hacia el pecho (flexión)</li>
        <li>Mantén 15 segundos</li>
        <li>Inclina suavemente la cabeza hacia atrás (extensión)</li>
        <li>Mantén 15 segundos</li>
        <li>Repite 3 veces</li>
      </ul>
      
      <p><strong>Precauciones:</strong></p>
      <ul>
        <li>No forzar los movimientos</li>
        <li>Detener si hay dolor intenso</li>
        <li>Respirar normalmente durante todo el ejercicio</li>
      </ul>
    `,
    categoria: 'ejercicios',
    profesion: TipoProfesion.FISIOTERAPIA,
    etiquetas: ['cuello', 'estiramiento', 'cervical', 'dolor', 'tension'],
    esContenidoPrecargado: true,
  },
  {
    titulo: 'Fortalecimiento de Core - Nivel Básico',
    descripcion: 'Ejercicios fundamentales para fortalecer el abdomen y espalda baja',
    contenido: `
      <h3>Rutina de Fortalecimiento del Core</h3>
      <p><strong>Nivel:</strong> Principiante</p>
      <p><strong>Duración:</strong> 15-20 minutos</p>
      
      <h4>1. Plancha (Plank)</h4>
      <ul>
        <li>Posición: apoyado en antebrazos y puntas de pies</li>
        <li>Cuerpo en línea recta</li>
        <li>Mantén 20-30 segundos</li>
        <li>Descanso 30 segundos</li>
        <li>3-4 repeticiones</li>
      </ul>
      
      <h4>2. Puente (Bridge)</h4>
      <ul>
        <li>Acostado boca arriba, rodillas flexionadas</li>
        <li>Eleva la cadera formando línea recta</li>
        <li>Mantén 15 segundos</li>
        <li>10-12 repeticiones</li>
      </ul>
      
      <h4>3. Bird Dog</h4>
      <ul>
        <li>En cuatro puntos (manos y rodillas)</li>
        <li>Extiende brazo derecho y pierna izquierda simultáneamente</li>
        <li>Mantén 10 segundos</li>
        <li>Alterna lados</li>
        <li>10 repeticiones por lado</li>
      </ul>
      
      <h4>4. Abdominales Crunch</h4>
      <ul>
        <li>Acostado boca arriba, rodillas flexionadas</li>
        <li>Manos detrás de la cabeza</li>
        <li>Eleva parte superior del tronco</li>
        <li>15-20 repeticiones</li>
        <li>3 series</li>
      </ul>
      
      <p><strong>Recomendaciones:</strong></p>
      <ul>
        <li>Mantener respiración constante</li>
        <li>Calidad sobre cantidad</li>
        <li>Progresar gradualmente</li>
      </ul>
    `,
    categoria: 'ejercicios',
    profesion: TipoProfesion.FISIOTERAPIA,
    etiquetas: ['core', 'abdomen', 'espalda', 'fortalecimiento', 'basico'],
    esContenidoPrecargado: true,
  },
  {
    titulo: 'Movilidad de Hombro Post-Lesión',
    descripcion: 'Ejercicios progresivos para recuperar movilidad del hombro',
    contenido: `
      <h3>Recuperación de Movilidad de Hombro</h3>
      <p><strong>Indicado para:</strong> Post-lesión, capsulitis, tendinitis</p>
      
      <h4>Fase 1: Movilidad Pasiva (Primeros días)</h4>
      <ul>
        <li><strong>Péndulo de Codman:</strong> Deja colgar el brazo y realiza círculos suaves, 2 min</li>
        <li><strong>Elevación asistida:</strong> Con ayuda del brazo sano, eleva el brazo afectado, 10 repeticiones</li>
      </ul>
      
      <h4>Fase 2: Movilidad Activa Asistida (Semana 1-2)</h4>
      <ul>
        <li><strong>Deslizamiento en pared:</strong> Con los dedos sobre la pared, desliza hacia arriba, 10 reps</li>
        <li><strong>Rotación externa con banda:</strong> Banda elástica ligera, 3 series de 12</li>
      </ul>
      
      <h4>Fase 3: Fortalecimiento (Semana 3+)</h4>
      <ul>
        <li><strong>Elevaciones laterales:</strong> Sin peso o peso muy ligero, 3×10</li>
        <li><strong>Rotadores con banda:</strong> Resistencia progresiva, 3×12</li>
      </ul>
      
      <p><strong>⚠️ Importante:</strong></p>
      <ul>
        <li>No forzar si hay dolor agudo</li>
        <li>Progresar solo cuando no haya dolor</li>
        <li>Consultar antes de pasar a siguiente fase</li>
      </ul>
    `,
    categoria: 'ejercicios',
    profesion: TipoProfesion.FISIOTERAPIA,
    etiquetas: ['hombro', 'lesion', 'movilidad', 'recuperacion', 'rehabilitacion'],
    esContenidoPrecargado: true,
  },
  {
    titulo: 'Técnicas de Automasaje con Pelota',
    descripcion: 'Uso de pelota terapéutica para liberación miofascial',
    contenido: `
      <h3>Automasaje con Pelota Terapéutica</h3>
      
      <h4>Zona Lumbar</h4>
      <ul>
        <li>Acostado boca arriba, pelota bajo espalda baja</li>
        <li>Realiza pequeños movimientos circulares</li>
        <li>2-3 minutos por zona</li>
      </ul>
      
      <h4>Zona Dorsal</h4>
      <ul>
        <li>Pelota entre espalda y pared</li>
        <li>Flexiona levemente las rodillas</li>
        <li>Muévete arriba y abajo lentamente</li>
      </ul>
      
      <h4>Planta del Pie</h4>
      <ul>
        <li>De pie, coloca pelota bajo el pie</li>
        <li>Aplica presión controlada</li>
        <li>Rueda desde talón hasta dedos</li>
        <li>3-5 minutos por pie</li>
      </ul>
      
      <p><strong>Consejo:</strong> Presión firme pero tolerable, no debe causar dolor intenso.</p>
    `,
    categoria: 'autotratamiento',
    profesion: TipoProfesion.FISIOTERAPIA,
    etiquetas: ['automasaje', 'pelota', 'miofascial', 'dolor', 'tension'],
    esContenidoPrecargado: true,
  },
];

// ============================================================================
// PSICOLOGÍA - RECURSOS PSICOEDUCATIVOS
// ============================================================================

export const contenidosPsicologia: Omit<RecursoBiblioteca, 'id' | 'fechaCreacion' | 'fechaActualizacion'>[] = [
  {
    titulo: 'Técnica de Respiración 4-7-8',
    descripcion: 'Técnica efectiva para reducir ansiedad y mejorar el sueño',
    contenido: `
      <h3>Respiración 4-7-8 para la Ansiedad</h3>
      
      <p><strong>¿Qué es?</strong><br>
      Una técnica de respiración consciente que activa el sistema nervioso parasimpático, 
      promoviendo la relajación y reduciendo el estrés.</p>
      
      <h4>Cómo realizar la técnica:</h4>
      <ol>
        <li><strong>Inhala</strong> por la nariz contando hasta 4</li>
        <li><strong>Mantén</strong> la respiración contando hasta 7</li>
        <li><strong>Exhala</strong> completamente por la boca contando hasta 8</li>
        <li>Repite el ciclo 4 veces</li>
      </ol>
      
      <h4>¿Cuándo utilizarla?</h4>
      <ul>
        <li>Momentos de ansiedad o estrés agudo</li>
        <li>Antes de dormir</li>
        <li>Antes de situaciones estresantes</li>
        <li>Como práctica diaria de bienestar</li>
      </ul>
      
      <h4>Beneficios:</h4>
      <ul>
        <li>Reducción inmediata de ansiedad</li>
        <li>Mejora la calidad del sueño</li>
        <li>Aumenta la sensación de calma</li>
        <li>Reduce la frecuencia cardíaca</li>
      </ul>
      
      <p><strong>💡 Tip:</strong> Practica 2 veces al día durante una semana para obtener mejores resultados.</p>
    `,
    categoria: 'tecnicas',
    profesion: TipoProfesion.PSICOLOGIA,
    etiquetas: ['respiracion', 'ansiedad', 'estres', 'relajacion', 'mindfulness'],
    esContenidoPrecargado: true,
  },
  {
    titulo: 'Registro de Pensamientos Automáticos',
    descripcion: 'Herramienta cognitiva para identificar y cuestionar pensamientos negativos',
    contenido: `
      <h3>Registro de Pensamientos Automáticos (RPA)</h3>
      
      <p>El RPA es una herramienta fundamental de la Terapia Cognitivo-Conductual 
      para identificar patrones de pensamiento que afectan nuestro estado emocional.</p>
      
      <h4>Columnas del registro:</h4>
      
      <ol>
        <li><strong>Situación:</strong> ¿Qué estaba pasando?</li>
        <li><strong>Emoción:</strong> ¿Qué sentí? (tristeza, ansiedad, enojo...)</li>
        <li><strong>Intensidad:</strong> Del 0 al 100%</li>
        <li><strong>Pensamiento automático:</strong> ¿Qué pensé en ese momento?</li>
        <li><strong>Evidencia a favor:</strong> ¿Qué apoya este pensamiento?</li>
        <li><strong>Evidencia en contra:</strong> ¿Qué lo contradice?</li>
        <li><strong>Pensamiento alternativo:</strong> Pensamiento más equilibrado</li>
        <li><strong>Nueva emoción:</strong> ¿Cómo me siento ahora? (0-100%)</li>
      </ol>
      
      <h4>Ejemplo:</h4>
      <ul>
        <li><strong>Situación:</strong> No me respondió el mensaje</li>
        <li><strong>Emoción:</strong> Ansiedad (80%)</li>
        <li><strong>Pensamiento:</strong> "Me está ignorando, está enojado conmigo"</li>
        <li><strong>Alternativo:</strong> "Puede estar ocupado, le escribiré mañana"</li>
        <li><strong>Nueva emoción:</strong> Ansiedad (40%)</li>
      </ul>
      
      <p><strong>📝 Tarea:</strong> Completa el registro diariamente durante 2 semanas.</p>
    `,
    categoria: 'herramientas',
    profesion: TipoProfesion.PSICOLOGIA,
    etiquetas: ['pensamientos', 'cognitivo', 'tcc', 'registro', 'emociones'],
    esContenidoPrecargado: true,
  },
  {
    titulo: 'Higiene del Sueño',
    descripcion: 'Recomendaciones para mejorar la calidad del sueño',
    contenido: `
      <h3>Guía de Higiene del Sueño</h3>
      
      <h4>Antes de Dormir (1-2 horas):</h4>
      <ul>
        <li>❌ Evita pantallas (celular, TV, computadora)</li>
        <li>❌ No consumir cafeína después de las 4 PM</li>
        <li>❌ Evita comidas pesadas</li>
        <li>✅ Crea una rutina relajante (lectura, música suave)</li>
        <li>✅ Baño o ducha tibia</li>
        <li>✅ Escribe preocupaciones en papel (para dejarlas ir)</li>
      </ul>
      
      <h4>Ambiente Ideal:</h4>
      <ul>
        <li>🌡️ Temperatura fresca (18-20°C)</li>
        <li>🌙 Oscuridad completa (cortinas blackout)</li>
        <li>🔇 Silencio o ruido blanco</li>
        <li>🛏️ Cama solo para dormir (no trabajo ni TV)</li>
      </ul>
      
      <h4>Horarios Consistentes:</h4>
      <ul>
        <li>Acostarse y levantarse a la misma hora (incluso fines de semana)</li>
        <li>Si no logras dormir en 20 min, levántate y realiza actividad tranquila</li>
        <li>Evita siestas largas (máximo 20-30 min antes de las 3 PM)</li>
      </ul>
      
      <h4>Durante el Día:</h4>
      <ul>
        <li>☀️ Exposición a luz natural por la mañana</li>
        <li>🏃 Ejercicio regular (no cerca de la hora de dormir)</li>
        <li>🧘 Práctica de relajación o meditación</li>
      </ul>
      
      <p><strong>Recuerda:</strong> Los cambios toman tiempo. Sé constante por al menos 2-3 semanas.</p>
    `,
    categoria: 'psicoeducacion',
    profesion: TipoProfesion.PSICOLOGIA,
    etiquetas: ['sueño', 'insomnio', 'descanso', 'higiene', 'habitos'],
    esContenidoPrecargado: true,
  },
  {
    titulo: 'Técnica de Grounding 5-4-3-2-1',
    descripcion: 'Ejercicio de atención plena para crisis de ansiedad o pánico',
    contenido: `
      <h3>Grounding 5-4-3-2-1</h3>
      
      <p><strong>¿Para qué sirve?</strong><br>
      Esta técnica te ayuda a "volver al presente" durante momentos de ansiedad intensa, 
      ataques de pánico o disociación.</p>
      
      <h4>Paso a paso:</h4>
      
      <p><strong>5 cosas que PUEDES VER</strong><br>
      Mira a tu alrededor y nombra 5 cosas que puedes ver ahora mismo.<br>
      Ejemplo: "Veo una silla azul, un cuadro, mi reloj, una planta, la ventana"</p>
      
      <p><strong>4 cosas que PUEDES TOCAR</strong><br>
      Identifica 4 texturas o sensaciones táctiles.<br>
      Ejemplo: "Siento la suavidad de mi ropa, la dureza de la silla, el frío del celular, 
      la textura de mi cabello"</p>
      
      <p><strong>3 cosas que PUEDES OÍR</strong><br>
      Escucha con atención 3 sonidos.<br>
      Ejemplo: "Oigo el tráfico afuera, el zumbido del refrigerador, mi respiración"</p>
      
      <p><strong>2 cosas que PUEDES OLER</strong><br>
      Identifica 2 aromas.<br>
      Ejemplo: "Huelo mi perfume, el aroma del café"</p>
      
      <p><strong>1 cosa que PUEDES SABOREAR</strong><br>
      Nota un sabor en tu boca.<br>
      Ejemplo: "Saboreo el café que tomé hace rato"</p>
      
      <h4>Tips:</h4>
      <ul>
        <li>Hazlo lentamente, con atención plena</li>
        <li>Di las cosas en voz alta si es posible</li>
        <li>No importa si repites alguna cosa</li>
        <li>Respira profundo entre cada sentido</li>
      </ul>
    `,
    categoria: 'tecnicas',
    profesion: TipoProfesion.PSICOLOGIA,
    etiquetas: ['grounding', 'ansiedad', 'panico', 'presente', 'mindfulness'],
    esContenidoPrecargado: true,
  },
];

// ============================================================================
// MANICURISTA - CUIDADOS Y RECOMENDACIONES
// ============================================================================

export const contenidosManicurista: Omit<RecursoBiblioteca, 'id' | 'fechaCreacion' | 'fechaActualizacion'>[] = [
  {
    titulo: 'Cuidados Post-Manicure',
    descripcion: 'Instrucciones para mantener las uñas hermosas por más tiempo',
    contenido: `
      <h3>Cuidados Después de tu Manicure</h3>
      
      <h4>Primeras 24 horas:</h4>
      <ul>
        <li>❌ Evita agua caliente (ducha, lavaplatos)</li>
        <li>❌ No uses guantes ajustados</li>
        <li>✅ Deja secar completamente el esmalte (al menos 2 horas)</li>
        <li>✅ Evita actividades que puedan golpear las uñas</li>
      </ul>
      
      <h4>Cuidado Diario:</h4>
      <ul>
        <li>🧴 Aplica aceite de cutícula cada noche</li>
        <li>🧤 Usa guantes para lavar platos y limpiar</li>
        <li>💧 Mantén tus manos hidratadas (crema varias veces al día)</li>
        <li>✋ Evita usar las uñas como herramientas</li>
      </ul>
      
      <h4>Para Manicure en Gel:</h4>
      <ul>
        <li>No retires el gel tu misma (puede dañar la uña natural)</li>
        <li>Si se levanta un borde, cubre con esmalte transparente y agenda cita</li>
        <li>Regresa cada 3-4 semanas para mantenimiento</li>
      </ul>
      
      <h4>Para Manicure Tradicional:</h4>
      <ul>
        <li>Aplica capa de top coat cada 2-3 días</li>
        <li>Lima suavemente si hay un despunte</li>
        <li>Reprograma cada 7-10 días</li>
      </ul>
      
      <p><strong>💅 Consejo:</strong> Una buena hidratación es la clave para manos y uñas hermosas!</p>
    `,
    categoria: 'cuidados',
    profesion: TipoProfesion.NUTRICION,
    etiquetas: ['manicure', 'cuidados', 'esmalte', 'uñas', 'mantenimiento'],
    esContenidoPrecargado: true,
  },
  {
    titulo: 'Fortalecimiento de Uñas Débiles',
    descripcion: 'Tratamiento casero para uñas quebradizas',
    contenido: `
      <h3>Fortalece tus Uñas en Casa</h3>
      
      <h4>Tratamiento Intensivo (2-4 semanas):</h4>
      
      <p><strong>1. Baño de Aceite de Oliva</strong></p>
      <ul>
        <li>Calienta aceite de oliva (tibio, no caliente)</li>
        <li>Sumerge las uñas 10-15 minutos</li>
        <li>Realiza 3 veces por semana</li>
      </ul>
      
      <p><strong>2. Mascarilla de Aguacate</strong></p>
      <ul>
        <li>Machaca medio aguacate maduro</li>
        <li>Mezcla con 1 cucharada de aceite de coco</li>
        <li>Aplica en uñas y cutículas</li>
        <li>Deja 20 minutos y enjuaga</li>
        <li>1-2 veces por semana</li>
      </ul>
      
      <p><strong>3. Vitaminas Esenciales</strong></p>
      <ul>
        <li>Biotina (vitamina B7) - suplemento diario</li>
        <li>Vitamina E - aplicación tópica</li>
        <li>Alimentación rica en proteínas</li>
      </ul>
      
      <h4>Qué Evitar:</h4>
      <ul>
        <li>❌ Acetona pura (usa removedor sin acetona)</li>
        <li>❌ Uñas artificiales por periodos prolongados</li>
        <li>❌ Lima metálica (usa lima de vidrio o cartón)</li>
        <li>❌ Cortar cutículas (solo empujarlas suavemente)</li>
      </ul>
      
      <h4>Hábitos Saludables:</h4>
      <ul>
        <li>✅ Mantén las uñas cortas mientras se fortalecen</li>
        <li>✅ Lima en una sola dirección</li>
        <li>✅ Usa base coat fortalecedora</li>
        <li>✅ Hidrata cutículas diariamente</li>
      </ul>
      
      <p><strong>Resultados:</strong> Deberías ver mejora en 3-4 semanas de tratamiento constante.</p>
    `,
    categoria: 'tratamientos',
    profesion: TipoProfesion.NUTRICION,
    etiquetas: ['uñas', 'fortalecimiento', 'quebradizas', 'tratamiento', 'casero'],
    esContenidoPrecargado: true,
  },
  {
    titulo: 'Guía de Formas de Uñas',
    descripcion: 'Cómo elegir la forma ideal según tu mano',
    contenido: `
      <h3>Formas de Uñas y Cómo Elegir</h3>
      
      <h4>1. Cuadrada</h4>
      <p><strong>Descripción:</strong> Bordes rectos, esquinas de 90 grados<br>
      <strong>Ideal para:</strong> Dedos largos y delgados, uñas anchas<br>
      <strong>Estilo:</strong> Clásico, elegante, formal</p>
      
      <h4>2. Cuadrada Redondeada (Squoval)</h4>
      <p><strong>Descripción:</strong> Base cuadrada con esquinas suavizadas<br>
      <strong>Ideal para:</strong> Casi todos los tipos de manos<br>
      <strong>Estilo:</strong> Versátil, moderno, práctico<br>
      <strong>✨ Más popular</strong></p>
      
      <h4>3. Redonda</h4>
      <p><strong>Descripción:</strong> Bordes curvos que siguen la forma natural<br>
      <strong>Ideal para:</strong> Uñas cortas, manos pequeñas<br>
      <strong>Estilo:</strong> Natural, suave, bajo mantenimiento</p>
      
      <h4>4. Ovalada</h4>
      <p><strong>Descripción:</strong> Forma de óvalo alargado<br>
      <strong>Ideal para:</strong> Dedos cortos, manos anchas<br>
      <strong>Estilo:</strong> Femenino, elegante, alarga visualmente los dedos</p>
      
      <h4>5. Almendra (Almond)</h4>
      <p><strong>Descripción:</strong> Punta suave y redondeada<br>
      <strong>Ideal para:</strong> Dedos medianos a largos<br>
      <strong>Estilo:</strong> Sofisticado, femenino, muy popular</p>
      
      <h4>6. Stiletto</h4>
      <p><strong>Descripción:</strong> Punta muy afilada y dramática<br>
      <strong>Ideal para:</strong> Dedos largos, ocasiones especiales<br>
      <strong>Estilo:</strong> Dramático, llamativo, requiere mantenimiento</p>
      
      <h4>7. Coffin/Ballerina</h4>
      <p><strong>Descripción:</strong> Forma de ataúd con punta plana<br>
      <strong>Ideal para:</strong> Uñas largas, dedos delgados<br>
      <strong>Estilo:</strong> Moderno, trendy, fashion forward</p>
      
      <p><strong>💡 Consejo:</strong> Si no estás segura, squoval o almendra son opciones seguras para casi todas!</p>
    `,
    categoria: 'educacion',
    profesion: TipoProfesion.NUTRICION,
    etiquetas: ['formas', 'uñas', 'estilos', 'guia', 'diseño'],
    esContenidoPrecargado: true,
  },
  {
    titulo: 'Cuidado de Cutículas',
    descripcion: 'Técnicas seguras para mantener cutículas saludables',
    contenido: `
      <h3>Cuidado Profesional de Cutículas</h3>
      
      <p><strong>¿Qué son las cutículas?</strong><br>
      Son la capa de piel que protege la matriz de la uña (donde crece la uña). 
      Su función es proteger contra bacterias e infecciones.</p>
      
      <h4>Cuidado Diario:</h4>
      <ul>
        <li>🧴 Aplica aceite de cutícula cada noche</li>
        <li>💆 Masajea suavemente para mejorar circulación</li>
        <li>💧 Mantén hidratadas (crema de manos)</li>
        <li>🚫 NO las muerdas ni arranques</li>
      </ul>
      
      <h4>Tratamiento Semanal:</h4>
      <ol>
        <li>Remoja las manos en agua tibia 3-5 minutos</li>
        <li>Aplica ablandador de cutículas</li>
        <li>Espera 30-60 segundos</li>
        <li>Con palito de naranjo, empuja suavemente hacia atrás</li>
        <li>Limpia exceso con toalla húmeda</li>
        <li>Aplica aceite nutritivo</li>
      </ol>
      
      <h4>Qué NO Hacer:</h4>
      <ul>
        <li>❌ Cortar las cutículas (aumenta riesgo de infección)</li>
        <li>❌ Empujar en seco (puede romperlas)</li>
        <li>❌ Usar tijeras o cortauñas para cutículas</li>
        <li>❌ Aplicar productos muy agresivos</li>
      </ul>
      
      <h4>Aceites Recomendados:</h4>
      <ul>
        <li>🥥 Aceite de coco</li>
        <li>🫒 Aceite de oliva</li>
        <li>🌺 Aceite de jojoba</li>
        <li>🌸 Aceite de rosa mosqueta</li>
        <li>🥑 Aceite de aguacate</li>
      </ul>
      
      <p><strong>⚠️ Señales de alerta:</strong> Enrojecimiento, hinchazón, pus o dolor indican posible infección. Consulta a un dermatólogo.</p>
    `,
    categoria: 'cuidados',
    profesion: TipoProfesion.NUTRICION,
    etiquetas: ['cuticulas', 'cuidados', 'salud', 'uñas', 'hidratacion'],
    esContenidoPrecargado: true,
  },
];

// ============================================================================
// FUNCIÓN PARA CARGAR CONTENIDOS
// ============================================================================

export const obtenerContenidosPorProfesion = (profesion: typeof TipoProfesion[keyof typeof TipoProfesion]) => {
  switch (profesion) {
    case TipoProfesion.FISIOTERAPIA:
      return contenidosFisioterapia;
    case TipoProfesion.PSICOLOGIA:
      return contenidosPsicologia;
    case TipoProfesion.NUTRICION:
      return contenidosManicurista; // TODO: Cambiar a contenidosNutricion cuando estén listos
    default:
      return [];
  }
};

export const obtenerTodosLosContenidos = () => {
  return [
    ...contenidosFisioterapia,
    ...contenidosPsicologia,
    ...contenidosManicurista,
  ];
};
