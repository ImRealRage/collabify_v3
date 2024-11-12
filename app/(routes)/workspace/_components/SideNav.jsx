"use client";

import Logo from '@/app/_components/Logo'
import { Button } from '@/components/ui/button'
import { db } from '@/config/firebaseConfig';
import { collection, doc, onSnapshot, query, setDoc, where } from 'firebase/firestore';
import { Bell, Loader2Icon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import DocumentList from './DocumentList';
import uuid4 from 'uuid4';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import NotificationBox from './NotificationBox';

const MAX_FILE=process.env.NEXT_PUBLIC_MAX_FILE_COUNT;

function SideNav({params}) {
    const [documentList, setDocumentList] = useState([]);
    const { user } = useUser();
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // Unwrap params to handle promise
    const unwrappedParams = React.use(params);

    useEffect(() => {
        if (unwrappedParams?.workspaceId) {
            GetDocumentList();
        }
    }, [unwrappedParams]);

    /**
     * Fetches document list from Firestore
     */
    const GetDocumentList = () => {
        const q = query(collection(db, 'workspaceDocuments'), 
        where('workspaceId', '==', Number(unwrappedParams?.workspaceId)));
    
        const unsubscribe = onSnapshot(q, (snapshot) => {
            // Using a functional update to avoid directly mutating the state
            const docs = [];
            snapshot.forEach((doc) => {
                docs.push(doc.data());
            });
            setDocumentList(docs);
        });

        // Optionally return the unsubscribe function to stop listening
        return unsubscribe;
    };

    const CreateNewDocument = async () => {


        if (documentList?.length >= MAX_FILE) {
            toast("Upgrade to add more files", {
                description: "You have reached the maximum limit of files. Please upgrade to add more files.",
                action: {
                    label: "Upgrade",
                    onClick: () => console.log("Upgrade action clicked")
                },
            });
            return;
        }

        setLoading(true);
        try {
            const docId = uuid4();
            await setDoc(doc(db, 'workspaceDocuments', docId.toString()), {
                workspaceId: Number(unwrappedParams?.workspaceId),
                createdBy: user?.primaryEmailAddress?.emailAddress || "Unknown User",
                coverImage: null,
                emoji: null,
                id: docId,
                documentName: "Untitled Document",
                documentOutput: []
            });

            await setDoc(doc(db, 'documentOutput', docId.toString()), {
                    id: docId,
                    output: []
            });

            // Navigate to the new workspace and document page
            router.replace(`/workspace/${unwrappedParams?.workspaceId}/${docId}`);
        } catch (error) {
            console.error("Error creating document:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="h-screen fixed md:w-72 hidden md:block bg-purple-50 p-5 shadow-md">
            <div className="flex justify-between items-center">
                <Logo />
                <NotificationBox>
                    <Bell className="h-5 w-5 text-gray-500" />
                </NotificationBox>
            </div>
            <hr className="my-5"></hr>
            <div>
                <div className="flex justify-between items-center">
                    <h2 className="font-bold">Workspace Name</h2>
                    <Button className="sm" onClick={CreateNewDocument}>
                        {loading ? <Loader2Icon className="h-4 w-4 animate-spin" /> : '+'}
                    </Button>
                </div>
            </div>
        
            {/* Document List */}
            <DocumentList documentList={documentList} params={unwrappedParams} />
        
            {/* Progress Bar */}
            <div className="absolute bottom-10 w-[85%]">
                <Progress value={(documentList?.length/MAX_FILE)*100} />
                <h2 className="text-sm font-light my-2">
                    <strong>{documentList?.length}</strong> out of 5 files used
                </h2>
                <h2 className="text-sm font-light bg-gradient-to-r from-purple-700 to-blue-800 bg-clip-text text-transparent">
                    Upgrade your plan for unlimited access
                </h2>
            </div>
        </div>
    );
}

export default SideNav;
