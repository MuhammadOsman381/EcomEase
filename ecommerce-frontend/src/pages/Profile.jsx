import React from 'react'
import ProfileCard from '../components/ProfileCard'
import History from '../components/History'
const Profile = () => {
  return (
    <div className='w-full h-full flex flex-col mt-10 items-center justify-center'>
        <ProfileCard/>
        <History/>
    </div>
  )
}

export default Profile