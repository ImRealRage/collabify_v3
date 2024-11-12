import React, { useState } from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import CoverOptions from '../_shared/CoverOptions'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

function CoverPicker({children, setNewCover}) {

    const [selectedCover, setSelectedCover] = useState(null);

  return (
    <Dialog>
      <DialogTrigger className='w-full object-cover'>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Cover</DialogTitle>
          {/* Avoid <p> inside DialogDescription, using <div> instead */}
          <DialogDescription>
            <div className="text-sm text-muted-foreground">
              Select a cover from the options below:
            </div>
          </DialogDescription>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-3">
            {CoverOptions.map((cover, index) => (
              <div onClick={()=>setSelectedCover(cover?.imageUrl)} key={index} className={`${selectedCover==cover?.imageUrl
              &&'border-primary border-2'} p-1 rounded-md cover-option`}>
                <Image 
                  src={cover?.imageUrl} 
                  width={200} 
                  height={140} 
                  alt={`cover image ${index}`}
                  className='h-[70px] w-full rounded-md object-cover'
                />
              </div>
            ))}
          </div>
        </DialogHeader>
        <DialogFooter className="">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button" onClick={()=>setNewCover(selectedCover)}>
              Update
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CoverPicker
