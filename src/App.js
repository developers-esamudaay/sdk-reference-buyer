import styles from './styles/globalStyles.module.scss'
import OndcRoutes from './routes'
import { useEffect } from 'react'
import uuid from 'react-uuid'

function App() {
  console.log(process.env)
  useEffect(() => {
    let sessionId = sessionStorage.getItem('sessionId')
    if (!sessionId) sessionStorage.setItem('sessionId', uuid())
  }, [])
  return (
    <div className={styles.background}>
      <OndcRoutes />
    </div>
  )
}

export default App
