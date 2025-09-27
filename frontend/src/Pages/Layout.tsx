import { NavLink, Outlet } from "react-router";
import { ToastContainer } from 'react-toastify';
import { PiHouse,PiNotepad,PiRanking,PiUserCircle  } from "react-icons/pi";


export function Layout(){
    return(
        <div className="flex flex-col h-dvh">
            <nav className="bg-gray-300 py-1 px-3">
                <span className="font-bold text-2xl font-mono">
                    Linquiztic
                    </span>
                    </nav>
            <main className="flex-1 overflow-y-scroll px-3">
                <Outlet/>
            </main>
            <footer className="bg-gray-300">
                <div className="flex flex-row justify-around py-2">
                    <NavLink to={'/'}>

                    <div>
                        <span><PiHouse size={40}/></span>
                    </div>
                    </NavLink>


                    <div>
                        <span><PiNotepad size={40}/></span>
                    </div>
                    <div>
                        <span><PiRanking size={40}/></span>
                    </div>
                    <NavLink to={'/profile'}>
                    <div>
                        <span><PiUserCircle size={40}/></span>
                    </div>

                    </NavLink>
                </div>
            </footer>
            <ToastContainer/>
        </div>
    )
}