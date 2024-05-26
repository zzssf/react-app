import { InformationFlowContext } from "../../../context/informationFlowContext";
import VirtualScroll from "../virtualScroll";
import styles from "./index.module.scss";

const List = () => {
  return (
    <div className={styles.container}>
      <InformationFlowContext>
        <VirtualScroll />
      </InformationFlowContext>
    </div>
  );
};

export default List;
