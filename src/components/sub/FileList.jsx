import { useState } from "react";

export default function FileList({ onClose }) {
  console.log("렌더");
  const [currentSrc, setCurrentSrc] = useState("");
  const sample = [
    {
      id: "20250123_040646",
      src: "/images/썸네일.png",
      name: "20260123_040646",
      type: "동영상",
    },
    {
      id: "20250123_050232",
      src: "/images/썸네일.png",
      name: "20250123_050232",
      type: "이미지",
    },
    {
      id: "20250123_030405",
      src: "/images/썸네일.png",
      name: "20250123_030405",
      type: "이미지",
    },
    {
      id: "20250123_230405",
      src: "/images/썸네일.png",
      name: "20250123_230405",
      type: "이미지",
    },
    {
      id: "20250124_001023",
      src: "/images/썸네일.png",
      name: "20250124_001023",
      type: "동영상",
    },
  ];

  const clickThumbnail = (src) => {
    return setCurrentSrc(src);
  };

  const close = () => setCurrentSrc("");

  console.log(currentSrc);

  return (
    <div id="fileWindow">
      <h2>
        FILE LIST <small id="transfer"></small>
      </h2>
      <div id="file_scroll">
        <table className="tbl-grid">
          <colgroup>
            <col width="15%" />
            <col width="35%" />
            <col width="25%" />
            <col width="25%" />
          </colgroup>
          <thead>
            <tr>
              <th>
                선택 &nbsp;
                <input
                  type="checkbox"
                  name="file_all"
                  onClick={() => console.log("전체 선택")}
                />
              </th>
              <th>파일명</th>
              <th>유형</th>
              <th>크기</th>
            </tr>
          </thead>
          <tbody>
            {sample.map((file) => (
              <tr key={file.id}>
                <td>
                  <input type="checkbox" name="fileid" value={file.id} />
                </td>
                <td>
                  <img
                    onClick={() => clickThumbnail(file?.src)}
                    src={file.src}
                    alt=""
                  />
                  <span>{file.name}</span>
                </td>
                <td>{file.type}</td>
                <td>-</td>
              </tr>
            ))}
          </tbody>
        </table>
        {currentSrc && (
          <img className="modalThumbnail" src={currentSrc} alt="" />
        )}
      </div>
      <div className="winBtnBox">
        <div class="winButton" id="copy_btn">
          <span>USB로 복사</span>
        </div>
        <div class="winButton" id="delete_btn">
          <span>삭제</span>
        </div>
        <div class="winButton" id="ok_btn" onClick={onClose}>
          <span>닫기</span>
        </div>
      </div>
    </div>
  );
}
