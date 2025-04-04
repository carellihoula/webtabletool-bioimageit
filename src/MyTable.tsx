import { useMemo, useEffect, useState } from "react";
import { MaterialReactTable, MRT_ColumnDef } from "material-react-table";

interface ImageResult {
  input_thumbnail?: string;
  output_thumbnail?: string;
  [key: string]: any;
}

interface NodeData {
  node: string;
  results: ImageResult[];
}

interface MyTableProps {
  messages: NodeData[];
}

interface ThumbnailCellProps {
  src: string;
  alt: string;
}

const ThumbnailCell: React.FC<ThumbnailCellProps> = ({ src, alt }) => {
  if (!src) return null;
  return (
    <div className="flex flex-col items-center">
      <img
        src={src}
        alt={alt}
        style={{ width: "100px", height: "100px" }}
        onError={(e) => {
          e.currentTarget.src =
            "http://localhost:8000/images/testA/Thumbnails/default.png";
        }}
      />
    </div>
  );
};

interface DataTableProps {
  selectedNode: NodeData;
}

const DataTable: React.FC<DataTableProps> = ({ selectedNode }) => {
  const hasData = selectedNode.results.length > 0;

  // Determine node type
  const isListFiles = selectedNode.node === "List files";
  const isImageNode =
    !isListFiles &&
    hasData &&
    ("input_thumbnail" in selectedNode.results[0] ||
      "output_thumbnail" in selectedNode.results[0]);

  // Data Construction based on node type
  const tableData = useMemo(() => {
    if (!hasData) return [];
    if (isListFiles) {
      return selectedNode.results.map((res) => ({
        input: res.input_thumbnail || null,
      }));
    } else if (isImageNode) {
      return selectedNode.results.map((res) => ({
        input: res.input_thumbnail || null,
        output: res.output_thumbnail || null,
      }));
    } else {
      // Statistical node : use objects directly
      return selectedNode.results;
    }
  }, [selectedNode.results, isListFiles, isImageNode, hasData]);

  // Column definition
  const columns = useMemo<MRT_ColumnDef<any>[]>(() => {
    if (isListFiles) {
      return [
        {
          accessorKey: "input",
          header: "List Files",
          Cell: ({ cell }) => (
            <ThumbnailCell
              src={cell.getValue() as string}
              alt="Input Thumbnail"
            />
          ),
        },
      ];
    } else if (isImageNode) {
      return [
        {
          accessorKey: "input",
          header: "List Files",
          Cell: ({ cell }) => (
            <ThumbnailCell
              src={cell.getValue() as string}
              alt="Input Thumbnail"
            />
          ),
        },
        {
          accessorKey: "output",
          header: selectedNode.node,
          Cell: ({ cell }) => (
            <ThumbnailCell
              src={cell.getValue() as string}
              alt="Output Thumbnail"
            />
          ),
        },
      ];
    } else {
      // Statistical node: generate a column for each key present in the first result
      const keys = Object.keys(selectedNode.results[0] || {});
      return keys.map((key) => ({
        accessorKey: key,
        header: key,
        Cell: ({ cell }) => <span>{String(cell.getValue())}</span>,
      }));
    }
  }, [selectedNode, isListFiles, isImageNode]);

  return (
    <MaterialReactTable columns={columns} data={hasData ? tableData : []} />
  );
};

const MyTable: React.FC<MyTableProps> = ({ messages }) => {
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);

  // Update the selected node as soon as new data is received
  useEffect(() => {
    if (messages && messages.length > 0) {
      // Here we take the last node received
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
