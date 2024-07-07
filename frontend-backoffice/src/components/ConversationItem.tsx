import { ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Typography } from "@mui/material";
import { IConversation } from "../interfaces/IConversation.js";
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import { useMemo } from "react";

export interface ConversationItemProps {
  conversation: IConversation
}

export function ConversationItem({ conversation }: ConversationItemProps) {
  const consumerIdentifier = useMemo(() => {
    if (conversation.consumer.name) return conversation.consumer.name

    return `Doc: ${conversation.consumer.document}`
  }, [conversation])

  return (
    <Paper>
      <Typography variant="body1" gutterBottom>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <ChatBubbleIcon />
              </ListItemIcon>
              <ListItemText style={{ whiteSpace: 'nowrap' }} primary={conversation.subject} secondary={consumerIdentifier}/>
            </ListItemButton>
          </ListItem>
      </Typography>
    </Paper>
  )
}