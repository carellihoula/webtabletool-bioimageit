import { useEffect, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import { MyTableProps, NodeData } from "./types";
import { DataTable } from "./components/MyTable/DataTable";

// Component to display the table
const MyTable: React.FC<MyTableProps> = ({ messages }) => {
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);

  // Update the selected node when new messages are received
  useEffect(() => {
    if (messages && messages.length > 0) {
      // Use the last node received
      setSelectedNode(messages[messages.length - 1]);
    }
  }, [messages]);

  if (!selectedNode) {
    return (
      <MaterialReactTable
        columns={[]}
        data={[]}
        renderEmptyRowsFallback={() => (
          <div style={{ padding: "1rem", textAlign: "center" }}>
            No data from workflow
          </div>
        )}
      />
    );
  }

  return (
    <div style={{ position: "relative" }}>
      <DataTable selectedNode={selectedNode} />
    </div>
  );
};

export default MyTable;
