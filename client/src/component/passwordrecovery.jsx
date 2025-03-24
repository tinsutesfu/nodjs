import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import "../styles/pages/recoverypassword.css";

const RESET_PASSWORD_URL = '/routes/auth/reset-password';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }

        try {
            const response = await axios.post(`${RESET_PASSWORD_URL}/${token}`, { password });
            setMessage(response.data.message);
            navigate('/login');
        } catch (err) {
            setMessage('Failed to reset password');
        }
    };

    return (
        <section className="reset-password-section">
            <h2 className="reset-password-title">Reset Password</h2>
            <form className="reset-password-form" onSubmit={handleSubmit}>
                <label className="reset-password-label" htmlFor="password">New Password:</label>
                <input
                    className="reset-password-input"
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <label className="reset-password-label" htmlFor="confirmPassword">Confirm Password:</label>
                <input
                    className="reset-password-input"
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                <button className="reset-password-button">Reset Password</button>
            </form>
            {message && <p className="reset-password-message">{message}</p>}
        </section>
    );
};

export default ResetPassword;