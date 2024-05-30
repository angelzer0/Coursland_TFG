import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCog } from '@fortawesome/free-solid-svg-icons';
import UserService from '../../api/UserService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ActualizarPerfil = () => {
    const navigate = useNavigate();

    const [profileInfo, setProfileInfo] = useState({
        idUsuario: '',
        nombre: '',
        email: ''
    });
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await UserService.getYourProfile(token);
                setProfileInfo(response.user);
                setFormData({
                    nombre: response.user.nombre,
                    email: response.user.email,
                    password: ''
                });
            } catch (error) {
                console.error('Error al obtener perfil del usuario:', error);
            }
        };

        fetchUserProfile();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: '' });
    };

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = {};
        if (!formData.nombre.trim()) {
            validationErrors.nombre = 'El nombre es obligatorio';
        }
        if (!formData.email.trim()) {
            validationErrors.email = 'El correo electrónico es obligatorio';
        }
        if (formData.password.trim() && formData.password.trim().length < 8) {
            validationErrors.password = 'La contraseña debe tener al menos 8 caracteres';
        } else if (formData.password.trim() && !/[A-Z]/.test(formData.password)) {
            validationErrors.password = 'La contraseña debe contener al menos una letra mayúscula';
        }
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await UserService.updateUser(profileInfo.idUsuario, formData, token);
            toast.success('Perfil actualizado correctamente');
            navigate('/login', { state: { message: 'Perfil actualizado correctamente. Por favor, inicie sesión de nuevo.' } });
        } catch (error) {
            if (error.response && error.response.data) {
                setErrors({ email: error.response.data.message });
            } else {
                console.error('Error al actualizar el perfil:', error);
                toast.error('Se produjo un error al actualizar el perfil');
            }
        }
    };

    return (
        <div className="container-fluid d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
            <ToastContainer />
            <div className="auth-container bg-dark text-white border p-3" style={{ boxShadow: '3px 4px 6px rgba(255, 255, 255, 0.5)', borderRadius: '15px' }}>
                <FontAwesomeIcon icon={faUserCog} size="5x" className="mb-3" />
                <h2 className="mb-3">Actualizar Perfil</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="mb-1">Nombre:</label>
                        <input type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} className="form-control" required />
                        {errors.nombre && <div className="text-danger">{errors.nombre}</div>}
                    </div>
                    <div className="mb-3">
                        <label className="mb-1">Correo Electrónico:</label>
                        <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="form-control" required />
                        {errors.email && <div className="text-danger">{errors.email}</div>}
                    </div>
                    <div className="mb-3">
                        <label className="mb-1">Contraseña:</label>
                        <div className="input-group">
                            <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleInputChange} className="form-control" />
                            <button type="button" className="btn btn-outline-secondary" onClick={handleTogglePassword}>
                                {showPassword ? 'Ocultar' : 'Mostrar'}
                            </button>
                        </div>
                        {errors.password && <div className="text-danger">{errors.password}</div>}
                    </div>
                    <div className="d-flex justify-content-center">
                        <button type="submit" className="btn btn-primary mb-2" style={{ backgroundColor: '#da773e', border: 'none', width: '100%' }}>Actualizar Perfil</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ActualizarPerfil;
