"use client";

import React, { useEffect, useState } from "react";
import SideNav from "../../_components/SideNav";
import DocumentEditiorSection from "../../_components/DocumentEditiorSection";
import { Room } from "@/app/Room";

function WorkspaceDocument({ params }) {


  return (
    <Room params = {params}>
      <div>
        {/* Side Nav */}
        <div className="">
          <SideNav params={params} />
        </div>

        {/* Document */}
        <div className="md:ml-72">
          <DocumentEditiorSection params={params} />
        </div>
      </div>
    </Room>
  );
}

export default WorkspaceDocument;
