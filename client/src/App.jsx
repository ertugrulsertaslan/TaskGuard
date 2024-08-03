import { useEffect, useState } from "react";
import axios from "axios";

import "./App.css";

function App() {
  const [data, setData] = useState([]);
  const api = axios.create({
    baseURL: "http://localhost:3000",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  // Taskları al
  const fetchTasks = async () => {
    try {
      const response = await api.get("/tasks");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };
  /*
  {data &&
        data.map((item, index) => {
          <div key={index}>
            <p>{item.title}</p>
            <p>{item.content}</p>
          </div>;
        })}
  */
  return <></>;
}

export default App;
