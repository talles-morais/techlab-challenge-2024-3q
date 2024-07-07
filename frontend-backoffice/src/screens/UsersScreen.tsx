import { useQuery } from "@tanstack/react-query"
import { api } from "../services/api.js"
import { useAccessToken, useAuthenticatedUser } from "../hooks/useAuthenticationContext.js"
import { IUser } from "../interfaces/IUser.js"
import { Box, Button, Paper, Typography } from "@mui/material"
import { Link } from "react-router-dom"
import { useState } from "react"
import NewUser from "../components/NewUser.js"

export function UsersScreen() {
  const [NewUserForm, setNewUserForm] = useState(false)
  const accessToken = useAccessToken()
  const user = useAuthenticatedUser();

  if (user.profile !== "sudo") {
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
          <Paper style={{ width: 'fit-content', backgroundColor: 'blueviolet' }}>
            <Button style={{ textDecoration: 'none', color: '#fff' }} onClick={() => setNewUserForm(!NewUserForm)}>
              <Box>
                <Typography>
                  Create new user
                </Typography>
              </Box>
            </Button>
          </Paper>
        }
        {NewUserForm && user.profile === "sudo" && <NewUser />}
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