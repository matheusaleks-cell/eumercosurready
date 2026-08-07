import React from 'react'
export const dynamic = 'force-dynamic'
import { getCountries } from '@/lib/actions/countries'
import CountriesList from '@/components/admin/CountriesList'
import type { Country } from '@/types'

export default async function CountriesPage() {
  const result = await getCountries()
  const countries = (result.success ? (result.countries as Country[]) : []) || []

  return <CountriesList initialCountries={countries} />
}
