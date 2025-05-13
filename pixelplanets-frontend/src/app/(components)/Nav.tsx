import React from "react"
import Link from "next/link"
import Image from "next/image"

const Nav: React.FC = () => {
  return (
    <nav className="flex items-center justify-between px-6 py-4 shadow-md">
      <Link href="/">
        <Image
          src="/pixnet_logo.png"
          alt="Pixnet Logo"
          width={120}
          height={40}
          className="cursor-pointer"
        />
      </Link>
      <div className="flex space-x-4">
        <Link href="/login">Login</Link>
        <Link href="/signup">Signup</Link>
      </div>
    </nav>
  )
}

export default Nav
