"use client"

import { useState } from "react"
import { MoreHorizontal, Paperclip, Search, Send, Smile, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"

// Sample conversation data
const conversations = [
  {
    id: 1,
    contact: {
      name: "Emily Johnson",
      avatar: "/abstract-geometric-shapes.png",
      status: "online",
    },
    lastMessage: "I'm interested in the Senior Frontend Developer position",
    timestamp: "10:32 AM",
    unread: true,
  },
  {
    id: 2,
    contact: {
      name: "Michael Chen",
      avatar: "/number-two-graphic.png",
      status: "offline",
    },
    lastMessage: "Thank you for the interview opportunity",
    timestamp: "Yesterday",
    unread: false,
  },
  {
    id: 3,
    contact: {
      name: "Sarah Williams",
      avatar: "/abstract-geometric-shapes.png",
      status: "online",
    },
    lastMessage: "When can we schedule the technical interview?",
    timestamp: "Yesterday",
    unread: true,
  },
  {
    id: 4,
    contact: {
      name: "David Rodriguez",
      avatar: "/abstract-geometric-shapes.png",
      status: "offline",
    },
    lastMessage: "I've attached my updated portfolio",
    timestamp: "Monday",
    unread: false,
  },
  {
    id: 5,
    contact: {
      name: "Jessica Lee",
      avatar: "/abstract-geometric-composition-5.png",
      status: "offline",
    },
    lastMessage: "Is the Marketing Specialist position still open?",
    timestamp: "Monday",
    unread: false,
  },
]

// Sample messages for a conversation
const messages = [
  {
    id: 1,
    sender: "candidate",
    content:
      "Hello, I'm interested in the Senior Frontend Developer position at your company. I saw the job posting on your website and I believe my skills and experience align well with what you're looking for.",
    timestamp: "10:15 AM",
  },
  {
    id: 2,
    sender: "employer",
    content:
      "Hi Emily, thank you for reaching out! We're definitely still looking to fill that position. Could you tell me a bit more about your experience with React and TypeScript?",
    timestamp: "10:20 AM",
  },
  {
    id: 3,
    sender: "candidate",
    content:
      "Of course! I've been working with React for over 5 years now, and TypeScript for the last 3 years. In my current role, I've built and maintained several large-scale applications using React, TypeScript, and Redux. I've also led the migration of a legacy JavaScript codebase to TypeScript.",
    timestamp: "10:25 AM",
  },
  {
    id: 4,
    sender: "employer",
    content:
      "That sounds impressive! We're definitely looking for someone with strong TypeScript experience. Are you familiar with Next.js as well?",
    timestamp: "10:28 AM",
  },
  {
    id: 5,
    sender: "candidate",
    content:
      "Yes, I've worked with Next.js on several projects. I really appreciate its server-side rendering capabilities and the improved performance it offers. I've also used it with both REST APIs and GraphQL.",
    timestamp: "10:32 AM",
  },
]

export default function MessagesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedConversation, setSelectedConversation] = useState(conversations[0])
  const [messageText, setMessageText] = useState("")

  return (
    <div className="flex h-[calc(100vh-10rem)] flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
        <p className="text-muted-foreground">Communicate with candidates and team members</p>
      </div>

      <div className="grid flex-1 gap-6 overflow-hidden md:grid-cols-[300px_1fr]">
        {/* Conversations List */}
        <div className="flex flex-col border rounded-lg">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search messages..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Tabs defaultValue="all" className="flex-1">
            <div className="px-4 pt-2">
              <TabsList className="w-full">
                <TabsTrigger value="all" className="flex-1">
                  All
                </TabsTrigger>
                <TabsTrigger value="unread" className="flex-1">
                  Unread
                  <Badge className="ml-2 bg-primary/10 text-primary">
                    {conversations.filter((c) => c.unread).length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="starred" className="flex-1">
                  Starred
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="flex-1 p-0">
              <ScrollArea className="h-[calc(100vh-16rem)]">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`flex cursor-pointer items-center gap-3 border-b p-4 hover:bg-muted/50 ${
                      selectedConversation.id === conversation.id ? "bg-muted" : ""
                    }`}
                    onClick={() => setSelectedConversation(conversation)}
                  >
                    <div className="relative">
                      <Avatar>
                        <AvatarImage
                          src={conversation.contact.avatar || "/placeholder.svg"}
                          alt={conversation.contact.name}
                        />
                        <AvatarFallback>
                          {conversation.contact.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span
                        className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${
                          conversation.contact.status === "online" ? "bg-green-500" : "bg-gray-300"
                        }`}
                      />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{conversation.contact.name}</div>
                        <div className="text-xs text-muted-foreground">{conversation.timestamp}</div>
                      </div>
                      <div className="truncate text-sm text-muted-foreground">{conversation.lastMessage}</div>
                    </div>
                    {conversation.unread && <Badge className="h-2 w-2 rounded-full p-0" />}
                  </div>
                ))}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="unread" className="flex-1 p-0">
              <ScrollArea className="h-[calc(100vh-16rem)]">
                {conversations
                  .filter((c) => c.unread)
                  .map((conversation) => (
                    <div
                      key={conversation.id}
                      className={`flex cursor-pointer items-center gap-3 border-b p-4 hover:bg-muted/50 ${
                        selectedConversation.id === conversation.id ? "bg-muted" : ""
                      }`}
                      onClick={() => setSelectedConversation(conversation)}
                    >
                      <div className="relative">
                        <Avatar>
                          <AvatarImage
                            src={conversation.contact.avatar || "/placeholder.svg"}
                            alt={conversation.contact.name}
                          />
                          <AvatarFallback>
                            {conversation.contact.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span
                          className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${
                            conversation.contact.status === "online" ? "bg-green-500" : "bg-gray-300"
                          }`}
                        />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <div className="flex items-center justify-between">
                          <div className="font-medium">{conversation.contact.name}</div>
                          <div className="text-xs text-muted-foreground">{conversation.timestamp}</div>
                        </div>
                        <div className="truncate text-sm text-muted-foreground">{conversation.lastMessage}</div>
                      </div>
                      <Badge className="h-2 w-2 rounded-full p-0" />
                    </div>
                  ))}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="starred" className="flex-1 p-0">
              <div className="flex h-full items-center justify-center p-4 text-center text-muted-foreground">
                <div>
                  <Star className="mx-auto mb-2 h-10 w-10 opacity-20" />
                  <p>No starred conversations</p>
                  <p className="text-sm">Star important conversations to find them quickly</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Conversation */}
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center gap-4 pb-3">
            <Avatar>
              <AvatarImage
                src={selectedConversation.contact.avatar || "/placeholder.svg"}
                alt={selectedConversation.contact.name}
              />
              <AvatarFallback>
                {selectedConversation.contact.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2">
                {selectedConversation.contact.name}
                <span
                  className={`inline-block h-2 w-2 rounded-full ${
                    selectedConversation.contact.status === "online" ? "bg-green-500" : "bg-gray-300"
                  }`}
                />
              </CardTitle>
              <CardDescription>
                {selectedConversation.contact.status === "online" ? "Online" : "Offline"}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Star className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>View Profile</DropdownMenuItem>
                  <DropdownMenuItem>Mark as Unread</DropdownMenuItem>
                  <DropdownMenuItem>Archive Conversation</DropdownMenuItem>
                  <DropdownMenuItem>Mute Notifications</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">Block Contact</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="flex-1 p-0">
            <ScrollArea className="h-[calc(100vh-20rem)]">
              <div className="flex flex-col gap-4 p-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "employer" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.sender === "employer"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <div className="text-sm">{message.content}</div>
                      <div className="mt-1 text-right text-xs opacity-70">{message.timestamp}</div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
          <Separator />
          <CardFooter className="p-4">
            <div className="flex w-full items-end gap-2">
              <Button variant="outline" size="icon" className="shrink-0">
                <Paperclip className="h-4 w-4" />
              </Button>
              <div className="relative flex-1">
                <Textarea
                  placeholder="Type your message..."
                  className="min-h-[80px] resize-none pr-10"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                />
                <div className="absolute bottom-2 right-2 flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Smile className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Button className="shrink-0" disabled={!messageText.trim()}>
                <Send className="mr-2 h-4 w-4" />
                Send
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
