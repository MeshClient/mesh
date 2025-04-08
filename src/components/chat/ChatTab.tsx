import React, {useCallback, useMemo, useState} from 'react';
import {Paperclip, Send, Smile} from 'lucide-react';
import {Input} from '../ui/input';
import {Button} from '../ui/button';
import {MessageGroup} from "@/components/chat/MessageGroup.tsx";
import {Message} from "@/components/chat/types.ts";
import TypingIndicator, {TypingUser} from "@/components/chat/TypingIndicator.tsx";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {EmojiPicker} from "@/components/emoji/EmojiPicker";


interface ChatTabProps {
    roomId: string;
    roomName: string;
    roomType?: 'direct' | 'group' | 'space';
    onActivate?: () => void;
}

const ChatTab: React.FC<ChatTabProps> = ({roomName, roomType = 'group', onActivate}) => {
    const [inputValue, setInputValue] = useState('');
    const [typingUsers, setTypingUsers] = useState<TypingUser[]>([
        {id: 'user1', name: 'Alice', avatarUrl: 'https://i.imgur.com/pn3oJUs.png'},
        {id: 'user2', name: 'Bob', avatarUrl: ''},
        {id: 'user3', name: 'Alice', avatarUrl: 'https://i.imgur.com/pn3oJUs.png'},
    ]);

    // TODO: Replace with actual messages
    // Move this to a custom hook or context
    const messages = useMemo(() => [
        {
            id: 'm1',
            senderId: 'user1',
            senderName: 'Alice',
            content: 'Hey everyone! Has anyone started implementing the new Matrix API?',
            timestamp: '10:32 AM',
        },
        {
            id: 'm2',
            senderId: 'user2',
            senderName: 'Bob',
            content: 'I\'ve been working on it this week. The new endpoints are much better!',
            timestamp: '10:34 AM',
        },
        {
            id: 'm3',
            senderId: 'user1',
            senderName: 'Alice',
            content: 'Great! Could you share your implementation? I\'m having some issues with the encryption part.',
            timestamp: '10:36 AM',
        },
        {
            id: 'm4',
            senderId: 'user3',
            senderName: 'Charlie',
            content: 'I can help with that! I\'ve been working on the e2e encryption for the past month.',
            timestamp: '10:40 AM',
        },
        {
            id: 'm5',
            senderId: 'user3',
            senderName: 'Charlie',
            content: 'I\'ll share my code in a bit, but the key thing to remember is that you need to handle the key verification process carefully.',
            timestamp: '10:41 AM',
        }
    ], []);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    }, []);

    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        // TODO: Handle sending the message
        console.log(`Sending message in ${roomName}: ${inputValue}`);
        setInputValue('');
    }, [inputValue, roomName]);

    const groupedMessages = useMemo(() => {
        const groups: Message[][] = [];
        let currentGroup: Message[] = [];

        messages.forEach((message, index) => {
            if (index === 0 || messages[index - 1].senderId !== message.senderId) {
                if (currentGroup.length > 0) {
                    groups.push(currentGroup);
                }
                currentGroup = [message];
            } else {
                currentGroup.push(message);
            }
        });

        if (currentGroup.length > 0) {
            groups.push(currentGroup);
        }

        return groups;
    }, [messages]);

    const handleActivate = useCallback(() => {
        onActivate?.();
    }, [onActivate]);

    return (
        <div
            className="flex flex-col h-full bg-background-primary"
            onClick={() => handleActivate?.()}
        >
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {groupedMessages.map((group, groupIndex) => (
                    <MessageGroup key={groupIndex} messages={group}/>
                ))}
            </div>

            <TypingIndicator users={typingUsers}/>

            {/* Input Area */}
            <div className="p-3 border-t border-border">
                <form onSubmit={handleSubmit} className="flex items-center">
                    <div className="flex-1 relative">
                        <Input
                            value={inputValue}
                            onChange={handleInputChange}
                            placeholder={`Message ${roomType === 'direct' ? roomName : `#${roomName}`}`}
                            className="pr-20 bg-background-secondary border-background-tertiary"
                        />
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 rounded-full bg-transparent"
                            >
                                <Paperclip className="h-4 w-4 text-text-secondary"/>
                            </Button>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 rounded-full bg-transparent"
                                    >
                                        <Smile className="h-4 w-4 text-text-secondary"/>
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="end">
                                    <EmojiPicker 
                                        onEmojiSelect={(emoji, slug) => {
                                            setInputValue(prev => prev + (slug || emoji));
                                        }}
                                        customPacks={[ //TODO: Fetch from server
                                            {
                                                name: "Custom Pack",
                                                slug: "custom-pack",
                                                source: "matrix://server.org/emojis",
                                                emojis: [
                                                    {
                                                        emoji: "🔥",
                                                        name: "Fire",
                                                        slug: "fire_custom",
                                                        skin_tone_support: false,
                                                        source: "matrix://server.org/emojis/fire"
                                                    }
                                                ]
                                            }
                                        ]}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                    <Button
                        type="submit"
                        variant="ghost"
                        size="icon"
                        className="ml-2 h-9 w-9 rounded-full bg-primary text-primary-foreground hover:bg-primary/80"
                        disabled={!inputValue.trim()}
                    >
                        <Send className="h-4 w-4"/>
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default ChatTab;