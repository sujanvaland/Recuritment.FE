"use client"

import { useEffect, useState } from "react"
import { Check, MessageSquare, PaperclipIcon, Search, Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"

// Types for our message data
interface Contact {
  id: string
  name: string
  company: string
  avatar: string
  lastMessage: string
  lastMessageTime: string
  unread: boolean
  online: boolean
}

interface Message {
  id: string
  senderId: string
  text: string
  timestamp: string
  read: boolean
}

export default function MessagesPage() {
  const { user } = useAuth()
  const [contacts, setContacts] = useState<Contact[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [newMessage, setNewMessage] = useState("")

  // Simulate API call to fetch contacts
  useEffect(() => {
    const fetchContacts = async () => {
      setIsLoading(true)
      try {
        // In a real app, this would be an API call
        // await fetch('/api/messages/contacts')

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Dummy data
        const dummyContacts: Contact[] = [
          {
            id: "1",
            name: "Sarah Johnson",
            company: "TechCorp",
            avatar: "/stylized-initials.png",
            lastMessage: "Thanks for your application! We'd like to schedule an interview.",
            lastMessageTime: "2023-04-15T14:30:00",
            unread: true,
            online: true,
          },
          {
            id: "2",
            name: "Michael Chen",
            company: "InnovateCo",
            avatar: "/microphone-crowd.png",
            lastMessage: "Do you have any questions about the role?",
            lastMessageTime: "2023-04-14T09:15:00",
            unread: false,
            online: false,
          },
          {
            id: "3",
            name: "Jessica Rodriguez",
            company: "CreativeMinds",
            avatar: "/abstract-jr.png",
            lastMessage: "Your portfolio looks great! When are you available to chat?",
            lastMessageTime: "2023-04-13T16:45:00",
            unread: true,
            online: true,
          },
          {
            id: "4",
            name: "David Smith",
            company: "CloudTech",
            avatar: "/abstract-data-stream.png",
            lastMessage: "We've reviewed your application and would like to move forward.",
            lastMessageTime: "2023-04-10T11:20:00",
            unread: false,
            online: false,
          },
        ]

        setContacts(dummyContacts)
        // Set the first contact as selected by default
        if (dummyContacts.length > 0) {
          setSelectedContact(dummyContacts[0])
        }
      } catch (error) {
        console.error("Error fetching contacts:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchContacts()
  }, [])

  // Simulate API call to fetch messages when a contact is selected
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedContact) return

      try {
        // In a real app, this would be an API call
        // await fetch(`/api/messages/${selectedContact.id}`)

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 300))

        // Dummy data - generate different messages based on the selected contact
        const dummyMessages: Message[] = [
          {
            id: "1",
            senderId: selectedContact.id,
            text: `Hello ${user?.firstName}, thanks for your interest in our company.`,
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
            read: true,
          },
          {
            id: "2",
            senderId: "me",
            text: "Hi, thank you for considering my application. I'm very interested in the position.",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 30).toISOString(),
            read: true,
          },
          {
            id: "3",
            senderId: selectedContact.id,
            text: "Your experience looks great. We'd like to learn more about your previous projects.",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
            read: true,
          },
          {
            id: "4",
            senderId: "me",
            text: "I'd be happy to discuss my previous work. I've worked on several projects that align with what you're looking for.",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 + 1000 * 60 * 15).toISOString(),
            read: true,
          },
          {
            id: "5",
            senderId: selectedContact.id,
            text: selectedContact.lastMessage,
            timestamp: selectedContact.lastMessageTime,
            read: !selectedContact.unread,
          },
        ]

        setMessages(dummyMessages)

        // Mark contact as read when messages are loaded
        if (selectedContact.unread) {
          setContacts((prevContacts) =>
            prevContacts.map((contact) =>
              contact.id === selectedContact.id ? { ...contact, unread: false } : contact,
            ),
          )
        }
      } catch (error) {
        console.error("Error fetching messages:", error)
      }
    }

    fetchMessages()
  }, [selectedContact, user?.firstName])

  // Filter contacts based on search query
  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Handle sending a new message
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedContact) return

    const newMsg: Message = {
      id: `new-${Date.now()}`,
      senderId: "me",
      text: newMessage,
      timestamp: new Date().toISOString(),
      read: false,
    }

    setMessages((prev) => [...prev, newMsg])
    setNewMessage("")

    // In a real app, this would be an API call
    // await fetch('/api/messages/send', { method: 'POST', body: JSON.stringify({ contactId: selectedContact.id, message: newMessage }) })
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
        <p className="text-muted-foreground">Communicate with recruiters and hiring managers</p>
      </div>

      <Card className="overflow-hidden">
        <div className="grid h-[600px] grid-cols-1 md:grid-cols-3">
          {/* Contacts sidebar */}
          <div className="border-r">
            <div className="p-4">
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
            <Tabs defaultValue="all" className="px-4">
              <TabsList className="w-full">
                <TabsTrigger value="all" className="flex-1">
                  All
                </TabsTrigger>
                <TabsTrigger value="unread" className="flex-1">
                  Unread
                </TabsTrigger>
                <TabsTrigger value="archived" className="flex-1">
                  Archived
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="h-[calc(600px-110px)] overflow-y-auto">
              {isLoading ? (
                <div className="space-y-2 p-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3 rounded-md p-2">
                      <div className="h-10 w-10 rounded-full bg-slate-200"></div>
                      <div className="space-y-1">
                        <div className="h-4 w-24 rounded-md bg-slate-200"></div>
                        <div className="h-3 w-32 rounded-md bg-slate-200"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredContacts.length > 0 ? (
                <div className="space-y-1 p-2">
                  {filteredContacts.map((contact) => (
                    <button
                      key={contact.id}
                      className={`flex w-full items-start gap-3 rounded-md p-2 text-left transition-colors ${
                        selectedContact?.id === contact.id ? "bg-slate-100" : "hover:bg-slate-50"
                      }`}
                      onClick={() => setSelectedContact(contact)}
                    >
                      <div className="relative">
                        <img
                          src={contact.avatar || "/placeholder.svg"}
                          alt={contact.name}
                          className="h-10 w-10 rounded-full"
                        />
                        {contact.online && (
                          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-white"></span>
                        )}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{contact.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(contact.lastMessageTime).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{contact.company}</p>
                        <p className="text-sm truncate">{contact.lastMessage}</p>
                      </div>
                      {contact.unread && <span className="ml-auto mt-1 h-2 w-2 rounded-full bg-blue-600"></span>}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex h-full flex-col items-center justify-center p-4 text-center">
                  <MessageSquare className="h-8 w-8 text-muted-foreground" />
                  <h3 className="mt-2 font-medium">No conversations found</h3>
                  <p className="text-sm text-muted-foreground">
                    {searchQuery ? "Try a different search term" : "Start applying to jobs to connect with recruiters"}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Message content */}
          <div className="col-span-2 flex flex-col">
            {selectedContact ? (
              <>
                <div className="flex items-center justify-between border-b p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={selectedContact.avatar || "/placeholder.svg"}
                        alt={selectedContact.name}
                        className="h-10 w-10 rounded-full"
                      />
                      {selectedContact.online && (
                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-white"></span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">{selectedContact.name}</h3>
                      <p className="text-sm text-muted-foreground">{selectedContact.company}</p>
                    </div>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderId === "me" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.senderId === "me" ? "bg-primary text-primary-foreground" : "bg-slate-100"
                        }`}
                      >
                        <p>{message.text}</p>
                        <div
                          className={`mt-1 flex items-center justify-end gap-1 text-xs ${
                            message.senderId === "me" ? "text-primary-foreground/80" : "text-muted-foreground"
                          }`}
                        >
                          {new Date(message.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                          {message.senderId === "me" && (
                            <Check className={`h-3 w-3 ${message.read ? "text-blue-500" : ""}`} />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" className="shrink-0">
                      <PaperclipIcon className="h-4 w-4" />
                      <span className="sr-only">Attach file</span>
                    </Button>
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                    />
                    <Button className="shrink-0" onClick={handleSendMessage}>
                      <Send className="mr-2 h-4 w-4" />
                      Send
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex h-full flex-col items-center justify-center p-4 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
                  <MessageSquare className="h-10 w-10 text-slate-400" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">Select a conversation</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Choose a contact from the list to view your conversation
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </>
  )
}
