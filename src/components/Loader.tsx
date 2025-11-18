import React from "react";

export default function Loader() {
  return (
    <div className="w-full flex justify-center items-center py-10">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-500 border-t-transparent" />
    </div>
  );
}
