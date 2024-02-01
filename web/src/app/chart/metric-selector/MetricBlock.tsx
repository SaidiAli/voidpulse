import { DataType, MetricMeasurement, PropOrigin } from "@voidpulse/api";
import React, { useState } from "react";
import {
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
} from "@floating-ui/react";
import { MetricSelector } from "./MetricSelector";
import { IoIosArrowDown } from "react-icons/io";
import { RxDragHandleDots2 } from "react-icons/rx";
import { IoClose, IoFilter } from "react-icons/io5";
import { FilterBlock } from "./FilterBlock";
import { Metric, MetricFilter } from "./Metric";
import { LineSeparator } from "../../ui/LineSeparator";

interface MetricBlockProps {
  idx: number;
  metric?: Metric | null;
  onEventNameChange: (eventName: string) => void;
  onDelete?: () => void;
  onAddFilter?: (f: MetricFilter) => void;
  onDeleteFilter?: (f: MetricFilter) => void;
}

export const MetricBlock: React.FC<MetricBlockProps> = ({
  idx,
  metric,
  onEventNameChange,
  onDelete,
  onAddFilter,
  onDeleteFilter,
}) => {
  const [isOpen, setIsOpen] = useState(!metric);
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: "bottom-start",
  });
  const { getReferenceProps, getFloatingProps } = useInteractions([
    useClick(context),
    useDismiss(context),
  ]);
  const [addNewFilter, setAddNewFilter] = useState(false);

  return (
    // Full metric block: label, drag handle, metric selector, and measurement.
    // Can be empty if no metric is selected.
    // Can be expanded to add metric specific filters.
    <div className="standard card py-1 px-1 my-2" key={idx}>
      <div className="flex flex-row">
        {/* Left side of the button for the label and drag handle*/}
        <div className={"cursor-grab accent-hover group rounded-md"}>
          {/* Square label for the dataset letter ID */}
          <div
            className="text-primary-900 flex text-sm font-bold m-2 bg-secondary-signature-100 rounded-md items-center"
            style={{
              height: 18,
              width: 18,
              textAlign: "center",
              justifyContent: "center",
              marginTop: 8,
            }}
          >
            {String.fromCharCode(idx + "A".charCodeAt(0))}
          </div>
          <RxDragHandleDots2 className="mx-auto opacity-0 group-hover:opacity-100" />
        </div>

        {/* Main middle section for choosing events and units */}
        <div className={"flex flex-col w-full"}>
          {/* Metric selector */}
          <div className="flex justify-between items-center group">
            <button
              {...getReferenceProps()}
              ref={refs.setReference}
              className="w-full text-primary-100 flex text-sm accent-hover p-2 font-semibold rounded-md"
            >
              {metric?.eventName || "Select event"}
            </button>
            {onAddFilter ? (
              <div
                className="rounded-md opacity-0 transition-opacity group-hover:opacity-100 accent-hover"
                onClick={() => {
                  console.log("Adding filter");
                  setAddNewFilter(true);
                }}
              >
                <IoFilter size={36} className="fill-primary-500 p-2" />
              </div>
            ) : null}
            {onDelete ? (
              <div
                className="rounded-md opacity-0 transition-opacity group-hover:opacity-100 hover:bg-secondary-red-100/20"
                onClick={onDelete}
              >
                <IoClose
                  size={36}
                  className="fill-primary-500 hover:fill-secondary-red-100 p-2"
                />
              </div>
            ) : null}
          </div>

          {/* Floating UI for choosing metric to add */}
          {isOpen ? (
            <div
              ref={refs.setFloating}
              {...getFloatingProps()}
              style={floatingStyles}
            >
              <MetricSelector
                eventName={metric?.eventName || ""}
                onEventNameChange={(name) => {
                  setIsOpen(false);
                  onEventNameChange(name);
                }}
              />
            </div>
          ) : null}

          {/* Metric measurement */}
          <div className="text-primary-400 text-xs accent-hover px-2 py-2 rounded-md flex items-center">
            {
              {
                [MetricMeasurement.totalEvents]: "Total events",
                [MetricMeasurement.uniqueUsers]: "Unique users",
              }[metric?.type || MetricMeasurement.totalEvents]
            }
            <IoIosArrowDown className="ml-1" />
          </div>

          {/* Metric specific filters */}
          {metric?.filters
            ? metric?.filters.map((metricSpecificFilter, i) => {
                return (
                  <FilterBlock
                    key={i}
                    onDelete={() => {
                      onDeleteFilter
                        ? onDeleteFilter(metricSpecificFilter)
                        : undefined;
                    }}
                    onFilterChosen={() => {
                      console.log("Changing filter");
                    }}
                  />
                );
              })
            : null}
          {/* Show a shell filter block if we are about to add a new filter in here: */}
          {/* Like with the Metric Block itself, once the filter is successfully added, 
          hide the new filter shell and show it as part of the list above. */}
          {/* This should only be happening in an established metric block where the onAddFilter function exists.*/}
          {addNewFilter && onAddFilter ? (
            <>
              <LineSeparator />
              <FilterBlock
                onFilterChosen={(filter) => {
                  //Tell the parent to add a new filter to the metric
                  onAddFilter(filter);
                  //Hide the new filter shell
                  setAddNewFilter(false);
                }}
              />
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};
