import "./App.css";
import { useState } from "react";
import Clock from "./components/main/Clock";
import Thumbnail from "./components/main/Thumbnail";
import Modal from "./components/sub/Modal";
import FileList from "./components/sub/FileList";
import Main from "./components/Main";

function App() {
  const [openFileList, setOpenFileList] = useState(false);

  return (
    <div className="App">
      <div className="container">
        <div className="systemPanel">
          <img src="/images/setting.png" alt="" />
          <Clock />
          <img src="/images/와이파이배터리.png" alt="" />
        </div>
        <Main />
        <Thumbnail onClick={() => setOpenFileList(true)} />
        <Modal openFileList={openFileList}>
          <FileList onClose={() => setOpenFileList(false)} />
        </Modal>
      </div>
    </div>
  );
}

export default App;
