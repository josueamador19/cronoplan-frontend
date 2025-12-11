// src/constants/modalData.js

export const taskDetail = {
  id: 1,
  title: 'Optimizar flujo de onboarding',
  board: 'Producto',
  boardIcon: '🏷️',
  status: 'En Progreso',
  statusColor: '#FAAD14',
  priority: 'Alta',
  description: `El flujo actual de onboarding tiene una tasa de abandono del 65% en el segundo paso.
Necesitamos simplificar el formulario de registro y añadir opciones de "Social Login".

Requerimientos clave:
• Integrar Google y Apple Sign-in.
• Reducir campos obligatorios.
• Añadir barra de progreso visual.`,
  dueDate: '2023-10-12',
  dueDateFormatted: '12 Oct, 2023',
  daysLeft: 2,
  reminder: '1 día antes',
  assignee: {
    name: 'Carlos M.',
    avatar: 'https://i.pravatar.cc/150?img=5'
  },
  subtasks: [
    { 
      id: 1, 
      text: 'Analizar métricas de Mixpanel', 
      completed: true, 
      assignee: { name: 'Ana R.', avatar: 'https://i.pravatar.cc/150?img=6' }
    },
    { 
      id: 2, 
      text: 'Wireframes de baja fidelidad', 
      completed: true, 
      assignee: { name: 'Pedro S.', avatar: 'https://i.pravatar.cc/150?img=7' }
    },
    { 
      id: 3, 
      text: 'Diseño UI en Figma', 
      completed: false, 
      assignee: null 
    },
    { 
      id: 4, 
      text: 'Prototipado y pruebas de usuario', 
      completed: false, 
      assignee: null 
    }
  ],
  labels: [
    { id: 1, name: 'UX Design', color: '#9254DE', icon: '🎨' },
    { id: 2, name: 'Mobile', color: '#1890FF', icon: '📱' },
    { id: 3, name: 'Q4 Goals', color: '#FF4D4F', icon: '🎯' }
  ],
  attachments: [
    { 
      id: 1, 
      name: 'specs_v1.pdf', 
      type: 'pdf', 
      size: '2.3 MB', 
      uploadedAt: 'Ayer a las 14:30',
      icon: '📄'
    }
  ],
  activity: [
    {
      id: 1,
      user: { name: 'Carlos M.', avatar: 'https://i.pravatar.cc/150?img=5' },
      action: 'cambió el estado a',
      detail: 'En Progreso',
      timestamp: 'Hace 2 horas',
      type: 'status_change'
    },
    {
      id: 2,
      user: { name: 'Ana R.', avatar: 'https://i.pravatar.cc/150?img=8' },
      action: 'subió un archivo',
      attachment: { name: 'specs_v1.pdf', icon: '📄' },
      timestamp: 'Ayer a las 14:30',
      type: 'file_upload'
    },
    {
      id: 3,
      user: { name: 'Sistema', avatar: null },
      action: 'creó un recordatorio',
      detail: '10 Oct, 10:00 AM',
      timestamp: '10 Oct, 10:00 AM',
      type: 'reminder'
    },
    {
      id: 4,
      user: { name: 'Carlos M.', avatar: 'https://i.pravatar.cc/150?img=5' },
      action: 'creó la tarea',
      timestamp: '10 Oct, 09:45 AM',
      type: 'created'
    }
  ]
};

export const priorityOptions = [
  { value: 'Alta', label: 'Alta', icon: '🔴', color: '#FF4D4F' },
  { value: 'Media', label: 'Media', icon: '🟡', color: '#FFA940' },
  { value: 'Baja', label: 'Baja', icon: '🔵', color: '#1890FF' }
];

export const reminderOptions = [
  '15 minutos antes',
  '30 minutos antes',
  '1 hora antes',
  '1 día antes',
  '2 días antes',
  '1 semana antes'
];