'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

async function createActionSupabaseClient() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        },
      },
    }
  )
}

export async function registerAction(formData: FormData) {
  const nama = formData.get('nama') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const role = (formData.get('role') as string) || 'user'

  const supabase = await createActionSupabaseClient()

  // 1. Sign up di Auth dengan role yang dipilih
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        nama,
        role,
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  // 2. Jika role = user (pasien), masukkan ke tabel pasien
  if (data.user && role === 'user') {
    const nik = formData.get('nik') as string
    const tanggal_lahir = formData.get('tanggal_lahir') as string
    const jenis_kelamin = formData.get('jenis_kelamin') as 'L' | 'P'
    const no_telepon = formData.get('no_telepon') as string
    const alamat = formData.get('alamat') as string

    const { error: dbError } = await supabase.from('pasien').insert({
      id: data.user.id,
      nama,
      nik,
      tanggal_lahir,
      jenis_kelamin,
      alamat,
      no_telepon,
    })

    if (dbError) {
      return { error: dbError.message }
    }
  }

  // 3. Jika role = dokter, masukkan ke tabel dokter
  if (data.user && role === 'dokter') {
    const spesialisasi = formData.get('spesialisasi') as string
    const no_str = formData.get('no_str') as string
    const poli_id = formData.get('poli_id') as string

    const { error: dbError } = await supabase.from('dokter').insert({
      id: data.user.id,
      nama,
      spesialisasi,
      no_str,
      poli_id,
      jadwal: [] // default empty schedule
    })

    if (dbError) {
      return { error: dbError.message }
    }
  }

  redirect('/auth/login?registered=true')
}
