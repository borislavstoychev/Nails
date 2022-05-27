import Image from 'next/image'
import { useEffect, useState } from 'react'
// import { createClient } from '@supabase/supabase-js'
import { mapImageResources } from '../lib/cloudinary'
// import ImageSearch from '../components/SearchBar'

// export async function getStaticProps() {
//   const supabaseAdmin = createClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL || '',
//     process.env.SUPABASE_SERVICE_ROLE_KEY || ''
//   )

//   const { data } = await supabaseAdmin.from('gallery').select('*').order('id')
//   return {
//     props: {
//       images: data,
//     },
//   }
// }

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

type Image = {
  id: string
  title: string
  image: string
}

export default function Gallery() {
  const [images, setImages] = useState([])
  const [term, setTerm] = useState('')

  const [tags, setTags] = useState([])
  const [activeTag, setActiveTag] = useState()

  // useEffect(() => {
  //   ;(async function run() {
  //     const data = await fetch('/api/tags').then((r) => r.json())
  //     setTags(data.tags)
  //   })()
  // }, [])

  useEffect(() => {
    ;(async function run() {
      const results = await fetch('/api/search', {
        method: 'POST',
        body: JSON.stringify({
          expression: `folder="gallery"`,
        }),
      }).then((r) => r.json())

      const { resources } = results
      const images = mapImageResources(resources)

      setImages(images)
    })()
  }, [term])

  // useEffect(() => {
  //   ;(async function run() {
  //     if (!activeTag) return
  //     const data = await fetch('/api/images', {
  //       method: 'POST',
  //       body: JSON.stringify({
  //         tag: activeTag,
  //       }),
  //     }).then((r) => r.json())
  //     const images = mapImageResources(data.resources)
  //     setImages(images)
  //   })()
  // }, [activeTag])
  return (
    <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
      <h1 className="mt-0 mb-2 text-6xl font-normal leading-normal text-teal-500">
        Галерия
      </h1>
      {Array.isArray(tags) && (
        <ul
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            listStyle: 'none',
            padding: 0,
            margin: 0,
          }}
        >
          {tags?.map((tag) => {
            return (
              <li key={tag} style={{ margin: '.5em' }}>
                <button
                  onClick={() => setActiveTag(tag)}
                  className="flex-shrink-0 rounded border-4 border-teal-500 bg-teal-500 py-1 px-2 text-sm text-white hover:border-teal-700 hover:bg-teal-700"
                >
                  {tag}
                </button>
              </li>
            )
          })}
        </ul>
      )}
      <h2 className="mt-0 mb-2 text-2xl font-normal leading-normal text-teal-500">
        {activeTag}
      </h2>
      <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        {images.map((image: Image) => (
          <BlurImage key={image.id} image={image} />
        ))}
      </div>
    </div>
  )
}

function BlurImage({ image }: { image: Image }) {
  const [isLoading, setLoading] = useState(true)

  return (
    <a href={image.image} className="group">
      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-w-7 xl:aspect-h-8">
        <Image
          alt=""
          src={image.image}
          layout="fill"
          objectFit="cover"
          className={cn(
            'duration-700 ease-in-out group-hover:opacity-75',
            isLoading
              ? 'scale-110 blur-2xl grayscale'
              : 'scale-100 blur-0 grayscale-0'
          )}
          onLoadingComplete={() => setLoading(false)}
        />
      </div>
      <h3 className="mt-4 text-sm text-gray-700">{image.title}</h3>
      <p className="mt-1 text-lg font-medium text-gray-900">Sonq Nails</p>
    </a>
  )
}
