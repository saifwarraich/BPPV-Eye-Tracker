import { Key, useCallback, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Tooltip,
} from "@nextui-org/react";
import { DeleteIcon } from "../../../../assets/Delete";
import { EditIcon } from "../../../../assets/EditIcon";
import { LabelTimestampsType } from "../../Types";
import { getTimeDifference } from "../../../../utils/utils";
import { useLabelTimestamps } from "../../../../Context/useLabelTimeStamp";

interface AnnotationListProps {
  videoStart: number;
}

export default function AnnotationList({ videoStart }: AnnotationListProps) {
  const columns = [
    { name: "TIME", uid: "time" },
    { name: "TYPE", uid: "type" },
    { name: "ACTIONS", uid: "actions" },
  ];

  const { labelTimestamps, removeLabelTimestamp } = useLabelTimestamps();

  const renderCell = useCallback(
    (item: LabelTimestampsType, columnKey: Key) => {
      switch (columnKey) {
        case "time":
          return `${getTimeDifference(
            item.start,
            videoStart
          )} - ${getTimeDifference(item.end, videoStart)}`;
        case "type":
          return (
            <Chip color="primary" size="sm" variant="flat">
              {item.label}
            </Chip>
          );
        case "actions":
          return (
            <div className="relative flex items-center gap-2">
              <Tooltip content="Edit Label">
                <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                  <EditIcon />
                </span>
              </Tooltip>
              <Tooltip color="danger" content="Delete user">
                <span
                  className="text-lg text-danger cursor-pointer active:opacity-50"
                  onClick={() => removeLabelTimestamp(item.id)}
                >
                  <DeleteIcon />
                </span>
              </Tooltip>
            </div>
          );
        default:
          return "";
      }
    },
    []
  );

  return (
    <Table aria-label="Example table with custom cells">
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={labelTimestamps}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
