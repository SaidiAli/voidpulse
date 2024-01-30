import React from "react";
import Downshift from "downshift";
import { useProjectBoardContext } from "../../../../providers/ProjectBoardProvider";
import { trpc } from "../../utils/trpc";
import { Input } from "../../ui/Input";

interface MetricSelectorProps {
  eventName: string;
  onEventNameChange: (eventName: string) => void;
}

export const MetricSelector: React.FC<MetricSelectorProps> = ({
  eventName,
  onEventNameChange,
}) => {
  const { projectId } = useProjectBoardContext();
  const { data } = trpc.getEventNames.useQuery({ projectId });

  return (
    <Downshift
      onChange={(selection) =>
        onEventNameChange(selection ? selection.value : "")
      }
      itemToString={(item) => (item ? item.value : "")}
      initialIsOpen
    >
      {({
        getInputProps,
        getItemProps,
        getLabelProps,
        getMenuProps,
        isOpen,
        inputValue,
        highlightedIndex,
        selectedItem,
        getRootProps,
      }) => (
        <div
          style={{ width: 320, height: 260 }}
          className="bg-primary-700 flex flex-col"
        >
          {/* <label {...getLabelProps()}>Enter a fruit</label> */}
          <div
            style={{ display: "inline-block" }}
            className="w-full"
            {...getRootProps({}, { suppressRefError: true })}
          >
            <Input {...getInputProps({ autoFocus: true })} />
          </div>
          <ul
            {...getMenuProps({
              className: "overflow-auto flex-1",
            })}
          >
            {isOpen
              ? data?.names
                  .filter((item) => !inputValue || item.includes(inputValue))
                  .map((item, index) => (
                    <li
                      {...getItemProps({
                        key: item,
                        index,
                        item: { value: item },
                        style: {
                          backgroundColor:
                            highlightedIndex === index ? "lightgray" : "#000",
                          fontWeight: selectedItem === item ? "bold" : "normal",
                        },
                      })}
                    >
                      {item}
                    </li>
                  ))
              : null}
          </ul>
        </div>
      )}
    </Downshift>
  );
};