import "./App.css";
import { useSocket } from "./context/SocketContext";
import MyTable from "./MyTable";
import { Slide, ToastContainer } from "react-toastify";

function App() {
  const { messages } = useSocket();
  console.log("messages: ", messages);
  return (
    <>
      <MyTable messages={messages} />
      <ToastContainer
        position="top-left"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="light"
        transition={Slide}
      />
    </>
  );
}

export default App;
