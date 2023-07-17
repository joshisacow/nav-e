"use client"

import dynamic from 'next/dynamic'
import 'firebaseui/dist/firebaseui.css'
import IconButton from '@/components/utils/IconButton'
import { useRouter } from 'next/navigation';

const FirebaseUIAuth = dynamic(() => import('@/components/auth/FirebaseUIAuth'), {
  ssr: false
})

export default function Login() {
  const router = useRouter();
  return (
    <div className="bg-white">
      <h1 className="text-center">Login</h1>
      <IconButton icon="home" onClick={() => router.push('/')} className="text-lg bg-gray-200  rounded-lg border-8 box-content ml-6" />
      <FirebaseUIAuth />
    </div>
  )
}
