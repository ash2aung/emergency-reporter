import logo from './assets/mv-logo-white.png';

function handleSearchSubmit(){
    // Enter key
    // if(e.which == 13){
    //     window.location.href = `https://metrovancouver.org/search/Pages/results.aspx?k=${e.target.value}`
    // }
}

export default function Nav() {
    return (
        <ul className="bg-zinc-900 list-none flex justify-between p-6 sticky top-0">
            <li key={0}>
                <a className="hover:brightness-80 transition-all duration-200" href="https://metrovancouver.org/">
                    <img src={logo} alt="logo" />
                </a>
            </li>
            <li key={1} className="relative">
                <input 
                    className="py-2.5 px-3.5 rounded-3xl border-2 border-zinc-600 bg-zinc-600 text-gray-400 bg-[url('./assets/search-symbol.png')] bg-no-repeat bg-size-[1.5em] bg-position-[95%_center] pr-12 outline-none focus:border-zinc-400 transition-all duration-500 placeholder:text-gray-400" 
                    onKeyDown={handleSearchSubmit} 
                    type="text" 
                    placeholder="Search..." 
                />
            </li>
        </ul>
    )
}