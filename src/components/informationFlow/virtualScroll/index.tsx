import { VariableSizeList as List, VariableSizeList } from "react-window";
import AutoSizer, { Size } from "react-virtualized-auto-sizer";
import React, { useRef } from "react";
import { useInformationFlowContext } from "../../../context/informationFlowContext";
import Row from "../row";
import { DEFAULT_HEIGHT } from "../../../type/constant";

const VirtualScroll: React.FC = () => {
  const { sizesRef } = useInformationFlowContext();
  const listRef = useRef<VariableSizeList>(null);

  const getHeight = (index: number) => {
    return sizesRef?.current?.[index] || DEFAULT_HEIGHT;
  };

  return (
    <AutoSizer>
      {({ height, width }: Size) => (
        <List
          ref={listRef}
          className="List"
          height={height}
          itemCount={6}
          itemSize={getHeight}
          width={width}
        >
          {({ index, style }) => (
            <Row index={index} style={style} listRef={listRef} />
          )}
        </List>
      )}
    </AutoSizer>
  );
};

export default VirtualScroll;
