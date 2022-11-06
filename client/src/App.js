import React from "react";
import Clock from "./components/Clock";
import CreateSchedule from "./components/CreateSchedule";
import Schedules from "./components/Schedules";
import socketIO from "socket.io-client";
import { useEffect, useState } from "react";

//React Toastify imports
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

const socket = socketIO.connect("http://localhost:4000");

const App = () => {
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    //listens for the event list from the backend
    socket.on("sendSchedules", (schedules) => {
      setSchedules(schedules);
    });

    //Listens for the notification from the server
    socket.on("notification", (data) => {
      console.log(data);
      toast.success(` It's time for ${data.title}`);
    });
  }, []);

  return (
    <div className='app__container'>
      <Clock />
      <CreateSchedule socket={socket} />
      <Schedules schedules={schedules} />
      <ToastContainer />
    </div>
  );
};
export default App;