import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import Box from '@mui/material/Box'
import Navbar from '../Navbar/Navbar'
import PageFallback from '../Loading/PageFallback'
import { NAVBAR_HEIGHT } from '../../theme/theme'

function Layout() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
      <Navbar />
      <Box
        component="main"
        sx={{
          flex: 1,
          mt: `${NAVBAR_HEIGHT}px`,
          minHeight: 0,
          overflow: 'hidden',
        }}
      >
        <Suspense fallback={<PageFallback />}>
          <Outlet />
        </Suspense>
      </Box>
    </Box>
  )
}

export default Layout
