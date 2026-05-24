import { useAuth } from '@clerk/nextjs'

export function useUploadImage() {
  const { getToken } = useAuth()

  async function uploadImage(file: File): Promise<{ url: string; markdown: string }> {
    const token = await getToken()
    const form  = new FormData()
    form.append('image', file)

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/upload-image`, {
      method:  'POST',
      headers: { Authorization: `Bearer ${token ?? ''}` },
      body:    form,
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.error?.message ?? 'Upload failed')
    return data.data as { url: string; markdown: string }
  }

  return { uploadImage }
}
