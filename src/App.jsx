import "./App.css";
import { useState } from "react";
import Clock from "./components/main/Clock";
import Thumbnail from "./components/main/Thumbnail";
import Modal from "./components/sub/Modal";
import FileList from "./components/sub/FileList";
import Main from "./components/Main";
import Setting from "../src/components/sub/Setting";

function App() {
  const [modalOpen, setModalopen] = useState(null);

  return (
    <div className="App">
      <div className="container">
        <div className="systemPanel">
          <img
            onClick={() => setModalopen("setting")}
            src="/images/setting.png"
            alt=""
          />
          <Clock />
          <img src="/images/와이파이배터리.png" alt="" />
        </div>
        <Main />
        <Thumbnail onClick={() => setModalopen("fileList")} />
        <Modal modalOpen={modalOpen}>
          {modalOpen === "fileList" && (
            <FileList onClose={() => setModalopen(null)} />
          )}
          {modalOpen === "setting" && (
            <Setting onClose={() => setModalopen(null)} />
          )}
        </Modal>
      </div>
    </div>
  );
}

export default App;
