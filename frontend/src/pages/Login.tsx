import { useNavigate } from "react-router-dom";
import { useState } from "react";

import API from "../services/api";

function Login(){
  const navigate = useNavigate();

  const [formData, setFormData] = useState({email: "", password: ""});

  const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
     setFormData({
    ...formData,
    [e.target.name]: e.target.value
  })
}

  const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      const { data } = await API.post("/auth/login", formData);

      localStorage.setItem("token", data.token);

      navigate("/dashboard");

    } catch (error : any) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div>
       <form onSubmit={handleSubmit}>

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />

        <button type="submit">
          Login
        </button>

      </form>
    </div>
  )
}

export default Login; 