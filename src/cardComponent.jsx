

const Card = ({ title, content }) => {
    return (
      <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px', borderRadius: '5px' }}>
        <h2>{title}</h2>
        <p>{content}</p>
      </div>
    );
  };
  
export default Card;