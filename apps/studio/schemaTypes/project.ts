import {defineField, defineType} from 'sanity'
import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'

export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  orderings: [orderRankOrdering],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: ['client', 'product', 'experiment'],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
      description: 'Surfaces on home grid (cap 4)',
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Manual rank; kept alongside drag-reorder',
    }),
    defineField({
      name: 'draft',
      title: 'Draft',
      type: 'boolean',
      initialValue: true,
      description: 'Drafts never render publicly',
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'string',
      description: 'One-line hook for cards',
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
    }),
    defineField({
      name: 'client',
      title: 'Client',
      type: 'string',
      description: 'Client/organization name for client work',
    }),
    defineField({
      name: 'timeline',
      title: 'Timeline',
      type: 'string',
    }),
    defineField({
      name: 'outcome',
      title: 'Outcome',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'stack',
      title: 'Stack',
      type: 'array',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
    }),
    defineField({
      name: 'metrics',
      title: 'Metrics',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({name: 'label', title: 'Label', type: 'string'}),
            defineField({name: 'value', title: 'Value', type: 'string'}),
          ],
        },
      ],
    }),
    defineField({
      name: 'links',
      title: 'Links',
      type: 'object',
      fields: [
        defineField({name: 'live', title: 'Live', type: 'url'}),
        defineField({name: 'source', title: 'Source', type: 'url'}),
        defineField({name: 'writeup', title: 'Writeup', type: 'url'}),
      ],
    }),
    defineField({
      name: 'cover',
      title: 'Cover',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'demo',
      title: 'Demo',
      type: 'object',
      fields: [
        defineField({
          name: 'kind',
          title: 'Kind',
          type: 'string',
          options: {list: ['embed', 'video', 'image']},
        }),
        defineField({name: 'url', title: 'URL', type: 'url'}),
        defineField({name: 'image', title: 'Image', type: 'image'}),
      ],
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [{type: 'block'}, {type: 'image', options: {hotspot: true}}],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
    }),
    orderRankField({type: 'project'}),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'type',
      media: 'cover',
    },
  },
})
