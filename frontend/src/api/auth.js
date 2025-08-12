import axios from 'axios';
const apiBase = import.meta.env.VITE_API_BASE_URL;


export const login = (data) => axios.post(`${apiBase}/api/auth/login`, data);

export const studentSignup = (data) => axios.post(`${apiBase}/api/auth/student/signup`, data);

export const teacherSignup = (data) => axios.post(`${apiBase}/api/auth/teacher/signup`, data);
