import { createClient, type SanityClient } from 'next-sanity'
import {
  createImageUrlBuilder,
  type SanityImageSource,
} from '@sanity/image-url'

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!
export const apiVersion = '2024-01-01'

export const sanity: SanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
})

const builder = createImageUrlBuilder(sanity)

/** Build an optimized Sanity CDN URL for an image field. */
export const urlFor = (source: SanityImageSource) => builder.image(source)
