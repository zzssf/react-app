import FlowList from "../../components/informationFlow/list";
import styles from "./index.module.scss";

const InformationFlow = () => {
  return (
    <div className={styles.swipeableContainer}>
      <FlowList />
    </div>
  );
};

export default InformationFlow;
