// src/components/modals/CreateBoardModal.jsx - CON SCROLL OPTIMIZADO
import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { createBoard } from '../services/boardsService';
import '../../styles/modal.css';

const CreateBoardModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    color: '#1890FF',
    icon: '📊',
    type: 'personal'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Colores predefinidos
  const colors = [
    { name: 'Azul', value: '#1890FF' },
    { name: 'Verde', value: '#52C41A' },
    { name: 'Naranja', value: '#FAAD14' },
    { name: 'Rojo', value: '#FF4D4F' },
    { name: 'Púrpura', value: '#9254DE' },
    { name: 'Cian', value: '#13C2C2' },
    { name: 'Rosa', value: '#EB2F96' },
    { name: 'Lima', value: '#A0D911' }
  ];

  // Iconos predefinidos
  const icons = [
    '📊', '🌐', '💻', '🎨', '📱', '🚀', 
    '💼', '📈', '🎯', '⚡', '🔥', '✨',
    '📝', '🎓', '🏃', '💡', '🎭', '🎪'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleColorSelect = (color) => {
    setFormData(prev => ({
      ...prev,
      color
    }));
  };

  const handleIconSelect = (icon) => {
    setFormData(prev => ({
      ...prev,
      icon
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError('El nombre del tablero es requerido');
      return;
    }

    try {
      setLoading(true);
      setError('');

      console.log('📤 Creando tablero:', formData);

      const newBoard = await createBoard(formData);

      console.log('✅ Tablero creado:', newBoard);

      if (onSuccess) {
        onSuccess(newBoard);
      }

      setFormData({
        name: '',
        color: '#1890FF',
        icon: '📊',
        type: 'personal'
      });

      onClose();

    } catch (error) {
      console.error('❌ Error al crear tablero:', error);
      
      if (error.response?.data?.detail) {
        setError(error.response.data.detail);
      } else if (error.request) {
        setError('Error de conexión. Verifica que el backend esté corriendo.');
      } else {
        setError('Error al crear el tablero. Intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !loading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="task-modal-overlay" onClick={handleOverlayClick}>
      <div className="task-modal" style={{ 
        maxWidth: '550px',
        maxHeight: '90vh',  // ✅ Altura máxima
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'  // ✅ Sin scroll en contenedor
      }}>
        {/* Header - Fijo */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 24px',
          borderBottom: '1px solid #f0f0f0',
          flexShrink: 0  // ✅ No se encoge
        }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600' }}>
            Crear Nuevo Tablero
          </h2>
          <button
            onClick={onClose}
            disabled={loading}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              padding: '8px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#999'
            }}
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Body - Con scroll */}
        <form onSubmit={handleSubmit} style={{ 
          display: 'flex', 
          flexDirection: 'column',
          flex: 1,
          overflow: 'hidden'  // ✅ Contenedor sin scroll
        }}>
          <div style={{ 
            padding: '24px',
            overflowY: 'auto',  // ✅ Solo esta sección tiene scroll
            flex: 1
          }}>
            {/* Error message */}
            {error && (
              <div style={{
                backgroundColor: '#fff1f0',
                border: '1px solid #ffccc7',
                borderRadius: '6px',
                padding: '12px',
                marginBottom: '20px',
                color: '#cf1322',
                fontSize: '14px'
              }}>
                {error}
              </div>
            )}

            {/* Nombre del tablero */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '500',
                fontSize: '14px',
                color: '#333'
              }}>
                Nombre del tablero *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ej: Proyecto Web, Marketing Q3..."
                disabled={loading}
                autoFocus
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d9d9d9',
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.3s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#1890ff'}
                onBlur={(e) => e.target.style.borderColor = '#d9d9d9'}
              />
            </div>

            {/* Selección de color */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '500',
                fontSize: '14px',
                color: '#333'
              }}>
                Color
              </label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(8, 1fr)',
                gap: '8px'
              }}>
                {colors.map(color => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => handleColorSelect(color.value)}
                    disabled={loading}
                    title={color.name}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      border: formData.color === color.value 
                        ? '3px solid #1890ff' 
                        : '2px solid transparent',
                      backgroundColor: color.value,
                      cursor: loading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: formData.color === color.value 
                        ? '0 2px 8px rgba(24, 144, 255, 0.3)' 
                        : 'none'
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Selección de icono */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '500',
                fontSize: '14px',
                color: '#333'
              }}>
                Icono
              </label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(9, 1fr)',
                gap: '8px'
              }}>
                {icons.map(icon => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => handleIconSelect(icon)}
                    disabled={loading}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      border: formData.icon === icon 
                        ? '2px solid #1890ff' 
                        : '1px solid #f0f0f0',
                      backgroundColor: formData.icon === icon 
                        ? '#e6f7ff' 
                        : 'white',
                      fontSize: '20px',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Tipo de tablero */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '500',
                fontSize: '14px',
                color: '#333'
              }}>
                Tipo
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d9d9d9',
                  borderRadius: '6px',
                  fontSize: '14px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  backgroundColor: 'white'
                }}
              >
                <option value="personal">👤 Personal</option>
                <option value="team">👥 Equipo</option>
              </select>
            </div>

            {/* Preview */}
            <div style={{
              padding: '16px',
              backgroundColor: '#f9f9f9',
              borderRadius: '8px',
              border: '1px solid #f0f0f0'
            }}>
              <p style={{
                fontSize: '12px',
                color: '#999',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                fontWeight: '600'
              }}>
                Vista previa
              </p>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{
                  width: '4px',
                  height: '40px',
                  backgroundColor: formData.color,
                  borderRadius: '2px'
                }} />
                <span style={{ fontSize: '24px' }}>{formData.icon}</span>
                <div>
                  <p style={{
                    margin: 0,
                    fontWeight: '600',
                    fontSize: '16px',
                    color: '#333'
                  }}>
                    {formData.name || 'Nombre del tablero'}
                  </p>
                  <p style={{
                    margin: 0,
                    fontSize: '12px',
                    color: '#999'
                  }}>
                    {formData.type === 'personal' ? '👤 Personal' : '👥 Equipo'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer - Fijo */}
          <div style={{
            padding: '16px 24px',
            borderTop: '1px solid #f0f0f0',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            flexShrink: 0  // ✅ No se encoge
          }}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                padding: '8px 16px',
                border: '1px solid #d9d9d9',
                borderRadius: '6px',
                backgroundColor: 'white',
                color: '#666',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !formData.name.trim()}
              style={{
                padding: '8px 24px',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: loading || !formData.name.trim() 
                  ? '#d9d9d9' 
                  : '#1890ff',
                color: 'white',
                cursor: loading || !formData.name.trim() 
                  ? 'not-allowed' 
                  : 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              {loading ? 'Creando...' : 'Crear Tablero'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBoardModal;