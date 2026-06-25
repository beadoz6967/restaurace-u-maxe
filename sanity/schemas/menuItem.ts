import { defineField, defineType } from 'sanity'

/**
 * A single dish: name, an optional weight prefix and an optional individual
 * price. When the price is left blank the dish uses the parent daily menu's
 * shared `menuPrice`.
 */
export default defineType({
  name: 'menuItem',
  title: 'Položka',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'Název',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'weight',
      title: 'Gramáž',
      type: 'string',
      description: 'Volitelné, např. „140 g", „300 g".',
    }),
    defineField({
      name: 'price',
      title: 'Cena (Kč)',
      type: 'number',
      description:
        'Vyplňte jen u výjimek. Bez ceny se použije cena menu z denního lístku.',
      validation: (rule) => rule.integer().positive(),
    }),
    defineField({
      name: 'image',
      title: 'Fotografie',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternativní text',
          type: 'string',
          description: 'Popis fotografie pro čtečky obrazovky.',
        }),
        defineField({
          name: 'description',
          title: 'Popis pod fotkou',
          type: 'text',
          rows: 2,
        }),
      ],
    }),
  ],
  preview: {
    select: { name: 'name', weight: 'weight', price: 'price', media: 'image' },
    prepare({ name, weight, price, media }) {
      return {
        title: weight ? `${weight} ${name}` : name,
        subtitle: typeof price === 'number' ? `${price} Kč` : undefined,
        media,
      }
    },
  },
})
