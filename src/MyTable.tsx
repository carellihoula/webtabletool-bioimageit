import { useMemo, useState } from "react";
import { MaterialReactTable, MRT_ColumnDef } from "material-react-table";
import { useSocket } from "./context/SocketContext";
import { Copy } from "lucide-react";

interface ImageData {
  path: string;
  [key: string]: any;
}

const MyTable: React.FC = () => {
  const { messages, connectionStatus } = useSocket();
  // const [isClicked, setIsClicked] = useState(false);
  // const handleCopy = (value: string) => {
  //   navigator.clipboard.writeText(value);
  //   setIsClicked(true);
  // };

  const maxRows = messages.reduce((max, col) => {
    if (Array.isArray(col)) {
      return Math.max(max, col.length);
    }
    return max;
  }, 0);

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () =>
      messages.map((_, colIndex) => ({
        accessorKey: `col${colIndex}`,
        header: `Colonne ${colIndex + 1}`,

        Cell: ({ cell }) => {
          const value = cell.getValue() as ImageData | null;
          if (!value || !value.path) return null;
          return (
            <div className="flex flex-col items-center gap-4">
              <div className="flex justify-center items-center ">
                <img
                  src={value.path}
                  alt={`Image ${colIndex}`}
                  style={{ width: "100%", height: "100%" }}
                  onError={(e) => {
                    e.currentTarget.src =
                      "http://localhost:8000/images/Thumbnails/List%20Files/ai-generated-9134381_640_0-0.png";
                  }}
                />
              </div>
              {/* <p className="text-center bg-amber-900 rounded-b-lg text-white w-fill">
                {value.path}
              </p> */}
              <div className="flex items-center gap-1">
                <Copy
                  size={16}
                  onClick={() => navigator.clipboard.writeText(value.path)}
                  className="cursor-pointer"
                />
                <span>Copy</span>
              </div>
            </div>
          );
        },
      })),
    [messages]
  );

  const data = useMemo(() => {
    const rows: any[] = [];
    for (let rowIndex = 0; rowIndex < maxRows; rowIndex++) {
      const row: Record<string, ImageData | null> = {};
      messages.forEach((col, colIndex) => {
        row[`col${colIndex}`] =
          Array.isArray(col) && col[rowIndex] ? col[rowIndex] : null;
      });
      rows.push(row);
    }
    return rows;
  }, [messages, maxRows]);

  return (
    <div style={{ position: "relative" }}>
      <div
        className=""
        style={{
          position: "absolute",
          top: "10px",
          zIndex: 10,
          color: "green",
          padding: "10px",
        }}
      >
        Status : {connectionStatus}
      </div>
      <MaterialReactTable columns={columns} data={data} />
    </div>
  );
};

export default MyTable;
