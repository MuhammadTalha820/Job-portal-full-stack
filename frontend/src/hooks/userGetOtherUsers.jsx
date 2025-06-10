import { setGetUser } from '@/redux/authSlice'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const useGetOtherUsers = () => {
    const dispatch = useDispatch()
    useEffect(() => {
        const fetchOtherUser = async () => {
            try {
                axios.defaults.withCredentials = true
                const response = await axios.get(`http://localhost:8000/api/v1/user/`)
                // console.log(response.data)
                if (response.data.success) {
                    dispatch(setGetUser(response.data.otherUser)) // ✅ fix
                    // <-- Corrected here
                }
            } catch (error) {
                console.log('Failed to fetch other users:', error)
            }
        }
        fetchOtherUser()
    }, [])
}

export default useGetOtherUsers
