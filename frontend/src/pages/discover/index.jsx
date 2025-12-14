import React, { useEffect } from 'react'
import UserLayout from '../layouts/UserLayout'
import DashboardLayout from '../layouts/DashboardLayout'
import { useDispatch, useSelector } from 'react-redux'
import { getAllUsers } from '@/config/redux/action/AuthAction';


function Discover() {
  const authState = useSelector((state)=>state.auth);
  const dispatch = useDispatch();
  useEffect(()=>{
    if(!authState.all_profile_fetched){
      dispatch(getAllUsers());
    }
  },[])
  return (
    <UserLayout>
        <DashboardLayout>
        <div>
          {console.log(authState.allUsers)}
            Discover Page
        </div>
        </DashboardLayout>
    </UserLayout>
  )
}

export default Discover