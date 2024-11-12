"use client";

import React, { useEffect, useRef, useCallback } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import Delimiter from '@editorjs/delimiter';
import Alert from 'editorjs-alert';
import List from '@editorjs/list';
import NestedList from '@editorjs/nested-list';
import Checklist from '@editorjs/checklist';
import Embed from '@editorjs/embed';
import SimpleImage from 'simple-image-editorjs';
import Table from '@editorjs/table';
import CodeTool from '@editorjs/code';
import { doc, getDoc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@/config/firebaseConfig';
import { useParams } from 'next/navigation';
import debounce from 'lodash.debounce';
import GenerateAITemplate from './GenerateAITemplate';

function RichDocumentEditor() {
  const params = useParams();
  const documentId = params?.documentId;
  const editorRef = useRef(null);
  const unsubscribeRef = useRef(null);
  const isOwnChange = useRef(false);

  useEffect(() => {
    if (documentId && !editorRef.current) {
      initializeEditor();
    }
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, [documentId]);

  const initializeEditor = async () => {
    const existingData = await fetchDocumentData();
    editorRef.current = new EditorJS({
      holder: 'editorjs',
      data: existingData,
      onChange: handleEditorChange,
      tools: {
        header: Header,
        delimiter: Delimiter,
        alert: {
          class: Alert,
          inlineToolbar: true,
          shortcut: 'CMD+SHIFT+A',
          config: {
            alertTypes: [
              'primary',
              'secondary',
              'info',
              'success',
              'warning',
              'danger',
              'light',
              'dark',
            ],
            defaultType: 'primary',
            messagePlaceholder: 'Enter something',
          },
        },
        list: {
          class: List,
          inlineToolbar: true,
        },
        nestedList: {
          class: NestedList,
          inlineToolbar: true,
        },
        checklist: {
          class: Checklist,
          inlineToolbar: true,
        },
        embed: {
          class: Embed,
          inlineToolbar: true,
          config: {
            services: {
              youtube: true,
              vimeo: true,
              twitter: true,
              instagram: true,
            },
          },
        },
        simpleImage: {
          class: SimpleImage,
          inlineToolbar: true,
        },
        table: {
          class: Table,
          inlineToolbar: true,
        },
        code: {
          class: CodeTool,
          inlineToolbar: false,
        },
      },
    });

    editorRef.current.isReady
      .then(() => {
        const docRef = doc(db, 'documentOutput', documentId);
        unsubscribeRef.current = onSnapshot(
          docRef,
          { includeMetadataChanges: true },
          (docSnap) => {
            if (docSnap.exists()) {
              if (docSnap.metadata.hasPendingWrites) {
                return;
              }

              if (!isOwnChange.current) {
                let data = docSnap.data().output;

                if (typeof data === 'string') {
                  try {
                    data = JSON.parse(data);
                  } catch (error) {
                    console.error('Error parsing data:', error);
                    data = { blocks: [] };
                  }
                }

                // Ensure data has the correct format
                if (!data || !Array.isArray(data.blocks)) {
                  data = { blocks: [] };
                }

                // Update the editor content
                if (editorRef.current) {
                  try {
                    editorRef.current.blocks.render(data);
                  } catch (error) {
                    console.error('Error rendering editor content:', error);
                  }
                }
              } else {
                isOwnChange.current = false;
              }
            }
          }
        );
      })
      .catch((error) => {
        console.error('Editor.js initialization error:', error);
      });
  };

  const fetchDocumentData = async () => {
    try {
      const docRef = doc(db, 'documentOutput', documentId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        let data = docSnap.data().output;

        if (typeof data === 'string') {
          try {
            data = JSON.parse(data);
          } catch (error) {
            console.error('Error parsing data:', error);
            data = { blocks: [] };
          }
        }

        // Ensure data has the correct format
        if (!data || !Array.isArray(data.blocks)) {
          data = { blocks: [] };
        }

        return data;
      } else {
        // Initialize the document with correct empty structure
        const initialData = { blocks: [] };
        await setDoc(docRef, { output: JSON.stringify(initialData) });
        return initialData;
      }
    } catch (error) {
      console.error('Error fetching document:', error);
      return { blocks: [] };
    }
  };

  const saveDocument = useCallback(
    debounce(async (outputData) => {
      try {
        const docRef = doc(db, 'documentOutput', documentId);
        isOwnChange.current = true;

        // Ensure outputData is in correct format
        if (!outputData || !Array.isArray(outputData.blocks)) {
          outputData = { blocks: [] };
        }

        await updateDoc(docRef, { output: JSON.stringify(outputData) });
      } catch (error) {
        console.error('Error saving document:', error);
      }
    }, 1000),
    [documentId]
  );

  const handleEditorChange = async () => {
    if (editorRef.current) {
      try {
        const outputData = await editorRef.current.save();
        saveDocument(outputData);
      } catch (error) {
        console.error('Error saving document:', error);
      }
    }
  };

  return (
    <div className="lg:mr-80 ml-20">
      <div id="editorjs"></div>
      <div className="fixed bottom-10 md:ml-80 left-0 z-10">
        <GenerateAITemplate
          setGenetateAIOutput={(output) => {
            if (editorRef.current) {
              editorRef.current.blocks.render(output);
            }
          }}
        />
      </div>
    </div>
  );
}

export default RichDocumentEditor;
