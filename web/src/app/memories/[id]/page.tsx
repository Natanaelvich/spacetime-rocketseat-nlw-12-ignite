import { api } from '@/lib/api'
import dayjs from 'dayjs'
import { ArrowLeft } from 'lucide-react'
import { cookies } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'

type Props = {
  params: {
    id: string
  }
}

type Memory = {
  id: string
  coverUrl: string
  content: string
  createdAt: string
}

const MemoryDetails = async ({ params }: Props) => {
  const token = cookies().get('token')?.value
  const { id } = params

  const response = await api.get<Memory>(`/memories/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const memory = response.data

  return (
    <div className="flex flex-col gap-10 p-8">
      <div key={memory.id} className="flex flex-col space-y-4">
        {/* botaõ de voltar a esquerda */}
        <Link
          href="/"
          className="flex items-center gap-2 self-end text-lg text-gray-200 hover:text-gray-100"
        >
          <ArrowLeft size={24} />
          <span>Voltar</span>
        </Link>

        <time className="-ml-8 flex items-center gap-2 text-sm text-gray-100 before:h-px before:w-5 before:bg-gray-50">
          {dayjs(memory.createdAt).format('D[ de ]MMMM[, ]YYYY')}
        </time>
        <Image
          src={memory.coverUrl}
          alt=""
          width={592}
          height={280}
          className="aspect-video w-full rounded-lg object-cover"
        />
        <p className="text-lg leading-relaxed text-gray-100">
          {memory.content}
        </p>
      </div>
    </div>
  )
}

export default MemoryDetails
