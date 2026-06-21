import { createClient } from '@sanity/client'

// TODO: initialize with values from env in a later step
//   NEXT_PUBLIC_SANITY_PROJECT_ID · NEXT_PUBLIC_SANITY_DATASET · SANITY_API_TOKEN
export const sanity = createClient({
  projectId: '',
  dataset: '',
  apiVersion: '2024-01-01',
  useCdn: true,
})
