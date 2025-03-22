"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarIcon, CheckCircle, PlusCircle, XCircle } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"

export function AdminDashboard() {
  const [date, setDate] = useState<Date>()
  const [pendingRequests, setPendingRequests] = useState([
    {
      id: 1,
      user: {
        name: "Alex Johnson",
        avatar: "/placeholder.svg?height=32&width=32",
        pod: { name: "Red Pod", color: "#ef4444" },
      },
      task: "Client presentation",
      points: 15,
      evidence: "https://docs.example.com/presentation",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
    },
    {
      id: 2,
      user: {
        name: "Sam Taylor",
        avatar: "/placeholder.svg?height=32&width=32",
        pod: { name: "Blue Pod", color: "#3b82f6" },
      },
      task: "Bug fix in production",
      points: 12,
      evidence: "https://github.com/example/repo/pull/123",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    },
  ])

  const [pods, setPods] = useState([
    { id: 1, name: "Red Pod", color: "#ef4444", members: 5 },
    { id: 2, name: "Blue Pod", color: "#3b82f6", members: 4 },
    { id: 3, name: "Green Pod", color: "#10b981", members: 6 },
  ])

  const [tasks, setTasks] = useState([
    { id: 1, title: "Weekly team meeting", points: 5 },
    { id: 2, title: "Client presentation", points: 15 },
    { id: 3, title: "Code review", points: 10 },
    { id: 4, title: "Documentation update", points: 8 },
    { id: 5, title: "Bug fix", points: 12 },
  ])

  const [members, setMembers] = useState([
    { id: 1, name: "Alex Johnson", email: "alex@example.com", pod: "Red Pod", points: 45 },
    { id: 2, name: "Sam Taylor", email: "sam@example.com", pod: "Blue Pod", points: 32 },
    { id: 3, name: "Jamie Smith", email: "jamie@example.com", pod: "Green Pod", points: 28 },
    { id: 4, name: "Riley Brown", email: "riley@example.com", pod: "Red Pod", points: 37 },
    { id: 5, name: "Casey Wilson", email: "casey@example.com", pod: "Blue Pod", points: 41 },
  ])

  const handleApprove = (id: number) => {
    setPendingRequests(pendingRequests.filter((request) => request.id !== id))
    // In a real app, you would also update the user's points and pod points
  }

  const handleReject = (id: number) => {
    setPendingRequests(pendingRequests.filter((request) => request.id !== id))
    // In a real app, you would also notify the user
  }

  return (
    <Tabs defaultValue="requests">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <TabsList>
          <TabsTrigger value="requests">Pending Requests</TabsTrigger>
          <TabsTrigger value="pods">Manage Pods</TabsTrigger>
          <TabsTrigger value="tasks">Manage Tasks</TabsTrigger>
          <TabsTrigger value="members">Manage Members</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="requests" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Pending Point Requests</CardTitle>
            <CardDescription>Review and approve point requests from team members</CardDescription>
          </CardHeader>
          <CardContent>
            {pendingRequests.length === 0 ? (
              <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">No pending requests</p>
                </div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Task</TableHead>
                    <TableHead>Points</TableHead>
                    <TableHead>Evidence</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8 border-2" style={{ borderColor: request.user.pod.color }}>
                            <AvatarImage src={request.user.avatar} alt={request.user.name} />
                            <AvatarFallback>{request.user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{request.user.name}</div>
                            <div className="text-xs text-muted-foreground">{request.user.pod.name}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{request.task}</TableCell>
                      <TableCell>
                        <Badge variant="outline">+{request.points}</Badge>
                      </TableCell>
                      <TableCell>
                        <a
                          href={request.evidence}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-500 hover:underline"
                        >
                          View Evidence
                        </a>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => handleApprove(request.id)}
                          >
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => handleReject(request.id)}
                          >
                            <XCircle className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="pods" className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Manage Pods</CardTitle>
                <CardDescription>Create, edit, and manage pod teams</CardDescription>
              </div>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Pod
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pod Name</TableHead>
                  <TableHead>Color</TableHead>
                  <TableHead>Members</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pods.map((pod) => (
                  <TableRow key={pod.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full" style={{ backgroundColor: pod.color }} />
                        <span className="font-medium">{pod.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{pod.color}</TableCell>
                    <TableCell>{pod.members}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                        <Button size="sm" variant="outline">
                          View Members
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Set Reward Period</CardTitle>
            <CardDescription>Set the end date for the current points period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="grid gap-2">
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <Button className="self-end">Save</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="tasks" className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Manage Tasks</CardTitle>
                <CardDescription>Create and edit tasks and point values</CardDescription>
              </div>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Task
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task Name</TableHead>
                  <TableHead>Points</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell>
                      <span className="font-medium">{task.title}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">+{task.points}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-500">
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Request Volunteers</CardTitle>
            <CardDescription>Create tasks that team members can volunteer for</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="task-title">Task Title</Label>
                <Input id="task-title" placeholder="Enter task title" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="task-description">Description</Label>
                <Input id="task-description" placeholder="Enter task description" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="task-points">Points</Label>
                  <Input id="task-points" type="number" placeholder="10" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="task-deadline">Deadline</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        <span>Pick a date</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <Button>Create Volunteer Task</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="members" className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Manage Team Members</CardTitle>
                <CardDescription>Add members to pods and manage their roles</CardDescription>
              </div>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Member
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Pod</TableHead>
                  <TableHead>Points</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="font-medium">{member.name}</div>
                    </TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>
                      <Select defaultValue={member.pod}>
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Select pod" />
                        </SelectTrigger>
                        <SelectContent>
                          {pods.map((pod) => (
                            <SelectItem key={pod.id} value={pod.name}>
                              <div className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: pod.color }} />
                                <span>{pod.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">+{member.points}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                        <Button size="sm" variant="outline">
                          Award Points
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

