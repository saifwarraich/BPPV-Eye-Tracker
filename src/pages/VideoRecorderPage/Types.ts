import { BPPV_TYPES } from "../../utils/constants";

export interface LabelTimestampsType {
  id: string;
  start: number;
  end: number;
  label: (typeof BPPV_TYPES)[number]["value"];
}
