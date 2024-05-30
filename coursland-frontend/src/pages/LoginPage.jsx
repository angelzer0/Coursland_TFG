import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserService from '../api/UserService';

const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (location.state && location.state.message) {
            toast.warn(location.state.message, { className: 'toast-warning' });
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email.trim()) {
            toast.error('El correo electrónico es obligatorio');
            return;
        }

        if (!formData.password.trim()) {
            toast.error('La contraseña es obligatoria');
            return;
        }

        try {
            const userData = await UserService.login(formData.email, formData.password);
            console.log('UserData:', userData); 
            if (userData.token) {
                localStorage.setItem('token', userData.token);
                localStorage.setItem('roles', JSON.stringify(userData.roles)); 
                navigate('/cursos', { state: { message: 'Has iniciado sesión correctamente' } });
            } else {
                toast.error(userData.message);
            }
        } catch (error) {
            toast.error('Se produjo un error al iniciar sesión');
        }
    };

    return (
        <div className="container-fluid d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
            <ToastContainer />
            <div className="auth-container bg-dark text-white border p-3" style={{ boxShadow: '3px 4px 6px rgba(255, 255, 255, 0.5)', borderRadius: '15px'}}>
                <h2 className="mb-3">Login</h2>
                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="mb-1">Correo Electrónico:</label>
                        <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="form-control" required />
                    </div>
                    <div className="mb-3">
                        <label className="mb-1">Contraseña:</label>
                        <div className="input-group">
                            <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleInputChange} className="form-control" required />
                            <button type="button" className="btn btn-outline-secondary" onClick={handleTogglePassword}>
                                {showPassword ? 'Ocultar' : 'Mostrar'}
                            </button>
                        </div>
                    </div>
                    <div className="d-flex justify-content-center">
                        <button type="submit" className="btn btn-primary mb-2" style={{ backgroundColor: '#da773e', border: 'none', width: '100%' }}>Iniciar Sesión</button>
                    </div>
                </form>
                <p>¿No tienes cuenta? <Link to="/registro" style={{textDecoration: 'none', color: '#da773e'}}>Regístrate</Link></p>
            </div>
        </div>
    );
};

export default LoginPage;
