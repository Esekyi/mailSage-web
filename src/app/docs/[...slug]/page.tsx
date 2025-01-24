import { notFound } from 'next/navigation'
import { axiosInstance } from '@/lib/axios'
import { DocContent } from '@/components/docs/content/doc-content'
import { AxiosError } from 'axios'

interface DocPageProps {
  params: {
    slug: string[]
  }
}

export default async function DocPage({ params }: DocPageProps) {
  const slug = params.slug.join('/')

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
    // Handle 404 errors
    if (error instanceof AxiosError) {
      if (error.response?.status === 404) {
        notFound()
      }

      // Handle network errors with a user-friendly message
      if (error.code === 'ERR_NETWORK') {
        return (
          <DocContent
            title="Connection Error"
            content=""
            error="We're unable to connect to the documentation server. Please check your internet connection and try again later."
          />
        )
      }

      // Handle timeout errors
      if (error.code === 'ECONNABORTED') {
        return (
          <DocContent
            title="Connection Timeout"
            content=""
            error="The request to our documentation server timed out. Please try again later."
          />
        )
      }
    }

    // Handle other errors with a generic message
    return (
      <DocContent
        title="Documentation Error"
        content=""
        error="We're having trouble loading the documentation. Please try again later."
      />
    )
  }
}
