import axios from 'axios';

const UserService = {
    
    
    BASE_URL: 'https://courslandtfg-production.up.railway.app',

    async login(email, password) {
        const response = await axios.post(`${UserService.BASE_URL}/auth/login`, { email, password });
        return response.data;
    },

    async register(userData) {
        const response = await axios.post(`${UserService.BASE_URL}/auth/register`, userData);
        return response.data;
    },

    async getAllUsers(token) {
        const response = await axios.get(`${UserService.BASE_URL}/adminuser/get-all-users`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    async getYourProfile(token) {
        const response = await axios.get(`${UserService.BASE_URL}/adminuser/get-profile`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    async getUserById(userId, token) {
        const response = await axios.get(`${UserService.BASE_URL}/adminuser/get-users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    async updateUser(userId, userData, token) {
        const response = await axios.put(`${UserService.BASE_URL}/admin/update/${userId}`, userData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    async deleteUserById(userId, token) {
        const response = await axios.delete(`${UserService.BASE_URL}/admin/delete/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('roles');
        console.log('Sesión cerrada');
    },

    isAuthenticated() {
        const token = localStorage.getItem('token');
        return !!token;
    },

    isAdmin() {
        const rolesString = localStorage.getItem('roles');
        const roles = rolesString ? JSON.parse(rolesString) : [];
        return roles && roles.some(role => role.name === 'ADMIN');
    },

    isUser() {
        const rolesString = localStorage.getItem('roles');
        const roles = rolesString ? JSON.parse(rolesString) : [];
        return roles && roles.some(role => role.name === 'USER');
    },

    adminOnly() {
        return this.isAuthenticated() && this.isAdmin();
    }
};

export default UserService;
