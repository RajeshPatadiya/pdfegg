import { MousePointer2, Type, Square } from "lucide-react";
import React from "react";
import styles from "./Toolbar.module.css";
import classnames from "classnames";

type Tool = "move" | "text" | "square";

interface Props {
  selectedTool: Tool;
}

function Toolbar({ selectedTool }: Props) {
  return (
    <div className={styles["toolbar"]}>
      <Well selected={selectedTool === "move"}>
        <MousePointer2 />
      </Well>

      <Well selected={selectedTool === "text"}>
        <Type />
      </Well>

      <Well selected={selectedTool === "square"}>
        <Square />
      </Well>
    </div>
  );
}

interface WellProps {
  selected: boolean;
  children: React.ReactChild;
}

function Well({ selected, children }: WellProps) {
  return (
    <div
      className={classnames(styles["well"], {
        [styles["well--selected"]]: selected,
      })}
    >
      {children}
    </div>
  );
}

export default Toolbar;
