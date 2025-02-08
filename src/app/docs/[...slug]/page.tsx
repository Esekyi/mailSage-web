import { notFound } from 'next/navigation'
import { axiosInstance } from '@/lib/axios'
import { DocContent } from '@/components/docs/content/doc-content'
import { AxiosError } from 'axios'
import { Metadata } from 'next'

interface DocPageProps {
  params: Promise<{
    slug: string[]
  }>
}

export async function generateMetadata({ params }: DocPageProps): Promise<Metadata> {
  try {
    const resolvedParams = await params
    const slug = resolvedParams.slug.join('/')
    const { data } = await axiosInstance.get(`/api/v1/docs/${slug}`)

    return {
      title: `${data.title} - Documentation`,
      description: data.meta?.description || 'MailSage documentation and guides',
      openGraph: {
        title: `${data.title} - MailSage Documentation`,
        description: data.meta?.description || 'MailSage documentation and guides',
        type: 'article',
      },
    }
  } catch (error) {
    console.error('API Error:', error)
    if (error instanceof AxiosError) {
      console.error('Axios Error:', error.message)
      console.error('Axios Error Response:', error.response)
    } else {
      console.error('Unexpected Error:', error)
    }
    return {
      title: 'Documentation',
      description: 'MailSage documentation and guides',
    }
  }
}

export default async function DocPage({ params }: DocPageProps) {
  const resolvedParams = await params

  if (!resolvedParams?.slug) {
    notFound()
  }

  const slug = resolvedParams.slug.join('/')

  try {
    const { data } = await axiosInstance.get(`/api/v1/docs/${slug}`)

    if (!data) {
      notFound()
    }

    return (
      <DocContent
        title={data.title}
        content={data.content}
        category={data.category}
        description={data.meta?.description}
        editUrl={`https://github.com/Esekyi/mailSage/tree/main/docs/${slug}.md`}
        lastUpdated={data.meta?.lastUpdated}
      />
    )
  } catch (error) {
    console.error('API Error:', error)
    if (error instanceof AxiosError) {
      console.error('Axios Error:', error.message)
      console.error('Axios Error Response:', error.response)
    } else {
      console.error('Unexpected Error:', error)
    }
    notFound()
  }
}
