import AppLayout from '@/components/Layouts/AppLayout'
import Head from 'next/head'
import { useAuth } from '@/hooks/auth'
import * as XLSX from 'xlsx'
import { useState } from 'react'
import axios from '@/lib/axios'
import AuthValidationErrors from '@/components/AuthValidationErrors'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Admin = () => {

    const { user } = useAuth({ middleware: 'guest' })

    const [proveedores, setProveedores] = useState([])
    const [errors, setErrors] = useState([])
    const [loading, setLoading] = useState(false)

    const readExcel = (file) => {
        setProveedores([])
        const promise = new Promise((resolve, reject) => {
            const fileReader = new FileReader()
            fileReader.readAsArrayBuffer(file)
            fileReader.onload = (e) => {
                const bufferArray = e.target.result
                const wb = XLSX.read(bufferArray, {type:'buffer'})
                const wsName = wb.SheetNames[0]
                const ws = wb.Sheets[wsName]
                const data = XLSX.utils.sheet_to_json(ws)
                resolve(data)
            }
            fileReader.onerror = (error) => {
                reject(error)
            }
        })
        promise.then((d) => {
            setProveedores(d)
        })
    }

    const saveProveedor = async (proveedor) => {

        setLoading(true)
        setErrors([])

        const data = {
            name: proveedor.Nombre,
            email: proveedor.Email,
        }

        await axios.post('createProveedor', data)
            .then(response => {
                setProveedores(proveedores.filter((item) => item !== proveedor))
                toast.success(`${proveedor.Nombre} fue registrado correctamente`);
                setLoading(false)
            })
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(Object.values(error.response.data.errors).flat())
                toast.error(`${Object.values(error.response.data.errors).flat()}`);
            })
        //if(proveedores.length == 1) window.location.reload(false)
    }

    return (
        <AppLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Dashboard
                </h2>
            }>

            <Head>
                <title>Laravel - Dashboard</title>
            </Head>
            
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            {/* <AuthValidationErrors className="mb-4" errors={errors} /> */}
                            <div className='flex justify-between items-center'>
                                <input 
                                    type='file'
                                    onChange={(e) => {
                                        const file = e.target.files[0];

                                        readExcel(file)
                                    }}
                                />
                                <h1 className='font-bold uppercase'>Proveedores</h1>
                            </div>
                            <div className='mt-4 w-full overflow-y-auto'>
                                <table className='min-w-full text-center'>
                                    <thead className='border-b bg-gray-800'>
                                        <tr>
                                            <th scope='col' className='text-sm font-medium text-white px-6 py-4'>
                                                Nombre
                                            </th>
                                            <th scope='col' className='text-sm font-medium text-white px-6 py-4'>
                                                RFC
                                            </th>
                                            <th scope='col' className='text-sm font-medium text-white px-6 py-4'>
                                                Email
                                            </th>
                                            <th scope='col' className='text-sm font-medium text-white px-6 py-4'>
                                                Acciones
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {proveedores.map((proveedor, index) => (
                                            <tr key={index} className='bg-white border-b'>
                                                <td className='text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap'>
                                                    {proveedor.Nombre}
                                                </td>
                                                <td className='text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap'>
                                                    {proveedor.RFC}
                                                </td>
                                                <td className='text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap'>
                                                    {proveedor.Email}
                                                </td>
                                                <td className='text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap'>
                                                    <button 
                                                        className='bg-blue-400 p-2 rounded-md text-white hover:bg-blue-300' 
                                                        onClick={() => {
                                                            loading ? 
                                                            toast.info('Loading')
                                                            :
                                                            saveProveedor(proveedor)
                                                        }}
                                                    >
                                                        Guardar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />

        </AppLayout>
    )
}

export default Admin
