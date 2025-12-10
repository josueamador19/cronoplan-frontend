// src/constants/dashboardData.js

export const menuItems = [
  { id: 'inicio', name: 'Inicio', icon: '🏠', path: '/dashboard' },
  { id: 'actividades', name: 'Mis Actividades', icon: '📋', path: '/dashboard/tasks' },
  { id: 'tableros', name: 'Mis Tableros', icon: '📊', path: '/dashboard/boards' },
  { id: 'calendario', name: 'Calendario', icon: '📅', path: '/dashboard/calendar' },
  { id: 'recordatorios', name: 'Recordatorios', icon: '🕐', path: '/dashboard/reminders' }
];

export const boards = [
  { id: 1, name: 'Lanzamiento Web', color: '#52C41A', icon: '🌐' },
  { id: 2, name: 'Marketing Q3', color: '#FAAD14', icon: '📊' },
  { id: 3, name: 'Diseño UI/UX', color: '#9254DE', icon: '🎨' },
  { id: 4, name: 'Desarrollo App', color: '#1890FF', icon: '💻' }
];

export const tasks = [
  {
    id: 1,
    title: 'Rediseñar Landing Page',
    status: 'Diseño',
    statusColor: '#9254DE',
    priority: 'Alta',
    dueDate: '12 Oct, 2023',
    board: 'Diseño UI/UX',
    boardId: 3,
    column: 'todo',
    completed: false,
    assignee: { name: 'Juan Pérez', avatar: 'https://i.pravatar.cc/150?img=1' }
  },
  {
    id: 2,
    title: 'Entrevista con Usuarios',
    status: 'Research',
    statusColor: '#52C41A',
    priority: 'Media',
    dueDate: '14 Oct, 2023',
    board: 'Lanzamiento Web',
    boardId: 1,
    column: 'progress',
    completed: false,
    assignee: { name: 'María López', avatar: 'https://i.pravatar.cc/150?img=2' }
  },
  {
    id: 3,
    title: 'Configurar Analytics',
    status: 'Docs',
    statusColor: '#1890FF',
    priority: 'Baja',
    dueDate: 'Ayer',
    board: 'Marketing Q3',
    boardId: 2,
    column: 'todo',
    completed: false,
    assignee: { name: 'Carlos Ruiz', avatar: 'https://i.pravatar.cc/150?img=3' }
  },
  {
    id: 4,
    title: 'Actualizar Documentación',
    status: 'Docs',
    statusColor: '#1890FF',
    priority: 'Baja',
    dueDate: '20 Oct, 2023',
    board: 'Desarrollo App',
    boardId: 4,
    column: 'todo',
    completed: false,
    assignee: { name: 'Ana García', avatar: 'https://i.pravatar.cc/150?img=4' }
  },
  {
    id: 5,
    title: 'Definir KPIs de campaña',
    status: 'Estrategia',
    statusColor: '#FF4D4F',
    priority: 'Alta',
    dueDate: '24 Oct, 2023',
    board: 'Marketing Q3',
    boardId: 2,
    column: 'todo',
    completed: false,
    assignee: { name: 'Laura Martín', avatar: 'https://i.pravatar.cc/150?img=5' }
  },
  {
    id: 6,
    title: 'Briefing para influencers',
    status: 'Social',
    statusColor: '#FAAD14',
    priority: 'Media',
    dueDate: '28 Oct, 2023',
    board: 'Marketing Q3',
    boardId: 2,
    column: 'todo',
    completed: false,
    assignee: { name: 'Pedro Sánchez', avatar: 'https://i.pravatar.cc/150?img=6' }
  },
  {
    id: 7,
    title: 'Diseño de actividades',
    status: 'Diseño',
    statusColor: '#9254DE',
    priority: 'Media',
    dueDate: '8 Nov, 2023',
    board: 'Marketing Q3',
    boardId: 2,
    column: 'progress',
    completed: false,
    assignee: { name: 'Sofía Torres', avatar: 'https://i.pravatar.cc/150?img=7' }
  },
  {
    id: 8,
    title: 'Copywriting para emails',
    status: 'Email',
    statusColor: '#1890FF',
    priority: 'Media',
    dueDate: '18 Oct, 2023',
    board: 'Marketing Q3',
    boardId: 2,
    column: 'progress',
    completed: false,
    assignee: { name: 'Diego Rojas', avatar: 'https://i.pravatar.cc/150?img=8' }
  },
  {
    id: 9,
    title: 'Revisión de presupuesto ads',
    status: 'Finanzas',
    statusColor: '#52C41A',
    priority: 'Baja',
    dueDate: '30 Oct, 2023',
    board: 'Marketing Q3',
    boardId: 2,
    column: 'todo',
    completed: false,
    assignee: { name: 'Elena Vega', avatar: 'https://i.pravatar.cc/150?img=9' }
  },
  {
    id: 10,
    title: 'Setup de herramientas',
    status: 'Admin',
    statusColor: '#722ED1',
    priority: 'Media',
    dueDate: '10 Oct, 2023',
    board: 'Marketing Q3',
    boardId: 2,
    column: 'done',
    completed: true,
    assignee: { name: 'Miguel Ángel', avatar: 'https://i.pravatar.cc/150?img=10' }
  }
];

export const kanbanColumns = [
  { id: 'todo', title: 'Por hacer', count: 3 },
  { id: 'progress', title: 'En progreso', count: 2 },
  { id: 'done', title: 'Completado', count: 5 }
];

export const priorityColors = {
  'Alta': { bg: '#FFF1F0', text: '#FF4D4F', icon: '🔴' },
  'Media': { bg: '#FFF7E6', text: '#FFA940', icon: '🟡' },
  'Baja': { bg: '#E6F7FF', text: '#1890FF', icon: '🔵' }
};