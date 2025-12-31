"use client";

import { useState } from "react";
import { MoreVertical, Edit2, Trash2, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { deletePost } from "@/features/post/services/post.service";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { PostFormModal } from "../PostFormModal";
import { ICategory, IPost } from "@/interfaces";

interface PostActionsProps {
  post: IPost;
  categories: ICategory[];
  isAdmin: boolean;
}

export const PostActions = ({
  post,
  categories,
  isAdmin,
}: PostActionsProps) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isAdmin) return null;

  const handleDelete = async () => {
    if (
      !confirm(
        "¿Estás seguro de suspender esta publicación? Si tiene evento, también se borrará."
      )
    )
      return;

    setIsDeleting(true);
    const res = await deletePost(post.id);
    setIsDeleting(false);

    if (res.success) {
      toast.success("Publicación suspendida");
      router.refresh();
    } else {
      toast.error("Error al eliminar");
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="p-1 rounded-full hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600">
            {isDeleting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <MoreVertical className="w-4 h-4" />
            )}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {/* BOTÓN EDITAR */}
          <PostFormModal
            categories={categories}
            isAdmin={isAdmin}
            postToEdit={post}
            trigger={
              <div className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-slate-100 data-disabled:pointer-events-none data-disabled:opacity-50 w-full">
                <Edit2 className="mr-2 h-3.5 w-3.5" />
                <span>Editar</span>
              </div>
            }
          />

          {/* BOTÓN ELIMINAR */}
          <DropdownMenuItem
            onClick={handleDelete}
            className="text-red-600 focus:text-red-600 focus:bg-red-50"
          >
            <Trash2 className="mr-2 h-3.5 w-3.5" />
            <span>Suspender</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
