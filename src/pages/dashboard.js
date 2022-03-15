import AppLayout from '@/components/Layouts/AppLayout'
import Head from 'next/head'
import { useAuth } from '@/hooks/auth'
import Proveedor from '@/components/Proveedor'
import Admin from '@/components/Admin'

const Dashboard = () => {

    const { user } = useAuth({ middleware: 'guest' })

    return (
        <>
            {user?.type == 'admin' ? <Admin /> : <Proveedor/>}
        </>
    )
}

export default Dashboard
