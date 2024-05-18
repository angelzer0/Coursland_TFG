import { useState } from 'react';
import UserService from '../api/UserService';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email.trim()) {
            setError('El correo electrónico es obligatorio');
            return;
        }

        if (!formData.password.trim()) {
            setError('La contraseña es obligatoria');
            return;
        }

        try {
            const userData = await UserService.login(formData.email, formData.password);
            console.log('UserData:', userData); 
            if (userData.token) {
                localStorage.setItem('token', userData.token);
                localStorage.setItem('roles', JSON.stringify(userData.roles)); 
                navigate('/cursos');
            } else {
                setError(userData.message);
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            setError('Se produjo un error al iniciar sesión');
        }
    };

    return (
        <div className="container-fluid d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
            <div className="auth-container bg-dark text-white border p-3" style={{ boxShadow: '3px 4px 6px rgba(255, 255, 255, 0.5)', borderRadius: '15px'}}>
                <h2 className="mb-3">Login</h2>
                {error && <p className="text-danger">{error}</p>}
                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="mb-1">Correo Electrónico:</label>
                        <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="form-control" required />
                    </div>
                    <div className="mb-3">
                        <label className="mb-1">Contraseña:</label>
                        <input type="password" name="password" value={formData.password} onChange={handleInputChange} className="form-control" required />
                    </div>
                    <button type="submit" className="btn btn-primary mb-2" style={{ backgroundColor: '#da773e', border: 'none' }}>Iniciar Sesión</button>
                </form>
                <p>¿No tienes cuenta? <Link to="/registro" style={{textDecoration: 'none', color: '#da773e'}}>Regístrate</Link></p>
            </div>
        </div>
    );
};

export default LoginPage;
