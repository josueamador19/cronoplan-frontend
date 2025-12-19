import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCamera, FaTrash, FaUser, FaPhone } from 'react-icons/fa';
import {
  getStoredUser,
  uploadAvatar,
  deleteAvatar,
  updateUserName
} from '../components/services/authService';
import '../styles/profile.css';

const Profile = () => {
  const storedUser = getStoredUser();
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(storedUser?.full_name || '');
  const [avatarPreview, setAvatarPreview] = useState(
    storedUser?.avatar_url || 'https://i.pravatar.cc/150?img=12'
  );
  const [selectedFile, setSelectedFile] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Manejar selección de archivo
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    
    if (!file) return;

    // Validar tipo de archivo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setMessage({ 
        type: 'error', 
        text: 'Solo se permiten archivos JPG, PNG o WEBP' 
      });
      return;
    }

    // Validar tamaño (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setMessage({ 
        type: 'error', 
        text: 'El archivo es demasiado grande. Máximo 5MB' 
      });
      return;
    }

    // Crear preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
      setSelectedFile(file);
      setMessage({ type: '', text: '' });
    };
    reader.readAsDataURL(file);
  };

  // Subir avatar
  const handleUploadAvatar = async () => {
    if (!selectedFile) {
      setMessage({ type: 'error', text: 'Selecciona una imagen primero' });
      return;
    }

    setUploadingAvatar(true);
    setMessage({ type: '', text: '' });

    try {
      const result = await uploadAvatar(selectedFile);
      setAvatarPreview(result.avatar_url);
      setSelectedFile(null);
      setMessage({ 
        type: 'success', 
        text: 'Foto de perfil actualizada' 
      });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.message || 'Error al subir la foto' 
      });
      // Restaurar preview anterior
      setAvatarPreview(storedUser?.avatar_url || 'https://i.pravatar.cc/150?img=12');
      setSelectedFile(null);
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Eliminar avatar
  const handleDeleteAvatar = async () => {
    if (!storedUser?.avatar_url) {
      setMessage({ type: 'error', text: 'No tienes foto de perfil' });
      return;
    }

    if (!window.confirm('¿Seguro que quieres eliminar tu foto de perfil?')) {
      return;
    }

    setUploadingAvatar(true);
    setMessage({ type: '', text: '' });

    try {
      await deleteAvatar();
      setAvatarPreview('https://i.pravatar.cc/150?img=12');
      setSelectedFile(null);
      setMessage({ 
        type: 'success', 
        text: 'Foto de perfil eliminada' 
      });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.message || 'Error al eliminar la foto' 
      });
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Actualizar nombre
  const handleSubmitName = async (e) => {
    e.preventDefault();
    
    if (!fullName.trim()) {
      setMessage({ type: 'error', text: 'El nombre no puede estar vacío' });
      return;
    }

    if (fullName === storedUser?.full_name) {
      setMessage({ type: 'info', text: 'No hay cambios para guardar' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await updateUserName(fullName);
      setMessage({ 
        type: 'success', 
        text: 'Nombre actualizado correctamente' 
      });
      
      // Redirigir al dashboard después de 1.5 segundos
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.message || 'Error al actualizar nombre' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>Mi Perfil</h1>
        <p>Administra tu información personal</p>
      </div>

      {/* MENSAJES */}
      {message.text && (
        <div className={`profile-message ${message.type}`}>
          {message.text}
        </div>
      )}

      {/* SECCIÓN DE AVATAR */}
      <div className="profile-card">
        <h2>Foto de perfil</h2>
        
        <div className="avatar-section">
          <div className="avatar-preview-container">
            <img 
              src={avatarPreview} 
              alt="Avatar" 
              className="avatar-preview" 
            />
            <button
              type="button"
              className="avatar-upload-btn"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingAvatar}
            >
              <FaCamera />
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />

          <div className="avatar-actions">
            {selectedFile && (
              <button
                type="button"
                className="btn-primary"
                onClick={handleUploadAvatar}
                disabled={uploadingAvatar}
              >
                {uploadingAvatar ? 'Subiendo...' : 'Guardar foto'}
              </button>
            )}
            
            {storedUser?.avatar_url && !selectedFile && (
              <button
                type="button"
                className="btn-danger"
                onClick={handleDeleteAvatar}
                disabled={uploadingAvatar}
              >
                <FaTrash /> Eliminar foto
              </button>
            )}
          </div>

          
        </div>
      </div>

      {/* SECCIÓN DE INFORMACIÓN */}
      <div className="profile-card">
        <h2>Información personal</h2>
        
        <form onSubmit={handleSubmitName}>
          {/* NOMBRE */}
          <div className="form-group">
            <label htmlFor="full_name">
              <FaUser /> Nombre completo
            </label>
            <input
              id="full_name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Tu nombre completo"
              maxLength={100}
            />
          </div>

          {/* TELÉFONO (SOLO LECTURA) */}
          <div className="form-group">
            <label htmlFor="phone">
              <FaPhone /> Teléfono
            </label>
            <input
              id="phone"
              type="text"
              value={storedUser?.phone || 'No registrado'}
              readOnly
              disabled
              className="input-readonly"
            />
            
          </div>

          {/* EMAIL (SOLO LECTURA) */}
          <div className="form-group">
            <label htmlFor="email">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              value={storedUser?.email || ''}
              readOnly
              disabled
              className="input-readonly"
            />
          
          </div>

          <button 
            type="submit" 
            className="btn-primary btn-block"
            disabled={loading || fullName === storedUser?.full_name}
          >
            {loading ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;