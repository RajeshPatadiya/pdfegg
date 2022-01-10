import React from "react";
import { MousePointer2, Type, Square } from "lucide-react";
import styles from "./Toolbar.module.css";
import classnames from "classnames";

export type Tool = "move" | "text" | "square";

interface Props {
  selectedTool: Tool;
  onChanged: (newSelectedTool: Tool) => void;
}

function Toolbar({ selectedTool, onChanged }: Props) {
  return (
    <div className={styles["toolbar"]}>
      <Well
        selected={selectedTool === "move"}
        onClick={(e) => onChanged("move")}
      >
        <MousePointer2 />
      </Well>

      <Well
        selected={selectedTool === "text"}
        onClick={(e) => onChanged("text")}
      >
        <Type />
      </Well>

      <Well
        selected={selectedTool === "square"}
        onClick={(e) => onChanged("square")}
      >
        <Square />
      </Well>
    </div>
  );
}

interface WellProps {
  selected: boolean;
  onClick: React.MouseEventHandler;
  children: React.ReactChild;
}

function Well({ selected, onClick, children }: WellProps) {
  return (
    <div
      className={classnames(styles["well"], {
        [styles["well--selected"]]: selected,
      })}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export default Toolbar;
