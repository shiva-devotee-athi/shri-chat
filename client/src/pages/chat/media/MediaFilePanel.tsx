import React from "react";

type MediaFilePanelProps = {
  mediaFile: File | null;
};

function formatFileSize(bytes: number) {
  if (bytes < 1024) {
    return bytes + " bytes";
  } else if (bytes < 1024 * 1024) {
    return (bytes / 1024).toFixed(2) + " KB";
  } else if (bytes < 1024 * 1024 * 1024) {
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  } else {
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
  }
}

const MediaFilePanel: React.FC<MediaFilePanelProps> = ({ mediaFile }) => {
  return (
    <div>
      {mediaFile && (
        <div className="m-2 p-2 bg-zinc-800 rounded-lg">
          {mediaFile.type.startsWith("image") && (
            <ImageUI mediaFile={mediaFile} />
          )}
          {mediaFile.type.startsWith("audio") && (
            <AudioUI mediaFile={mediaFile} />
          )}
          {mediaFile.type.startsWith("video") && (
            <VideoUI mediaFile={mediaFile} />
          )}
          {mediaFile.type.startsWith("application") && (
            <DocumentUI mediaFile={mediaFile} />
          )}
          {/* Add document preview if needed */}
        </div>
      )}
    </div>
  );
};

export default MediaFilePanel;

const ImageUI = ({ mediaFile }: { mediaFile: File }) => {
  return (
    <div className="flex justify-start gap-3">
      <img
        src={URL.createObjectURL(mediaFile)}
        alt="preview"
        className="w-24 h-24 object-cover rounded-md"
      />
      <div>
        <p className="mb-1 text-gray-500 dark:text-gray-400">
          {mediaFile.name}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {formatFileSize(mediaFile.size)}
        </p>
      </div>
    </div>
  );
};

const DocumentUI = ({ mediaFile }: { mediaFile: File }) => {
  return (
    <div className="flex justify-start gap-3">
      <div className="relative w-2xs max-w-xs max-h-60 h-40">
        <iframe
          className="absolute top-0 left-0 w-full h-full"
          src={URL.createObjectURL(mediaFile)}
          frameBorder={0}
          style={{ border: 0 }}
          allowFullScreen={false}
          aria-hidden="false"
          tabIndex={0}
        ></iframe>
      </div>
      <div>
        <p className="mb-1 text-gray-500 dark:text-gray-400">
          {mediaFile.name}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {formatFileSize(mediaFile.size)}
        </p>
      </div>
    </div>
  );
};

const AudioUI = ({ mediaFile }: { mediaFile: File }) => {
  return (
    <div className="flex justify-start gap-3">
      <audio controls className="w-full max-w-xs">
        <source src={URL.createObjectURL(mediaFile)} />
      </audio>
      <div>
        <p className="mb-1 text-gray-500 dark:text-gray-400">
          {mediaFile.name}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {formatFileSize(mediaFile.size)}
        </p>
      </div>
    </div>
  );
};

const VideoUI = ({ mediaFile }: { mediaFile: File }) => {
  return (
    <div className="flex justify-start gap-3">
      <video controls className="w-full max-w-xs max-h-[200px] rounded-md">
        <source src={URL.createObjectURL(mediaFile)} />
      </video>
      <div>
        <p className="mb-1 text-gray-500 dark:text-gray-400">
          {mediaFile.name}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {formatFileSize(mediaFile.size)}
        </p>
      </div>
    </div>
  );
};
