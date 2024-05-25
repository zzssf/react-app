import styles from "./index.module.scss";
import { CloseOutline } from "antd-mobile-icons";
import { Ellipsis, Image } from "antd-mobile";
import React, { useMemo } from "react";
import { ISinglePictureItemType } from "../../../type/informationFlow";
import { EImagePosition } from "../../../type/enum";

const SinglePictureItem: React.FC<ISinglePictureItemType> = ({
  content,
  commentInfo,
  author,
  image = [],
  imagePosition,
}) => {
  const relativeInformation = useMemo(() => {
    return (
      <div className={styles.otherInformation}>
        <div>
          <span>{author}</span>
          <span> {commentInfo}</span>
        </div>
        <div className={styles.iconContainer}>
          <CloseOutline className={styles.icon} />
        </div>
      </div>
    );
  }, [author, commentInfo]);

  const renderPicture = useMemo(() => {
    if (!imagePosition) {
      return;
    }

    if (image.length === 0) {
      return;
    }

    const renderImage = <Image lazy src={image[0] || ""} />;
    const pictureMaps = new Map<EImagePosition, JSX.Element>([
      [
        EImagePosition.left,
        <div
          className={
            imagePosition === EImagePosition.left
              ? [styles.singlePicture, styles.setRightMargin].join(" ")
              : styles.singlePicture
          }
        >
          {renderImage}
        </div>,
      ],
      [
        EImagePosition.right,
        <div className={styles.singlePicture}>{renderImage}</div>,
      ],
      [
        EImagePosition.bottom,
        <div className={styles.multiPicture}>
          <div className={styles.pictures}>
            {image.map((imageUrl, key) => (
              <Image
                src={imageUrl || ""}
                key={key}
                className={styles.imageStyle}
              />
            ))}
            {image.length === 2 && <div className={styles.placeholder} />}
          </div>
          {relativeInformation}
        </div>,
      ],
    ]);

    return pictureMaps.get(imagePosition);
  }, [imagePosition, image, relativeInformation]);

  const renderOtherInformation = useMemo(() => {
    if (imagePosition === EImagePosition.bottom) {
      return;
    }

    return relativeInformation;
  }, [imagePosition, relativeInformation]);

  const containerStyle = useMemo(() => {
    if (!imagePosition) {
      return styles.container;
    }

    const containerStylesMap = new Map([
      [
        EImagePosition.left,
        [styles.setImageLeftPosition, styles.container].join(" "),
      ],
      [
        EImagePosition.bottom,
        [styles.setImageBottomPosition, styles.container].join(" "),
      ],
    ]);

    if (!containerStylesMap.has(imagePosition)) {
      return styles.container;
    }

    return containerStylesMap.get(imagePosition);
  }, [imagePosition]);

  return (
    <div className={containerStyle}>
      <div
        className={
          image.length === 1
            ? styles.textContent
            : [styles.textContent, styles.noPicture].join(" ")
        }
      >
        <div className={styles.main}>
          <Ellipsis
            direction="end"
            rows={3}
            content={content || ""}
            expandText="展开"
            collapseText="收起"
          />
        </div>
        {renderOtherInformation}
      </div>
      {renderPicture}
    </div>
  );
};

export default SinglePictureItem;
