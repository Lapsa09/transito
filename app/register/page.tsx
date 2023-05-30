import React from 'react'
import { Button, Input } from '@/components'
import { FormProvider, useForm } from 'react-hook-form'

function page() {
  const methods = useForm({
    mode: 'all',
  })
  return (
    <div className="max-w-2xl mx-auto bg-white p-16 dark:bg-black">
      <FormProvider {...methods}>
        <form>
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <Input
                label="First name"
                placeholder="John"
                name="first_name"
                rules={{ required: 'First name is required' }}
              />
            </div>
            <div>
              <Input
                label="Last name"
                placeholder="Doe"
                name="last_name"
                rules={{ required: 'Last name is required' }}
              />
            </div>
            <div>
              <Input
                label="Company name"
                placeholder="Flowbite"
                name="company_name"
              />
            </div>
            <div>
              <Input label="Job title" placeholder="CEO" name="job_name" />
            </div>
            <div>
              <Input
                label="Website"
                placeholder="flowbite.com"
                name="website"
                type="url"
              />
            </div>
            <div>
              <Input
                label="Phone"
                placeholder="+1 (305) 1234-567"
                name="phone"
                type="tel"
              />
            </div>
          </div>
          <Input
            label="Email"
            placeholder="email@domain.com"
            name="email"
            type="email"
            rules={{ required: 'Email is required' }}
          />
          <Input
            label="Password"
            name="password"
            type="password"
            rules={{ required: 'Password is required' }}
          />
          <Input
            label="Confirm Password"
            name="confirm_password"
            type="password"
            rules={{ required: 'Password is required' }}
          />
          <Button type="submit">Register</Button>
        </form>
      </FormProvider>
    </div>
  )
}

export default page
