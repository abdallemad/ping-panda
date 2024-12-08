'use client';
import { useQueryClient } from '@tanstack/react-query'
import React, { PropsWithChildren, useState } from 'react'
import { z } from 'zod'
import { CATEGORY_NAME } from '@/lib/validator/category-validator';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"
import { Modal } from '../ui/modal';
const EVENT_CATEGORY_VALIDATION = z.object({
  name : CATEGORY_NAME,
  color: z.string().regex(/^#([0-9A-F]{6})$/i, { message: 'invalid color' }),
  emoji:z.string().emoji({ message: 'invalid emoji' }).optional(),
})

function CreateEventCategoryModal({children}:PropsWithChildren) {
  const [isOpen, setIsOpen] = useState(false)
  const queryClient = useQueryClient()

  const form = useForm<z.infer<typeof EVENT_CATEGORY_VALIDATION>>({
    resolver: zodResolver(EVENT_CATEGORY_VALIDATION),
    defaultValues:{
      name: '',
      color: '',
      emoji: '',
    }
  })
  return (
    <>
      <div onClick={() => setIsOpen(true)}>
      {children}
      </div>
      <Modal>
        <form onSubmit={form.handleSubmit((data) => console.log(data))}>
          
        </form>
      </Modal>
    </>
  )
}

export default CreateEventCategoryModal
