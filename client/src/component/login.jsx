import { useRef, useState, useEffect } from 'react';
import useAuth from '../hooks/authuse';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import "../styles/pages/login.css";
import axios from '../api/axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
const LOGIN_URL = '/routes/auth/login';

const Login = () => {
    const { setAuth, persist, setPersist } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const userRef = useRef();
    const errRef = useRef();

    const [username, setUser] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [username, password])

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({ username, password }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );

            const { accessToken, roles, id, username: user, profilePicture } = response?.data;

            // Avoid storing the password in auth state for security reasons
            setAuth({ user, roles, id, accessToken,  });
            setUser('');
            setPwd('');
            navigate(from, { replace: true });
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
            }
            errRef.current.focus();
        }
    }

    const togglePersist = () => {
        setPersist(prev => !prev);
    }

    useEffect(() => {
        localStorage.setItem("persist", persist);
    }, [persist])
    return (
        <div className="app">
            <section className='section'>
                <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                <h1>Sign In</h1>
                <form className="form" onSubmit={handleSubmit}>
                    <label htmlFor="username">Username:</label>
                    <input className="input"
                        type="text"
                        id="username"
                        ref={userRef}
                        autoComplete="off"
                        onChange={(e) => setUser(e.target.value)}
                        value={username}
                        required
                    />
                    <label htmlFor="password">Password:</label>
<div className='passwordshow'> 
    
                    <input className="pwinput"
                        type={showPassword ? "text" : "password"}
                        id="password"
                        onChange={(e) => setPwd(e.target.value)}
                        value={password}
                        required
                    />
                    <div className='pwbutton' type="button" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ?(
                                                                        <FaEyeSlash/>
                                                                    )
                                                                    :
                                                                    (
                                                                        <FaEye/>
                                                                    )} 
                    </div>
                    </div>
                   

                    <button className='button' type="submit">Sign In</button>
                    <div className="persistCheck">
                    <input
                        type="checkbox"
                        id="persist"
                        onChange={togglePersist}
                        checked={persist}
                    />
                    <label htmlFor="persist">Trust This Device</label>
                </div>
                </form>
                <p>
                    Need an Account?<br />
                    <span className="line">
                        <Link to="/register">Sign Up</Link>
                    </span>
                </p>
                <p>
                    Forgot your password?<br />
                    <span className="line">
                        <Link to="/request-reset-password">Reset Password</Link>
                    </span>
                </p>
            </section>
        </div>
    )
}

export default Login;
