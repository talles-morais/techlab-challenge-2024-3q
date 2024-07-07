import { useQuery } from "@tanstack/react-query"
import { api } from "../services/api.js"
import { useAccessToken, useAuthenticatedUser } from "../hooks/useAuthenticationContext.js"
import { IUser } from "../interfaces/IUser.js"
import { Box, Typography } from "@mui/material"
import { Link } from "react-router-dom"

export function UsersScreen() {
  const accessToken = useAccessToken()
  const user = useAuthenticatedUser();

  if(user.profile !== "sudo"){
    return <div><p>Standard Profile</p></div>
  }

  const query = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await api.get('/users', {
        headers: { Authorization: `Bearer ${accessToken}` }
      })

      return response.data as {
        count: number
        users: IUser[]
      }
    },
  })

  const users = query.data?.users

  return (
    <>
      <Box style={{ padding: 12 }}>
        {user.profile === "sudo" && 
          <Box >
          <Link to={'/users'}>
            <Box>
              <Typography>
                Create new user
              </Typography>
            </Box>
          </Link>
          </Box>
        }
        {user.profile === "sudo" && users?.map(user => (
          <Link to={`/users/${user.id}`}>
            <Box key={`users:${user.id}`}>
              <Typography>
                {user.username}
              </Typography>
            </Box>
          </Link>
        ))}
      </Box>
    </>
  )
}