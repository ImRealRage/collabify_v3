"use client";

import CoverPicker from '@/app/_components/CoverPicker';
import EmojiPickerComponent from '@/app/_components/EmojiPickerComponent';
import { db } from '@/config/firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { SmilePlus } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useParams } from 'next/navigation'; // Import useParams

function DocumentInfo() {
  const params = useParams(); // Get route parameters
  const documentId = params?.documentId;

  const [coverImage, setCoverImage] = useState('/cover.jpg');
  const [emoji, setEmoji] = useState(null);
  const [documentName, setDocumentName] = useState('Untitled Document');

  // Fetch document information when documentId is available
  useEffect(() => {
    if (documentId) {
      GetDocumentInfo(documentId);
    }
  }, [documentId]);

  // Get document information from Firestore
  const GetDocumentInfo = async (documentId) => {
    const docRef = doc(db, 'workspaceDocuments', documentId);
    try {
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const docData = docSnap.data();
        console.log('Document Data:', docData);

        // Set the document data if it exists
        setCoverImage(docData?.coverImage || '/cover.jpg');
        setEmoji(docData?.emoji || null);
        setDocumentName(docData?.documentName || 'Untitled Document');
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error fetching document: ', error);
    }
  };

  const updateDocumentInfo = async (key, value) => {
    const docRef = doc(db, 'workspaceDocuments', documentId);
    try {
      await updateDoc(docRef, {
        [key]: value,
      });
      toast.success('Document updated successfully');
    } catch (error) {
      console.error('Error updating document: ', error);
      toast.error('Error updating document');
    }
  };

  // Handle changes to document name
  const handleDocumentNameChange = (e) => {
    setDocumentName(e.target.value);
  };

  // Update document name in Firebase when user finishes typing
  const handleDocumentNameBlur = () => {
    updateDocumentInfo('documentName', documentName);
  };

  // Update emoji in Firebase when it's changed
  const handleEmojiChange = (newEmoji) => {
    setEmoji(newEmoji);
    updateDocumentInfo('emoji', newEmoji);
  };

  return (
    <div>
      {/* Cover Image */}
      <CoverPicker
        setNewCover={(cover) => {
          setCoverImage(cover);
          updateDocumentInfo('coverImage', cover);
        }}
      >
        <div className="relative group cursor-pointer">
          <h2 className="hidden absolute p-4 w-full h-full items-center justify-center group-hover:flex">
            Change cover
          </h2>
          <div className="group-hover:opacity-70 relative w-full h-[200px]">
            <Image
              src={coverImage}
              alt="cover image"
              fill
              className="rounded-t-xl object-cover"
            />
          </div>
        </div>
      </CoverPicker>

      {/* Emoji Picker */}
      <div className="absolute ml-10 mt-[-40px] cursor-pointer">
        <EmojiPickerComponent setEmojiIcon={handleEmojiChange}>
          <div className="bg-[#ffffffb0] p-4 rounded-md">
            {emoji ? (
              <span className="text-5xl">{emoji}</span>
            ) : (
              <SmilePlus className="h-10 w-10 text-gray-800" />
            )}
          </div>
        </EmojiPickerComponent>
      </div>

      {/* File Name */}
      <div className="mt-10 p-10">
        <input
          type="text"
          className="font-extrabold text-4xl outline-none"
          placeholder="Untitled Document"
          value={documentName}
          onChange={handleDocumentNameChange}
          onBlur={handleDocumentNameBlur}
        />
      </div>
    </div>
  );
}

export default DocumentInfo;
