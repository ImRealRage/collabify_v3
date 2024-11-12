import React from 'react'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"

function NotificationBox({children}) {
  return (
    <Popover>
        <PopoverTrigger>{children}</PopoverTrigger>
        <PopoverContent>No notifications as of now. 👀⏳🥱</PopoverContent>
    </Popover>
  )
}

export default NotificationBox