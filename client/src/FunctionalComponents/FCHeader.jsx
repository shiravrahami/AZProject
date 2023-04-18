import React from 'react'

export default function FCHeader() {
  return (
    <header>
      <button style={{textAlign:"left"}}>התנתק</button>
    <img height={'250px'} src={process.env.PUBLIC_URL + '/LogoWithoutDesc.jpg'} alt="Logo" /><br /><br />
  </header>
  )
}
