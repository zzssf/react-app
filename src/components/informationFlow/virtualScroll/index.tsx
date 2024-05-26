import { VariableSizeList as List } from "react-window";
import AutoSizer, { Size } from "react-virtualized-auto-sizer";
import React from "react";
import { useInformationFlowContext } from "../../../context/informationFlowContext";
import Row from "../row";
import { DEFAULT_HEIGHT } from "../../../type/constant";

const VirtualScroll: React.FC = () => {
  const { sizes } = useInformationFlowContext();

  const getHeight = (index: number) => {
    console.log(index);
    console.log(sizes?.[index], "sizes?.[index]", index);

    return sizes?.[index] || DEFAULT_HEIGHT;
  };

  return (
    <AutoSizer>
      {({ height, width }: Size) => (
        <List
          className="List"
          height={height}
          itemCount={6}
          itemSize={getHeight}
          width={width}
        >
          {Row}
        </List>
      )}
    </AutoSizer>
  );
};

export default VirtualScroll;
