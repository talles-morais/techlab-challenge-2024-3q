import { Box, Grid, Pagination } from "@mui/material";
import { useAccessToken, useAuthenticatedUser } from "../hooks/useAuthenticationContext.js";
import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api.js";
import { ConversationItem } from "../components/ConversationItem.js";
import { IConversation } from "../interfaces/IConversation.js";
import { Link, Outlet } from "react-router-dom";
import { useMemo, useState } from "react";

export function ConversationsScreen() {
  const user = useAuthenticatedUser()
  const accessToken = useAccessToken()
  const [page, setPage] = useState(1);
  const [viewList, setViewList] = useState(true);

  const query = useQuery({
    queryKey: ['conversations', page],
    queryFn: async () => {
      const response = await api.get('/conversations', {
        params: { page },
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      setViewList(true);
      return response.data as {
        count: number
        conversations: IConversation[]
        conversationsPerPage: number
      }
    },
  })

  const count = useMemo(() => {
    return query.data?.count ?? NaN
  }, [query.data?.count])

  const handlePageChange = ( _: any, value: number) => {
    setPage(value);
  };

  const conversations = query.data?.conversations ?? null
  const perPage = query.data?.conversationsPerPage ?? null

  return (
    <Grid container pl={0.1}>
      <Grid paddingX={10}>
        <Box
          style={{
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'wrap',
            height: '40%',
            gap: 16,
            justifyContent: 'space-between',

          }}>
          {viewList && conversations?.filter(
            (conversation) => user.profile === "sudo" ? true : conversation.user?.id === user.id)
            .map((conversation) => (
              <Grid style={{}} item key={`conversations:${conversation.id}`}>
                <Link to={`/conversations/${conversation.id}`} onClick={() => setViewList(false)}>
                  <ConversationItem conversation={conversation} />
                </Link>
              </Grid>
            ))}
        </Box>
        {viewList && <Pagination
          style={{ position: 'absolute', bottom: 20}}
          count={Math.ceil(count / (perPage || 10))}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />}
      </Grid>
      <Grid item xs={10}>
        <Outlet />
      </Grid>
    </Grid>
  )
}
