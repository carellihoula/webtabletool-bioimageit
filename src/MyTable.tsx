import { useMemo } from "react";
import { MaterialReactTable, MRT_ColumnDef } from "material-react-table";
import { useSocket } from "./context/SocketContext";

interface ImageData {
  path: string;
  [key: string]: any;
}

const MyTable: React.FC = () => {
  const { messages, connectionStatus } = useSocket();

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
                  style={{ width: "100px", height: "auto" }}
                  onError={(e) => {
                    e.currentTarget.src =
                      "http://localhost:8000/images/website.jpg";
                  }}
                />
              </div>
              <p className="text-center bg-amber-900 rounded-b-lg text-white w-fill">
                {value.path}
              </p>
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
