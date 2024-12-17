"use client";
import { EVENT_CATEGORY_VALIDATION } from "@/lib/validator/category-validator";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PropsWithChildren, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Modal } from "../ui/modal";
import { createEventCategoryAction } from "@/app/dashboard/actions";
const COLORS_OPTIONS = [
  "#FF6B6B", // bg-[#FF6B6B]
  "#4ECDC4", // bg-[#4ECDC4]
  "#45B7D1", // bg-[#45B7D1]
  "#FFA07A", // bg-[#FFA07A]
  "#98D8C8", // bg-[#98D8C8]
  "#FDCB6E", // bg-[#FDCB6E]
  "#6C5CE7", // bg-[#6C5CE7]
  "#FF85A2", // bg-[#FF85A2]
  "#2ECC71", // bg-[#2ECC71]
  "#E17055", // bg-[#E17055]
];
const EMOJI_OPTIONS = [
  { emoji: "💰", label: "Money (Sale)" },
  { emoji: "👤", label: "User (Sign-up)" },
  { emoji: "🎉", label: "Celebration" },
  { emoji: "📅", label: "Calendar" },
  { emoji: "🚀", label: "Launch" },
  { emoji: "📢", label: "Announcement" },
  { emoji: "🎓", label: "Graduation" },
  { emoji: "🏆", label: "Achievement" },
  { emoji: "💡", label: "Idea" },
  { emoji: "🔔", label: "Notification" },
];
interface Props extends PropsWithChildren{
  wrapperClassName?:string
}
function CreateEventCategoryModal({ children, wrapperClassName }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const { mutate: createEventCategory, isPending: isCreating } = useMutation({
    mutationFn: async (data: EVENT_CATEGORY_VALIDATION) =>
      await createEventCategoryAction(data),
    onSuccess(){
      queryClient.invalidateQueries({
        queryKey: ["user-event-categories"],
      });
      setIsOpen(false);
    }
  });
  const form = useForm<EVENT_CATEGORY_VALIDATION>({
    resolver: zodResolver(EVENT_CATEGORY_VALIDATION),
    defaultValues: {
      name: "",
      color: "",
      emoji: "",
    },
  });
  const handleSubmit = (data: EVENT_CATEGORY_VALIDATION) => {
    createEventCategory(data);
  };
  return (
    <>
      <div onClick={() => setIsOpen(true)} className={wrapperClassName}>{children}</div>
      <Modal
        showModal={isOpen}
        setShowModal={setIsOpen}
        className="max-w-xl p-8"
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div>
              <h2 className="text-lg/7 font-medium tracking-tight text-gray-950">
                Create Event Category
              </h2>
              <p className="text-sm/6 text-gray-600">
                Create new category to organize your events
              </p>
            </div>
            <div className="space-y-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input autoFocus placeholder="Category name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                      <div className="flex flex-wrap gap-3 mb-2">
                        {COLORS_OPTIONS.map((color) => (
                          <button
                            key={color}
                            type="button"
                            className={cn(
                              `bg-[${color}]`,
                              "size-10 rounded-full ring-offset-2 ring-2 ring-transparent transition-all duration-300 hover:scale-105",
                              {
                                " ring-brand-700 scale-110":
                                  color === field.value,
                              }
                            )}
                            onClick={() => field.onChange(color)} // Update selected option
                          ></button>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="emoji"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Emoji</FormLabel>
                    <FormControl>
                      <div className="flex flex-wrap gap-3">
                        {EMOJI_OPTIONS.map((emoji) => (
                          <button
                            key={emoji.emoji}
                            type="button"
                            className={cn(
                              "size 10 flex items-center justify-center text-xl rounded-md transition-all bg-brand-100 hover:border-brand-200",
                              {
                                "bg-brand-100 ring-2 ring-brand-700 scale-110":
                                  emoji.emoji === field.value,
                              }
                            )}
                            onClick={() => field.onChange(emoji.emoji)} // Update selected option
                          >
                            {emoji.emoji}
                          </button>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                type="button"
                variant={"outline"}
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button disabled={isCreating} type="submit">{
                isCreating ? "Creating..." : "Create Category"
            }</Button>
            </div>
          </form>
        </Form>
      </Modal>
    </>
  );
}

export default CreateEventCategoryModal;
