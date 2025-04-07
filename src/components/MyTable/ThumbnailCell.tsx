import { ThumbnailCellProps } from "../../types";

// Component to display an image with a fallback on error
export const ThumbnailCell: React.FC<ThumbnailCellProps> = ({ src, alt }) => {
  if (!src) return null;
  return (
    <div className="flex flex-col items-center">
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
    </div>
  );
};
