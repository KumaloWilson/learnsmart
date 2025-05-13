"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { MessageSquare, Send } from "lucide-react"

interface CourseDiscussionsProps {
  courseId: string
}

export function CourseDiscussions({ courseId }: CourseDiscussionsProps) {
  const { toast } = useToast()
  const { user } = useAuth()
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Mock data for discussions
  const [discussions, setDiscussions] = useState([
    {
      id: "1",
      user: {
        id: "user1",
        name: "John Doe",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      message: "Has anyone started working on the group project yet?",
      timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      replies: [
        {
          id: "reply1",
          user: {
            id: "user2",
            name: "Jane Smith",
            avatar: "/placeholder.svg?height=40&width=40",
          },
          message: "Yes, I've started researching the topic. We should meet to discuss the approach.",
          timestamp: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
        },
      ],
    },
    {
      id: "2",
      user: {
        id: "user3",
        name: "Alex Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      message: "Does anyone have the notes from yesterday's lecture? I missed it due to a doctor's appointment.",
      timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      replies: [],
    },
  ])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    setIsSubmitting(true)
    try {
      // In a real app, this would be an API call to save the message
      // await saveDiscussionMessage(courseId, message)

      // For demo, we'll just update the local state
      const newDiscussion = {
        id: `new-${Date.now()}`,
        user: {
          id: user?.id || "current-user",
          name: `${user?.firstName} ${user?.lastName}` || "Current User",
          avatar: user?.avatarUrl || "/placeholder.svg?height=40&width=40",
        },
        message,
        timestamp: new Date().toISOString(),
        replies: [],
      }

      setDiscussions([newDiscussion, ...discussions])
      setMessage("")

      toast({
        title: "Message Posted",
        description: "Your message has been posted to the discussion board.",
      })
    } catch (error) {
      console.error("Error posting message:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to post your message. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Course Discussion</CardTitle>
          <CardDescription>Discuss course topics with your classmates and instructor</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[100px]"
            />
            <Button type="submit" disabled={isSubmitting || !message.trim()}>
              <Send className="h-4 w-4 mr-2" />
              Post Message
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {discussions.map((discussion) => (
          <Card key={discussion.id}>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <Avatar>
                  <AvatarImage src={discussion.user.avatar || "/placeholder.svg"} alt={discussion.user.name} />
                  <AvatarFallback>{discussion.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{discussion.user.name}</p>
                      <p className="text-sm text-muted-foreground">{new Date(discussion.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                  <p className="mt-2">{discussion.message}</p>

                  {discussion.replies.length > 0 && (
                    <div className="mt-4 pl-6 border-l-2 border-muted space-y-4">
                      {discussion.replies.map((reply) => (
                        <div key={reply.id} className="flex gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={reply.user.avatar || "/placeholder.svg"} alt={reply.user.name} />
                            <AvatarFallback>{reply.user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-baseline gap-2">
                              <p className="font-medium text-sm">{reply.user.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(reply.timestamp).toLocaleString()}
                              </p>
                            </div>
                            <p className="text-sm mt-1">{reply.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <Button variant="ghost" size="sm" className="mt-2">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Reply
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
