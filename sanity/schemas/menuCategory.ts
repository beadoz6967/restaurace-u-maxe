import { defineArrayMember, defineField, defineType } from 'sanity'

/**
 * A menu category (e.g. Polévky) holding an ordered list of dishes. Used as an
 * inline object inside a daily menu — ordering follows the array position.
 */
export default defineType({
  name: 'menuCategory',
  title: 'Kategorie',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Název kategorie',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'allergens',
      title: 'Alergeny (popis pod kategorií)',
      type: 'string',
    }),
    defineField({
      name: 'items',
      title: 'Položky',
      type: 'array',
      of: [defineArrayMember({ type: 'menuItem' })],
    }),
  ],
  preview: {
    select: { title: 'title', items: 'items' },
    prepare({ title, items }) {
      const count = Array.isArray(items) ? items.length : 0
      return {
        title,
        subtitle: count === 1 ? '1 položka' : `${count} položek`,
      }
    },
  },
})
