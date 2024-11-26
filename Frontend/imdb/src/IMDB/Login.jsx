import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Import the CSS file

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            setMessage("Please Fill in both fields.");
            return;
        }
        try {
            const response = await fetch("http://localhost:5000/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem("userEmail", data.email);
                setMessage(data.message);
                navigate("/movie");
            } else {
                setMessage(data.message);
            }
        } catch (err) {
            setMessage(err.message);
        }
    }

    const Signup = ()=>{
        navigate("/")
    }
    return (
        <div className="login-container">
            <div className="card">
                <h1 className='heading'>Login <br />Form</h1>
                <form className="form"onSubmit={handleLogin}>
                    <input
                    className='input'
                        type="email"
                        placeholder='Enter Email...'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                    className='input'
                        type="password"
                        placeholder='Enter Password...'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className='button'>Login</button>
                    <p className='p' style={{color:"blue", textDecoration:"underline",cursor:"pointer" }} onClick={Signup}>Signup?</p>
                </form>
                {message && <p>{message}</p>}
            </div>
        </div>
    )
}

export default Login;
