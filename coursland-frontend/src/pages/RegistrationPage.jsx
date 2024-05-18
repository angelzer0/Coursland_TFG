import { useState } from 'react';
import UserService from '../api/UserService';
import { useNavigate, Link } from 'react-router-dom';

const RegistrationPage = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        nombre: '',
        username: '',
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({}); 

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: '' });
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
        if (!formData.password.trim()) {
            validationErrors.password = 'La contraseña es obligatoria';
        } else if (formData.password.trim().length < 8) {
            validationErrors.password = 'La contraseña debe tener al menos 8 caracteres';
        } else if (!/[A-Z]/.test(formData.password)) {
            validationErrors.password = 'La contraseña debe contener al menos una letra mayúscula';
        }
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const response = await UserService.register(formData);
            if (response.statusCode === 200) {
                setFormData({
                    nombre: '',
                    email: '',
                    password: ''
                });
                alert('Usuario registrado exitosamente');
                navigate('/login');
            } else if (response.statusCode === 400) {
                setErrors({ email: response.message });
            }
        } catch (error) {
            console.error('Error al registrar usuario:', error);
            alert('Se produjo un error al registrar al usuario');
        }
    };

    return (
        <div className="container-fluid d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
            <div className="auth-container bg-dark text-white border p-3" style={{ boxShadow: '3px 4px 6px rgba(255, 255, 255, 0.5)' ,borderRadius: '15px'}}>
                <h2 className="mb-3">Registro</h2>
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
                        <input type="password" name="password" value={formData.password} onChange={handleInputChange} className="form-control" required />
                        {errors.password && <div className="text-danger">{errors.password}</div>}
                    </div>
                    <button type="submit" className="btn btn-primary mb-2" style={{ backgroundColor: '#da773e', border: 'none' }}>Registrar</button>
                </form>
                <p>¿Ya tienes una cuenta? <Link to="/login" style={{textDecoration: 'none', color: '#da773e'}}>Iniciar sesión</Link></p>
            </div>
        </div>
    );
}

export default RegistrationPage;
