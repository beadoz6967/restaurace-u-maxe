import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './sanity/schemas'
import { projectId, dataset } from './lib/sanity'

export default defineConfig({
  name: 'default',
  title: 'Restaurace U Maxe',
  basePath: '/studio',
  projectId,
  dataset,
  plugins: [structureTool()],
  schema: { types: schemaTypes },
})
