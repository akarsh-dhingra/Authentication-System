import { useState,useEffect } from 'react';
import axios from 'axios';
function App() {
  const [userData, setuserData] = useState([]);

  useEffect(()=>{
    axios.get("/api/users").then( (res) =>{
      setuserData(res.data);
    }
    )
    .catch((e)=>{
      console.error(e);
    })
  },[])
  return (
    <>
  <div>
    <h1>UserData:{userData.length} </h1>

    {userData.map((user)=>(
      <div key={user.id}> 
        <h3>{user.name}</h3>
        <h3>{user.todo}</h3>
      </div>
    ))}
  </div>
    </>
  )
}

export default App
