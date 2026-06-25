import type { SchemaTypeDefinition } from 'sanity'
import dailyMenu from './dailyMenu'
import menuCategory from './menuCategory'
import menuItem from './menuItem'

export const schemaTypes: SchemaTypeDefinition[] = [
  dailyMenu,
  menuCategory,
  menuItem,
]
