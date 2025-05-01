"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useAppDispatch, useAppSelector } from "@/store"
import { fetchQuizzes } from "@/store/slices/quiz-slice"
import { AdminSidebar } from "@/components/admin-sidebar"
import { QuizzesTable } from "@/components/quizzes-table"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function QuizzesPage() {
  const dispatch = useAppDispatch()
  const { quizzes, isLoading, error } = useAppSelector((state) => state.quizzes)
  const { toast } = useToast()

  useEffect(() => {
    dispatch(fetchQuizzes())
  }, [dispatch])

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      })
    }
  }, [error, toast])

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Quizzes</h1>
          <Link href="/quizzes/new">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Quiz
            </Button>
          </Link>
        </div>

        <QuizzesTable quizzes={quizzes} isLoading={isLoading} />
      </div>
    </div>
  )
}
