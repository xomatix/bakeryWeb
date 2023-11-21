import { useEffect, useState } from "preact/hooks";


const SearchBox = () => {
    const [isInputVisible, setIsInputVisible] = useState(false);
    const [filter, setFilter] = useState('');

    useEffect(() => {

        window.addEventListener('keypress', (e) => {
            //e.preventDefault();
            if (e.key == '-') {

                toggleInputVisibility()
                handleFilterChange("");
            }

            if (e.key == 'Enter') {
                
                
                
                toggleInputVisibility()

            }
        })
    }, [])

    const toggleInputVisibility = async () => {
        setIsInputVisible((prevVisibility) => !prevVisibility);

        setTimeout(() => {
            document.getElementById('searchBoxSimple').select()
        }, 50);

    };

    const handleFilterChange = (value) => {
        var val = value
        var items = document.getElementsByClassName('searchItem');
        let f = val;

        for (let i = 0; i < items.length; i++) {
            var isVisible = false

            for (let j = 0; j < items[i].children.length; j++) {
            // console.log(`${items[i].children[j].innerHTML} + ${items[i].children[j].innerHTML.includes(f) }`);
                // console.log(f)
                if (items[i].children[j].innerHTML.toLowerCase().indexOf(f.toLowerCase()) != -1) {
                    isVisible = true;
                }
            }
            items[i].classList.toggle("hiddenItem", !isVisible)
        }
    }

    return (
        <>
            <button onClick={toggleInputVisibility}>
                {isInputVisible ? 'Hide filter' : 'Show filter'}
            </button>


            <div className="searchBox" style={{ display: isInputVisible ? "block" : 'none' }}>
                <input id="searchBoxSimple" value={filter} onInput={(e) => { handleFilterChange(e.target.value) }}></input>
            </div>

        </>
    )
}


export default SearchBox;