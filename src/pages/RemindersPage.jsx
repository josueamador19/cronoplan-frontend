// src/pages/RemindersPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import TopBar from '../components/layout/TopBar';
import { 
  getAllReminders, 
  deleteReminder, 
  updateReminder,
  formatDaysUntilDue,
  getDaysColor
} from '../components/services/remindersService';
import { FaBell, FaTrash, FaToggleOn, FaToggleOff, FaPlus } from 'react-icons/fa';

const RemindersPage = () => {
  const navigate = useNavigate();
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadReminders();
  }, []);

  const loadReminders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllReminders();
      setReminders(data);
    } catch (error) {
      console.error('Error al cargar recordatorios:', error);
      
      if (error.response?.status === 401) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        navigate('/login');
      } else {
        setError('Error al cargar los recordatorios');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (reminder) => {
    try {
      await updateReminder(reminder.id, {
        is_active: !reminder.is_active
      });
      await loadReminders();
    } catch (error) {
      console.error('Error al actualizar:', error);
    }
  };

  const handleDelete = async (reminderId) => {
    if (!window.confirm('¿Eliminar este recordatorio?')) return;
    
    try {
      await deleteReminder(reminderId);
      await loadReminders();
    } catch (error) {
      console.error('Error al eliminar:', error);
    }
  };

  const getReminderTypeText = (type, daysBefore) => {
    switch (type) {
      case 'daily':
        return '📅 Diario';
      case 'before_due':
        return `⏰ ${daysBefore} día${daysBefore > 1 ? 's' : ''} antes`;
      case 'on_due':
        return '🔔 Día de vencimiento';
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <DashboardLayout activeItem="recordatorios">
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '400px'
        }}>
          <p>Cargando recordatorios...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout activeItem="recordatorios">
        <div style={{ padding: '40px', textAlign: 'center', color: '#ff4d4f' }}>
          <h3>⚠️ {error}</h3>
          <button 
            onClick={loadReminders}
            style={{
              marginTop: '20px',
              padding: '10px 24px',
              backgroundColor: '#1890ff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Reintentar
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeItem="recordatorios">
      <TopBar 
        title="Recordatorios"
        subtitle="Gestiona tus alertas y notificaciones"
      />

      <div style={{ padding: '20px' }}>
        {/* Resumen */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '32px'
        }}>
          <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}>
            <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#999' }}>
              Total de Recordatorios
            </p>
            <p style={{ margin: 0, fontSize: '32px', fontWeight: '600', color: '#1890ff' }}>
              {reminders.length}
            </p>
          </div>

          <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}>
            <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#999' }}>
              Activos
            </p>
            <p style={{ margin: 0, fontSize: '32px', fontWeight: '600', color: '#52c41a' }}>
              {reminders.filter(r => r.is_active).length}
            </p>
          </div>

          <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}>
            <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#999' }}>
              Inactivos
            </p>
            <p style={{ margin: 0, fontSize: '32px', fontWeight: '600', color: '#999' }}>
              {reminders.filter(r => !r.is_active).length}
            </p>
          </div>
        </div>

        {/* Lista de recordatorios */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '20px 24px',
            borderBottom: '1px solid #f0f0f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
              Mis Recordatorios
            </h2>
            <button
              onClick={() => alert('Crear recordatorio - Próximamente')}
              style={{
                padding: '8px 16px',
                background: '#1890ff',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              <FaPlus size={12} />
              Nuevo Recordatorio
            </button>
          </div>

          {reminders.length === 0 ? (
            <div style={{
              padding: '60px 20px',
              textAlign: 'center',
              color: '#999'
            }}>
              <FaBell size={48} color="#d9d9d9" />
              <p style={{ marginTop: '16px', fontSize: '14px' }}>
                No tienes recordatorios configurados
              </p>
              <p style={{ fontSize: '12px' }}>
                Los recordatorios se crean automáticamente al agregar una fecha límite a tus tareas
              </p>
            </div>
          ) : (
            <div style={{ padding: '0' }}>
              {reminders.map(reminder => (
                <div
                  key={reminder.id}
                  style={{
                    padding: '20px 24px',
                    borderBottom: '1px solid #f0f0f0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    opacity: reminder.is_active ? 1 : 0.5
                  }}
                >
                  {/* Icono */}
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: reminder.is_active ? '#e6f7ff' : '#f5f5f5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    flexShrink: 0
                  }}>
                    {reminder.is_active ? '🔔' : '🔕'}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      margin: '0 0 4px 0',
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#333'
                    }}>
                      {reminder.task_title || 'Sin tarea'}
                    </h3>
                    
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      flexWrap: 'wrap'
                    }}>
                      <span style={{
                        fontSize: '13px',
                        color: '#666'
                      }}>
                        {getReminderTypeText(reminder.reminder_type, reminder.days_before)}
                      </span>
                      
                      {reminder.time && (
                        <span style={{
                          fontSize: '13px',
                          color: '#666'
                        }}>
                          🕐 {reminder.time}
                        </span>
                      )}

                      {reminder.task_due_date && (
                        <span style={{
                          fontSize: '13px',
                          color: getDaysColor(reminder.days_until_due),
                          fontWeight: '500'
                        }}>
                          📅 {formatDaysUntilDue(reminder.days_until_due)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Acciones */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <button
                      onClick={() => handleToggleActive(reminder)}
                      style={{
                        padding: '8px',
                        background: 'transparent',
                        border: '1px solid #d9d9d9',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        color: reminder.is_active ? '#52c41a' : '#999'
                      }}
                      title={reminder.is_active ? 'Desactivar' : 'Activar'}
                    >
                      {reminder.is_active ? <FaToggleOn size={20} /> : <FaToggleOff size={20} />}
                    </button>

                    <button
                      onClick={() => handleDelete(reminder.id)}
                      style={{
                        padding: '8px',
                        background: 'transparent',
                        border: '1px solid #d9d9d9',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        color: '#ff4d4f'
                      }}
                      title="Eliminar"
                    >
                      <FaTrash size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RemindersPage;