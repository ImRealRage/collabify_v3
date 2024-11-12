import React, { useState } from 'react'
import DocumentHeader from './DocumentHeader'
import DoumentInfo from './DoumentInfo'
import RichDocumentEditor from './RichDocumentEditor'
import { Button } from '@/components/ui/button'
import { MessageSquareQuote, X } from 'lucide-react'
import CommentBox from './CommentBox'

function DocumentEditiorSection({params}) {

    const [openComment, setOpenComment] = useState(false);

  return (
    <div>
        {/* Header */}
        <DocumentHeader />

        {/* Document Info */}
        <DoumentInfo params={params} />

        {/* Rich text editor */}
        <div className="grid grid-cols-4">
          <div className="col-span-3">
            <RichDocumentEditor params={params} />
          </div>

          <div className="fixed right-5 bottom-5">
            <Button onClick = {() => {
              setOpenComment(!openComment)
            }}
            >
              {openComment ? <X /> : <MessageSquareQuote />}
            </Button>
            {openComment && <CommentBox />}
          </div>
        </div>
    </div>
  )
}

export default DocumentEditiorSection