"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAppDispatch } from "@/store"
import { deleteQuiz, publishQuiz, type Quiz } from "@/store/slices/quiz-slice"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Edit, MoreHorizontal, Trash, Eye, Play } from "lucide-react"
import { formatDate } from "date-fns"
import { cn } from "@/lib/utils"
import { useToast } from "./ui/use-toast"


interface QuizzesTableProps {
  quizzes: Quiz[]
  isLoading: boolean
}

export function QuizzesTable({ quizzes, isLoading }: QuizzesTableProps) {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { toast } = useToast()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [quizToDelete, setQuizToDelete] = useState<string | null>(null)

  const handleDelete = async () => {
    if (!quizToDelete) return

    try {
      await dispatch(deleteQuiz(quizToDelete)).unwrap()
      toast({
        title: "Success",
        description: "Quiz deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: typeof error === "string" ? error : "Failed to delete quiz",
        variant: "destructive",
      })
    } finally {
      setDeleteDialogOpen(false)
      setQuizToDelete(null)
    }
  }

  const handlePublish = async (id: string) => {
    try {
      await dispatch(publishQuiz(id)).unwrap()
      toast({
        title: "Success",
        description: "Quiz published successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: typeof error === "string" ? error : "Failed to publish quiz",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-5 w-[250px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-[200px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-[100px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-[150px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-9 w-[100px]" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quizzes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No quizzes found.
                </TableCell>
              </TableRow>
            ) : (
              quizzes.map((quiz) => (
                <TableRow key={quiz.id}>
                  <TableCell className="font-medium">{quiz.title}</TableCell>
                  <TableCell>{quiz.courseName}</TableCell>
                  <TableCell>
                    {quiz.isPublished ? <Badge>Published</Badge> : <Badge variant="outline">Draft</Badge>}
                  </TableCell>
                  <TableCell>{cn(quiz.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(`/quizzes/${quiz.id}`)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/quizzes/${quiz.id}/edit`)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        {!quiz.isPublished && (
                          <DropdownMenuItem onClick={() => handlePublish(quiz.id)}>
                            <Play className="mr-2 h-4 w-4" />
                            Publish
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => {
                            setQuizToDelete(quiz.id)
                            setDeleteDialogOpen(true)
                          }}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the quiz and all associated questions and
              attempts.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
