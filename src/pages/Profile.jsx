import { useState } from 'react';
import {
  getStoredUser,
  updateUserProfile
} from '../components/services/authService';
import '../styles/profile.css';
const Profile = () => {
  const storedUser = getStoredUser();

  const [form, setForm] = useState({
    full_name: storedUser?.full_name || '',
    phone: storedUser?.phone || '',
    avatar_url: storedUser?.avatar_url || '',
  });

  const [preview, setPreview] = useState(
    storedUser?.avatar_url || 'https://i.pravatar.cc/150'
  );

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAvatarUrlChange = (e) => {
    setForm({ ...form, avatar_url: e.target.value });
    setPreview(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updatedUser = await updateUserProfile(form);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      alert('Perfil actualizado correctamente ✅');
    } catch (error) {
      console.error(error);
      alert('Error al actualizar perfil ❌');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <h1>Editar perfil</h1>

      <form className="profile-card" onSubmit={handleSubmit}>
        {/* AVATAR */}
        <div className="avatar-section">
          <img src={preview} alt="Avatar" className="avatar-preview" />

          <input
            type="text"
            name="avatar_url"
            placeholder="URL de tu avatar"
            value={form.avatar_url}
            onChange={handleAvatarUrlChange}
          />

          <small>
            Usa una URL pública (ej: Supabase, Cloudinary, Imgur)
          </small>
        </div>

        {/* DATOS */}
        <div className="form-group">
          <label>Nombre completo</label>
          <input
            type="text"
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Teléfono</label>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </form>
    </div>
  );
};

export default Profile;
