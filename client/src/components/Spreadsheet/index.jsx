import React, { useState } from "react";

const Spreadsheet = () => {
  return (
    <>
      <div className="text-[#363636] parent grid grid-cols-5 grid-rows-5 gap-4 h-screen relative">
        {/* Other Divs */}
        <div
          className={`div1 col-span-4 col-start-2" : row-span-2 row-start-1 the-shadow border-2 text-[#363636] rounded-xl p-4 transition-all duration-500`}
        >
          <div className="inner-grid grid grid-cols-3 grid-rows-3 gap-2 h-full">
            <div className="box1 col-start-1 col-end-5 row-start-1 row-end-3">
              Welcome
            </div>
          </div>
        </div>

        <div className="div5 row-span-3 col-start-1 row-start-1 the-shadow border-2 text-[#363636] rounded-xl p-4">
          User
        </div>
      </div>
    </>
  );
};

export default Spreadsheet;
