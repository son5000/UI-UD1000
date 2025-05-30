import Slider from "react-slick";
import styles from "./FrequencyRange.module.css";
import { useRef, useCallback } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function FrequencyRange() {
  const slickRef = useRef();

  const next = useCallback(() => {
    if (slickRef.current) {
      slickRef.current.slickNext();
    }
  }, []);

  const prev = useCallback(() => {
    if (slickRef.current) {
      slickRef.current.slickPrev();
    }
  }, []);

  const settings = {
    dots: false, // ✅ 페이지네이션 제거
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false, // ✅ 직접 버튼으로 제어하므로 false
  };

  return (
    <div className={styles.container}>
      <div className={styles.frequencyRange} style={{ width: "50px" }}>
        <Slider ref={slickRef} {...settings}>
          <div>
            <div className={styles.boxStyle}>
              <img src="/images/audible.png" alt="" />
            </div>
          </div>
          <div>
            <div className={styles.boxStyle}>
              <img src="/images/gas.png" alt="" />
            </div>
          </div>
          <div>
            <div className={styles.boxStyle}>
              <img src="/images/elec.png" alt="" />
            </div>
          </div>
        </Slider>
        <button className={`${styles.arrow} ${styles.nextBtn}`} onClick={prev}>
          <img src="/images/leftArrow.png" alt="next" />
        </button>
        <button className={`${styles.arrow} ${styles.prevBtn}`} onClick={next}>
          <img src="/images/rightArrow.png" alt="prev" />
        </button>
      </div>
    </div>
  );
}
