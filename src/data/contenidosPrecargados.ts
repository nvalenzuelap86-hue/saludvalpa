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
// NUTRICIÓN - CONTENIDO DE ALIMENTACIÓN Y NUTRICIÓN
// ============================================================================

export const contenidosNutricion: Omit<RecursoBiblioteca, 'id' | 'fechaCreacion' | 'fechaActualizacion'>[] = [
  {
    titulo: 'Guía de Alimentación Balanceada',
    descripcion: 'Principios básicos para una alimentación equilibrada',
    contenido: `
      <h3>Alimentación Balanceada: Guía Completa</h3>
      
      <h4>¿Qué es una alimentación balanceada?</h4>
      <p>Es aquella que proporciona todos los nutrientes esenciales en las cantidades adecuadas para mantener la salud, prevenir enfermedades y promover el bienestar general.</p>
      
      <h4>Grupos de Alimentos Esenciales:</h4>
      <ul>
        <li>🥩 <strong>Proteínas:</strong> Carnes magras, pescado, huevos, legumbres, tofu</li>
        <li>🌾 <strong>Carbohidratos complejos:</strong> Cereales integrales, avena, quinoa, arroz integral</li>
        <li>🥑 <strong>Grasas saludables:</strong> Aguacate, nueces, aceite de oliva, pescados grasos</li>
        <li>🥦 <strong>Vitaminas y minerales:</strong> Frutas y verduras de todos los colores</li>
        <li>🥛 <strong>Calcio:</strong> Lácteos, leches vegetales fortificadas, brócoli</li>
      </ul>
      
      <h4>Distribución Recomendada del Plato:</h4>
      <ul>
        <li>½ plato: Verduras y frutas</li>
        <li>¼ plato: Proteínas magras</li>
        <li>¼ plato: Carbohidratos complejos</li>
      </ul>
      
      <h4>Consejos Prácticos:</h4>
      <ul>
        <li>✅ Come 5 porciones de frutas y verduras al día</li>
        <li>✅ Elige granos integrales sobre refinados</li>
        <li>✅ Limita azúcares añadidos y alimentos procesados</li>
        <li>✅ Bebe 2-3 litros de agua al día</li>
        <li>✅ Cocina en casa siempre que sea posible</li>
      </ul>
    `,
    categoria: 'educacion',
    profesion: TipoProfesion.NUTRICION,
    etiquetas: ['nutricion', 'alimentacion', 'balance', 'guia', 'salud'],
    esContenidoPrecargado: true,
  },
  {
    titulo: 'Plan de Alimentación para Pérdida de Peso',
    descripcion: 'Estrategias nutricionales para pérdida de peso saludable',
    contenido: `
      <h3>Pérdida de Peso Saludable</h3>
      
      <h4>Principios Fundamentales:</h4>
      <ul>
        <li>Déficit calórico moderado (300-500 kcal menos del gasto basal)</li>
        <li>Alta densidad nutricional en cada comida</li>
        <li>Proteínas adecuadas para preservar masa muscular</li>
        <li>Fibra para saciedad y salud digestiva</li>
      </ul>
      
      <h4>Alimentos Recomendados:</h4>
      <ul>
        <li>🥬 Verduras de hoja verde (espinacas, kale, lechuga)</li>
        <li>🍗 Proteínas magras (pollo, pavo, pescado, claras de huevo)</li>
        <li>🫘 Legumbres (lentejas, garbanzos, frijoles)</li>
        <li>🍎 Frutas bajas en azúcar (berries, manzana, toronja)</li>
        <li>🥑 Grasas saludables en porciones controladas</li>
      </ul>
      
      <h4>Alimentos a Limitar:</h4>
      <ul>
        <li>❌ Azúcares refinados y bebidas azucaradas</li>
        <li>❌ Harinas refinadas (pan blanco, pasta regular)</li>
        <li>❌ Alimentos fritos y ultraprocesados</li>
        <li>❌ Alcohol</li>
      </ul>
      
      <h4>Ejemplo de Menú Diario (1500 kcal):</h4>
      <p><strong>Desayuno:</strong> Omelette de claras con espinacas<br>
      <strong>Colación:</strong> Manzana con 6 almendras<br>
      <strong>Comida:</strong> Pechuga de pollo con verduras salteadas y quinoa<br>
      <strong>Colación:</strong> Yogurt griego natural<br>
      <strong>Cena:</strong> Ensalada de atún con verduras mixtas</p>
    `,
    categoria: 'planes',
    profesion: TipoProfesion.NUTRICION,
    etiquetas: ['perdida_peso', 'dieta', 'calorias', 'saludable'],
    esContenidoPrecargado: true,
  },
  {
    titulo: 'Nutrición para Diabéticos',
    descripcion: 'Guía de alimentación para control de diabetes tipo 2',
    contenido: `
      <h3>Alimentación para Control de Diabetes</h3>
      
      <h4>Principios Clave:</h4>
      <ul>
        <li>Control de porciones de carbohidratos</li>
        <li>Elegir carbohidratos de bajo índice glucémico</li>
        <li>Distribuir carbohidratos uniformemente en el día</li>
        <li>No saltar comidas</li>
      </ul>
      
      <h4>Alimentos con Bajo Índice Glucémico:</h4>
      <ul>
        <li>🌾 Avena integral, quinoa, cebada</li>
        <li>🫘 Legumbres (lentejas, garbanzos, frijoles)</li>
        <li>🥦 Verduras no almidonosas</li>
        <li>🍎 Frutas como manzana, pera, toronja, berries</li>
        <li>🥜 Nueces y semillas</li>
      </ul>
      
      <h4>Alimentos a Evitar:</h4>
      <ul>
        <li>❌ Azúcares simples (refrescos, jugos, dulces)</li>
        <li>❌ Pan blanco, arroz blanco, pasta regular</li>
        <li>❌ Papas fritas y botanas procesadas</li>
        <li>❌ Frutas en almíbar</li>
      </ul>
      
      <h4>Recomendaciones Especiales:</h4>
      <ul>
        <li>✅ Monitorear porciones con el método del plato</li>
        <li>✅ Incluir fibra en cada comida (mínimo 25-30g/día)</li>
        <li>✅ Combinar carbohidratos con proteína y grasa saludable</li>
        <li>✅ Realizar actividad física regular</li>
        <li>✅ Mantener horarios regulares de comida</li>
      </ul>
    `,
    categoria: 'condiciones',
    profesion: TipoProfesion.NUTRICION,
    etiquetas: ['diabetes', 'glucosa', 'indice_glucemico', 'control'],
    esContenidoPrecargado: true,
  },
  {
    titulo: 'Suplementación Deportiva: Guía Básica',
    descripcion: 'Suplementos nutricionales para rendimiento deportivo',
    contenido: `
      <h3>Guía de Suplementación Deportiva</h3>
      
      <h4>Suplementos con Evidencia Científica:</h4>
      
      <p><strong>1. Proteína de Suero (Whey)</strong><br>
      Beneficio: Recuperación muscular, síntesis de proteína<br>
      Dosis: 20-30g post-entreno<br>
      Momento: Dentro de 30-60 minutos después del ejercicio</p>
      
      <p><strong>2. Creatina Monohidratada</strong><br>
      Beneficio: Fuerza, potencia, rendimiento anaeróbico<br>
      Dosis: 3-5g diarios<br>
      Ciclo: Uso continuo sin necesidad de ciclar</p>
      
      <p><strong>3. Cafeína</strong><br>
      Beneficio: Energía, concentración, rendimiento aeróbico<br>
      Dosis: 1-3 mg/kg de peso corporal<br>
      Momento: 30-60 minutos antes del ejercicio</p>
      
      <p><strong>4. Omega-3</strong><br>
      Beneficio: Antiinflamatorio, salud cardiovascular<br>
      Dosis: 1-2g diarios de EPA/DHA</p>
      
      <h4>Precauciones:</h4>
      <ul>
        <li>⚠️ Consultar con profesional de la salud antes de iniciar</li>
        <li>⚠️ Los suplementos NO reemplazan una alimentación balanceada</li>
        <li>⚠️ Verificar calidad y certificación de los productos</li>
        <li>⚠️ Respetar dosis recomendadas</li>
      </ul>
    `,
    categoria: 'deporte',
    profesion: TipoProfesion.NUTRICION,
    etiquetas: ['suplementos', 'deporte', 'rendimiento', 'proteina', 'creatina'],
    esContenidoPrecargado: true,
  },
  {
    titulo: 'Alimentación para Ganancia Muscular',
    descripcion: 'Estrategias nutricionales para hipertrofia muscular',
    contenido: `
      <h3>Nutrición para Ganar Masa Muscular</h3>
      
      <h4>Principios Nutricionales:</h4>
      <ul>
        <li>Superávit calórico moderado (200-400 kcal sobre gasto basal)</li>
        <li>Proteína: 1.6-2.2 g/kg de peso corporal</li>
        <li>Carbohidratos adecuados para rendimiento en entrenamiento</li>
        <li>Grasas saludables para función hormonal</li>
      </ul>
      
      <h4>Alimentos Clave:</h4>
      <ul>
        <li>🥩 Carnes magras (pollo, res, pavo)</li>
        <li>🥚 Huevos (fuente completa de proteína)</li>
        <li>🐟 Pescados grasos (salmón, atún, sardinas)</li>
        <li>🥛 Lácteos (yogurt griego, leche, queso cottage)</li>
        <li>🫘 Legumbres y quinoa (proteína vegetal)</li>
        <li>🥜 Mantequilla de cacahuate, almendras, nueces</li>
      </ul>
      
      <h4>Distribución de Comidas:</h4>
      <ul>
        <li>Comer cada 3-4 horas (5-6 comidas al día)</li>
        <li>Incluir proteína en cada comida</li>
        <li>Comida pre-entreno: carbohidratos + proteína (1-2h antes)</li>
        <li>Comida post-entreno: proteína + carbohidratos (dentro de 2h)</li>
      </ul>
    `,
    categoria: 'deporte',
    profesion: TipoProfesion.NUTRICION,
    etiquetas: ['musculo', 'hipertrofia', 'proteina', 'entreno', 'volumen'],
    esContenidoPrecargado: true,
  },
  {
    titulo: 'Alimentos Ricos en Hierro para Combatir la Anemia',
    descripcion: 'Guía de alimentos para prevenir y tratar la anemia ferropénica',
    contenido: `
      <h3>Alimentos Ricos en Hierro</h3>
      
      <h4>Hierro Hemo (Alta Absorción):</h4>
      <ul>
        <li>🥩 Carne roja magra (res, cordero)</li>
        <li>🐟 Pescados (sardinas, atún, salmón)</li>
        <li>🍗 Aves (pollo, pavo - especialmente pierna y muslo)</li>
        <li>🫘 Mariscos (almejas, mejillones, ostras)</li>
      </ul>
      
      <h4>Hierro No Hemo (Vegetal):</h4>
      <ul>
        <li>🫘 Legumbres (lentejas, garbanzos, frijoles negros)</li>
        <li>🥬 Espinacas y acelgas</li>
        <li>🌾 Cereales fortificados</li>
        <li>🥜 Semillas de calabaza</li>
        <li>🌿 Quinoa</li>
      </ul>
      
      <h4>Consejos para Mejorar la Absorción:</h4>
      <ul>
        <li>✅ Combinar con vitamina C (limón, naranja, pimiento)</li>
        <li>✅ Evitar café/té inmediatamente después de comidas ricas en hierro</li>
        <li>✅ Cocinar en sartenes de hierro fundido</li>
        <li>✅ Remojar legumbres y granos antes de cocinar</li>
      </ul>
    `,
    categoria: 'condiciones',
    profesion: TipoProfesion.NUTRICION,
    etiquetas: ['hierro', 'anemia', 'nutrientes', 'salud'],
    esContenidoPrecargado: true,
  },
  {
    titulo: 'Guía de Hidratación Saludable',
    descripcion: 'Importancia de la hidratación y cómo mantenerla',
    contenido: `
      <h3>Hidratación: La Base de la Salud</h3>
      
      <h4>¿Cuánta Agua Necesitas?</h4>
      <ul>
        <li>Mujeres: ~2.7 litros/día (incluyendo agua de alimentos)</li>
        <li>Hombres: ~3.7 litros/día</li>
        <li>+500ml por hora de ejercicio intenso</li>
        <li>+300ml por cada 30 minutos en clima caluroso</li>
      </ul>
      
      <h4>Señales de Deshidratación:</h4>
      <ul>
        <li>⚠️ Sed intensa</li>
        <li>⚠️ Orina oscura</li>
        <li>⚠️ Fatiga y dolor de cabeza</li>
        <li>⚠️ Mareos al levantarse</li>
        <li>⚠️ Piel seca</li>
      </ul>
      
      <h4>Estrategias para Mantener Hidratación:</h4>
      <ul>
        <li>✅ Llevar botella de agua reutilizable</li>
        <li>✅ Establecer recordatorios cada hora</li>
        <li>✅ Infusiones y aguas de frutas sin azúcar</li>
        <li>✅ Consumir frutas y verduras ricas en agua</li>
        <li>✅ Beber un vaso de agua al despertar</li>
      </ul>
    `,
    categoria: 'educacion',
    profesion: TipoProfesion.NUTRICION,
    etiquetas: ['hidratacion', 'agua', 'salud', 'bienestar'],
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
      return contenidosNutricion;
    default:
      return [];
  }
};

export const obtenerTodosLosContenidos = () => {
  return [
    ...contenidosFisioterapia,
    ...contenidosPsicologia,
    ...contenidosNutricion,
  ];
};
