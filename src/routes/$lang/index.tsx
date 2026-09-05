import { createFileRoute, redirect } from '@tanstack/react-router'

// The landing page lives at /$lang/revival; /$lang is a temporary redirect to it.
export const Route = createFileRoute('/$lang/')({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: '/$lang/revival',
      params: { lang: params.lang },
      statusCode: 307,
    })
  },
})
