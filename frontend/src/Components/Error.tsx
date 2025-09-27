import errorImg from "../assets/error.jpg"
export function Error(){
    return(
        <div className="flex flex-col items-center">
            <img src={errorImg} alt="" className="sm:h-1/3 sm:w-1/3"/>
            <span>something wrong please refresh</span>
            <button className="border px-5 py-2 my-1 cursor-pointer" onClick={()=>window.location.reload()}>Refresh</button>
        </div>
    )
}