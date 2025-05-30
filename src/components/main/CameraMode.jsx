import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useRef, useCallback, useState } from "react";
import styles from "./CameraMode.module.css";

export default function CameraMode() {
  const sliderRef = useRef(null);
  const [centerIndex, setCenterIndex] = useState(1);

  const next = useCallback(() => sliderRef.current?.slickNext(), []);
  const prev = useCallback(() => sliderRef.current?.slickPrev(), []);

  const slides = [
    { id: 2, text: "Thermal" },
    { id: 1, text: "Ultrasonic" },
    { id: 3, text: "Ultraviolet" },
  ];

  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 300,
    slidesToShow: 3,
    slidesToScroll: 1,
    vertical: true,
    verticalSwiping: true,
    afterChange: (current) => {
      const centered = (current + 1) % slides.length; // ✅ 중앙 index 계산
      setCenterIndex(centered);
    },
  };

  return (
    <div
      className={styles.cameraMode}
      style={{
        width: "110px", // 100px + 여유
        height: "58px", // 20px * 3 + 마진 고려
        margin: "0 auto",
        // overflow: "hidden",
      }}
    >
      <Slider ref={sliderRef} {...settings}>
        {slides.map((slide, idx) => (
          <div key={slide.id}>
            <div
              className="font-rajdhani"
              style={{
                height: "4px",
                width: "90px",
                margin: "4px auto",
                transform: idx === centerIndex ? "scale(1)" : "scale(0.9)",
                textShadow:
                  "-1px -1px 0 black, 1px -1px 0 black, -1px 1px 0 black, 1px 1px 0 black",
                transition: "all 0.1s",
                animation:
                  idx === centerIndex ? " 1s textOverlay forwards" : "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                fontSize: idx !== centerIndex ? "10px" : "14px",
                color: "white",
                opacity: idx !== centerIndex ? "0.5" : "1",
                marginLeft: "15px",
              }}
            >
              {slide.text}
            </div>
          </div>
        ))}
      </Slider>
      {/* Glass Overlay */}
      {/* <div
        style={{
          position: "absolute",
          top: "60%", // 중앙 위치
          left: "52%",
          transform: "translate(-50%, -50%)",
          width: "90px", // 슬라이드보다 살짝 크게
          height: "70px",
          borderRadius: "10px",

          pointerEvents: "none", // ✅ 클릭 막지 않게
          zIndex: 2,
        }}
      ></div> */}

      <button className={`${styles.arrow} ${styles.prevBtn}`} onClick={prev}>
        <img src="/images/leftArrow.png" alt="next" />
      </button>
      <button className={`${styles.arrow} ${styles.nextBtn}`} onClick={next}>
        <img src="/images/rightArrow.png" alt="prev" />
      </button>
    </div>
  );
}
