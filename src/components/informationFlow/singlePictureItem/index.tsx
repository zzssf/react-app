import styles from "./index.module.scss";
import { CloseOutline } from "antd-mobile-icons";
import { Ellipsis, Image } from "antd-mobile";
import React from "react";

interface ISinglePictureItemType {
  content?: string;
  commentInfo?: string;
  author?: string;
  image?: string;
}

const SinglePictureItem: React.FC<ISinglePictureItemType> = ({
  content,
  commentInfo,
  author,
  image,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.textContent}>
        <div className={styles.main}>
          <Ellipsis
            direction="end"
            rows={3}
            content={content || ""}
            expandText="展开"
          />
        </div>
        <div className={styles.subordination}>
          <div>
            <span>{author}</span>
            <span> {commentInfo}</span>
          </div>
          <div className={styles.iconContainer}>
            <CloseOutline className={styles.icon} />
          </div>
        </div>
      </div>
      <div className={styles.singlePicture}>
        <Image lazy src={image || ""} />
      </div>
    </div>
  );
};

export default SinglePictureItem;
