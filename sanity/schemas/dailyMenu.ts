import { defineArrayMember, defineField, defineType } from 'sanity'

/**
 * The dated daily menu the owner fills in each day: a shared menu price, an
 * optional half-portion price, a footer greeting and the day's categories.
 */
export default defineType({
  name: 'dailyMenu',
  title: 'Denní menu',
  type: 'document',
  fields: [
    defineField({
      name: 'date',
      title: 'Datum',
      type: 'date',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'menuPrice',
      title: 'Cena menu (Kč)',
      type: 'number',
      description: 'Sdílená cena hlavních jídel, např. 150.',
      validation: (rule) => rule.integer().positive(),
    }),
    defineField({
      name: 'halfPortionPrice',
      title: 'Cena poloviční porce (Kč)',
      type: 'number',
      validation: (rule) => rule.integer().positive(),
    }),
    defineField({
      name: 'footerNote',
      title: 'Patička (pozdrav)',
      type: 'string',
      description: 'Např. „Přejeme Vám dobrou chuť!".',
    }),
    defineField({
      name: 'categories',
      title: 'Kategorie',
      type: 'array',
      of: [defineArrayMember({ type: 'menuCategory' })],
    }),
  ],
  orderings: [
    {
      title: 'Datum (nejnovější)',
      name: 'dateDesc',
      by: [{ field: 'date', direction: 'desc' }],
    },
  ],
  preview: {
    select: { date: 'date' },
    prepare({ date }) {
      return { title: date ? `Menu ${date}` : 'Denní menu (bez data)' }
    },
  },
})
