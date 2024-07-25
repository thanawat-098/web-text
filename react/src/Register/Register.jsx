import { useState } from "react";
import "./Register.css";
import axios from "axios";
import Swal from 'sweetalert2';

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 8) {
      Swal.fire({
        title: 'ข้อผิดพลาด',
        text: 'รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร',
        icon: 'error',
        confirmButtonText: 'ตกลง'
      });
      return;
    }
    if (password !== confirmPassword) {
      Swal.fire({
        title: 'ข้อผิดพลาด',
        text: 'รหัสผ่านไม่ตรงกัน',
        icon: 'error',
        confirmButtonText: 'ตกลง'
      });
      return;
    }
    try {
      const response = await axios.post("http://localhost:3200/register", {
        username,
        password,
      });
      Swal.fire({
        title: 'สำเร็จ',
        text: response.data.message,
        icon: 'success',
        confirmButtonText: 'ตกลง'
      });
    } catch (error) {
      Swal.fire({
        title: 'ข้อผิดพลาด',
        text: error.response.data.message || 'เกิดข้อผิดพลาดในการลงทะเบียน',
        icon: 'error',
        confirmButtonText: 'ตกลง'
      });
    }
  };

  return (
    <div className="log1">
    <form className="log2" onSubmit={handleSubmit}>
      <h2 className="log3">Login</h2>
      <div className="log4">
        <label className="log5">Username</label>
        <input
          className="log6"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          type="text"
          placeholder="Username"
        />
      </div>

      <div className="log7">
        <label className="log5">Password</label>
        <input
          className="log6"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="password"
        />
      </div>

      <div className="log7">
        <label className="log5">Confirm Password</label>
        <input
          className="log6"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          type="password"
          placeholder="Confirm password"
        />
      </div>

      <button type="submit" className="log8">Register</button>
    </form>
  </div>

  );
}

export default Register;
