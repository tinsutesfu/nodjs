import { useState } from 'react';
import axios from '../api/axios';
import "../styles/pages/resetpassword.css";

const PASSWORD_RESET_URL = '/routes/auth/password-reset';

const RequestResetPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(PASSWORD_RESET_URL, { email });
            setMessage(response.data.message);
            window.location.href = 'https://mail.google.com';
        } catch (err) {
            setMessage('Failed to send password reset email');
        }
    };

    return (
        <section className="request-reset-section">
            <h2 className="request-reset-title">Request Password Reset</h2>
            <form className="request-reset-form" onSubmit={handleSubmit}>
                <label className="request-reset-label" htmlFor="email">Email:</label>
                <input
                    className="request-reset-input"
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button className="request-reset-button">Request Reset</button>
            </form>
            {message && <p className="request-reset-message">{message}</p>}
        </section>
    );
};

export default RequestResetPassword;