"use client";

import CoverPicker from '@/app/_components/CoverPicker';
import EmojiPickerComponent from '@/app/_components/EmojiPickerComponent';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { db } from '@/config/firebaseConfig';
import { useAuth } from '@clerk/clerk-react';
import { useUser } from '@clerk/nextjs';
import { doc, setDoc } from 'firebase/firestore';
import { Loader2Icon, SmilePlus } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import uuid4 from 'uuid4';

function CreateWorkspace() {

  const [coverImage, setCoverImage] = useState('/cover.jpg');
  const [workspaceName, setWorkspaceName] = useState('');
  const [emoji, setEmoji] = useState('');
  const { user } = useUser();
  const { orgId } = useAuth();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  /**
   * @description This function is used to create a new workspace and set data in db
  */
  const OnCreateWorkspace = async () => {
    setLoading(true);
    const workspaceId = Date.now();
    const createdBy = user?.primaryEmailAddress?.emailAddress || "Unknown User";
    const organizationId = orgId || createdBy;

    try {
      // Create Workspace document
      await setDoc(doc(db, "Workspace", workspaceId.toString()), {
        workspaceName: workspaceName,
        emoji: emoji,
        coverImage: coverImage,
        createdBy: createdBy,
        id: workspaceId,
        orgId: organizationId
      });

      

      // Generate a unique document ID
      const docId = uuid4();
      // Create workspace document entry
      await setDoc(doc(db, 'workspaceDocuments', docId.toString()), {
        workspaceId: workspaceId,
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
      router.replace(`/workspace/${workspaceId}/${docId}`);
    } catch (error) {
      console.error("Error creating workspace:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='p-10 md:px-36 lg:px-64 xl:px-96 py-28'>
      <div className="shadow-2xl rounded-xl">
        {/* cover image */}
        <CoverPicker setNewCover={(v) => setCoverImage(v)}>
          <div className="relative group cursor-pointer">
            <h2 className="hidden absolute p-4 w-full h-full items-center justify-center group-hover:flex">Change cover</h2>
            <div className="group-hover:opacity-70">
              <Image src={coverImage} width={400} height={400} alt='cover image'
                className='w-full h-[180px] object-cover rounded-t-xl'
              />
            </div>
          </div>
        </CoverPicker>

        {/* Input Section */}
        <div className="p-12">
          <h2 className="font-bold text-xl">Create a new workspace</h2>
          <h2 className="text-sm mt-2">This is a shared space where you can collaborate with your team.
            You can always rename it later.
          </h2>
          <div className="mt-8 flex gap-2 items-center">
            <EmojiPickerComponent setEmojiIcon={(v) => setEmoji(v)}>
              <Button variant="outline">
                {emoji ? emoji : <SmilePlus />}
              </Button>
            </EmojiPickerComponent>
            <Input placeholder="Workspace Name"
              onChange={(e) => setWorkspaceName(e.target.value)}
            />
          </div>
          <div className="mt-7 flex justify-end gap-6">
            <Button disabled={!workspaceName.length || loading}
              onClick={OnCreateWorkspace}
            >
              Create {loading && <Loader2Icon className='animate-spin ml-2' />}
            </Button>
            <Button variant="outline">Cancel</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateWorkspace;
