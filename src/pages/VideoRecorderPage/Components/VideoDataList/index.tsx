import { Key, useCallback, useEffect, useMemo, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownMenu,
  DropdownItem,
  Input,
  Pagination,
} from "@nextui-org/react";
import { capitalize } from "../../../../utils/utils";
import { VerticalDotsIcon } from "../../../../assets/VerticleDotsIcon";
import randomData from "../../../../utils/pdata";
import { BPPV_TYPES } from "../../../../utils/constants";
import { SearchIcon } from "../../../../assets/SearchIcon";
import { ChevronDownIcon } from "../../../../assets/ChevronDownIcon";
import { PlusIcon } from "../../../../assets/PlusIcon";
import { DeleteIcon } from "../../../../assets/Delete";
import { CameraIcon } from "../../../../assets/CameraIcon";

interface AnnotationListProps {
  videoStart: number;
}

export default function VideoDataList({ videoStart }: AnnotationListProps) {
  const columns = [
    { name: "NAME", uid: "name", sortable: true },
    { name: "GENDER", uid: "gender", sortable: true },
    { name: "LABELS", uid: "labels", sortable: true },
    { name: "ACTIONS", uid: "actions" },
  ];

  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState("");
  const [visibleColumns, setVisibleColumns] = useState("all");
  const [bppvTypeFilter, setBPPVTypeFilter] = useState("all");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [deleteDisabled, setDeleteDisabled] = useState(false);
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "age",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    let filteredUsers = [...randomData];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        user.patientName.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    if (
      bppvTypeFilter !== "all" &&
      Array.from(bppvTypeFilter).length !== BPPV_TYPES.length
    ) {
      filteredUsers = filteredUsers.filter((user) => {
        const labels = user.label.map((item) => item.label);
        return Array.from(bppvTypeFilter).some((type) => labels.includes(type));
      });
    }

    return filteredUsers;
  }, [randomData, filterValue, bppvTypeFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a: any, b: any) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  // const { labelTimestamps, removeLabelTimestamp } = useLabelTimestamps();

  const renderCell = useCallback(
    (item: (typeof randomData)[0], columnKey: Key) => {
      switch (columnKey) {
        case "name":
          return item.patientName;
        case "gender":
          return item.gender;
        case "labels":
          return (
            <Dropdown>
              <DropdownTrigger>
                <Button variant="bordered" size="sm" radius="full">
                  Labels
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Example with disabled actions"
                disabledKeys={["disable"]}
              >
                {item.label.map((label) => (
                  <DropdownItem key={"disable"}>
                    {BPPV_TYPES.find((a) => a.value === label.label)?.label}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          );
        case "actions":
          return (
            <div className="flex justify-between">
              <Button
                size="sm"
                // variant="bordered"
                color="warning"
                radius="full"
                startContent={<CameraIcon />}
              >
                Video
              </Button>
              <div className="relative flex justify-end items-center">
                <Dropdown>
                  <DropdownTrigger>
                    <Button isIconOnly size="sm" variant="light">
                      <VerticalDotsIcon />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu>
                    <DropdownItem>View</DropdownItem>
                    <DropdownItem>Edit</DropdownItem>
                    <DropdownItem>Delete</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </div>
          );
        default:
          return "";
      }
    },
    []
  );

  const onNextPage = useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = useCallback((e: any) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = useCallback((value: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            size="sm"
            className="w-full sm:max-w-[44%]"
            placeholder="Search by name..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown closeOnSelect={false}>
              <DropdownTrigger className="sm:flex">
                <Button endContent={<ChevronDownIcon />} variant="flat">
                  BPPV Type
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                selectedKeys={bppvTypeFilter}
                selectionMode="multiple"
                onSelectionChange={setBPPVTypeFilter}
              >
                {BPPV_TYPES.map((bppvType) => (
                  <DropdownItem key={bppvType.value}>
                    {bppvType.label}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="sm:flex">
                <Button endContent={<ChevronDownIcon />} variant="flat">
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button
              color="danger"
              endContent={<DeleteIcon />}
              isDisabled={!Boolean(Array.from(selectedKeys).length)}
            >
              Delete
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {randomData.length} users
          </span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    bppvTypeFilter,
    visibleColumns,
    onRowsPerPageChange,
    randomData.length,
    onSearchChange,
    hasSearchFilter,
    selectedKeys,
  ]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${filteredItems.length} selected`}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
          >
            Previous
          </Button>
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

  return (
    <Table
      aria-label="Example table with custom cells, pagination and sorting"
      isHeaderSticky
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      classNames={{
        wrapper: "max-h-[382px]",
      }}
      selectedKeys={selectedKeys}
      selectionMode="multiple"
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      onSelectionChange={setSelectedKeys}
      onSortChange={setSortDescriptor}
    >
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn key={column.uid} align={"start"}>
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={"No users found"} items={sortedItems}>
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
