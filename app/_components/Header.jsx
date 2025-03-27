

import Image from 'next/image'
import React from 'react'
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'

function Header() {
  return (
    <div className='p-5 flex justify-between items-center border shadow-sm bg-slate-200'>
        <Image src = {'./logo.svg'}
        alt = 'logo'
        width = {160}
        height = {100}
        />
        <header className="flex justify-end items-center p-4 gap-4 h-16">
            <SignedOut >
              <SignInButton className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700" />
              <SignUpButton className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700" />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </header>
    </div>
  )
}

export default Header