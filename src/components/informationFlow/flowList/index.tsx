import SinglePictureItem from "../singlePictureItem";
import styles from "./index.module.scss";

const InformationFlowList = () => {

  //TODO:待修改
  const data = [
    {
      content:
        "一旦我国武统台湾,美将 打击中方核武库和火箭军, 美司令嚣张至极 一旦我国武统台湾,美将 打击中方核武库和火箭军, 美司令嚣张至极 一旦我国武统台湾,美将 打击中方核武库和火箭军, 美司令嚣张至极",
      commentInfo: "174评",
      author: "惜蕊说历史",
      image:
        "https://images.unsplash.com/photo-1567945716310-4745a6b7844b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=60",
    },
    {
      content:
        "一旦我国武统台湾,美将 打击中方核武库和火箭军, 美司令嚣张至极 一旦我国武统台湾,美将 打击中方核武库和火箭军, 美司令嚣张至极 一旦我国武统台湾,美将 打击中方核武库和火箭军, 美司令嚣张至极",
      commentInfo: "50评",
      author: "小易寒",
      image:
        "https://images.unsplash.com/photo-1620476214170-1d8080f65cdb?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=3150&q=80",
    },
    {
      content:
        "一旦我国武统台湾,美将 打击中方核武库和火箭军, 美司令嚣张至极 一旦我国武统台湾,美将 打击中方核武库和火箭军, 美司令嚣张至极 一旦我国武统台湾,美将 打击中方核武库和火箭军, 美司令嚣张至极",
      commentInfo: "50评",
      author: "小易寒",
  },
  ];

  return (
    <div className={styles.container}>
      {data.map((item,key) => (
        <SinglePictureItem {...item} key={key} />
      ))}
    </div>
  );
};

export default InformationFlowList;
