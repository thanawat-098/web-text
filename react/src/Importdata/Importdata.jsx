import axios from "axios";
import { useState } from "react";
import "./Importdata.css";
import Swal from "sweetalert2";

function Importdata() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      Swal.fire({
        title: "ข้อผิดพลาด",
        text: "กรุณาเลือกไฟล์ CSV",
        icon: "error",
        confirmButtonText: "ตกลง",
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post("http://localhost:3200/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      Swal.fire({
        title: "สำเร็จ",
        text: "อัปโหลดไฟล์สำเร็จ",
        icon: "success",
        confirmButtonText: "ตกลง",
      });
      fetchData();
    } catch (error) {
      Swal.fire({
        title: "ข้อผิดพลาด",
        text: "เกิดข้อผิดพลาดในการอัปโหลดไฟล์",
        icon: "error",
        confirmButtonText: "ตกลง",
      });
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3200/data");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleExport = async () => {
    try {
      const response = await axios.get("http://localhost:3200/export", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "data.json");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      Swal.fire({
        title: "ข้อผิดพลาด",
        text: "เกิดข้อผิดพลาดในการส่งออกข้อมูล",
        icon: "error",
        confirmButtonText: "ตกลง",
      });
    }
  };

  return (
    <div className="im1">
      <div className="im2">
        <input
          className="im3"
          type="file"
          accept=".csv"
          onChange={handleFileChange}
        />
      </div>
      <div className="im4">
        <button className="im5" onClick={handleUpload}>
          Upload CSV
        </button>
        <button className="im5" onClick={handleExport}>
          Export as JSON
        </button>
      </div>

      <table className="im6">
        <thead>
          <tr className="im7">
            <th className="im8">Username</th>
            <th className="im8">Department</th>
            <th className="im8">License</th>
            <th className="im8">Installed</th>
            <th className="im8">Brand</th>
            <th className="im8">Model</th>
            <th className="im8">Serial</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr className="im9" key={index}>
              <td className="im10">{row.username}</td>
              <td className="im10">{row.department}</td>
              <td className="im10">{row.license}</td>
              <td className="im10">{row.installed}</td>
              <td className="im10">{row.brand}</td>
              <td className="im10">{row.model}</td>
              <td className="im10">{row.serial}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Importdata;
