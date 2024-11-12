import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import DocumentOptions from './DocumentOptions';
import { deleteDoc, doc } from 'firebase/firestore';
import { toast } from 'sonner';
import { db } from '@/config/firebaseConfig';

function DocumentList({ documentList, params }) {
    const router = useRouter();
    const DeleteDocument = async (docId) => {
        try {
            // Assuming the documents are in the "workspaceDocuments" collection
            await deleteDoc(doc(db, "workspaceDocuments", docId));  // Correct collection name
            toast.success('Document Deleted Successfully!');
        } catch (error) {
            toast.error('Error deleting document: ' + error.message);
        }
    }

    // Ensure params is available and unwrapped if it's a promise
    const workspaceId = params?.workspaceId;
    const documentId = params?.documentId;

    return (
        <div>
            {documentList.map((doc, index) => (
                <div
                    key={index}
                    className={`mt-3 p-2 px-3 hover:bg-purple-200 rounded-lg cursor-pointer flex justify-between items-center
                    ${doc.id === documentId ? 'bg-gray-200' : ''}
                    transform transition-all duration-300 ease-in-out
                    hover:shadow-lg`} // Removed hover:scale-105
                    onClick={() => {
                        if (workspaceId && doc.id) {
                            router.push(`/workspace/${workspaceId}/${doc.id}`);
                        }
                    }}
                >
                    <div className="flex gap-2 items-center">
                        {/* Default Image when no emoji is set */}
                        {!doc.emoji && (
                            <Image src="/colab_doc.svg" width={20} height={20} alt="file" />
                        )}
                        <h2 className="flex gap-2">
                            {doc?.emoji} {doc.documentName}
                        </h2>
                    </div>
                    <DocumentOptions doc={doc} deleteDocument={(docId) => DeleteDocument(docId)} />
                </div>
            ))}
        </div>
    );
}

export default DocumentList;
