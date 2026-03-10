import React from "react";
import ReactDOM from "react-dom/client";

function App() {
  return (
    <div style={{textAlign:"center",marginTop:"50px"}}>
      <h1>School Dashboard</h1>
      <p>ระบบจัดการโรงเรียน</p>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
