import { useMemo } from "react";
import { MaterialReactTable, MRT_ColumnDef } from "material-react-table";
import { Copy } from "lucide-react";

interface ImageResult {
  path: string;
  input_thumbnail: string;
  output_thumbnail?: string;
  // Dynamic keys for the result
  // These keys are not known in advance and can vary
  [key: string]: any;
}

interface NodeData {
  node: string;
  results: ImageResult[];
}

interface MyTableProps {
  messages: NodeData[];
}

const MyTable: React.FC<MyTableProps> = ({ messages }) => {
  // Set the maximum number of lines to be displayed
  const maxRows = useMemo(() => {
    return messages.reduce(
      (max, message) => Math.max(max, message.results.length),
      0
    );
  }, [messages]);

  // Create one column per node (with header equal to message.node)
  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () =>
      messages.map((msg, nodeIndex) => ({
        accessorKey: `col${nodeIndex}`,
        header: msg.node,
        Cell: ({ cell }) => {
          const result = cell.getValue() as ImageResult | null;
          if (!result) return null;
          return (
            <div className="flex flex-col items-center gap-4">
              {/* <div className="flex flex-col items-center">
                <img
                  src={result.input_thumbnail}
                  alt="Input Thumbnail"
                  style={{ width: "100%", height: "100%" }}
                  onError={(e) => {
                    e.currentTarget.src =
                      "http://localhost:8000/images/testA/Thumbnails/default.png";
                  }}
                />
                <div className="flex items-center gap-1">
                  <Copy
                    size={16}
                    onClick={() =>
                      navigator.clipboard.writeText(result.input_thumbnail)
                    }
                    className="cursor-pointer"
                  />
                  <span>Copy Input</span>
                </div>
              </div> */}
              {/* Bloc pour l'output_thumbnail (s'il existe) */}
              {result.output_thumbnail && (
                <div className="flex flex-col items-center">
                  <img
                    src={result.output_thumbnail}
                    alt="Output Thumbnail"
                    style={{ width: "100%", height: "100%" }}
                    onError={(e) => {
                      e.currentTarget.src =
                        "http://localhost:8000/images/testA/Thumbnails/default.png";
                    }}
                  />
                  <div className="flex items-center gap-1">
                    <Copy
                      size={16}
                      onClick={() =>
                        result.output_thumbnail &&
                        navigator.clipboard.writeText(result.output_thumbnail)
                      }
                      className="cursor-pointer"
                    />
                    <span>Copy Output</span>
                  </div>
                </div>
              )}
            </div>
          );
        },
      })),
    [messages]
  );

  // Prepare table data:
  // For each row (index 0 to maxRows-1), create an object with one key per column.
  const data = useMemo(() => {
    const rows: any[] = [];
    for (let rowIndex = 0; rowIndex < maxRows; rowIndex++) {
      const row: Record<string, ImageResult | null> = {};
      messages.forEach((msg, nodeIndex) => {
        row[`col${nodeIndex}`] = msg.results[rowIndex] || null;
      });
      rows.push(row);
    }
    return rows;
  }, [messages, maxRows]);

  return (
    <div style={{ position: "relative" }}>
      <MaterialReactTable columns={columns} data={data} />
    </div>
  );
};

export default MyTable;
