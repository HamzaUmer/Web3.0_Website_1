import { Navbar,Footer,Home,Services,Transaction } from "./components";

const App=()=> {

  return (
    <div className="min-h-screen">
      <div className="gradient-bg-welcome">
            <Navbar/>
            <Home/>
      </div>
           <Services/>
           <Transaction/>
           <Footer/>
    </div>
  )
}

export default App
