import { Topic } from './types';

export const SYSTEM_INSTRUCTION = `
Eres un mentor experto en programación web especializado en Laravel 12 y PHP moderno (8.2+). 
Tu objetivo es guiar al usuario desde un nivel principiante (cero) hasta convertirse en un experto (arquitecto de software).
El idioma de interacción es ESPAÑOL.

Pautas de comportamiento:
1.  **Pedagogía:** Explica los conceptos de forma clara, concisa y progresiva. Usa analogías cuando sea útil.
2.  **Laravel 12:** Asegúrate de que todo el código y las recomendaciones sean específicos para Laravel 12 (uso de Pest para testing, Vite, nuevos helpers, estructura de carpetas actual).
3.  **Buenas Prácticas:** Fomenta principios SOLID, Clean Code, Inyección de Dependencias y Patrones de Diseño.
4.  **Multimodal:** Si el usuario sube una imagen de código, diagramas de base de datos o errores, analízala detalladamente y ofrece soluciones o explicaciones.
5.  **Formato:** Usa Markdown para formatear tu respuesta. Los bloques de código deben especificar el lenguaje (ej. \`\`\`php).
6.  **Tono:** Profesional, motivador y paciente.

Si el usuario activa el modo "Thinking" (Pensamiento Profundo), profundiza en la arquitectura, pros/contras y razonamiento detrás de las soluciones.
`;

export const TOPICS: Topic[] = [
  {
    id: 'intro',
    title: 'Introducción a Laravel 12',
    description: 'Instalación, estructura de carpetas y ciclo de vida.',
    level: 'beginner',
    prompt: 'Hola, quiero aprender Laravel 12 desde cero. ¿Cómo lo instalo y cuál es la estructura básica del proyecto?'
  },
  {
    id: 'routing',
    title: 'Rutas y Controladores',
    description: 'Definición de rutas, verbos HTTP y lógica en controladores.',
    level: 'beginner',
    prompt: 'Enséñame cómo funcionan las rutas en web.php y cómo crear un controlador básico en Laravel 12.'
  },
  {
    id: 'blade',
    title: 'Vistas con Blade',
    description: 'Plantillas, herencia, componentes y directivas.',
    level: 'beginner',
    prompt: '¿Cómo funciona el motor de plantillas Blade? Explícame layouts y componentes.'
  },
  {
    id: 'database',
    title: 'Base de Datos y Migraciones',
    description: 'Configuración, migraciones, seeders y factories.',
    level: 'intermediate',
    prompt: 'Quiero diseñar una base de datos. Explícame las migraciones y cómo usar seeders.'
  },
  {
    id: 'eloquent',
    title: 'Eloquent ORM',
    description: 'Modelos, relaciones, scopes y accesores.',
    level: 'intermediate',
    prompt: 'Enséñame a usar Eloquent ORM para consultas y relaciones entre modelos.'
  },
  {
    id: 'auth',
    title: 'Autenticación y Seguridad',
    description: 'Laravel Breeze/Jetstream, Gates y Policies.',
    level: 'intermediate',
    prompt: '¿Cómo manejo el registro y login de usuarios? ¿Qué son los Policies?'
  },
  {
    id: 'api',
    title: 'Desarrollo de APIs',
    description: 'API Resources, Sanctum y respuestas JSON.',
    level: 'expert',
    prompt: 'Quiero construir una API RESTful. Explícame API Resources y Laravel Sanctum.'
  },
  {
    id: 'testing',
    title: 'Testing con Pest',
    description: 'Pruebas unitarias y de características (Feature tests).',
    level: 'expert',
    prompt: '¿Cómo escribo tests automatizados usando Pest en Laravel 12?'
  },
  {
    id: 'deployment',
    title: 'Despliegue y CI/CD',
    description: 'Optimización, Laravel Forge, Docker y GitHub Actions.',
    level: 'expert',
    prompt: '¿Cuáles son los pasos para desplegar una aplicación Laravel 12 en producción de forma segura?'
  }
];
