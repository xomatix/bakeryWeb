import { useEffect, useState } from "preact/hooks";

const MessageBox = ({ dataType, query }) => {
    const [isDivVisible, setIsDivVisible] = useState(false);



    useEffect(() => {
        window.addEventListener('keypress', (e) => {
            if (e.shiftKey && (e.keyCode == 33))
                if (isDivVisible)
                    setIsDivVisible(false);
                else
                    setIsDivVisible(true);
        })

    }, [])

    const handleCloseClick = () => {
        setIsDivVisible(false);
    };

    return (
        <div>
            <div style={{ display: isDivVisible ? 'block' : 'none', position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', padding: '20px', background: '#131f29', boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)' }}>
                <p>DataType: {dataType}</p>
                <p>SQL: {query}</p>
                <button onClick={handleCloseClick}>Close</button>
            </div>
        </div>
    );
};

export default MessageBox;