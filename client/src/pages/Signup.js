import React from 'react'
import Header from "../components/Header";
import SignUp from "../components/Signup";

const Signup = () => {
  return (
    <>
      <div class="bg-cover bg-center h-screen bg-[url('https://media.istockphoto.com/id/849178250/vector/poster-template-isolated-on-infographic-background.jpg?s=1024x1024&w=is&k=20&c=z3a8YNly8MhfHDTLEPfZe2zLUOdRL35v5mlH5g8RRnI=')]">
        <div className="min-h-full h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className=" bg-[url('https://img.freepik.com/premium-vector/polka-dot-seamless-vector-pattern-white-simple-background_547648-2176.jpg?size=626&ext=jpg&ga=GA1.1.1343216661.1723271479&semt=ais_hybrid')] " style={{width:'1005px',height:'800px'}}>
          <div className="max-w-md	 " style={{ position:'absolute',top:'90px',right:'830px'}}>
            <Header
              heading="Signup to Kap-Insight"
              paragraph="Already have an account? "
              linkName="Login"
              linkUrl="/"
            />
            <SignUp />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Signup
