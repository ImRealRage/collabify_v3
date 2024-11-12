"use client";

import React, { useState, useEffect } from "react";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";

export function Room({ children, params }) {
  const [documentId, setDocumentId] = useState(null);

  useEffect(() => {
    async function unwrapParams() {
      const unwrappedParams = await params;
      setDocumentId(unwrappedParams?.documentId);
    }
    unwrapParams();
  }, [params]);

  return (
    <LiveblocksProvider
      authEndpoint="/api/liveblocks-auth"
      resolveUsers={async ({ userIds }) => {
        const q = query(collection(db, "LoopUsers"), where("email", "in", userIds));
        const querySnapshot = await getDocs(q);
        const users = [];

        querySnapshot.forEach((doc) => {
          users.push(doc.data());
        });

        return users;
      }}
      
    >
      {documentId && (
        <RoomProvider id={documentId}>
          <ClientSideSuspense fallback={<div>Loading…</div>}>
            {children}
          </ClientSideSuspense>
        </RoomProvider>
      )}
    </LiveblocksProvider>
  );
}
