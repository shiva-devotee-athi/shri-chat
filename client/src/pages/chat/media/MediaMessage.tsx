import { baseURL } from "@/api/axios.config";
import React from "react";

const MediaImageUI = ({ fileurl }: { fileurl: string }) => {
  const mediaUrl = fileurl.startsWith("/assets")
    ? `${baseURL}${fileurl}`
    : fileurl;
  return (
    <div className="leading-1.5 flex w-full max-w-[320px] mb-2 flex-col">
      <div className="group relative mt-2">
        <div className="absolute w-full h-full bg-gray-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
          <button
            data-tooltip-target="download-image"
            className="inline-flex items-center justify-center rounded-full h-10 w-10 bg-white/30 hover:bg-white/50 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50"
          >
            <svg
              className="w-5 h-5 text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 16 18"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 1v11m0 0 4-4m-4 4L4 8m11 4v3a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-3"
              />
            </svg>
          </button>
          <div
            id="download-image"
            role="tooltip"
            className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-xs opacity-0 tooltip dark:bg-gray-700"
          >
            Download image
            <div className="tooltip-arrow" data-popper-arrow></div>
          </div>
        </div>
        <img
          src={mediaUrl}
          className="rounded-lg max-h-60 w-full object-contain"
        />
      </div>
    </div>
  );
};

export const MediaDocumentUI = ({ fileurl }: { fileurl: string }) => {
  const mediaUrl = fileurl.startsWith("/assets")
    ? `${baseURL}${fileurl}`
    : fileurl;
  return (
    <div className="relative w-2xs max-w-xs max-h-60 h-60">
      <iframe
        className="absolute top-0 left-0 w-full h-full"
        src={mediaUrl}
        frameBorder={0}
        style={{ border: 0 }}
        allowFullScreen={true}
        aria-hidden="false"
        tabIndex={0}
      ></iframe>
    </div>
  );
};

export const MediaVideoUI = ({ fileurl }: { fileurl: string }) => {
  const mediaUrl = fileurl.startsWith("/assets")
    ? `${baseURL}${fileurl}`
    : fileurl;
  return (
    <video controls className="w-full max-w-xs max-h-60 rounded-md">
      <source src={mediaUrl} />
    </video>
  );
};

export const MediaAudioUI = ({ fileurl }: { fileurl: string }) => {
  const mediaUrl = fileurl.startsWith("/assets")
    ? `${baseURL}${fileurl}`
    : fileurl;
  return (
    <div className="leading-1.5 flex w-full max-w-[320px] mb-2 flex-col">
      <audio controls className="max-w-xs">
        <source src={mediaUrl} />
      </audio>
    </div>
  );
};

export default MediaImageUI;
