import React, { createContext, useState, useContext, ReactNode } from "react";
import { BPPV_TYPES } from "../utils/constants";

export interface LabelTimestampsType {
  id: string;
  start: number;
  end: number;
  label: (typeof BPPV_TYPES)[number]["value"];
}

interface LabelTimestampsContextType {
  labelTimestamps: LabelTimestampsType[];
  setLabelTimestamps: React.Dispatch<
    React.SetStateAction<LabelTimestampsType[]>
  >;
  removeLabelTimestamp: (id: string) => void;
}

const LabelTimestampsContext = createContext<LabelTimestampsContextType>({
  labelTimestamps: [],
  setLabelTimestamps: () => {},
  removeLabelTimestamp: () => {},
});

export const useLabelTimestamps = () => useContext(LabelTimestampsContext);

export const LabelTimestampsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [labelTimestamps, setLabelTimestamps] = useState<LabelTimestampsType[]>(
    []
  );

  const removeLabelTimestamp = (id: string) => {
    setLabelTimestamps((prevLabelTimestamps) =>
      prevLabelTimestamps.filter((item) => item.id !== id)
    );
  };

  return (
    <LabelTimestampsContext.Provider
      value={{ labelTimestamps, setLabelTimestamps, removeLabelTimestamp }}
    >
      {children}
    </LabelTimestampsContext.Provider>
  );
};
