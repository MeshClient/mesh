import React from "react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {colorFromUsername} from "@/lib/functions.ts";
import {Message} from "@/components/chat/types.ts";

interface MessageProps {
    messages: Message[]
}

export const MessageGroup = React.memo(({messages}: MessageProps) => {
    return (
        <div className="flex items-start">
            <Avatar
                className="mr-3 flex-shrink-0"
                size="md"
                style={{backgroundColor: colorFromUsername(messages[0].senderName)}}
            >
                <AvatarImage src='https://i.imgur.com/pn3oJUs.png' alt={messages[0].senderName}/>
                <AvatarFallback className="text-sm text-text-secondary">
                    {messages[0].senderName.charAt(0).toUpperCase()}
                </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
                <div className="flex items-center">
                    <span className="font-medium text-text-primary">{messages[0].senderName}</span>
                    <span className="ml-2 text-xs text-text-secondary">{messages[0].timestamp}</span>
                </div>

                <div className="space-y-1 mt-1">
                    {messages.map((message) => (
                        <div key={message.id} className="text-text-primary">
                            {message.content}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
});