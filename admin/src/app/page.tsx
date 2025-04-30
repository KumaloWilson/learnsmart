// import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
// import { AtRiskStudentsChart } from "../components/at-risk-students-chart";
// import { CourseEnrollmentChart } from "../components/course-enrollment-chart";
// import { DashboardStats } from "../components/dashboard-stats";
// import { PageHeader } from "../components/page-header";
// import { RecentActivity } from "../components/recent-activity";


// export default function Dashboard() {
//   return (
//     <div className="flex-1 space-y-4 p-8 pt-6">
//       <PageHeader heading="Dashboard" text="Overview of your educational system" />

//       <Tabs defaultValue="overview" className="space-y-4">
//         <TabsList>
//           <TabsTrigger value="overview">Overview</TabsTrigger>
//           <TabsTrigger value="analytics">Analytics</TabsTrigger>
//           <TabsTrigger value="reports">Reports</TabsTrigger>
//         </TabsList>

//         <TabsContent value="overview" className="space-y-4">
//           <DashboardStats />

//           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
//             <Card className="col-span-4">
//               <CardHeader>
//                 <CardTitle>Recent Activity</CardTitle>
//                 <CardDescription>Latest actions across the platform</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <RecentActivity />
//               </CardContent>
//             </Card>

//             <Card className="col-span-3">
//               <CardHeader>
//                 <CardTitle>At-Risk Students</CardTitle>
//                 <CardDescription>Students who may need additional support</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <AtRiskStudentsChart />
//               </CardContent>
//             </Card>
//           </div>
//         </TabsContent>

//         <TabsContent value="analytics" className="space-y-4">
//           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
//             <Card className="col-span-4">
//               <CardHeader>
//                 <CardTitle>Course Enrollment</CardTitle>
//                 <CardDescription>Number of students enrolled per course</CardDescription>
//               </CardHeader>
//               <CardContent className="h-[300px]">
//                 <CourseEnrollmentChart />
//               </CardContent>
//             </Card>

//             <Card className="col-span-3">
//               <CardHeader>
//                 <CardTitle>Student Performance</CardTitle>
//                 <CardDescription>Average grades by department</CardDescription>
//               </CardHeader>
//               <CardContent className="h-[300px]">
//                 <div className="flex h-full items-center justify-center text-muted-foreground">
//                   Performance data visualization
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </TabsContent>

//         <TabsContent value="reports" className="space-y-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>Available Reports</CardTitle>
//               <CardDescription>Generate and download system reports</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="flex flex-col gap-4">
//                 <div className="rounded-md border p-4">
//                   <div className="font-medium">Student Enrollment Report</div>
//                   <div className="text-sm text-muted-foreground">
//                     Comprehensive data on student enrollments across all programs
//                   </div>
//                 </div>
//                 <div className="rounded-md border p-4">
//                   <div className="font-medium">Academic Performance Report</div>
//                   <div className="text-sm text-muted-foreground">
//                     Analysis of student performance metrics and trends
//                   </div>
//                 </div>
//                 <div className="rounded-md border p-4">
//                   <div className="font-medium">Course Utilization Report</div>
//                   <div className="text-sm text-muted-foreground">
//                     Statistics on course attendance and resource usage
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }

import { PageHeader } from "@/components/page-header"
import { DashboardStats } from "@/components/dashboard-stats"
import { RecentActivity } from "@/components/recent-activity"
import { AtRiskStudentsChart } from "@/components/at-risk-students-chart"
import { CourseEnrollmentChart } from "@/components/course-enrollment-chart"

export default function Dashboard() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1">
        <div className="container mx-auto p-4 md:p-6 lg:p-8">
          <PageHeader heading="Dashboard" text="Welcome to the Learn Smart admin portal" />

          <DashboardStats />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mt-6">
            <AtRiskStudentsChart />
            <CourseEnrollmentChart />
          </div>

          <div className="mt-6">
            <RecentActivity />
          </div>
        </div>
      </div>
    </div>
  )
}

