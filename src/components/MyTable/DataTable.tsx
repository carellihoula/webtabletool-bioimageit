import { useMemo } from "react";
import { DataTableProps } from "../../types";
import { MaterialReactTable, MRT_ColumnDef } from "material-react-table";
import { ThumbnailCell } from "./ThumbnailCell";
// import { useSocket } from "../../context/SocketContext";

// Dynamically builds and renders the table based on the node's content type.
export const DataTable: React.FC<DataTableProps> = ({ selectedNode }) => {
  // const { sendMessage } = useSocket();
  // const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});
  const hasData = selectedNode.results.length > 0;

  // Check if the node is of type "List files"
  const isListFiles = selectedNode.node === "List files";

  // Check if there is at least one non-null "_thumbnail" key (other than "path_thumbnail")
  const isImageNode =
    hasData &&
    selectedNode.results.some((item) =>
      Object.entries(item).some(
        ([key, value]) =>
          key.endsWith("_thumbnail") &&
          key !== "path_thumbnail" &&
          value !== null &&
          value !== undefined
      )
    );

  // Build table data based on node type
  const tableData = useMemo(() => {
    if (!hasData) return [];

    // "List files" case: display only the input image
    if (isListFiles) {
      return selectedNode.results.map((res) => ({
        input: res.path_thumbnail || null,
        absoluteInput: res.path || null,
      }));
    }

    // Image node case: display both input and output images
    if (isImageNode) {
      return selectedNode.results.map((res) => {
        const input = res.path_thumbnail || null;
        const absoluteInput = res.path || null; // absolute path for the input image

        // For the output image, find the key ending with "_thumbnail" (but not "path_thumbnail")
        const outputKey = Object.keys(res).find(
          (key) => key.endsWith("_thumbnail") && key !== "path_thumbnail"
        );
        const output = outputKey ? res[outputKey] : null;

        // Absolute output path is in the same key as the output thumbnail but without the "_thumbnail" suffix.
        const absoluteOutputKey = outputKey
          ? outputKey.replace(/_thumbnail$/, "")
          : null;
        const absoluteOutput = absoluteOutputKey
          ? res[absoluteOutputKey]
          : null;

        return { input, absoluteInput, output, absoluteOutput };
      });
    }

    // Statistical node: filter out keys that have only null/undefined values
    const validKeys = Object.keys(selectedNode.results[0] || {}).filter((key) =>
      selectedNode.results.some(
        (item) => item[key] !== null && item[key] !== undefined
      )
    );

    return selectedNode.results.map((res) => {
      const filtered: { [key: string]: number | string | null } = {};
      for (const key of validKeys) {
        filtered[key] = res[key];
      }
      return filtered;
    });
  }, [selectedNode.results, isListFiles, isImageNode, hasData]);

  // Define table columns based on node type
  const columns = useMemo<MRT_ColumnDef<(typeof tableData)[number]>[]>(() => {
    if (!hasData) return [];

    if (isListFiles || isImageNode) {
      // Dynamically get the key for the output image
      const outputKey =
        hasData &&
        selectedNode.results[0] &&
        Object.keys(selectedNode.results[0]).find(
          (key) => key.endsWith("_thumbnail") && key !== "path_thumbnail"
        );

      const cols: MRT_ColumnDef<(typeof tableData)[number]>[] = [
        {
          accessorKey: "input",
          header: "Liste files",
          Cell: ({ cell, row }) => (
            <ThumbnailCell
              src={cell.getValue() as string}
              alt="Input Thumbnail"
              row={row.original}
            />
          ),
        },
      ];

      // Add output column using the node's name as header
      if (outputKey) {
        cols.push({
          accessorKey: "output",
          header: selectedNode.node,
          Cell: ({ cell, row }) => (
            <ThumbnailCell
              src={cell.getValue() as string}
              alt="Output Thumbnail"
              row={row.original}
            />
          ),
        });
      }

      return cols;
    }

    // For statistical nodes: display text values
    const firstItem = tableData[0] || {};
    return Object.keys(firstItem).map((key) => ({
      accessorKey: key,
      header: key,
      Cell: ({ cell }) => {
        const value = cell.getValue();
        return value !== null && value !== undefined ? (
          <span>{String(value)}</span>
        ) : null;
      },
    }));
  }, [selectedNode, isListFiles, isImageNode, tableData, hasData]);

  return (
    <MaterialReactTable
      columns={columns}
      data={tableData}
      // enableRowSelection
      // state={{ rowSelection }}
      // onRowSelectionChange={setRowSelection}
    />
  );
};
