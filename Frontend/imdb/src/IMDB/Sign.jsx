import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
const Sign = () => {
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [message,setMessage] = useState("")
  const navigate = useNavigate()

  const login = ()=>{
    navigate("/login")
  }
  const handleSignup = async(e)=>{
    e.preventDefault();
    if(!email||!password){
      setMessage('Please Fill in the Blanks')
      return;
    }
    if(!/\S+@\S+\.\S+/.test(email)){
      setMessage("Please enter a valid email")
      return;
    }
    try{
      const response = await fetch(`http://${process.env.REACT_APP_API_URL}:5000/api/signup`,{
        method:"POST",
        headers : {"Content-Type":"application/json"},
        body: JSON.stringify({email,password})
      })
      const data = await response.json();
      if(response.ok){
        setMessage(data.message)
        navigate('/login')
      }
      else{
        setMessage(data.message)
      }
    }catch(err){
      setMessage(err.message)
    }
  }
  return (
    <div className="login-container">
            <div className="card">
                <h1 className='heading'>Signup <br />Form</h1>
                <form className="form" onSubmit={handleSignup}>
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
                    <button className='button'>Signup</button>
                    <p className='p' style={{color:"blue", textDecoration:"underline",cursor:"pointer" }} onClick={login}>Login?</p>
                </form>
                {message && <p>{message}</p>}
            </div>
        </div>
  )
}

export default Sign
