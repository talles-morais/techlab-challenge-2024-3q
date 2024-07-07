import { LoadingButton } from "@mui/lab";
import { Box, MenuItem, Select, TextField } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useAccessToken } from "../hooks/useAuthenticationContext";
import { IUser } from "../interfaces/IUser";
import { api } from "../services/api";
import { useForm } from "react-hook-form";
import SaveIcon from '@mui/icons-material/Save'

export default function NewUser() {
  const accessToken = useAccessToken()

  const save = useMutation({
    mutationFn: async (user: Partial<IUser>) => {
      await api.put(`/users`, { ...user, id: self.crypto.randomUUID }, {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
    }
  })

  const form = useForm<Partial<IUser>>({})
  
  return (
    <Box style={{padding: 12, display:"flex", flexDirection:"column" ,gap:16}}>
      <Box>
        <TextField label="Username" {...form.register('username')} fullWidth />
      </Box>
      <Box>
        <TextField label="E-mail" {...form.register('email')} fullWidth />
      </Box>
      <Box>
        <TextField label="Password" {...form.register('password')} type="password" fullWidth />
      </Box>
      <Box>
        <Select label="Profile" {...form.register('profile')} fullWidth>
          <MenuItem value='standard'>Standard</MenuItem>
          <MenuItem value='sudo'>Sudo</MenuItem>
        </Select>
      </Box>
      <Box>
      <LoadingButton loading={save.isPending} variant="contained" style={{ padding: 16 }} startIcon={<SaveIcon />} onClick={
        // @ts-expect-error: I know exactly what I'm doing ok?
        form.handleSubmit(save.mutate)}
      >
        Salvar
      </LoadingButton>
      </Box>
    </Box>
  )
};
