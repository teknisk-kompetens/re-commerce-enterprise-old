
'use client';

/**
 * COLLABORATION BAR
 * Real-time collaboration interface showing active participants,
 * live cursors, chat, and session controls
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  MessageCircle, 
  Share2, 
  Video, 
  Mic, 
  MicOff, 
  VideoOff,
  Settings,
  UserPlus,
  Crown,
  Eye,
  Edit,
  MoreHorizontal,
  Send,
  Smile,
  Phone,
  PhoneOff
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { collaborationEngine } from '@/lib/collaboration-engine';

interface CollaborationBarProps {
  sessionId: string;
  participants: Participant[];
}

interface Participant {
  userId: string;
  userName: string;
  userEmail: string;
  role: 'owner' | 'editor' | 'viewer';
  isOnline: boolean;
  cursor: {
    position: { x: number; y: number };
    color: string;
    visible: boolean;
  };
  presence: {
    status: 'active' | 'idle' | 'away' | 'busy';
    activity: string;
    lastSeen: Date;
  };
}

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: Date;
  type: 'message' | 'system' | 'action';
}

const SAMPLE_PARTICIPANTS: Participant[] = [
  {
    userId: 'user-1',
    userName: 'Alice Johnson',
    userEmail: 'alice@example.com',
    role: 'owner',
    isOnline: true,
    cursor: {
      position: { x: 150, y: 200 },
      color: '#3B82F6',
      visible: true,
    },
    presence: {
      status: 'active',
      activity: 'editing widget',
      lastSeen: new Date(),
    },
  },
  {
    userId: 'user-2',
    userName: 'Bob Smith',
    userEmail: 'bob@example.com',
    role: 'editor',
    isOnline: true,
    cursor: {
      position: { x: 300, y: 150 },
      color: '#10B981',
      visible: true,
    },
    presence: {
      status: 'active',
      activity: 'browsing widgets',
      lastSeen: new Date(),
    },
  },
  {
    userId: 'user-3',
    userName: 'Carol Davis',
    userEmail: 'carol@example.com',
    role: 'viewer',
    isOnline: false,
    cursor: {
      position: { x: 0, y: 0 },
      color: '#F59E0B',
      visible: false,
    },
    presence: {
      status: 'away',
      activity: 'viewing',
      lastSeen: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
    },
  },
];

const SAMPLE_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    userId: 'user-2',
    userName: 'Bob Smith',
    message: 'Looking great! I like the new chart widget.',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    type: 'message',
  },
  {
    id: 'msg-2',
    userId: 'system',
    userName: 'System',
    message: 'Carol Davis left the session',
    timestamp: new Date(Date.now() - 3 * 60 * 1000),
    type: 'system',
  },
  {
    id: 'msg-3',
    userId: 'user-1',
    userName: 'Alice Johnson',
    message: 'Thanks! Should we move it to the top right?',
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
    type: 'message',
  },
];

export function CollaborationBar({ sessionId, participants = SAMPLE_PARTICIPANTS }: CollaborationBarProps) {
  const [showChat, setShowChat] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(SAMPLE_MESSAGES);
  const [newMessage, setNewMessage] = useState('');
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);

  const onlineParticipants = participants.filter(p => p.isOnline);
  const currentUser = participants.find(p => p.userId === 'user-1'); // Would be actual current user

  const handleSendMessage = useCallback(() => {
    if (!newMessage.trim() || !currentUser) return;

    const message: ChatMessage = {
      id: crypto.randomUUID(),
      userId: currentUser.userId,
      userName: currentUser.userName,
      message: newMessage.trim(),
      timestamp: new Date(),
      type: 'message',
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Would send to collaboration engine
    // collaborationEngine.sendChatMessage(sessionId, message);
  }, [newMessage, currentUser, sessionId]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  };

  const formatLastSeen = (date: Date) => {
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return 'just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const getRoleIcon = (role: Participant['role']) => {
    switch (role) {
      case 'owner':
        return <Crown className="h-3 w-3 text-yellow-500" />;
      case 'editor':
        return <Edit className="h-3 w-3 text-blue-500" />;
      case 'viewer':
        return <Eye className="h-3 w-3 text-gray-500" />;
    }
  };

  const getStatusColor = (status: Participant['presence']['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'idle':
        return 'bg-yellow-500';
      case 'away':
        return 'bg-gray-500';
      case 'busy':
        return 'bg-red-500';
      default:
        return 'bg-gray-300';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between px-4 py-2">
        {/* Participants */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {onlineParticipants.length} online
            </span>
          </div>

          {/* Participant Avatars */}
          <div className="flex items-center -space-x-2">
            {onlineParticipants.slice(0, 5).map((participant) => (
              <Popover key={participant.userId}>
                <PopoverTrigger asChild>
                  <button className="relative">
                    <Avatar className="h-8 w-8 border-2 border-white dark:border-gray-800">
                      <AvatarImage src={`https://avatar.vercel.sh/${participant.userName}`} />
                      <AvatarFallback className="text-xs">
                        {participant.userName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    {/* Cursor color indicator */}
                    <div
                      className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800"
                      style={{ backgroundColor: participant.cursor.color }}
                    />
                    {/* Status indicator */}
                    <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${getStatusColor(participant.presence.status)}`} />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-3" align="start">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={`https://avatar.vercel.sh/${participant.userName}`} />
                        <AvatarFallback>
                          {participant.userName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <p className="font-medium text-gray-900 dark:text-white truncate">
                            {participant.userName}
                          </p>
                          {getRoleIcon(participant.role)}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {participant.userEmail}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-600 dark:text-gray-300">
                      <div className="flex items-center justify-between">
                        <span>Status:</span>
                        <Badge variant="secondary" className="text-xs">
                          {participant.presence.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span>Activity:</span>
                        <span className="text-gray-500">{participant.presence.activity}</span>
                      </div>
                      {!participant.isOnline && (
                        <div className="flex items-center justify-between mt-1">
                          <span>Last seen:</span>
                          <span className="text-gray-500">{formatLastSeen(participant.presence.lastSeen)}</span>
                        </div>
                      )}
                    </div>

                    {participant.role === 'owner' && currentUser?.role === 'owner' && (
                      <Separator />
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            ))}
            
            {onlineParticipants.length > 5 && (
              <div className="flex items-center justify-center h-8 w-8 bg-gray-100 dark:bg-gray-700 border-2 border-white dark:border-gray-800 rounded-full text-xs font-medium text-gray-600 dark:text-gray-300">
                +{onlineParticipants.length - 5}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {/* Voice/Video Controls */}
          <div className="flex items-center space-x-1">
            <Button
              variant={isVoiceEnabled ? "default" : "ghost"}
              size="sm"
              onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
              className="p-2"
            >
              {isVoiceEnabled ? (
                <Mic className="h-4 w-4" />
              ) : (
                <MicOff className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant={isVideoEnabled ? "default" : "ghost"}
              size="sm"
              onClick={() => setIsVideoEnabled(!isVideoEnabled)}
              className="p-2"
            >
              {isVideoEnabled ? (
                <Video className="h-4 w-4" />
              ) : (
                <VideoOff className="h-4 w-4" />
              )}
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Chat */}
          <Popover open={showChat} onOpenChange={setShowChat}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="relative p-2">
                <MessageCircle className="h-4 w-4" />
                {messages.filter(m => m.type === 'message').length > 0 && (
                  <Badge 
                    variant="secondary" 
                    className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs"
                  >
                    {messages.filter(m => m.type === 'message').length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="h-96 flex flex-col">
                {/* Chat Header */}
                <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Session Chat
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {onlineParticipants.length} participant{onlineParticipants.length !== 1 ? 's' : ''} online
                  </p>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-3">
                  <div className="space-y-3">
                    <AnimatePresence>
                      {messages.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className={`${
                            message.type === 'system' 
                              ? 'text-center' 
                              : message.userId === currentUser?.userId 
                                ? 'ml-4' 
                                : 'mr-4'
                          }`}
                        >
                          {message.type === 'system' ? (
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {message.message}
                            </div>
                          ) : (
                            <div className={`${
                              message.userId === currentUser?.userId 
                                ? 'text-right' 
                                : 'text-left'
                            }`}>
                              <div className={`inline-block max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                                message.userId === currentUser?.userId
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                              }`}>
                                {message.userId !== currentUser?.userId && (
                                  <div className="font-medium text-xs mb-1 opacity-75">
                                    {message.userName}
                                  </div>
                                )}
                                <div>{message.message}</div>
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {formatTime(message.timestamp)}
                              </div>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type a message..."
                      className="flex-1 h-8"
                    />
                    <Button size="sm" onClick={handleSendMessage} disabled={!newMessage.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Invite */}
          <Dialog open={showInvite} onOpenChange={setShowInvite}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="p-2">
                <UserPlus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite Collaborators</DialogTitle>
                <DialogDescription>
                  Share this session with others to collaborate in real-time.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Share Link</label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Input
                      value={`${window.location.origin}/widget-factory/session/${sessionId}`}
                      readOnly
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `${window.location.origin}/widget-factory/session/${sessionId}`
                        );
                      }}
                    >
                      Copy
                    </Button>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Invite by Email</label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Input placeholder="colleague@company.com" />
                    <Button>Invite</Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Share/Settings */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="p-2">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Share2 className="h-4 w-4 mr-2" />
                Share Session
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="h-4 w-4 mr-2" />
                Session Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <PhoneOff className="h-4 w-4 mr-2" />
                Leave Session
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
