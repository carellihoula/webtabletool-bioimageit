import { useEffect, useRef, useState } from "react";
import { ThumbnailCellProps } from "../../types";
import { Check, Copy } from "lucide-react";
import { Input } from "../ui/input";

// Component to display an image with a fallback on error
export const ThumbnailCell: React.FC<ThumbnailCellProps> = ({
  src,
  alt,
  row,
}) => {
  console.log("ThumbnailCell props h:", row);
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Extract file name from path
  const getFileName = (path: string) => {
    return path.split("/").pop() || path;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(String(row?.absoluteOutput ?? ""));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  // Focus and select the input text when editing is enabled.
  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  if (!src) return null;

  return (
    <div className="flex flex-col items-center gap-1">
      <img
        src={src}
        alt={alt}
        style={{ width: "100px", height: "100px" }}
        onError={(e) => {
          // Fallback image URL
          e.currentTarget.src =
            "http://localhost:8000/images/testA/Thumbnails/Binary threshold/neurons-7420670_640_thresholded_7-1.png";
        }}
      />
      <div className="flex items-center justify-center gap-2 text-xs mt-1">
        {editing ? (
          <Input
            ref={inputRef}
            type="text"
            defaultValue={row?.absoluteOutput ?? ""}
            onBlur={() => setEditing(false)}
            className="bg-[#8d8d8d]"
          />
        ) : (
          <span
            className="font-raleway cursor-pointer"
            onClick={() => setEditing(true)}
          >
            {getFileName(src)}
          </span>
        )}
        <button
          onClick={copyToClipboard}
          title="Copy full path"
          className="text-gray-500 cursor-pointer hover:text-blue-600"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      </div>
    </div>
  );
};
