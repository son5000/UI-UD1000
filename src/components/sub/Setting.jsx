import { useState } from "react";

export default function Setting({
  onCalibration,
  onDateTime,
  onTempRange,
  onClose,
}) {
  return (
    <div id="settingWindow">
      <h2>SETTING</h2>
      <div className="settingMenuBox">
        <div
          className="settingMenu up_btn"
          id="btnCameraCali"
          onClick={onCalibration}
        >
          <img src="images/align.png" alt="Camera Calibration" />
          <div>
            <span style={{ color: "#c0c0c0" }}>Camera Calibration</span>
          </div>
        </div>

        <div
          className="settingMenu up_btn"
          id="btnDateTime"
          onClick={onDateTime}
        >
          <img src="images/datetime.png" alt="Date Time Setting" />
          <div>
            <span style={{ color: "#c0c0c0" }}>Date/Time Setting</span>
          </div>
        </div>

        <div
          className="settingMenu up_btn"
          id="btnTempRange"
          onClick={onTempRange}
        >
          <span className="btn_temp" id="max_btn">
            -20℃
          </span>
          <span className="btn_temp" id="min_btn">
            150℃
          </span>
          <img src="images/temp_range.png" alt="Temp Range" />
          <div>
            <span style={{ color: "#c0c0c0" }}>Temp. Range</span>
          </div>
        </div>
      </div>

      <div className="winButton" id="ok_btn2" onClick={onClose}>
        <span>닫기</span>
      </div>
    </div>
  );
}
