import "./App.css";
import { useSocket } from "./context/SocketContext";
import MyTable from "./MyTable";

function App() {
  const { messages } = useSocket();
  return (
    <>
      <MyTable messages={messages} />
    </>
  );
}

export default App;
