import { PageContainer } from "@/components/page-container"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, Calendar, CheckCircle, FileText, MoreHorizontal, Settings, Users } from "lucide-react"

export default function NotificationsPage() {
  const notifications = [
    {
      id: "n1",
      title: "Assignment Submissions",
      description: "15 new submissions for 'Database Design'",
      time: "2 hours ago",
      type: "assignment",
      read: false,
    },
    {
      id: "n2",
      title: "Department Meeting",
      description: "Reminder: Faculty meeting tomorrow at 9 AM",
      time: "5 hours ago",
      type: "meeting",
      read: false,
    },
    {
      id: "n3",
      title: "System Update",
      description: "SmartLearn will be updated this weekend",
      time: "Yesterday",
      type: "system",
      read: true,
    },
    {
      id: "n4",
      title: "New Student Enrolled",
      description: "3 new students enrolled in CS101",
      time: "2 days ago",
      type: "student",
      read: true,
    },
    {
      id: "n5",
      title: "Assessment Due Soon",
      description: "Web Development Quiz due in 2 days",
      time: "2 days ago",
      type: "assessment",
      read: true,
    },
    {
      id: "n6",
      title: "Performance Report",
      description: "Monthly performance report is ready",
      time: "3 days ago",
      type: "report",
      read: true,
    },
    {
      id: "n7",
      title: "Virtual Class Scheduled",
      description: "You've scheduled a new virtual class for CS201",
      time: "4 days ago",
      type: "class",
      read: true,
    },
    {
      id: "n8",
      title: "Attendance Alert",
      description: "3 students have low attendance in CS301",
      time: "5 days ago",
      type: "attendance",
      read: true,
    },
  ]

  const getIcon = (type: string) => {
    switch (type) {
      case "assignment":
        return <FileText className="h-5 w-5 text-blue-500" />
      case "meeting":
        return <Calendar className="h-5 w-5 text-purple-500" />
      case "system":
        return <Settings className="h-5 w-5 text-gray-500" />
      case "student":
        return <Users className="h-5 w-5 text-green-500" />
      case "assessment":
        return <FileText className="h-5 w-5 text-orange-500" />
      case "report":
        return <FileText className="h-5 w-5 text-yellow-500" />
      case "class":
        return <Calendar className="h-5 w-5 text-indigo-500" />
      case "attendance":
        return <CheckCircle className="h-5 w-5 text-red-500" />
      default:
        return <Bell className="h-5 w-5 text-blue-500" />
    }
  }

  return (
    <PageContainer title="Notifications" description="View and manage your notifications">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Badge variant="default">{notifications.filter((n) => !n.read).length}</Badge>
          <span className="text-sm font-medium">Unread notifications</span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Mark All as Read</Button>
          <Button variant="outline">Settings</Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Notifications</CardTitle>
              <CardDescription>View all your recent notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-start p-3 rounded-lg ${notification.read ? "bg-background" : "bg-muted"}`}
                  >
                    <div className="mr-4 mt-0.5 rounded-full bg-primary/10 p-2">{getIcon(notification.type)}</div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium leading-none">{notification.title}</p>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {notification.read ? (
                              <DropdownMenuItem>Mark as Unread</DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem>Mark as Read</DropdownMenuItem>
                            )}
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <p className="text-sm text-muted-foreground">{notification.description}</p>
                      <p className="text-xs text-muted-foreground">{notification.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="unread">
          <Card>
            <CardHeader>
              <CardTitle>Unread Notifications</CardTitle>
              <CardDescription>View your unread notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications
                  .filter((notification) => !notification.read)
                  .map((notification) => (
                    <div key={notification.id} className="flex items-start p-3 rounded-lg bg-muted">
                      <div className="mr-4 mt-0.5 rounded-full bg-primary/10 p-2">{getIcon(notification.type)}</div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium leading-none">{notification.title}</p>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>Mark as Read</DropdownMenuItem>
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <p className="text-sm text-muted-foreground">{notification.description}</p>
                        <p className="text-xs text-muted-foreground">{notification.time}</p>
                      </div>
                    </div>
                  ))}

                {notifications.filter((notification) => !notification.read).length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Bell className="mx-auto h-8 w-8 mb-2" />
                    <p>No unread notifications</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assignments">
          <Card>
            <CardHeader>
              <CardTitle>Assignment Notifications</CardTitle>
              <CardDescription>View notifications related to assignments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications
                  .filter((notification) => notification.type === "assignment")
                  .map((notification) => (
                    <div
                      key={notification.id}
                      className={`flex items-start p-3 rounded-lg ${notification.read ? "bg-background" : "bg-muted"}`}
                    >
                      <div className="mr-4 mt-0.5 rounded-full bg-primary/10 p-2">{getIcon(notification.type)}</div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium leading-none">{notification.title}</p>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              {notification.read ? (
                                <DropdownMenuItem>Mark as Unread</DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem>Mark as Read</DropdownMenuItem>
                              )}
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <p className="text-sm text-muted-foreground">{notification.description}</p>
                        <p className="text-xs text-muted-foreground">{notification.time}</p>
                      </div>
                    </div>
                  ))}

                {notifications.filter((notification) => notification.type === "assignment").length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="mx-auto h-8 w-8 mb-2" />
                    <p>No assignment notifications</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle>System Notifications</CardTitle>
              <CardDescription>View system-related notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications
                  .filter((notification) => notification.type === "system")
                  .map((notification) => (
                    <div
                      key={notification.id}
                      className={`flex items-start p-3 rounded-lg ${notification.read ? "bg-background" : "bg-muted"}`}
                    >
                      <div className="mr-4 mt-0.5 rounded-full bg-primary/10 p-2">{getIcon(notification.type)}</div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium leading-none">{notification.title}</p>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              {notification.read ? (
                                <DropdownMenuItem>Mark as Unread</DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem>Mark as Read</DropdownMenuItem>
                              )}
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <p className="text-sm text-muted-foreground">{notification.description}</p>
                        <p className="text-xs text-muted-foreground">{notification.time}</p>
                      </div>
                    </div>
                  ))}

                {notifications.filter((notification) => notification.type === "system").length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Settings className="mx-auto h-8 w-8 mb-2" />
                    <p>No system notifications</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageContainer>
  )
}
